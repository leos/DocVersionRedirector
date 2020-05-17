import Sites, {SiteDefinition} from './sites'
import {browser} from 'webextension-polyfill-ts'
import pdata = require('./../package.json')

const blog = browser.extension.getBackgroundPage().console.log

setUp()

async function setUp(): Promise<void> {
    await ensureConfVersion()

    const sites = await Sites.getInstance()
    // If page has been visited (via localStorage cache) and we're going to redirect anyways, do it immediately.
    browser.webRequest.onBeforeRequest.addListener(
        ({url}) => {
            const oldURLObject = new URL(url)
            const siteDef = Sites.getInstanceLocal().getSite(oldURLObject.hostname)
            const newUrl = getRedirectURL(siteDef, oldURLObject)

            return siteDef.settings.enabled &&
                oldURLObject.href !== newUrl &&
                localStorage.getItem(`cache-${newUrl}`)
                ? {redirectUrl: newUrl}
                : {}
        },
        {
            urls: sites.getSiteNames().map(hostname => `*://${hostname}/*`),
            types: ['main_frame'],
        },
        ['blocking']
    )

    browser.runtime.onMessage.addListener(async (message, sender) => {
        if (message.action === 'checkForRedirect') {
            await checkForRedirect(
                Sites.getInstanceLocal(),
                new URL(sender.tab!.url!),
                sender.tab!.id!
            )
        } else if (message.action === 'changeSetting') {
            await sites.updateValue(message.site, message.name, message.value)
            const tab = await browser.tabs.get(message.tabID)
            await checkForRedirect(Sites.getInstanceLocal(), new URL(tab.url!), tab.id!)
        }
    })
}

async function ensureConfVersion() {
    const {confVersion} = await browser.storage.local.get('confVersion')
    if (confVersion !== pdata.version) {
        await browser.storage.local.clear()
        await browser.storage.local.set({confVersion: pdata.version})
    }
}

function getRedirectURL(siteDef: SiteDefinition, oldURL: URL): string {
    const {protocol, host} = oldURL
    const matches = new RegExp(siteDef.regex).exec(oldURL.pathname + oldURL.search + oldURL.hash)

    return matches
        ? `${protocol}//${host}` +
              siteDef.template
                  .replace('${lang}', siteDef.settings.lang)
                  .replace('${version}', siteDef.settings.version)
                  .replace(
                      '${path}',
                      rewritePath(
                          siteDef,
                          matches.groups!.version,
                          siteDef.settings.version,
                          matches.groups!.path
                      )
                  )
        : oldURL.href
}

function rewritePath(
    {moves = [], options: {version: versions}}: SiteDefinition,
    oldVersion: string,
    newVersion: string,
    path: string
): string {
    const move = moves.find(
        ({version: moveVersion, before}) =>
            versions.indexOf(oldVersion) > versions.indexOf(moveVersion) &&
            versions.indexOf(newVersion) <= versions.indexOf(moveVersion) &&
            path === before
    )

    return move ? move.after : path
}

async function checkForRedirect(sites: Sites, oldURL: URL, tabId: number): Promise<void> {
    browser.pageAction.show(tabId)
    await sites.checkForDynamicConfig(oldURL.hostname)
    const siteDef = sites.getSite(oldURL.hostname)

    if (siteDef.settings.enabled) {
        const newUrl = getRedirectURL(siteDef, oldURL)
        if (oldURL.href !== newUrl) {
            const response = await fetch(newUrl, {method: 'HEAD'})
            if (response.ok) {
                localStorage.setItem(`cache-${newUrl}`, '1')
                await browser.tabs.update(tabId, {url: newUrl})
            } else {
                // set icon to yellow
                blog(`HEAD request error: ${response.statusText}`)
            }
        }
    }
}
