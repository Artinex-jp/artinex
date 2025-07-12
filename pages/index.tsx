import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { ChevronDown, Music, Users, Calendar, ArrowRight, Play, Star, Award, Heart } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/router';

const ArtinexHomepage = () => {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: any) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    const name = (document.getElementById("name") as HTMLInputElement)?.value;
    const email = (document.getElementById("email") as HTMLInputElement)?.value;
    const subject = (document.getElementById("subject") as HTMLInputElement)?.value;
    const message = (document.getElementById("message") as HTMLTextAreaElement)?.value;

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, message }),
    });

    if (res.ok) {
      alert('送信が完了しました。自動返信メールをご確認ください。');
    } else {
      alert('送信に失敗しました。時間をおいて再度お試しください。');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>ホーム｜Artinex</title>
        <meta name="description" content="合同会社アーティネクス・公式ホームページ。私たちは、幅広くアーティスト同士を繋ぎ、芸術文化を愛する方々にアートを届けます" />
        <meta property="og:title" content="ホーム｜Artinex" />
        <meta property="og:description" content="合同会社アーティネクス・公式ホームページ。私たちは、幅広くアーティスト同士を繋ぎ、芸術文化を愛する方々にアートを届けます" />
        <meta property="og:url" content="https://artinex.jp/" />
        {/* <meta property="og:image" content="https://example.com/og-image.jpg" /> */}
        <meta property="og:type" content="website" />
      </Head>

      {/* Hero Section */}
      <section id="home" className="relative h-screen bg-gradient-to-br from-[#5BADC1] via-[#4A9BB5] to-[#D8D2AB] overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center max-w-4xl mx-auto px-6">
            <div className="mb-8 animate-fade-in">
              <Image
                src="/artinex_logo_white.svg"
                alt="Artinex ロゴ"
                width={240}
                height={40}
                priority
              />
            </div>
            
            <h1 className="text-3xl md:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up">
              アーティストをつなげる
            </h1>
            
            <p className="text-md md:text-2xl text-white/90 mb-8 animate-fade-in-up animation-delay-300">
              私たちは、幅広くアーティスト同士を繋ぎ、<br/>
              芸術文化を愛する方々にアートを届けます
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
              <button 
                onClick={() => scrollToSection('about')}
                className="bg-brand-secondary text-white border-2 border-white px-4 md:px-8 py-2 md:py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-brand-secondary transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                詳しく見る
              </button>
              <button 
                onClick={() => router.push("/events")}
                className="bg-brand-primary border-2 border-white text-white px-4 md:px-8 py-2 md:py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-brand-primary transition-all duration-300 transform hover:scale-105"
              >
                コンサート情報
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#5BADC1] to-[#D8D2AB] bg-clip-text text-transparent">
              Artinexについて
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              2024年末に設立された合同会社Artinexは、芸術文化をアーティスト視点で盛り上げることを使命としています
            </p>
          </div>

          <div className="items-center">           
              <div className="bg-brand-secondary/20 p-8 rounded-3xl border border-brand-secondary/30 w-[400px] max-w-[90%] mx-auto">
              <h3 className="text-2xl font-bold mb-4">私たちのミッション</h3>
                <p className="text-lg leading-relaxed">
                  優れた芸術家による個性的なイベントを企画し、新しい芸術体験の創造を通じて、芸術文化の発展に貢献します。<br/>従来の枠にとらわれない、革新的で感動的なイベントをお届けします。
                </p>
              </div>
          </div>
        </div>
      </section>

      {/* Concerts Section */}
      <section id="concerts" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#5BADC1] to-[#D8D2AB] bg-clip-text text-transparent">
              イベント情報
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Artinexが主催する多彩なイベントをお楽しみください
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#5BADC1]/10 to-[#D8D2AB]/10 p-8 rounded-3xl text-center">
            <Calendar className="w-16 h-16 text-[#5BADC1] mx-auto mb-6" />
            <h3 className="text-3xl font-bold mb-4 text-gray-800">イベント開催中</h3>
            <p className="text-lg text-gray-600 mb-8">
              チケットの予約・購入はこちらから
            </p>
            <button
              className="bg-[#5BADC1] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#4A9BB5] transition-all duration-300 transform hover:scale-105"
              onClick={() => router.push("/events")}
            >
              イベント情報
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-[#5BADC1] to-[#D8D2AB]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-5xl font-bold mb-6 text-white">
              お問い合わせ
            </h2>
            <p className="text-md md:text-lg text-white/90 max-w-3xl mx-auto">
              ご質問、ご相談、コラボレーションのお申し込みなど、お気軽にお問い合わせください
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm p-8 rounded-3xl">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="block text-white mb-2 font-medium">お名前</div>
                  <input id="name" type="text" className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:border-white focus:outline-none" placeholder="山田太郎" />
                </div>
                <div>
                  <div className="block text-white mb-2 font-medium">メールアドレス</div>
                  <input id="email" type="email" className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:border-white focus:outline-none" placeholder="example@email.com" />
                </div>
              </div>
              <div>
                <div className="block text-white mb-2 font-medium">件名</div>
                <input id="subject" type="text" className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:border-white focus:outline-none" placeholder="お問い合わせ内容" />
              </div>
              <div>
                <div className="block text-white mb-2 font-medium">メッセージ</div>
                <textarea id="message" rows={5} className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:border-white focus:outline-none resize-none" placeholder="お気軽にお問い合わせください"></textarea>
              </div>
              <button
                type="button"
                className="w-full bg-white text-[#5BADC1] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                onClick={handleSubmit}
              >
                送信する
              </button>
            </div>
          </div>
        </div>
      </section>



      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
      `}</style>
    </div>
  );
};

export default ArtinexHomepage;