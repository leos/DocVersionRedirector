import React from 'react'
import ReactDOM from 'react-dom/client'
import OptionTable from '../../components/OptionTable.tsx'
import '../popup/style.css'


const sortedSiteDefs = siteDefinitions.sort((a, b) => a.name.localeCompare(b.name))
console.log("in options")
storedConfigs.getValue().then(configs =>
    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <h1>DocVersionRedirector</h1>
            <div>
                <OptionTable sites={sortedSiteDefs} configs={configs} />
            </div>
        </React.StrictMode>,
    )
)
