(async function () {
    let blog = chrome.extension.getBackgroundPage().console.log;
    let browserAPI = typeof browser === "undefined" ?  chrome : browser;
    let prefs = await loadPreferences(await browserAPI.storage.local.get("prefs"));

    /**
     * If page has been visited (via localStorage cache) and we're going to redirect anyways, do it immediately.
     */
    browserAPI.webRequest.onBeforeRequest.addListener(
        function ({url}) {
            const oldURLObject = new URL(url);
            const newUrl = getRedirectURL(oldURLObject);

            return prefs[oldURLObject.hostname].enabled && (oldURLObject.href !== newUrl) && localStorage.getItem(`cache-${newUrl}`)
                ? {redirectUrl: newUrl} : {};
        },
        {
            urls: Object.keys(sites).map(hostname => `*://${hostname}/*`),
            types: ["main_frame"],
        },
        ["blocking"],
    );

    browserAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === "checkForRedirect") {
            checkForRedirect(new URL(sender.url), sender.tab.id).then(sendResponse);
            return true;
        } else if (message.action === "changeSetting") {
            changeSetting(message).then(sendResponse);
            return true;
        }
    });

    async function loadPreferences({prefs = {}}) {
        for (const name in sites) {
            prefs[name] = prefs[name] || {
                enabled: true,
                lang: sites[name].options.lang && sites[name].options.lang[0],
                version: sites[name].options.version && sites[name].options.version[0],
            }
        }

        await browserAPI.storage.local.set({prefs: prefs});

        return prefs;
    }

    function getRedirectURL(oldURL) {
        const {protocol, hostname, host} = oldURL;
        const matches = sites[hostname].regex.exec(oldURL.pathname + oldURL.search + oldURL.hash);

        return matches
            ? `${protocol}//${host}` + sites[hostname].template
                    .replace("${lang}", prefs[hostname].lang)
                    .replace("${version}", prefs[hostname].version)
                    .replace("${path}", rewritePath(sites[hostname], matches.groups.version, prefs[hostname].version, matches.groups.path))
            : oldURL.href;
    }

    function rewritePath({moves = [], options: {version: versions}}, oldVersion, newVersion, path) {
        move = moves.find(
            ({version: moveVersion, before}) =>
                versions.indexOf(oldVersion) > versions.indexOf(moveVersion) &&
                versions.indexOf(newVersion) <= versions.indexOf(moveVersion) &&
                path === before
        );

        return move ? move.after : path;
    }

    async function checkForRedirect(oldURLObject, tabId) {
        browserAPI.pageAction.show(tabId);

        if (prefs[oldURLObject.hostname].enabled) {
            const newUrl = getRedirectURL(oldURLObject);

            if (oldURLObject.href !== newUrl) {
                response = await fetch(newUrl, {method: "HEAD"});
                if (response.ok) {
                    localStorage.setItem(`cache-${newUrl}`, true);
                    return newUrl;
                } else {
                    // set icon to yellow
                    blog(`HEAD request error: ${response.statusText}`);
                }
            }
        }
    }

    async function changeSetting({site, name, value, tab}) {
        prefs[site][name] = value;
        await browserAPI.storage.local.set({prefs: prefs});

        if (prefs[site].enabled) {
            const newUrl = await checkForRedirect(new URL(tab.url), tab.id);
            if (newUrl) {
                await chrome.tabs.update(tab.id, {url: newUrl});
            }
        }
    }
})();