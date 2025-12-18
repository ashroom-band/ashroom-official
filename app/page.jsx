// app/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { siteConfig, latestNews, videoIds, discography, schedules } from '../data/ashroomConfig';

// --- 共通コンポーネント定義 ---

// 1. ヒーローセクション
const HeroSection = () => (
  <section id="top" className="h-screen w-full flex flex-col justify-center items-center relative overflow-hidden">
    <h2 className="text-3xl md:text-5xl font-extrabold text-white z-10 text-center tracking-tight font-shippori italic">
      {siteConfig.tagline}
    </h2>
    <img src="/artist-photo.jpg" alt="ashroom Artist Photo" className="absolute inset-0 w-full h-full object-cover" />
    <div className="absolute inset-0 bg-gray-900 opacity-60"></div>
  </section>
);

// 2. セクションタイトル
const SectionTitle = ({ title, path }) => (
  <div className="flex justify-between items-end border-b border-gray-700 pb-2 mb-8">
    <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
    <a href={path} className="text-gray-400 text-sm hover:text-[#E2FF00] transition-colors">VIEW ALL &gt;</a>
  </div>
);

// 3. 最新3種統合スライダー (YouTube API連携版)
const FlyerSlider = () => {
  const [videoTitle, setVideoTitle] = useState("LATEST VIDEO");
  const nextLive = schedules.find(s => s.status === 'upcoming') || {};
  
  // 配列の最後（最新）の音源データを取得
  const latestRelease = discography.length > 0 ? discography[discography.length - 1] : {};
  
  const latestVideoId = videoIds[0];
  const latestVideoThumb = `https://img.youtube.com/vi/${latestVideoId}/maxresdefault.jpg`;

  useEffect(() => {
    const fetchVideoTitle = async () => {
      const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
      if (!apiKey || !latestVideoId) return;

      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${latestVideoId}&key=${apiKey}`
        );
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          setVideoTitle(data.items[0].snippet.title);
        }
      } catch (error) {
        console.error("YouTube API Error:", error);
      }
    };
    fetchVideoTitle();
  }, [latestVideoId]);

  const slides = [
    { 
      id: 'live', 
      src: nextLive.flyer || "/no-image.jpg", 
      alt: 'Next Live', 
      link: '/schedule', 
      label: 'NEXT LIVE',
      title: nextLive.venue ? `${nextLive.venue} 『${nextLive.title}』` : 'LIVE SCHEDULE' 
    },
    { 
      id: 'disc', 
      src: latestRelease.jacket || "/no-image.jpg", 
      alt: 'New Release', 
      link: '/discography', 
      label: 'NEW RELEASE',
      title: latestRelease.title || 'DISCOGRAPHY'
    },
    { 
      id: 'video', 
      src: latestVideoThumb, 
      alt: 'Latest Video', 
      link: '/video', 
      label: 'LATEST VIDEO',
      title: videoTitle
    },
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const goToPrevious = () => setCurrentIndex(currentIndex === 0 ? slides.length - 1 : currentIndex - 1);
  const goToNext = () => setCurrentIndex(currentIndex === slides.length - 1 ? 0 : currentIndex + 1);
  
  return (
    <section className="my-10 relative group">
      <div className="relative h-72 md:h-[500px] bg-black rounded-lg overflow-hidden border border-gray-800">
        <div className="flex w-full h-full transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {slides.map((slide) => (
            <div key={slide.id} className="w-full flex-shrink-0 h-full relative">
              <a href={slide.link} className="block w-full h-full">
                <img src={slide.src} alt={slide.alt} className="w-full h-full object-contain pb-12" />
                <div className="absolute top-4 left-4 bg-[#E2FF00] text-black text-[10px] font-bold px-3 py-1 tracking-tighter z-10 shadow-lg">
                  {slide.label}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent pt-12 pb-5 px-6">
                  <p className="text-white text-sm md:text-xl font-bold tracking-tight truncate">
                    {slide.title}
                  </p>
                </div>
              </a>
            </div>
          ))}
        </div>
        <button onClick={goToPrevious} className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20">&lt;</button>
        <button onClick={goToNext} className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20">&gt;</button>
        <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2 z-20 scale-75">
          {slides.map((_, index) => (
            <button key={index} onClick={() => setCurrentIndex(index)} className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-[#E2FF00] w-6' : 'bg-gray-500'}`} />
          ))}
        </div>
      </div>
    </section>
  );
};

// 4. YouTube表示ブロック
const VideoBlock = ({ videoId }) => (
    <a href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noopener noreferrer" className="block relative w-full aspect-video group border border-gray-800 overflow-hidden rounded">
        <img src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} alt="YouTube Thumbnail" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <div className="w-14 h-10 bg-[#FF0000] rounded-lg flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110">
                <div className="w-0 h-0 border-t-[7px] border-t-transparent border-l-[12px] border-l-white border-b-[7px] border-b-transparent ml-1"></div>
            </div>
        </div>
    </a>
);

// --- メインコンポーネント ---

export default function Home() {
  const topNews = latestNews.slice(0, 2);
  const homeSchedules = schedules.filter(s => s.status === 'upcoming').slice(0, 2);
  
  // 配列の最後（最新）の音源データを取得
  const latestRelease = discography.length > 0 
    ? discography[discography.length - 1] 
    : { title: "COMING SOON", type: "", jacket: "/no-image.jpg", link: "#" };

  return (
    <div className="bg-[#0a0a0a]">
      <HeroSection />
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        
        <FlyerSlider /> 

        <section className="my-20">
          <SectionTitle title="NEWS" path="/news" />
          <div className="space-y-6">
            {topNews.map((item, index) => (
              <a key={index} href={item.link} className="group block border-b border-gray-800 pb-4">
                <p className="text-xs text-white font-bold mb-1 tracking-tighter">
                  {item.date} {index === 0 && <span className="bg-[#E2FF00] text-black text-[10px] px-2 py-0.5 ml-2 rounded">NEW</span>}
                </p>
                <p className="text-base text-gray-400 font-light tracking-tight group-hover:text-[#E2FF00] transition-colors">{item.title}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="my-20">
          <SectionTitle title="SCHEDULE" path="/schedule" />
          <div className="space-y-10">
            {homeSchedules.length > 0 ? homeSchedules.map((live) => (
              <div key={live.id} className="flex flex-col md:flex-row gap-4 md:items-center border-b border-gray-800 pb-8">
                <div className="md:w-48 flex-shrink-0">
                    <p className="text-xl font-bold text-white tracking-tighter">
                        {live.date} <span className="text-sm ml-1">[{live.dayOfWeek}]</span>
                    </p>
                </div>
                <div className="flex-grow">
                    <h3 className="text-lg font-bold text-white tracking-tight">{live.venue}</h3>
                    <p className="text-sm font-light text-gray-400 tracking-tight">『{live.title}』</p>
                </div>
                <div className="md:w-64 md:flex-shrink-0">
                    {live.link && live.link !== '#' ? (
                        <a href={live.link} target="_blank" rel="noopener noreferrer" className="block w-full bg-[#E2FF00] text-black text-center text-xs font-bold py-3 rounded-full hover:bg-white transition-colors shadow-lg tracking-tight">TICKET</a>
                    ) : (
                        <p className="text-xs text-gray-400 leading-relaxed italic md:text-right w-full tracking-tight">
                            TICKETは、各SNSのDMより取り置きのご連絡をお願いします。
                        </p>
                    )}
                </div>
              </div>
            )) : (
              <p className="text-gray-500 italic text-sm tracking-tight">No upcoming shows.</p>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 my-20">
            <section>
                <SectionTitle title="RELEASE" path="/discography" />
                <a href={latestRelease.link} target="_blank" rel="noopener noreferrer" className="group block relative overflow-hidden rounded-sm border border-gray-800">
                    <img 
                        src={latestRelease.jacket} 
                        alt={latestRelease.title} 
                        className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                        <p className="text-[#E2FF00] text-[10px] font-bold mb-1 uppercase tracking-tighter">
                            {latestRelease.type}
                        </p>
                        <h3 className="text-xl font-bold text-white tracking-tight">
                            {latestRelease.title}
                        </h3>
                    </div>
                </a>
            </section>

            <section>
                <SectionTitle title="VIDEO" path="/video" />
                <div className="space-y-4">
                    <VideoBlock videoId={videoIds[0]} />
                </div>
            </section>
        </div>

      </div>
    </div>
  );
}