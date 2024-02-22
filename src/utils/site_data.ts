import { SiteDefinition } from "./site_types"

export default defineUnlistedScript(() => { })

export const siteDefinitions: SiteDefinition[] = [
    {
        id: 101,
        name: 'Python',
        host: 'docs.python.org',
        regexFilter: '/([^/]*)/',
        substitutionTemplate: "/${version}/",
        options: {
            versions: ['3', '3.13', '3.12', '3.11', '3.10', '3.9', '3.8', '3.7', '3.6', '3.5', '2.7'],
        }
    },
    {
        id: 102,
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
        id: 103,
        name: 'MySQL',
        host: 'dev.mysql.com',
        regexFilter: '/doc/refman/([^/]*)/en/',
        substitutionTemplate: '/doc/refman/${version}/en/',
        options: {
            versions: ['8.3', '8.0', '5.7']
        }
    },
    {
        id: 104,
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
        id: 105,
        host: 'docs.oracle.com',
        name: 'Java SE',
        regexFilter: '/en/java/javase/([^/]*)/',
        substitutionTemplate: '/en/java/javase/${version}/',
        options: {
            versions: ['21', '20', '19', '18', '17', '16', '15', '14', '13', '12', '11']
        },
    },
    {
        id: 106,
        host: 'docs.bazel.build',
        name: 'Bazel',
        regexFilter: '/versions/([^/]*)/',
        substitutionTemplate: '/versions/${version}/',
        options: {
            versions: [
                'main',
                '5.4.1',
                '5.4.0',
                '5.3.1',
                '5.3.0',
                '5.2.0',
                '5.1.1',
                '5.1.0',
                '5.0.0',
                '4.2.4',
                '4.2.3',
                '4.2.2',
                '4.2.1',
                '4.2.0',
                '4.1.0',
                '4.0.0',
                '3.7.0',
                '3.6.0',
                '3.5.1',
                '3.4.0',
                '3.3.0',
                '3.2.0',
                '3.1.0',
                '3.0.0',
                '2.2.0',
                '2.1.0',
                '2.0.0',
                '1.2.0',
                '1.1.0',
                '1.0.0',
                '0.29.1',
                '0.29.0',
                '0.28.0',
                '0.27.0',
                '0.26.0',
                '0.25.0',
                '0.24.0',
                '0.23.0',
                '0.22.0',
                '0.21.0',
                '0.20.0',
                '0.19.2',
                '0.19.1',
                '0.18.1',
                '0.17.2',
                '0.17.1',
            ]
        }
    }
]

