import { StoredSiteConfig } from './site_types';


export const storedConfigs = storage.defineItem<StoredSiteConfig[]>(
    'sync:storedConfigs',
    {
        defaultValue: [],
        version: 1,
    }
)
