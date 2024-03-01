import { getVersionDisplay, getVersionURL } from '@/utils/helpers'
import { SiteVersion } from '@/utils/site_types'
import { ChangeEventHandler } from 'react'

export default function VersionPicker({ version, choices, updateVersion }: { version: string, choices: SiteVersion[], updateVersion: ChangeEventHandler }) {
    return (
        <select
            value={version}
            onChange={updateVersion}
        >
            <option key="none"></option>
            {choices.map(v => <option key={getVersionURL(v)} value={getVersionURL(v)}>{getVersionDisplay(v)}</option>)}
        </select >
    )
}
