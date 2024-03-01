import './OptionTable.css'
import { SiteDefinition } from '@/utils/site_types'
import VersionPicker from '@/components/VersionPicker'
import { createRedirectURL, getVersionURL } from '@/utils/helpers'
import { ChangeEvent, useState } from 'react'

export default function OptionTable({ sites, configs }: { sites: SiteDefinition[], configs: StoredSiteConfig[] | undefined }) {
    return (
        <table>
            <thead>
                <tr>
                    <td className="left">Name</td>
                    <td >Version</td>
                    <td className="left">Doc Root</td>
                </tr>
            </thead>
            <tbody className="left">
                {sites.map(site => {
                    const config = configs?.find(c => c.id === site.id)
                    const [version, setVersion] = useState(config ? config.v : '')
                    const docRoot = createRedirectURL(site, version ? version : getVersionURL(site.options.versions[0]))

                    function updateVersion(e: ChangeEvent<HTMLInputElement>) {
                        const newVersion = e.target.value
                        console.log("newVersion - ", newVersion)
                        upsertConfigForSite(site, newVersion)
                            .then(() => browser.tabs.query({ active: true, currentWindow: true }))
                            .then(tabs => {
                                if (newVersion && tabs[0].url?.includes(site.host)) {
                                    console.log("reload triggered: ", tabs[0].url, site.host)
                                    browser.tabs.reload(tabs[0].id, {bypassCache: true })
                                }
                            })
                            .then(() => {
                                console.log("setting new version ", newVersion)
                                setVersion(newVersion)
                            })
                            .finally(() => {
                                console.log("updated rules")
                            })
                        console.log("Really Done!")
                    }

                    return (
                        <tr key={site.id}>
                            <td>{site.name}</td>
                            <td>
                                <VersionPicker version={version} choices={site.options.versions} updateVersion={updateVersion} />
                            </td>
                            <td><a href={docRoot} target='_blank' rel="noopener noreferrer">{docRoot}</a></td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}
