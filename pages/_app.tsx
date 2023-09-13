import '@/styles/globals.css'
import 'antd/dist/antd.css'
import type {AppProps} from 'next/app'
// import 'antd/dist/reset.css'
// import {ConfigProvider} from 'antd';
// import theme from "@/theme/themeConfig";

export default function App({Component, pageProps}: AppProps) {
    return (
        // <ConfigProvider theme={theme}>
            <Component {...pageProps} />
        // </ConfigProvider>
    )
}

