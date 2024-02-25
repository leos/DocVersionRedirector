import { defineConfig } from 'wxt'
import react from '@vitejs/plugin-react'

// See https://wxt.dev/api/config.html
export default defineConfig({
    manifest: {
        host_permissions: [
            "*://airflow.apache.org/docs/*",
            "*://dev.mysql.com/doc/refman/*",
            "*://docs.bazel.build/*",
            "*://docs.djangoproject.com/*",
            "*://docs.oracle.com/en/*",
            "*://docs.python.org/*",
            "*://laravel.com/*",
            "*://www.postgresql.org/docs/*",
        ],
        permissions: ["declarativeNetRequest", "declarativeNetRequestFeedback", "storage"],
        name: 'DocVersionRedirector'
    },
    srcDir: 'src',
    vite: () => ({
        plugins: [react()],
    }),
})
