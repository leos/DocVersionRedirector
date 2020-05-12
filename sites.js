const sites = {
    "docs.ansible.com": {
        regex: /^\/ansible\/(?<version>[^\/]*)\/(?<path>.*)/,
        template: "/ansible/${version}/${path}",
        options: {
            version: ["devel","latest","2.8","2.7","2.6","2.5","2.4","2.3"]
        }
    },
    "docs.bazel.build": {
        regex: /^\/versions\/(?<version>[^\/]*)\/(?<path>.*)/,
        template: "/versions/${version}/${path}",
        options: {
            version: ["master","3.1.0","3.0.0","2.2.0","2.1.0","2.0.0","1.2.0","1.1.0",
            "1.0.0","0.29.1","0.29.0","0.28.0","0.27.0","0.26.0","0.25.0","0.24.0","0.23.0",
            "0.22.0","0.21.0","0.20.0","0.19.2","0.19.1","0.18.1","0.17.2","0.17.1"],
        }
    },
    "docs.djangoproject.com": {
        regex: /^\/(?<lang>[^\/]*)\/(?<version>[^\/]*)\/(?<path>.*)/,
        template: "/${lang}/${version}/${path}",
        options: {
            lang: ["en","el","es","fr","id","ja","ko","pl","pt-br","zh-hans"],
            version: ["dev","3.0","2.2","2.1","2.0","1.11","1.10","1.8"],
        }
    },
    "docs.python.org": {
        regex: /^\/(?<version>[^\/]*)\/(?<path>.*)/,
        template: "/${version}/${path}",
        options: {
            version: ["3","3.9","3.8","3.7","3.6","3.5","2.7"],
        },
        moves: [
            {version: "3.5", before: "library/sets.html", after: "library/stdtypes.html#set-types-set-frozenset"},
            {version: "3.5", before: "library/stringio.html", after: "library/io.html#io.StringIO"},
        ]
    }
}