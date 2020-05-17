import Sites from './sites'
import {browser} from 'webextension-polyfill-ts'

const blog = browser.extension.getBackgroundPage().console.log

export interface SitePreference {
    enabled: boolean
    lang: string
    version: string
    [key: string]: boolean | string
}

interface Preferences {
    [key: string]: SitePreference
}

class Prefs {
    private static instance: Prefs

    private prefs: Preferences = {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {}

    static async getInstance(): Promise<Prefs> {
        if (!Prefs.instance) {
            Prefs.instance = new Prefs()
            await Prefs.instance.loadAndRefreshPreferences()
        }
        return Prefs.instance
    }

    async loadAndRefreshPreferences(): Promise<void> {
        const {prefs} = await browser.storage.local.get({prefs: {}})

        for (const name of Sites.getSiteNames()) {
            const siteOptions = Sites.getDefinitionLocal(name).options
            prefs[name] = prefs[name] || {
                enabled: true,
                lang: siteOptions.lang && siteOptions.lang[0],
                version: siteOptions.version && siteOptions.version[0],
            }
        }

        await browser.storage.local.set({prefs: prefs})
        this.prefs = prefs
    }

    enabled(sitename: string): boolean {
        return this.prefs[sitename].enabled
    }

    forSite(sitename: string): SitePreference {
        return this.prefs[sitename]
    }

    getPrefs(): Preferences {
        return this.prefs
    }

    async updateValue(
        site: string,
        name: string,
        value: boolean | string
    ): Promise<void> {
        this.prefs[site][name] = value
        await browser.storage.local.set({prefs: this.prefs})
    }
}

export default Prefs
