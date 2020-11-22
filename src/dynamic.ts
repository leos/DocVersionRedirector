import {DynamicSite} from './site_types'

export class DocsRS implements DynamicSite {
    getDataURL(siteURL: URL): string {
        return siteURL.href
    }

    getVersionsRegex(): RegExp {
        return /<a href="&#x2F;crate&#x2F;[^&]+&#x2F;[^"]+" class="pure-menu-link">\s*([^<]*)\s*<\/a>\n/g
    }

    getNewSiteRegex(): string {
        return '^/(?<package>[^/]*)/(?<version>[^/]*)/(?<path>.*)'
    }

    getNewSiteTemplate(): string {
        return '/${package}/${version}/${path}'
    }
}

export class ReadTheDocs implements DynamicSite {
    getDataURL(siteURL: URL) {
        return `https://readthedocs.org/projects/${siteURL.hostname.split('.', 1)}/versions/`
    }

    getVersionsRegex(): RegExp {
        return /class="module-item-title".*>(.*)<\/a>/g
    }

    getNewSiteRegex(): string {
        return '^/en/(?<version>[^/]*)/(?<path>.*)'
    }

    getNewSiteTemplate(): string {
        return '/en/${version}/${path}'
    }
}
