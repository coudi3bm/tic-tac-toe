import colors from 'vuetify/es5/util/colors'

export default {
    target: 'server',
    render: {
        ssr: true
    },
    head: {
        htmlAttrs: {
            lang: 'ru',
        },
        title: 'tic-tac-toe',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: '' }
        ],
        link: [
            { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
        ]
    },
    components: true,
    buildModules: [
        '@nuxtjs/vuetify',
    ],
    modules: [
        '@nuxtjs/axios',
        '~/modules/ws-server'
    ],
    plugins: [
        '~/plugins/notifier.js',
    ],
    vuetify: {
        defaultAssets: false,
        icons: {
            iconfont: 'mdiSvg',
        },
        theme: {
            dark: false,
            themes: {
                light: {
                    header: '#ffffff',
                    icon: '#212121',
                },
                dark: {
                    header: '#363636',
                    icon: '#ffffff',
                }
            }
        }
    },
    axios: {
        proxy: true
    },
    server: {
        port: 3000,
        host: '0.0.0.0'
    },
    build: {}
}