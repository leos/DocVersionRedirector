(async function () {
    let browserAPI = typeof browser === "undefined" ?  chrome : browser;

    const tab = (await chrome.tabs.query({'active': true, 'currentWindow': true}))[0]
    const hostname = new URL(tab.url).hostname;
    const active_prefs = (await browserAPI.storage.local.get('prefs')).prefs[hostname];

    // Inputs
    const enabledCheckbox = document.getElementById("enabledInput");
    enabledCheckbox.checked = active_prefs.enabled;
    enabledCheckbox.addEventListener("change", e => browserAPI.runtime.sendMessage(
        {action: "changeSetting", site: hostname, name: "enabled", value: e.target.checked, tab: tab}
    ));

    setupChoice("version", hostname);
    setupChoice("lang", hostname);

    function setupChoice(name, site) {
        const input = document.getElementById(`${name}Input`);
        const options = sites[site].options[name] || [];

        document.getElementById(`${name}Div`).style.display = options.length ? "block" : "none";

        options.map(o => input.add(new Option(o, o)));
        input.value = active_prefs[name];
        input.addEventListener("change", e =>
            browserAPI.runtime.sendMessage(
                {action: "changeSetting", site: site, name:name, value: e.target.value, tab: tab}
            )
        );
    }
})();
