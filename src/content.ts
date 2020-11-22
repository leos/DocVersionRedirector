/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
// eslint-disable-next-line no-undef
;(typeof browser === 'undefined' ? chrome : browser).runtime.sendMessage({
    action: 'checkForRedirect',
})
