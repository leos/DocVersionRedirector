import { ChangeEventHandler } from 'react'

export default function VersionPicker({ version, choices, updateVersion }: { version: string, choices: string[], updateVersion: ChangeEventHandler }) {
    return (
        <select
            value={version}
            onChange={updateVersion}
        >
            <option key="none"></option>
            {choices.map(x => <option key={x}>{x}</option>)}
        </select >
    )
}
