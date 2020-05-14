import { sites } from './sites'
import { browser } from 'webextension-polyfill-ts';
import Prefs from './prefs'

let blog = browser.extension.getBackgroundPage().console.log

let prefs
setUp()

async function setUp(){
    prefs = await Prefs.getInstance()
    const tab = (await browser.tabs.query({'active': true, 'currentWindow': true}))[0]
    const hostname = new URL(tab.url).hostname
    const site_prefs = prefs.forSite(hostname)

    // Inputs
    const enabledCheckbox = document.getElementById('enabledInput') as HTMLInputElement
    enabledCheckbox.checked = site_prefs.enabled
    enabledCheckbox.addEventListener('change', e => browser.runtime.sendMessage(
        {action: 'changeSetting', site: hostname, name: 'enabled', value: (<HTMLInputElement>e.target).checked, tabID: tab.id},
    ))

    setupChoice('version', hostname)
    setupChoice('lang', hostname)

    function setupChoice(name: string, site: string) {
        const input = document.getElementById(`${name}Input`) as HTMLSelectElement
        const options = sites[site].options[name] || []

        document.getElementById(`${name}Div`).style.display = options.length ? 'block' : 'none'

        options.map((o: string) => input.add(new Option(o, o)))
        input.value = site_prefs[name]
        input.addEventListener('change', e => {
            browser.runtime.sendMessage(
                {action: 'changeSetting', site: site, name:name, value: (<HTMLSelectElement>e.target).value, tabID: tab.id},
            )},
        )
    }
}

