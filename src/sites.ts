import {blog} from './util'
import {browser} from 'webextension-polyfill-ts'
import {SitesData, SiteDefinitionNoSettings, SiteDefinition, DynamicSite} from './site_types'
import {ReadTheDocs, DocsRS} from './dynamic'

class SiteConfig {
    private static instance: SiteConfig

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {}

    static async getInstance(force = false): Promise<SiteConfig> {
        if (!SiteConfig.instance || force) {
            SiteConfig.instance = new SiteConfig()
            await SiteConfig.instance.loadAndApplyDefaultSettings()
        }
        return SiteConfig.instance
    }

    static getInstanceLocal(): SiteConfig {
        return SiteConfig.instance
    }

    private sites: SitesData = {}

    getDynamicSiteClass(siteURL: URL): DynamicSite | null {
        if (siteURL.hostname.endsWith('readthedocs.io')) {
            return new ReadTheDocs()
        } else if (siteURL.hostname === 'docs.rs') {
            return new DocsRS()
        }
        return null
    }

    async checkForDynamicConfig(siteURL: URL): Promise<void> {
        const oldSite = this.getSite(siteURL)
        if (oldSite && !oldSite.updated) return

        const dynamicSite = this.getDynamicSiteClass(siteURL)
        const now = new Date().valueOf()

        const staleness = now - ((oldSite && oldSite!.updated) ?? 0)

        if (dynamicSite && staleness > 86400000) {
            const response = await fetch(dynamicSite.getDataURL(siteURL), {mode: 'no-cors'})

            if (!response.ok) {
                const responseText = await response.text()
                blog(response.status)
                blog(responseText)
                return
            }
            const rtd_regex = dynamicSite.getVersionsRegex()
            const responseText = await response.text()
            const matches = responseText.match(rtd_regex)
            if (!matches) {
                blog("Couldn't find versions in response")
                return
            }

            const newSite = {
                regex: dynamicSite.getNewSiteRegex(),
                template: dynamicSite.getNewSiteTemplate(),
                options: {
                    version: [] as string[],
                },
                updated: now,
            }

            let match
            while ((match = rtd_regex.exec(responseText))) {
                newSite.options.version.push(match[1])
            }

            this.sites[this.genKeyForURL(siteURL)] = this.setDefaultSettings(newSite, oldSite)

            await this.saveSites()
        }
    }

    private setDefaultSettings(
        definition: SiteDefinitionNoSettings,
        oldSite?: SiteDefinition
    ): SiteDefinition {
        const newDef = definition as SiteDefinition
        newDef.settings = oldSite?.settings ?? {
            enabled: true,
            lang: '',
            version: '',
        }

        newDef.settings.lang = newDef.options.lang?.includes(newDef.settings.lang)
            ? newDef.settings.lang
            : newDef.options.lang && newDef.options.lang[0]

        newDef.settings.version = newDef.options.version?.includes(newDef.settings.version)
            ? newDef.settings.version
            : newDef.options.version && newDef.options?.version[0]

        return newDef
    }

    async loadAndApplyDefaultSettings(): Promise<void> {
        const {sites: loadedSites} = await browser.storage.local.get({sites: {}})
        this.sites = loadedSites as SitesData
        // update local storage data from hardcoded data
        for (const site of Object.keys(this.hardcodedSites)) {
            if (this.sites[site]) {
                Object.assign(this.sites[site], this.hardcodedSites[site])
            } else {
                this.sites[site] = this.hardcodedSites[site] as SiteDefinition
            }
        }

        // Set up default settings for any new sites
        for (const definition of Object.values(this.sites)) {
            if (definition.settings) continue
            this.setDefaultSettings(definition)
        }

        await this.saveSites()
    }

    async saveSites(): Promise<void> {
        await browser.storage.local.set({sites: this.sites})
    }

    getSite(siteURL: URL): SiteDefinition | undefined {
        return this.sites[this.genKeyForURL(siteURL)]
    }

    genKeyForURL(siteURL: URL): string {
        return siteURL.hostname === 'docs.rs'
            ? `${siteURL.hostname}/${siteURL.pathname.split('/', 2)[1]}`
            : siteURL.hostname
    }

    async updateValue(siteURL: URL, name: string, value: boolean | string): Promise<void> {
        this.sites[this.genKeyForURL(siteURL)].settings[name] = value
        await this.saveSites()
    }

    private hardcodedSites: {[key: string]: SiteDefinitionNoSettings} = {
        'airflow.apache.org': {
            regex: '^/docs/(?<version>[^/]*)/(?<path>.*)',
            template: '/docs/${version}/${path}',
            options: {
                version: [
                    'stable',
                    '1.10.10',
                    '1.10.9',
                    '1.10.8',
                    '1.10.7',
                    '1.10.6',
                    '1.10.5',
                    '1.10.4',
                    '1.10.3',
                    '1.10.2',
                    '1.10.1',
                ],
            },
        },
        'docs.ansible.com': {
            regex: '^/ansible/(?<version>[^/]*)/(?<path>.*)',
            template: '/ansible/${version}/${path}',
            options: {
                version: ['devel', 'latest', '2.8', '2.7', '2.6', '2.5', '2.4', '2.3'],
            },
        },
        'docs.bazel.build': {
            regex: '^/versions/(?<version>[^/]*)/(?<path>.*)',
            template: '/versions/${version}/${path}',
            options: {
                version: [
                    'master',
                    '3.3.0',
                    '3.2.0',
                    '3.1.0',
                    '3.0.0',
                    '2.2.0',
                    '2.1.0',
                    '2.0.0',
                    '1.2.0',
                    '1.1.0',
                    '1.0.0',
                    '0.29.1',
                    '0.29.0',
                    '0.28.0',
                    '0.27.0',
                    '0.26.0',
                    '0.25.0',
                    '0.24.0',
                    '0.23.0',
                    '0.22.0',
                    '0.21.0',
                    '0.20.0',
                    '0.19.2',
                    '0.19.1',
                    '0.18.1',
                    '0.17.2',
                    '0.17.1',
                ],
            },
        },
        'docs.djangoproject.com': {
            regex: '^/(?<lang>[^/]*)/(?<version>[^/]*)/(?<path>.*)',
            template: '/${lang}/${version}/${path}',
            options: {
                lang: ['en', 'el', 'es', 'fr', 'id', 'ja', 'ko', 'pl', 'pt-br', 'zh-hans'],
                version: ['dev', '3.1', '3.0', '2.2', '2.1', '2.0', '1.11', '1.10', '1.8'],
            },
        },
        'docs.python.org': {
            regex: '^/(?<version>[^/]*)/(?<path>.*)',
            template: '/${version}/${path}',
            options: {
                version: ['3', '3.10', '3.9', '3.8', '3.7', '3.6', '3.5', '2.7'],
            },
            moves: [
                {
                    version: '3.5',
                    before: 'library/sets.html',
                    after: 'library/stdtypes.html#set-types-set-frozenset',
                },
                {
                    version: '3.5',
                    before: 'library/stringio.html',
                    after: 'library/io.html#io.StringIO',
                },
            ],
        },
        'nodejs.org': {
            regex: '^/dist/(?<version>[^/]*)/docs/api/(?<path>.*)',
            template: '/dist/${version}/docs/api/${path}',
            options: {
                version: [
                    'latest-v14.x',
                    'latest-v13.x',
                    'latest-v12.x',
                    'latest-v11.x',
                    'latest-v10.x',
                    'latest-v9.x',
                    'latest-v8.x',
                    'latest-v7.x',
                    'latest-v6.x',
                    'latest-v5.x',
                    'latest-v4.x',
                    'latest-v0.12.x',
                    'latest-v0.10.x',
                ],
            },
        },
        'rspec.info': {
            regex: '^/documentation/(?<version>[^/]*)/(?<path>.*)',
            template: '/documentation/${version}/${path}',
            options: {
                version: [
                    '3.9',
                    '3.8',
                    '3.7',
                    '3.6',
                    '3.5',
                    '3.4',
                    '3.3',
                    '3.2',
                    '3.1',
                    '3.0',
                    '2.99',
                    '2.14',
                ],
            },
        },
        'ruby-doc.org': {
            regex: '^/(?<category>stdlib|core)-(?<version>[^/]*)/(?<path>.*)',
            template: '/${category}-${version}/${path}',
            options: {
                version: [
                    '2.7.1',
                    '2.7.0',
                    '2.6.6',
                    '2.6.5',
                    '2.6.4',
                    '2.6.3',
                    '2.6.2',
                    '2.6.1',
                    '2.6',
                    '2.5.8',
                    '2.5.7',
                    '2.5.6',
                    '2.5.5',
                    '2.5.4',
                    '2.5.3',
                    '2.5.2',
                    '2.5.1',
                    '2.5.0',
                    '2.4.10',
                    '2.4.9',
                    '2.4.8',
                    '2.4.7',
                    '2.4.6',
                    '2.4.5',
                    '2.4.4',
                    '2.4.3',
                    '2.4.2',
                    '2.4.1',
                    '2.4.0',
                    '2.3.8',
                    '2.3.7',
                    '2.3.6',
                    '2.3.5',
                    '2.3.4',
                    '2.3.3',
                    '2.3.2',
                    '2.3.1',
                    '2.3.0',
                    '2.2.10',
                    '2.2.7',
                    '2.2.6',
                    '2.2.5',
                    '2.2.4',
                    '2.2.3',
                    '2.2.2',
                    '2.2.1',
                    '2.2.0',
                    '2.1.9',
                    '2.1.8',
                    '2.1.7',
                    '2.1.6',
                    '2.1.5',
                    '2.1.4',
                    '2.1.3',
                    '2.1.2',
                    '2.1.1',
                    '2.1.0',
                    '2.0.0',
                    '1.9.3',
                    '1.9.2',
                    '1.9.1',
                    '1.8.7',
                    '1.8.6',
                ],
            },
        },
    }
}

export default SiteConfig
