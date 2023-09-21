import '@/styles/globals.css'
import 'antd/dist/antd.css'
// import 'antd/dist/reset.css';
// import 'antd/dist/antd-with-locales.min';
import type {AppProps} from 'next/app'
// import 'antd/dist/reset.css'
// import {ConfigProvider} from 'antd';
// import theme from "@/theme/themeConfig";

export default function App({Component, pageProps}: AppProps) {
    return (
        <Component {...pageProps} />
    )
}


// import '@/styles/globals.css'
// import React from 'react';
// import { ConfigProvider } from 'antd';
// import type { AppProps } from 'next/app';
//
// import theme from '../theme/themeConfig';
//
// const App = ({ Component, pageProps }: AppProps) => (
//     <ConfigProvider theme={theme}>
//         <Component {...pageProps} />
//     </ConfigProvider>
// );
//
// export default App;
