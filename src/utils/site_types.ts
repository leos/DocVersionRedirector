export default defineUnlistedScript(() => { })

export interface SiteDefinitionConfigured extends SiteDefinition {
    config: SiteConfig
}

export interface SiteConfig {
    version: string
}

export interface StoredSiteConfig {
    id: number
    v: string
}

export interface SiteDefinition {
    id: number
    name: string
    host: string
    regexFilter: string
    substitutionTemplate: string
    options: SiteOptions
}

export interface SiteOptions {
    versions: string[]
    langs?: string[]
}
