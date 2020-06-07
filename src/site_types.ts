export interface DynamicSite {
    getDataURL(siteURL: URL): string
    getVersionsRegex(): RegExp
    getNewSiteRegex(): string
    getNewSiteTemplate(): string
}

interface SiteOptionsVersion {
    version: string[]
    [key: string]: string[]
}

interface SiteOptionsFull extends SiteOptionsVersion {
    lang: string[]
}

interface SiteMove {
    version: string
    before: string
    after: string
}

export interface SiteSettings {
    enabled: boolean
    lang: string
    version: string
    [key: string]: boolean | string
}

export interface SiteDefinitionNoSettings {
    regex: string
    template: string
    options: SiteOptionsVersion | SiteOptionsFull
    moves?: SiteMove[]
    updated?: number
}

export interface SiteDefinition extends SiteDefinitionNoSettings {
    settings: SiteSettings
}

export interface SitesData {
    [key: string]: SiteDefinition
}
