(function () {
    let browserAPI = typeof browser === "undefined" ?  chrome : browser;

    function redirect(newUrl) {
        if (newUrl) {
            window.location.replace(newUrl);
        }
    };

    if(browserAPI === chrome) {
        chrome.runtime.sendMessage({action: "checkForRedirect"}, redirect);
    } else {
        browser.runtime.sendMessage({action: "checkForRedirect"}).then(redirect);
    }

    browserAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === "changeSetting") {
            window.location.reload();
        }
    });
})();