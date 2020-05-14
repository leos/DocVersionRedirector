import { sites } from './sites'
import { browser } from 'webextension-polyfill-ts';

let blog = browser.extension.getBackgroundPage().console.log

class Prefs {
    private prefs: any
    private static instance: Prefs

    private constructor(){}

    static async getInstance(): Promise<Prefs>{
        if(!Prefs.instance){
            Prefs.instance = new Prefs()
            await Prefs.instance.loadAndRefreshPreferences()
        }
        return Prefs.instance
    }

    async loadAndRefreshPreferences() {
        const {prefs} = await browser.storage.local.get({prefs: {}})

        for (const name in sites) {
            prefs[name] = prefs[name] || {
                enabled: true,
                lang: sites[name].options.lang && sites[name].options.lang[0],
                version: sites[name].options.version && sites[name].options.version[0],
            }
        }

        await browser.storage.local.set({prefs: prefs})
        this.prefs = prefs
    }

    enabled(sitename: string): boolean {
        return this.prefs[sitename].enabled
    }

    forSite(sitename: string){
        return this.prefs[sitename]
    }

    getPrefs(){
        return this.prefs
    }

    async updateValue(site: string, name: string, value: any){
        this.prefs[site][name] = value
        return browser.storage.local.set({prefs: this.prefs})
    }
}

export default Prefs
