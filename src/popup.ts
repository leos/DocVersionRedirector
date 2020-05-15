/* eslint-disable @typescript-eslint/no-use-before-define */
import Prefs from './prefs'
import Sites from './sites'
import { browser } from 'webextension-polyfill-ts'

const blog = browser.extension.getBackgroundPage().console.log

let prefs
setUp()

async function setUp(): Promise<void> {
    prefs = await Prefs.getInstance()
    const tab = (await browser.tabs.query({ active: true, currentWindow: true }))[0]
    const hostname = new URL(tab.url).hostname
    const sitePrefs = prefs.forSite(hostname)

    // Inputs
    const enabledCheckbox = document.getElementById('enabledInput') as HTMLInputElement
    enabledCheckbox.checked = sitePrefs.enabled
    enabledCheckbox.addEventListener('change', (e) =>
        browser.runtime.sendMessage({
            action: 'changeSetting',
            site: hostname,
            name: 'enabled',
            value: (e.target as HTMLInputElement).checked,
            tabID: tab.id,
        }),
    )

    setupChoice('version', hostname)
    setupChoice('lang', hostname)

    function setupChoice(name: string, site: string): void {
        const input = document.getElementById(`${name}Input`) as HTMLSelectElement
        const options = Sites.getDefinition(site).options[name] || []

        document.getElementById(`${name}Div`).style.display = options.length ? 'block' : 'none'

        options.map((o: string) => input.add(new Option(o, o)))
        input.value = sitePrefs[name]
        input.addEventListener('change', (e) => {
            browser.runtime.sendMessage({
                action: 'changeSetting',
                site: site,
                name: name,
                value: (e.target as HTMLSelectElement).value,
                tabID: tab.id,
            })
        })
    }
}
