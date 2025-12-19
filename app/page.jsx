"use client"; // クライアントコンポーネントとして定義（スライダー動作のため）

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { client } from '../lib/microcms';

export default function Home() {
    const [newsItems, setNewsItems] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [discoItems, setDiscoItems] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // 1. クライアントサイドでデータを取得
    useEffect(() => {
        const fetchData = async () => {
            const news = await client.get({ endpoint: 'news', queries: { limit: 2, orders: '-published' } });
            const sched = await client.get({ endpoint: 'schedule', queries: { limit: 2, orders: 'date', filters: `date[greater_than]${new Date().toISOString()}` } });
            const disco = await client.get({ endpoint: 'discography', queries: { limit: 2, orders: '-releaseDate' } });
            
            setNewsItems(news.contents);
            setSchedules(sched.contents);
            setDiscoItems(disco.contents);
        };
        fetchData();
    }, []);

    const videoIds = ["t96q-B-F1rU"];
    const latestVideoId = videoIds[0];
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    // スライダー用データ
    const slides = [
        {
            id: 'live',
            src: schedules[0]?.flyer?.url || "/no-image.jpg",
            link: '/schedule',
            label: 'NEXT LIVE',
            title: schedules[0] ? `${schedules[0].venue} 『${schedules[0].name}』` : 'LIVE SCHEDULE'
        },
        {
            id: 'disc',
            src: discoItems[0]?.jacket?.url || "/no-image.jpg",
            link: '/discography',
            label: 'NEW RELEASE',
            title: discoItems[0]?.title || 'DISCOGRAPHY'
        },
        {
            id: 'video',
            src: `https://img.youtube.com/vi/${latestVideoId}/maxresdefault.jpg`,
            link: '/video',
            label: 'LATEST VIDEO',
            title: 'Music Video'
        }
    ];

    const goToPrevious = () => setCurrentIndex(currentIndex === 0 ? slides.length - 1 : currentIndex - 1);
    const goToNext = () => setCurrentIndex(currentIndex === slides.length - 1 ? 0 : currentIndex + 1);

    return (
        <div className="bg-[#0a0a0a] min-h-screen text-white">
            
            {/* --- HERO SECTION (PROFILE共通設計) --- */}
            <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="/artist-photo.jpg" alt="ashroom" className="w-full h-full object-cover grayscale-[20%]" />
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>
                
                {/* ヘッダーロゴ */}
                <div className="absolute top-12 left-8 z-20">
                    <img src="/logo-white.png" alt="ashroom" className="w-32 md:w-40 opacity-90" />
                </div>

                <div className="relative z-10 text-center px-4">
                    <p className="text-xl md:text-3xl font-light tracking-[0.4em] text-white/90 shippori-mincho italic drop-shadow-lg">
                        灰の部屋から、静寂と轟音を。
                    </p>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-4 py-20 space-y-32">
                
                {/* --- SLIDER (以前の形式) --- */}
                <section className="relative group">
                    <div className="relative h-[300px] md:h-[500px] bg-[#0d0d0d] overflow-hidden border border-white/5 shadow-2xl">
                        <div className="flex w-full h-full transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                            {slides.map((slide) => (
                                <div key={slide.id} className="w-full flex-shrink-0 h-full relative">
                                    <Link href={slide.link} className="block w-full h-full">
                                        <img src={slide.src} alt="" className="w-full h-full object-contain pb-16 pt-8" />
                                        <div className="absolute top-6 left-6 border border-white/20 bg-black/40 text-white text-[10px] tracking-widest px-3 py-1 z-10">
                                            {slide.label}
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent pt-12 pb-6 px-8">
                                            <p className="text-white text-base md:text-xl font-bold tracking-tight truncate shippori-mincho">{slide.title}</p>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                        <button onClick={goToPrevious} className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 text-white p-4 hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100 z-20">&lt;</button>
                        <button onClick={goToNext} className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 text-white p-4 hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100 z-20">&gt;</button>
                    </div>
                </section>

                {/* --- NEWS SECTION --- */}
                <section>
                    <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-10">
                        <h2 className="text-2xl font-bold tracking-[0.2em] shippori-mincho uppercase">NEWS</h2>
                        <Link href="/news" className="text-[10px] text-white/40 hover:text-white tracking-widest transition-all">VIEW ALL &gt;</Link>
                    </div>
                    <div className="divide-y divide-white/5">
                        {newsItems.map((item) => (
                            <Link key={item.id} href={`/news/${item.id}`} className="group block py-10 hover:bg-white/[0.02] transition-all px-4">
                                <p className="text-xs text-white/40 mb-3 font-mono tracking-widest uppercase">
                                    {item.published.replace(/-/g, '.')}
                                </p>
                                <h3 className="text-base md:text-lg font-normal text-white/80 group-hover:text-white group-hover:font-semibold transition-all duration-300">{item.title}</h3>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* --- SCHEDULE SECTION --- */}
                <section>
                    <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-10">
                        <h2 className="text-2xl font-bold tracking-[0.2em] shippori-mincho uppercase">SCHEDULE</h2>
                        <Link href="/schedule" className="text-[10px] text-white/40 hover:text-white tracking-widest transition-all">VIEW ALL &gt;</Link>
                    </div>
                    <div className="space-y-4">
                        {schedules.map((item) => (
                            <Link key={item.id} href="/schedule" className="group flex flex-col md:flex-row md:items-center gap-6 p-6 hover:bg-white/[0.02] transition-all border border-white/5">
                                <div className="md:w-48 shrink-0">
                                    <p className="text-2xl font-bold tracking-tighter italic">{item.date.replace(/-/g, '.')}</p>
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-xl font-bold group-hover:font-semibold transition-all duration-300">{item.venue}</h3>
                                    <p className="text-sm text-white/40 tracking-widest uppercase mt-1">『{item.name}』</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] tracking-[0.3em] border border-white/20 px-8 py-3 group-hover:bg-white group-hover:text-black transition-all duration-500 uppercase">View Detail</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* --- RELEASE & VIDEO --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <section>
                        <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-10">
                            <h2 className="text-2xl font-bold tracking-[0.2em] shippori-mincho uppercase">RELEASE</h2>
                        </div>
                        <div className="space-y-10">
                            {discoItems.map((item) => (
                                <Link key={item.id} href="/discography" className="group block">
                                    <div className="aspect-square overflow-hidden bg-white/5 mb-6 border border-white/5">
                                        <img src={item.jacket?.url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" alt="" />
                                    </div>
                                    <p className="text-[10px] tracking-widest text-white/40 uppercase mb-2">{item.type}</p>
                                    <h3 className="text-lg font-normal group-hover:font-semibold transition-all duration-300">{item.title}</h3>
                                </Link>
                            ))}
                        </div>
                    </section>

                    <section>
                        <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-10">
                            <h2 className="text-2xl font-bold tracking-[0.2em] shippori-mincho uppercase">VIDEO</h2>
                        </div>
                        <a href={`https://www.youtube.com/watch?v=${latestVideoId}`} target="_blank" rel="noopener noreferrer" className="group block">
                            <div className="aspect-video relative overflow-hidden border border-white/5 bg-white/5">
                                <img src={`https://img.youtube.com/vi/${latestVideoId}/maxresdefault.jpg`} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" alt="" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-white/10 group-hover:scale-110 transition-all duration-500">
                                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                                    </div>
                                </div>
                            </div>
                            <h3 className="mt-8 text-lg font-normal group-hover:font-semibold transition-all tracking-[0.1em] uppercase shippori-mincho">Latest Music Video</h3>
                        </a>
                    </section>
                </div>

            </div>
        </div>
    );
}
