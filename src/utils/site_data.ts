import { SiteDefinition } from "./site_types"

export default defineUnlistedScript(() => { })

export const siteDefinitions: SiteDefinition[] = [
    {
        id: 1001,
        name: 'Python',
        host: 'docs.python.org',
        regexFilter: '/([^/]*)/',
        substitutionTemplate: "/${version}/",
        options: {
            versions: ['3', '3.13', '3.12', '3.11', '3.10', '3.9', '3.8', '3.7', '3.6', '3.5', '2.7'],
        }
    },
    {
        id: 1002,
        name: 'PostgreSQL',
        host: 'www.postgresql.org',
        regexFilter: '/docs/([^/]*)/',
        substitutionTemplate: "/docs/${version}/",
        options: {
            versions: [
                '16', '15', '14', '13', '12',
                'devel',
                // Legacy
                '11', '10', '9.6', '9.5', '9.4', '9.3', '9.2', '9.1', '9.0', '8.4', '8.3', '8.2', '8.1', '8.0', '7.4', '7.3', '7.2'
            ]
        }
    },
    {
        id: 1003,
        name: 'MySQL',
        host: 'dev.mysql.com',
        regexFilter: '/doc/refman/([^/]*)/en/',
        substitutionTemplate: '/doc/refman/${version}/en/',
        options: {
            versions: ['8.3', '8.0', '5.7']
        }
    },
    {
        id: 1004,
        host: 'docs.djangoproject.com',
        name: 'Django',
        regexFilter: '/en/([^/]*)/',
        substitutionTemplate: '/en/${version}/',
        options: {
            // lang: ['en', 'el', 'es', 'fr', 'id', 'ja', 'ko', 'pl', 'pt-br', 'zh-hans'],
            versions: ['5.0', 'dev', '4.2', '4.1', '4.0', '3.2', '3.1', '3.0', '2.2', '2.1', '2.0', '1.11', '1.10', '1.8'],
        },
    },
    {
        id: 1005,
        host: 'docs.oracle.com',
        name: 'Java SE',
        regexFilter: '/en/java/javase/([^/]*)/',
        substitutionTemplate: '/en/java/javase/${version}/',
        options: {
            versions: ['21', '20', '19', '18', '17', '16', '15', '14', '13', '12', '11']
        },
    }
]

