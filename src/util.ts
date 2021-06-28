import {browser} from 'webextension-polyfill-ts'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const w: any = browser.extension.getBackgroundPage()
export const blog = w.console.log
