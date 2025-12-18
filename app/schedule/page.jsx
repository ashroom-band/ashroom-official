// app/schedule/page.jsx
"use client";

import { schedules } from '../../data/ashroomConfig';

export default function SchedulePage() {
    // 未来のライブと過去のライブを分ける
    const upcomingLives = schedules.filter(s => s.status === 'upcoming');
    const pastLives = schedules.filter(s => s.status === 'past');

    return (
        <main className="min-h-screen bg-dark-bg text-white pt-24 pb-12 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold border-b border-gray-700 pb-4 mb-12 shippori-mincho text-ash-accent">
                    SCHEDULE
                </h1>

                {/* UPCOMING LIVE */}
                <section className="mb-20">
                    <h2 className="text-2xl font-semibold text-ash-accent mb-8 tracking-normal">UPCOMING LIVE</h2>

                    <div className="space-y-16">
                        {upcomingLives.length > 0 ? upcomingLives.map((live) => (
                            <div key={live.id} className="border-b border-gray-800 pb-12 flex flex-col md:flex-row gap-8">
                                
                                {/* 1. フライヤー画像エリア */}
                                <div className="w-full md:w-64 flex-shrink-0">
                                    <img 
                                        src={live.flyer || "/no-image.jpg"} 
                                        alt={live.title} 
                                        className="w-full h-auto object-contain rounded shadow-lg"
                                    />
                                </div>

                                {/* 2. 詳細部分とアクション部分をまとめるコンテナ */}
                                <div className="flex-grow flex flex-col lg:flex-row lg:items-start gap-6">
                                    
                                    {/* 2-A. 詳細テキスト部分 */}
                                    <div className="flex-grow">
                                        {/* 日付と曜日 */}
                                        <div className="whitespace-nowrap mb-4">
                                            <p className="text-2xl font-bold leading-none">
                                                {live.date} <span className="ml-2">[{live.dayOfWeek}]</span>
                                            </p>
                                        </div>

                                        {/* 会場名・タイトル */}
                                        <h3 className="text-xl font-bold mb-2">{live.venue}</h3>
                                        <p className="text-white text-base font-bold mb-4">
                                            『{live.title}』
                                        </p>

                                        {/* 時間・チケット料金 */}
                                        <div className="text-sm text-gray-400 space-y-1">
                                            <p>OPEN {live.open} / START {live.start}</p>
                                            <p>TICKET: {live.ticket}</p>
                                        </div>
                                    </div>

                                    {/* 2-B. アクション部分 (全画面時に右側に表示) */}
                                    <div className="flex items-center lg:w-80 lg:flex-shrink-0 lg:pt-12">
                                        {live.link && live.link !== '#' ? (
                                            <a
                                                href={live.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-block bg-[#E2FF00] text-black font-bold px-8 py-3 rounded-full hover:bg-white hover:text-black transition-colors text-center w-full shadow-lg"
                                            >
                                                TICKET
                                            </a>
                                        ) : (
                                            <p className="text-xs text-gray-400 leading-relaxed italic lg:text-right w-full">
                                                TICKETは、各SNSのDMより取り置きのご連絡をお願いします。
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray-500">現在、告知解禁されているライブはありません。</p>
                        )}
                    </div>
                </section>

                {/* PAST LIVE */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-500 mb-8 tracking-widest uppercase">Past Live History</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pastLives.map((live) => (
                            <div key={live.id} className="bg-gray-900/30 p-4 rounded border border-gray-800 flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-gray-500">{live.date} [{live.dayOfWeek}]</p>
                                    <p className="text-sm font-medium">{live.venue}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}