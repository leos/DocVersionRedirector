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
    hostChange?: boolean
    regexFilter: string
    substitutionTemplate: string
    options: SiteOptions
}

export interface SiteOptions {
    versions: SiteVersion[]
    langs?: string[]
}

export type SiteVersion = string | string[] // [url, display] or just url
