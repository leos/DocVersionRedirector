# ![icon](https://raw.githubusercontent.com/leos/DocsVersionRedirector/master/static/icons/icon48.png) DocsVersionRedirector

Chrome extension to redirect to the right version of docs for several sites:

Project | Site
--------|-----
Airflow | airflow.apache.org/docs
Ansible | docs.ansible.com/ansible
Bazel | docs.bazel.build
Django | docs.djangoproject.com
Python | docs.python.org

## Configuration
<img align="right" src="https://raw.githubusercontent.com/leos/DocsVersionRedirector/master/screenshots/python.png" />
On every site where the extension is active the icon will light up. If you click it you can change the setting for that site.

## Installation
If you want to try it out locally, check out the repo, then:
```
npm install
npm run dev
```
This will transpile the typescript into `dist/`.

Then go to `chrome://extensions/`, click on **Load Unpacked** and select the `dist` folder.