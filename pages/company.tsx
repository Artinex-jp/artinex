import Head from 'next/head'
import { useState, useEffect } from 'react'

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
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 py-20">
            <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                会社概要
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                合同会社Artinex
              </p>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Mission</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-2xl shadow-lg">
                    <h3 className="text-2xl font-bold text-white mb-3">「Art(ists)をnexusする」</h3>
                    <p className="text-blue-100">
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
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl transform rotate-3"></div>
                  <div className="relative bg-white rounded-2xl p-8 shadow-lg">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
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
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-white">
                <div className="text-center">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">代表プロフィール</h2>
                  <div className="w-24 h-1 bg-white/50 mx-auto rounded-full"></div>
                </div>
              </div>
              
              <div className="p-8 md:p-12">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-1">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 text-center">
                      <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-4xl font-bold text-white">榎</span>
                      </div>
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
                        学歴・経歴
                      </h4>
                      <div className="space-y-3 text-gray-600">
                        <p>東京藝術大学音楽学部作曲科を2013年に卒業後、渡仏</p>
                        <p>パリ国立高等音楽院音楽書法科修士課程を2018年に修了</p>
                        <p>同じく鍵盤即興科修士課程を2020年に賛辞付き満場一致の最優秀の成績で修了</p>
                        <p>フランスの主要映画館で無声映画の伴奏員を務める</p>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
                      <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                        活動実績
                      </h4>
                      <p className="text-gray-600">
                        これまでに映像・美術・舞踊・朗読など、多くの分野とのコラボレーションを行ってきた。
                      </p>
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
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">会社概要</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">会社名</h3>
                    <p className="text-lg">合同会社Artinex</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">設立</h3>
                    <p className="text-gray-600">2024年末</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">設立の想い</h3>
                  <p className="text-gray-600 leading-relaxed">
                    合同会社Artinexは、2024年末に芸術文化をアーティスト視点で盛り上げることを目的として設立いたしました。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}