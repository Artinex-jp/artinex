import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/webp" href="/artinex_logo_solo.webp" />
      </Head>
      <body className="font-sans">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}