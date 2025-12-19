import Link from 'next/link';
import { client } from '../lib/microcms';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// --- Data Fetching ---
async function getNews() {
    const data = await client.get({ endpoint: 'news', queries: { orders: '-published', limit: 2 } });
    return data.contents || [];
}

async function getSchedules() {
    const data = await client.get({ 
        endpoint: 'schedule', 
        queries: { orders: 'date', filters: `date[greater_than]${new Date().toISOString()}`, limit: 2 } 
    });
    return data.contents || [];
}

async function getDiscography() {
    const data = await client.get({ endpoint: 'discography', queries: { orders: '-release_date', limit: 1 } });
    return data.contents || [];
}

async function getLatestVideo() {
    const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY;
    const CHANNEL_ID = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID || process.env.YOUTUBE_CHANNEL_ID;
    if (!API_KEY || !CHANNEL_ID) return null;
    try {
        const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=3&order=date&type=video&key=${API_KEY}`);
        const data = await res.json();
        if (!data.items || data.items.length === 0) return null;
        return data.items[0];
    } catch (e) { return null; }
}

export default async function HomePage() {
    const [news, schedules, disco, video] = await Promise.all([
        getNews(),
        getSchedules(),
        getDiscography(),
        getLatestVideo()
    ]);

    // 曜日のマッピング（安全な表示のため）
    const dayMap = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    return (
        <main className="bg-[#0a0a0a] text-white space-y-32 pb-32 pt-20">
            
            {/* NEWS SECTION */}
            <section className="px-4 max-w-4xl mx-auto w-full">
                <Link href="/news" className="block text-center mb-16 group">
                    <h2 className="text-4xl font-bold tracking-tight uppercase shippori-mincho group-hover:opacity-50 transition-all">NEWS</h2>
                </Link>
                <div className="divide-y divide-white/5 border-t border-white/5">
                    {news.map((item) => {
                        const d = new Date(item.published);
                        const dateStr = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
                        const dayStr = dayMap[d.getDay()];
                        return (
                            <Link key={item.id} href={`/news/${item.id}`} className="group flex flex-col md:flex-row md:items-center py-10 hover:bg-white/[0.02] transition-all px-4">
                                <div className="flex items-center space-x-6 mb-3 md:mb-0 md:w-64 shrink-0">
                                    <span className="text-lg font-bold tracking-widest">
                                        {dateStr} <span className="text-xs ml-1 font-mono">[{dayStr}]</span>
                                    </span>
                                    {item.category && (
                                        <span className="text-[10px] border border-white/20 px-3 py-1 tracking-widest text-white/40 uppercase">{item.category}</span>
                                    )}
                                </div>
                                <h3 className="text-base md:text-lg font-normal tracking-wide text-gray-300 group-hover:text-white transition-all">{item.title}</h3>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* SCHEDULE SECTION */}
            <section className="px-4 max-w-4xl mx-auto w-full">
                <Link href="/schedule" className="block text-center mb-16 group">
                    <h2 className="text-4xl font-bold tracking-widest uppercase shippori-mincho group-hover:opacity-50 transition-all">SCHEDULE</h2>
                </Link>
                <div className="space-y-20">
                    {schedules.map((item) => {
                        const d = new Date(item.date);
                        const dateStr = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
                        const dayStr = dayMap[d.getDay()];
                        return (
                            <div key={item.id} className="border-b border-white/10 pb-16 flex flex-col md:flex-row gap-8 items-start">
                                <div className="w-full md:w-64 shrink-0">
                                    {item.flyer?.url ? (
                                        <div className="w-full bg-black border border-white/10 shadow-2xl">
                                            <img src={item.flyer.url} alt="" className="w-full h-auto object-contain" />
                                        </div>
                                    ) : (
                                        <div className="w-full aspect-video bg-white/5 border border-white/10 flex items-center justify-center">
                                            <span className="text-[10px] tracking-[0.3em] text-white/20 uppercase">Coming Soon</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-grow w-full">
                                    <div className="mb-2 flex items-baseline gap-3">
                                        <span className="text-2xl font-mono tracking-tighter">{dateStr}</span>
                                        <span className="text-sm font-mono tracking-widest uppercase">[{dayStr}]</span>
                                    </div>
                                    <h3 className="text-3xl font-bold mb-6 tracking-tight">{item.venue}</h3>
                                    <p className="text-white/70 text-sm leading-relaxed mb-8 line-clamp-3 whitespace-pre-wrap">{item.description}</p>
                                    <Link href="/schedule" className="inline-block px-10 py-3 border border-white text-[10px] tracking-[0.2em] hover:bg-white hover:text-black transition-all">VIEW DETAILS</Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* DISCOGRAPHY SECTION */}
            <section className="px-4 max-w-4xl mx-auto w-full">
                <Link href="/discography" className="block text-center mb-16 group">
                    <h2 className="text-4xl font-bold tracking-widest uppercase shippori-mincho group-hover:opacity-50 transition-all">DISCOGRAPHY</h2>
                </Link>
                {disco.map((item) => {
                    const d = new Date(item.release_date);
                    const dateStr = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
                    return (
                        <div key={item.id} className="flex flex-col md:flex-row gap-12 items-center md:items-start">
                            <div className="w-full md:w-1/2 aspect-square bg-white/5 border border-white/10 shadow-2xl overflow-hidden">
                                {item.jacket?.url && <img src={item.jacket.url} alt={item.title} className="w-full h-full object-cover" />}
                            </div>
                            <div className="w-full md:w-1/2 space-y-6">
                                <div className="flex justify-between items-baseline border-b border-white/10 pb-2 text-[13px]">
                                    <span className="tracking-[0.2em] font-bold uppercase">{item.type}</span>
                                    <span className="font-mono tracking-tighter">{dateStr}</span>
                                </div>
                                <h3 className="text-3xl font-bold tracking-wider">{item.title}</h3>
                                <div className="text-sm text-white/80 leading-relaxed line-clamp-5">
                                    {item.description?.replace(/<[^>]*>?/gm, '')}
                                </div>
                                {item.link_url && (
                                    <div className="pt-4">
                                        <a href={item.link_url} target="_blank" rel="noopener noreferrer" className="inline-block w-full py-4 border border-white text-[10px] tracking-[0.4em] text-center hover:bg-white hover:text-black transition-all uppercase">LISTEN / BUY</a>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </section>

            {/* VIDEO SECTION */}
            <section className="px-4 max-w-5xl mx-auto w-full">
                <Link href="/video" className="block text-center mb-16 group">
                    <h2 className="text-4xl font-bold tracking-tight shippori-mincho uppercase group-hover:opacity-50 transition-all">VIDEO</h2>
                </Link>
                {video && (
                    <a href={`https://www.youtube.com/watch?v=${video.id.videoId}`} target="_blank" rel="noopener noreferrer" className="block group">
                        <div className="relative aspect-video overflow-hidden border border-white/10 shadow-2xl">
                            <img src={video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url} alt={video.snippet.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-14 bg-[#FF0000] rounded-xl flex items-center justify-center opacity-90 transition-transform group-hover:scale-110">
                                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                                </div>
                            </div>
                        </div>
                        <h3 className="mt-8 text-2xl md:text-3xl font-bold text-center group-hover:text-white/70 transition-colors">{video.snippet.title}</h3>
                    </a>
                )}
            </section>

        </main>
    );
}
