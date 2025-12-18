// app/video/page.jsx 全文
"use client";

import { useState, useEffect } from 'react';

export default function VideoPage() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestVideos = async () => {
            const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
            const channelId = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;
            
            if (!apiKey || !channelId) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(
                    `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=20&order=date&type=video&key=${apiKey}`
                );
                const data = await res.json();
                
                if (data.items) {
                    const videoIds = data.items.map(item => item.id.videoId).join(',');
                    const detailRes = await fetch(
                        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${apiKey}`
                    );
                    const detailData = await detailRes.json();

                    const filtered = detailData.items.filter(item => {
                        const duration = item.contentDetails.duration;
                        return duration.includes('M') || duration.includes('H');
                    }).slice(0, 5);

                    setVideos(filtered);
                }
            } catch (error) {
                console.error("YouTube API Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestVideos();
    }, []);

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="mb-12">
                    {/* tracking-widestを削除し、少し狭めのtracking-tightに */}
                    <h1 className="text-4xl font-bold tracking-tight shippori-mincho uppercase">
                        VIDEO
                    </h1>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <div className="animate-spin h-10 w-10 border-4 border-[#E2FF00] border-t-transparent rounded-full mb-4"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                        {videos.map((video, index) => (
                            <div key={video.id} className={`${index === 0 ? 'md:col-span-2' : ''} group`}>
                                <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer" className="block">
                                    <div className="relative aspect-video overflow-hidden rounded-sm bg-gray-900 border border-white/5">
                                        <img 
                                            src={video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url} 
                                            alt={video.snippet.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-14 h-10 bg-[#FF0000] rounded-lg flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110">
                                                <div className="w-0 h-0 border-t-[7px] border-t-transparent border-l-[12px] border-l-white border-b-[7px] border-b-transparent ml-1"></div>
                                            </div>
                                        </div>
                                        <div className="absolute bottom-0 right-0 p-2 bg-black/60">
                                            {/* 日付の文字間隔も詰め気味に */}
                                            <p className="text-[10px] font-bold tracking-tighter text-white">
                                                {new Date(video.snippet.publishedAt).toLocaleDateString('ja-JP').replace(/\//g, '.')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        {/* tracking-wideを削除、見出しをタイトに */}
                                        <h2 className={`font-bold leading-tight tracking-tight text-white group-hover:opacity-70 transition-opacity ${index === 0 ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'}`}>
                                            {video.snippet.title}
                                        </h2>
                                    </div>
                                </a>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-24 pt-12 border-t border-white/5 text-center">
                    <a href={`https://www.youtube.com/channel/${process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID}`} target="_blank" rel="noopener noreferrer" className="inline-block border border-white/20 text-white px-10 py-3 text-xs font-bold hover:bg-white hover:text-black transition-all duration-500 tracking-normal">
                        VIEW MORE ON YOUTUBE
                    </a>
                </div>
            </div>
        </main>
    );
}