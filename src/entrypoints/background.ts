import { SiteDefinitionConfigured } from "@/utils/site_types"

export default defineBackground(() => {
})

browser.runtime.onInstalled.addListener(async ({ reason }) => {
    // console.log("Reason:", reason)
    const configs = await storedConfigs.getValue()

    const configuredDefs: SiteDefinitionConfigured[] = configs.flatMap(config => {
        const d = siteDefinitions.find(d => d.id === config.id)
        return d ? [{ ...d, config: { version: config.v } }] : []
    })

    const removeIds = configuredDefs.map(c => c.id)
    const addRules = configuredDefs.map(c => createRuleForSite(c, c.config.version))

    await browser.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: removeIds,
        addRules: addRules,
    })

    const rules = await browser.declarativeNetRequest.getDynamicRules()
    // console.log("Rules: ", rules)
})
