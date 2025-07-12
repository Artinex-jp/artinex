import Head from 'next/head'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Company() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <>
      <Head>
        <title>会社情報 | Artinex</title>
        <meta name="description" content="合同会社Artinexの会社情報。芸術文化をアーティスト視点で盛り上げることを目的として設立。" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="会社情報｜Artinex" />
        <meta property="og:description" content="合同会社Artinexの会社情報。芸術文化をアーティスト視点で盛り上げることを目的として設立。" />
        <meta property="og:url" content="https://artinex.jp/company" />
        <meta property="og:image" content="/artinex_ogp.webp" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 py-20">
            <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h1 className="text-2xl md:text-4xl font-bold mb-6">
                会社概要
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary mx-auto rounded-full"></div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Mission</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary mx-auto rounded-full"></div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-brand-primary to-brand-secondary p-6 rounded-2xl shadow-lg">
                    <h3 className="text-2xl font-bold text-white mb-3">「Art(ists)をnexusする」</h3>
                    <p className="text-white/90">
                      すなわち「芸術（家）を繋げる」という意味を込めて、「Artinex」と社名としております。
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <p className="text-gray-600 leading-relaxed">
                      日本では、素晴らしい才能を持つ個人アーティストが多数活動していますが、よほどその分野に精通している人でなければそのようなアートに触れることができないという現状があると言わざるを得ません。
                    </p>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-2xl transform rotate-3"></div>
                  <div className="relative bg-white rounded-2xl p-8 shadow-lg">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold text-gray-800 mb-2">Vision</h4>
                      <p className="text-gray-600">
                        分野を問わず、幅広くアーティスト同士を繋げ、芸術文化を愛する方々に素晴らしいアートを届けるために活動をしてまいります。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CEO Profile Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
              <div className="bg-gradient-to-r from-brand-primary to-brand-secondary px-8 py-12 text-white">
                <div className="text-center">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">代表プロフィール</h2>
                  <div className="w-24 h-1 bg-white/50 mx-auto rounded-full"></div>
                </div>
              </div>
              
              <div className="p-8 md:p-12">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-1">
                    <div className="relative bg-brand-primary/20 rounded-2xl pb-6 text-center overflow-hidden">
                      <Image
                        src="/enoki_profile.png"
                        alt="榎のプロフィール"
                        width={1000}
                        height={600}
                        className="w-full h-auto mb-4"
                      />
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">榎 政則</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p className="font-semibold">即興演奏家</p>
                        <p className="font-semibold">ピアニスト</p>
                        <p className="font-semibold">作曲家</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        プロフィール
                      </h4>
                      <div className="space-y-3 text-gray-600">
                        <p>東京藝術大学音楽学部作曲科を2013年に卒業後、渡仏。パリ国立高等音楽院音楽書法科修士課程を2018年に修了。同じく鍵盤即興科修士課程を2020年に賛辞付き満場一致の最優秀の成績で修了。フランスの主要映画館で無声映画の伴奏員を務める。</p>
                        <p>これまでに映像・美術・舞踊・朗読など、多くの分野とのコラボレーションを行ってきた。</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Company Info Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">会社情報</h1>
                <div className="w-24 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary mx-auto rounded-full"></div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4 border-b border-gray-200">
                  <div className="font-semibold text-gray-700">会社名</div>
                  <div className="md:col-span-3 text-gray-900">合同会社Artinex</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4 border-b border-gray-200">
                  <div className="font-semibold text-gray-700">設立</div>
                  <div className="md:col-span-3 text-gray-900">2024年12月23日</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4 border-b border-gray-200">
                  <div className="font-semibold text-gray-700">事業内容</div>
                  <div className="md:col-span-3 text-gray-900">
                    <ul className="space-y-2">
                      <li>(1) セミナー、研修会、講演会、公演、コンクールの企画、運営及び開催</li>
                      <li>(2) 音楽、美術、演劇その他の芸術活動に対する支援事業</li>
                      <li>(3) 文化芸術活動に関する助成金の運営及び管理</li>
                      <li>(4) デジタルコンテンツの企画、録音、録画、制作、配信、販売及び管理</li>
                      <li>(5) ウェブサイトの企画、構築、デザイン、制作、運営及びメンテナンス</li>
                      <li>(6) アート及び文化に関するコンサルティング業務</li>
                      <li>(7) 古物営業法に基づく古物営業及び古物競りあっせん業</li>
                      <li>(8) 楽器のレンタル及びリース事業</li>
                      <li>(9) 楽器及び文化財の保管、保全及び修理事業</li>
                      <li>(10) スタジオのレンタル及び運営管理事業</li>
                      <li>(11) 前各号に附帯関連する一切の事業</li>
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4 border-b border-gray-200">
                  <div className="font-semibold text-gray-700">代表</div>
                  <div className="md:col-span-3 text-gray-900">
                    <div>榎 政則</div>
                    <div>江崎 昭汰</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4">
                  <div className="font-semibold text-gray-700">所在地</div>
                  <div className="md:col-span-3 text-gray-900">東京都渋谷区鶯谷町1４－４－３０７</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}