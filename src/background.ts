/* eslint-disable @typescript-eslint/no-use-before-define */
import Prefs from './prefs'
import { browser } from 'webextension-polyfill-ts'
import { sites } from './sites'

const blog = browser.extension.getBackgroundPage().console.log
let prefs
Prefs.getInstance().then(doSetup)

function doSetup(preferences: Prefs): void {
    prefs = preferences

    // If page has been visited (via localStorage cache) and we're going to redirect anyways, do it immediately.
    browser.webRequest.onBeforeRequest.addListener(
        function ({ url }) {
            const oldURLObject = new URL(url)
            const newUrl = getRedirectURL(oldURLObject)

            return prefs.enabled(oldURLObject.hostname) &&
                oldURLObject.href !== newUrl &&
                localStorage.getItem(`cache-${newUrl}`)
                ? { redirectUrl: newUrl }
                : {}
        },
        {
            urls: Object.keys(sites).map((hostname) => `*://${hostname}/*`),
            types: ['main_frame'],
        },
        ['blocking'],
    )

    browser.runtime.onMessage.addListener((message, sender) => {
        if (message.action === 'checkForRedirect') {
            checkForRedirect(new URL(sender.tab.url), sender.tab.id)
        } else if (message.action === 'changeSetting') {
            prefs
                .updateValue(message.site, message.name, message.value)
                .then(browser.tabs.get(message.tabID).then((tab) => checkForRedirect(new URL(tab.url), tab.id)))
        }
    })
}

function getRedirectURL(oldURL: URL): string {
    const { protocol, hostname, host } = oldURL
    const matches = sites[hostname].regex.exec(oldURL.pathname + oldURL.search + oldURL.hash)
    const sitePrefs = prefs.forSite(hostname)

    return matches
        ? `${protocol}//${host}` +
              sites[hostname].template
                  .replace('${lang}', sitePrefs.lang)
                  .replace('${version}', sitePrefs.version)
                  .replace(
                      '${path}',
                      rewritePath(sites[hostname], matches.groups.version, sitePrefs.version, matches.groups.path),
                  )
        : oldURL.href
}

function rewritePath({ moves = [], options: { version: versions } }, oldVersion, newVersion, path): string {
    const move = moves.find(
        ({ version: moveVersion, before }) =>
            versions.indexOf(oldVersion) > versions.indexOf(moveVersion) &&
            versions.indexOf(newVersion) <= versions.indexOf(moveVersion) &&
            path === before,
    )

    return move ? move.after : path
}

async function checkForRedirect(oldURL: URL, tabId: number): Promise<void> {
    browser.pageAction.show(tabId)
    if (prefs.enabled(oldURL.hostname)) {
        const newUrl = getRedirectURL(oldURL)
        if (oldURL.href !== newUrl) {
            const response = await fetch(newUrl, { method: 'HEAD' })
            if (response.ok) {
                localStorage.setItem(`cache-${newUrl}`, '1')
                await browser.tabs.update(tabId, { url: newUrl })
            } else {
                // set icon to yellow
                blog(`HEAD request error: ${response.statusText}`)
            }
        }
    }
}
