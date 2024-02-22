import './Popup.css'
import { SiteDefinition, SiteConfig } from '@/utils/site_types'
import VersionPicker from '@/components/VersionPicker'

export default function Popup({ site, config }: { site: SiteDefinition, config: SiteConfig | undefined }) {

    return (
        <>
            <label>
                Pick a version:
                {/* <VersionPicker site={site} siteConfig={config} /> */}
            </label >

            <h1>WXT + ts</h1>
            <div className="card">
                <p>
                    Edit <code>src/App.tsx</code> cats are great!
                </p>
            </div>
            {/* <a onClick={() => browser.runtime.openOptionsPage()}>
                Options Page
            </a> */}
        </>
    )
}
