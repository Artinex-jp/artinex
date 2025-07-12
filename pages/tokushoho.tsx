import Head from 'next/head'

export default function Tokushoho() {
  return (
    <>
      <Head>
        <title>特定商取引法に基づく表記 | Artinex</title>
        <meta name="description" content="合同会社Artinexの特定商取引法に基づく表記" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="特定商取引法に基づく表記｜Artinex" />
        <meta property="og:description" content="合同会社Artinexの特定商取引法に基づく表記" />
        <meta property="og:url" content="https://artinex.jp/tokushoho" />
        {/* <meta property="og:image" content="https://example.com/og-image.jpg" /> */}
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <main className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-xl md:text-2xl font-bold text-center mb-10 text-gray-800 border-b-4 border-brand-primary pb-6">
            特定商取引法に基づく表記
          </h1>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-brand-primary">
              <h2 className="text-xl font-bold mb-3 text-gray-800">販売業者</h2>
              <p className="text-gray-600">合同会社Artinex</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-brand-primary">
              <h2 className="text-xl font-bold mb-3 text-gray-800">通信販売業務の責任者</h2>
              <p className="text-gray-600">榎政則</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-brand-primary">
              <h2 className="text-xl font-bold mb-3 text-gray-800">所在地</h2>
              <p className="text-gray-600">東京都渋谷区鶯谷町１４－４－３０７</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-brand-primary">
              <h2 className="text-xl font-bold mb-3 text-gray-800">電話番号</h2>
              <p className="text-gray-600">080-8050-6318</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-brand-primary">
              <h2 className="text-xl font-bold mb-3 text-gray-800">メールアドレス</h2>
              <p className="text-gray-600">info@artinex.jp</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-brand-primary">
              <h2 className="text-xl font-bold mb-3 text-gray-800">商品の販売価格</h2>
              <p className="text-gray-600">商品ページに記載</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-brand-primary">
              <h2 className="text-xl font-bold mb-3 text-gray-800">商品代金以外に必要な料金</h2>
              <p className="text-gray-600">消費税（商品代に含む）</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-brand-primary">
              <h2 className="text-xl font-bold mb-3 text-gray-800">支払時期</h2>
              <p className="text-gray-600">請求メールに記載</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-brand-primary">
              <h2 className="text-xl font-bold mb-3 text-gray-800">送料</h2>
              <p className="text-gray-600">商品ページに特別に記載がある場合を除き無料</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-brand-primary">
              <h2 className="text-xl font-bold mb-3 text-gray-800">返品・キャンセル</h2>
              <div className="space-y-4">
                <div className="bg-white rounded-md p-4">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">電子データ・電子チケットの場合</h3>
                  <p className="text-gray-600">
                    原則商品の返品・キャンセルは行いません。ただし、電子チケットの場合、当社の都合によりイベントが中止となった場合のみ払い戻しをいたします。
                  </p>
                </div>
                <div className="bg-white rounded-md p-4">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">現物の場合</h3>
                  <p className="text-gray-600">
                    お客様が受領した時点で著しい破損が見られた場合、それを証明する写真等の電磁データを当社に提出することにより、同一商品との交換を行います。
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-brand-primary">
              <h2 className="text-xl font-bold mb-3 text-gray-800">返品送料</h2>
              <p className="text-gray-600">当社で負担いたします。</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-brand-primary">
              <h2 className="text-xl font-bold mb-3 text-gray-800">商品の引渡時期</h2>
              <p className="text-gray-600">請求メールに記載</p>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}