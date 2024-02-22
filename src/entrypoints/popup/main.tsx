import React from 'react'
import ReactDOM from 'react-dom/client'

import OptionTable from '../../components/OptionTable.tsx'

import './style.css'

// const currentSite = siteDefinitions[2]
// const config = await getSiteConfigForID(currentSite.id)


const sortedSiteDefs = siteDefinitions.sort((a, b) => a.name.localeCompare(b.name))

storedConfigs.getValue().then(configs =>
    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <h2>DocVersionRedirector</h2>
            <div>
                <OptionTable sites={sortedSiteDefs} configs={configs} />
            </div>
            <div className="left">
                <p>Set your preferred version for each doc site above</p>
                <p>To disable automatic redirecting set the version to blank</p>
            </div>
            {/* <Popup site={currentSite} config={config} /> */}
        </React.StrictMode>,
    )
)
