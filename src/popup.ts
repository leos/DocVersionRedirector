import Sites from './sites'
import {blog} from './util'
import {browser} from 'webextension-polyfill-ts'
import {SiteDefinition} from './site_types'

setUp()

async function setUp(): Promise<void> {
    const sites = await Sites.getInstance()
    const tab = (await browser.tabs.query({active: true, currentWindow: true}))[0]
    const siteURL = new URL(tab.url as string)
    const siteDef = sites.getSite(siteURL)
    if (!siteDef) return

    // Inputs
    const enabledCheckbox = document.getElementById('enabledInput') as HTMLInputElement
    enabledCheckbox.checked = siteDef.settings.enabled
    enabledCheckbox.addEventListener('change', e =>
        browser.runtime.sendMessage({
            action: 'changeSetting',
            site: siteURL,
            name: 'enabled',
            value: (e.target as HTMLInputElement).checked,
            tabID: tab.id,
        })
    )

    await Promise.all([
        setupChoice('version', siteURL, siteDef, tab.id!),
        setupChoice('lang', siteURL, siteDef, tab.id!),
    ])
}

async function setupChoice(
    name: string,
    siteURL: URL,
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
            site: siteURL.href,
            name: name,
            value: (e.target as HTMLSelectElement).value,
            tabID: tabID,
        })
    })
}
