/* eslint-disable @typescript-eslint/ban-ts-ignore */
// @ts-ignore
;(typeof browser === 'undefined' ? chrome : browser).runtime.sendMessage({ action: 'checkForRedirect' })
