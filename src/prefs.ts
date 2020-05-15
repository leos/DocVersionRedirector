import Sites from './sites'
import { browser } from 'webextension-polyfill-ts'

const blog = browser.extension.getBackgroundPage().console.log

class Prefs {
    private prefs
    private static instance: Prefs

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
        const { prefs } = await browser.storage.local.get({ prefs: {} })

        for (const name of Sites.getSiteNames()) {
            const siteOptions = Sites.getDefinition(name).options
            prefs[name] = prefs[name] || {
                enabled: true,
                lang: siteOptions.lang && siteOptions.lang[0],
                version: siteOptions.version && siteOptions.version[0],
            }
        }

        await browser.storage.local.set({ prefs: prefs })
        this.prefs = prefs
    }

    enabled(sitename: string): boolean {
        return this.prefs[sitename].enabled
    }

    forSite(sitename: string) {
        return this.prefs[sitename]
    }

    getPrefs() {
        return this.prefs
    }

    async updateValue(site: string, name: string, value: any): Promise<void> {
        this.prefs[site][name] = value
        return browser.storage.local.set({ prefs: this.prefs })
    }
}

export default Prefs
