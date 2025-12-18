"use client";

import { discography } from '../../data/ashroomConfig';

export default function DiscographyPage() {
    // データをコピーして逆順（新しい順）にする
    const sortedDiscography = [...discography].reverse();

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20 px-4">
            <div className="max-w-5xl mx-auto">
                {/* ページタイトル */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold tracking-tight shippori-mincho uppercase">
                        DISCOGRAPHY
                    </h1>
                </div>

                {/* リスト表示 (逆順にした配列を使用) */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                    {sortedDiscography.map((item) => (
                        <div key={item.id} className="group">
                            {/* ジャケット写真 */}
                            <a 
                                href={item.link} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="block mb-4 overflow-hidden rounded-sm bg-gray-900 border border-white/5 transition-all duration-500 group-hover:border-white/20 shadow-xl"
                            >
                                <img 
                                    src={item.jacket} 
                                    alt={item.title}
                                    className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </a>

                            {/* 情報テキスト */}
                            <div className="space-y-1">
                                <p className="text-[10px] text-[#E2FF00] font-bold tracking-tighter uppercase">
                                    {item.type}
                                </p>
                                <a 
                                    href={item.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block"
                                >
                                    <h2 className="text-lg font-bold leading-tight tracking-tight text-white group-hover:opacity-70 transition-opacity">
                                        {item.title}
                                    </h2>
                                </a>
                                <p className="text-[10px] text-gray-500 font-bold tracking-tighter">
                                    {item.releaseDate}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 下部リンク */}
                <div className="mt-24 pt-12 border-t border-white/5 text-center">
                    <p className="text-gray-500 text-[10px] mb-6 tracking-tighter font-bold uppercase">Streaming & Download</p>
                </div>
            </div>
        </main>
    );
}