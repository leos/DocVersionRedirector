# ![icon](https://raw.githubusercontent.com/leos/DocVersionRedirector/master/src/public/icon/48.png) DocVersionRedirector

![icon](https://raw.githubusercontent.com/leos/DocVersionRedirector/master/images/screenshot.png)

A Chrome extension that redirects you to a specific version of the documentation that you want.

When you're working with a specific software version the docs for a different version that you get via search or links can give you incorrect information. This extension solves that problem by redirecting you to the version of the docs you need.

For example, DocVersionRedirector can automatically redirect: https://docs.python.org/2.7/library/index.html to https://docs.python.org/3.6/library/index.html.


## Supported Sites

| Project     | Site                             |
| ----------- | -------------------------------- |
| Airflow     | airflow.apache.org/docs          |
| Bazel       | docs.bazel.build                 |
| Django      | docs.djangoproject.com           |
| Java SE     | docs.oracle.com/en               |
| Laravel     | laravel.com/docs                 |
| MySQL       | dev.mysql.com/doc/refman         |
| PostgreSQL  | www.postgresql.org/docs          |
| Python      | docs.python.org                  |

More sites coming soon!

## Configuration

Click on the extension icon to see the settings screen. Here you can choose preferred versions for any of the available projects.

## Installation

You can install the latest from the [Chrome Web Store](https://chrome.google.com/webstore/detail/nomnkbngkijpffepcgbbofhcnafpkiep/).

If you want to try it out locally or do development, you'll need a recent version of [Node](https://nodejs.org/en/) and [pnpm](https://pnpm.io/) (`brew install node pnpm` on MacOS).

Clone this repo, then:

```
pnpm install
pnpm dev
```

The extension is built with [WXT](https://github.com/wxt-dev/wxt) which will automatically open up an instance of your browser and load it unpacked.

## Limitations

* In some cases, content has changed locations in the tree and the redirect won't be valid. For example, in 2.0 the page `more-widgets.html` got renamed to `more-extensions.html`. You'll need to disable the redirection. Better support for this situation is coming.
* This version of DocVersionRedirector doesn't yet support multiple languages and language switching.


## Adding sites

If you'd like to add a site, see the definitions in [`site_data.ts`](https://github.com/leos/DocVersionRedirector/blob/master/src/utils/site_data.ts) and feel free to submit a PR. Make sure to add a glob to `host_permissions` in `wxt.config.ts`.

