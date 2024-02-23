import { DeclarativeNetRequest } from 'wxt/browser'
import { SiteDefinition } from './site_types'
import { storedConfigs } from './storage'


export function createRuleForSite(site: SiteDefinition, newVersion: string): DeclarativeNetRequest.Rule {
    return {
        id: site.id,
        condition: {
            regexFilter: '^https://' + site.host.replaceAll(".", "\\.") + site.regexFilter,
            resourceTypes: ["main_frame" as const],
        },
        action: {
            type: "redirect" as const,
            redirect: {
                regexSubstitution: createRedirectURL(site, newVersion)
            }
        }
    }
}

export function createRedirectURL(site: SiteDefinition, newVersion: string): string {
    return 'https://' + site.host + site.substitutionTemplate.replace('${version}', newVersion)
}

export async function upsertConfigForSite(site: SiteDefinition, version: string) {
    const configs = await storedConfigs.getValue()
    const conf = configs.find(c => c.id === site.id)

    if (version) {
        if (conf) {
            conf.v = version
        } else {
            configs.push({ id: site.id, v: version })
        }
        // console.log("setting value", configs)
        await storedConfigs.setValue(configs)
        await browser.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: [site.id],
            addRules: [createRuleForSite(site, version)]
        })
        // console.log("rule for site: ", createRuleForSite(site, version))
    } else {
        const result = configs.filter(c => c.id !== site.id)
        // console.log("setting value from clear", result)
        await storedConfigs.setValue(result)
        await browser.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: [site.id],
        })
    }
}

export async function getSiteConfigForID(id: number): Promise<SiteConfig | undefined> {
    const configs = await storedConfigs.getValue()
    const c = configs.find(c => c.id === id)
    return c ? { version: c.v } : undefined
}
