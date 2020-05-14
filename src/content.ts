// @ts-ignore
(typeof browser === 'undefined' ? chrome : browser).runtime.sendMessage({action: 'checkForRedirect'})
