import Sites, {SiteDefinition} from './sites'
import {browser} from 'webextension-polyfill-ts'

const blog = browser.extension.getBackgroundPage().console.log

setUp()

async function setUp(): Promise<void> {
    const sites = await Sites.getInstance()
    const tab = (await browser.tabs.query({active: true, currentWindow: true}))[0]
    const hostname = new URL(tab.url as string).hostname
    const siteDef = sites.getSite(hostname)

    // Inputs
    const enabledCheckbox = document.getElementById('enabledInput') as HTMLInputElement
    enabledCheckbox.checked = siteDef.settings.enabled
    enabledCheckbox.addEventListener('change', e =>
        browser.runtime.sendMessage({
            action: 'changeSetting',
            site: hostname,
            name: 'enabled',
            value: (e.target as HTMLInputElement).checked,
            tabID: tab.id,
        })
    )

    await Promise.all([
        setupChoice('version', hostname, siteDef, tab.id!),
        setupChoice('lang', hostname, siteDef, tab.id!),
    ])
}

async function setupChoice(
    name: string,
    site: string,
    siteDef: SiteDefinition,
    tabID: number
): Promise<void> {
    const input = document.getElementById(`${name}Input`) as HTMLSelectElement
    const options = siteDef.options[name] || []

    document.getElementById(`${name}Div`)!.style.display = options.length ? 'block' : 'none'

    options.map(o => input.add(new Option(o, o)))
    input.value = siteDef.settings[name] as string
    input.addEventListener('change', e => {
        browser.runtime.sendMessage({
            action: 'changeSetting',
            site: site,
            name: name,
            value: (e.target as HTMLSelectElement).value,
            tabID: tabID,
        })
    })
}
