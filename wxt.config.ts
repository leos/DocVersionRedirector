import { defineConfig } from 'wxt'
import react from '@vitejs/plugin-react'

// See https://wxt.dev/api/config.html
export default defineConfig({
    manifest: {
        host_permissions: [
            "*://dev.mysql.com/doc/refman/*",
            "*://docs.djangoproject.com/*",
            "*://docs.oracle.com/en/*",
            "*://docs.python.org/*",
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
