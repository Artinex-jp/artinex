'use client';

export default function HomePage() {
  return (
    <main className="px-4 md:px-12 py-16 space-y-24 bg-gradient-to-br from-white to-gray-50">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
          芸術を、未来へ。
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Artinexは、アーティスト同士をつなげ、芸術文化の新たな価値を創造します。
        </p>
        <div className="mt-6">
          <a
            href="/events"
            className="inline-block px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-xl text-lg font-semibold shadow-md"
          >
            イベントを見る
          </a>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-5xl mx-auto space-y-4 text-center">
        <h2 className="text-3xl font-semibold text-gray-800">Artinexについて</h2>
        <p className="text-gray-600 text-md md:text-lg">
          私たちは、アーティストと観客のあいだに豊かな出会いを生み出すプラットフォームを提供します。
          音楽をはじめとした芸術活動の流通と価値創造をサポートするため、チケット販売、収益分配、アーカイブ配信など多角的なサービスを展開しています。
        </p>
      </section>

      {/* Services Section */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-10">私たちのサービス</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-2 text-blue-600">イベント管理</h3>
            <p className="text-gray-600 text-sm">
              公演の企画から予約・決済までを一括で管理。出演者情報、演目、会場などの詳細も柔軟にカスタマイズ可能です。
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-2 text-blue-600">チケット販売</h3>
            <p className="text-gray-600 text-sm">
              Stripe連携によるスムーズなオンライン決済。各パフォーマンスに合わせた多様なチケット種別に対応。
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-2 text-blue-600">アーカイブ配信</h3>
            <p className="text-gray-600 text-sm">
              公演の記録を高品質な映像で保存・共有。配信や販売にも対応し、芸術の資産化を推進します。
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="text-center space-y-4">
        <h2 className="text-3xl font-semibold text-gray-800">お問い合わせ</h2>
        <p className="text-gray-600 text-md">
          ご質問やご相談は、お気軽に <a href="mailto:info@artinex.jp" className="text-blue-600 underline">info@artinex.jp</a> までご連絡ください。
        </p>
      </section>
    </main>
  );
}
