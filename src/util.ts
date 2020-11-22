import {browser} from 'webextension-polyfill-ts'

const w: any = browser.extension.getBackgroundPage()
export const blog = w.console.log
