import Link from 'next/link';
import { client } from '../lib/microcms';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

// --- Data Fetching Functions ---

async function getNews() {
    const data = await client.get({
        endpoint: 'news',
        queries: { orders: '-published', limit: 2 }
    });
    return data.contents;
}

async function getSchedules() {
    const data = await client.get({
        endpoint: 'schedule',
        queries: { 
            orders: 'date',
            filters: `date[greater_than]${new Date().toISOString()}`,
            limit: 2
        }
    });
    return data.contents;
}

async function getDiscography() {
    const data = await client.get({
        endpoint: 'discography',
        queries: { orders: '-release_date', limit: 1 }
    });
    return data.contents;
}

async function getLatestVideo() {
    // サーバーサイドでのみ実行されるように、プロセスを確認
    const API_KEY = process.env.YOUTUBE_API_KEY; 
    const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
    
    // キーがない場合は、エラーを出さずにnullを返す（これ重要）
    if (!API_KEY || !CHANNEL_ID) {
        console.warn("YouTube API Key or Channel ID is missing.");
        return null;
    }

    try {
        const res = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=10&order=date&type=video&key=${API_KEY}`,
            { next: { revalidate: 3600 } } // キャッシュの設定
        );
        
        if (!res.ok) return null;
        const data = await res.json();
        
        if (!data.items || data.items.length === 0) return null;

        const videoIds = data.items.map(item => item.id.videoId).filter(Boolean).join(',');
        const detailRes = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${API_KEY}`
        );
        const detailData = await detailRes.json();

        if (!detailData.items) return null;

        return detailData.items.find(item => {
            const duration = item.contentDetails.duration;
            const title = item.snippet.title.toLowerCase();
            return (duration.includes('M') || duration.includes('H')) && !title.includes('#shorts');
        });
    } catch (e) {
        console.error("YouTube Fetch Error:", e);
        return null;
    }
}

export default async function HomePage() {
    const news = await getNews();
    const schedules = await getSchedules();
    const disco = await getDiscography();
    const video = await getLatestVideo();

    return (
        <main className="bg-[#0a0a0a] text-white space-y-32 pb-32">
            
            {/* NEWS SECTION */}
            <section className="pt-24 px-4 max-w-4xl mx-auto w-full">
                <Link href="/news" className="block group text-center mb-16">
                    <h2 className="text-4xl font-bold tracking-tight uppercase shippori-mincho group-hover:opacity-50 transition-opacity">NEWS</h2>
                </Link>
                <div className="divide-y divide-white/5 border-t border-white/5">
                    {news.map((item) => {
                        const dateObj = item.published ? new Date(item.published) : null;
                        const dateDisplay = dateObj ? dateObj.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Tokyo' }).replace(/\//g, '.') : '';
                        const dayIndex = dateObj ? new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'Asia/Tokyo' }).format(dateObj).toUpperCase() : '';
                        return (
                            <Link key={item.id} href={`/news/${item.id}`} className="group flex flex-col md:flex-row md:items-center py-8 hover:bg-white/[0.02] transition-all px-4">
                                <div className="flex items-center space-x-6 mb-3 md:mb-0 md:w-64 shrink-0">
                                    <span className="text-lg font-bold tracking-widest text-white">{dateDisplay} <span className="text-xs ml-1 font-mono">[{dayIndex}]</span></span>
                                    {item.category && <span className="text-[10px] border border-white/20 px-3 py-1 tracking-widest text-white/40 uppercase">{item.category}</span>}
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-base md:text-lg font-normal tracking-wide text-gray-300 group-hover:text-white group-hover:font-semibold transition-all duration-300">{item.title}</h3>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* SCHEDULE SECTION */}
            <section className="px-4 max-w-4xl mx-auto w-full">
                <Link href="/schedule" className="block group text-center mb-16">
                    <h2 className="text-4xl font-bold tracking-widest uppercase shippori-mincho group-hover:opacity-50 transition-opacity">SCHEDULE</h2>
                </Link>
                <div className="space-y-16">
                    {schedules.map((item) => {
                        const dateObj = item.date ? new Date(item.date) : null;
                        const dateDisplay = dateObj ? dateObj.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Tokyo' }).replace(/\//g, '.') : 'DATE TBD';
                        const dayIndex = dateObj ? new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'Asia/Tokyo' }).format(dateObj).toUpperCase() : '';
                        return (
                            <div key={item.id} className="border-b border-white/10 pb-12 flex flex-col md:flex-row gap-8 items-start">
                                <div className="w-full md:w-48 shrink-0">
                                    <div className="w-full bg-black border border-white/10 shadow-xl">
                                        <img src={item.flyer?.url || "/no-image.jpg"} alt="" className="w-full h-auto" />
                                    </div>
                                </div>
                                <div className="flex-grow w-full">
                                    <div className="mb-2 flex items-baseline gap-3">
                                        <span className="text-2xl font-mono text-white tracking-tighter">{dateDisplay}</span>
                                        <span className="text-sm font-mono text-white tracking-widest uppercase">[{dayIndex}]</span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 text-white tracking-tight">{item.venue}</h3>
                                    <p className="text-white text-sm leading-relaxed mb-6 line-clamp-3">{item.description}</p>
                                    <Link href="/schedule" className="inline-block px-8 py-2 border border-white text-[10px] tracking-widest hover:bg-white hover:text-black transition-all">VIEW DETAILS</Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* DISCOGRAPHY SECTION */}
            <section className="px-4 max-w-4xl mx-auto w-full">
                <Link href="/discography" className="block group text-center mb-16">
                    <h2 className="text-4xl font-bold tracking-widest uppercase shippori-mincho group-hover:opacity-50 transition-opacity">DISCOGRAPHY</h2>
                </Link>
                {disco.map((item) => {
                    const dateObj = item.release_date ? new Date(item.release_date) : null;
                    const dateDisplay = dateObj ? new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Tokyo' }).format(dateObj).replace(/\//g, '.') : '';
                    return (
                        <div key={item.id} className="flex flex-col md:flex-row gap-12 items-center md:items-start">
                            <div className="w-full md:w-1/2 aspect-square bg-white/5 border border-white/10 shadow-2xl overflow-hidden">
                                <img src={item.jacket?.url} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="w-full md:w-1/2 space-y-4">
                                <div className="flex justify-between items-baseline border-b border-white/10 pb-2">
                                    <span className="text-[13px] tracking-[0.2em] font-bold uppercase">{item.type}</span>
                                    <span className="text-[13px] font-mono tracking-tighter">{dateDisplay}</span>
                                </div>
                                <h3 className="text-3xl font-bold tracking-wider">{item.title}</h3>
                                <div className="text-sm text-white/80 leading-relaxed prose-invert line-clamp-4" dangerouslySetInnerHTML={{ __html: item.description }} />
                                {item.link_url && (
                                    <div className="pt-6">
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
                <Link href="/video" className="block group text-center mb-16">
                    <h2 className="text-4xl font-bold tracking-tight shippori-mincho uppercase group-hover:opacity-50 transition-opacity">VIDEO</h2>
                </Link>
                {video && (
                    <div className="w-full">
                        <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer" className="block group">
                            <div className="relative aspect-video overflow-hidden border border-white/10 shadow-2xl">
                                <img src={video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url} alt={video.snippet.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-20 h-14 bg-[#FF0000] rounded-xl flex items-center justify-center opacity-90 transition-transform group-hover:scale-110">
                                        <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 text-center">
                                <h3 className="text-2xl md:text-3xl font-bold leading-tight tracking-tight group-hover:text-white/70 transition-colors">{video.snippet.title}</h3>
                            </div>
                        </a>
                    </div>
                )}
                <div className="mt-16 text-center">
                    <Link href="/video" className="inline-block border border-white px-12 py-4 text-[10px] font-bold tracking-[0.3em] hover:bg-white hover:text-black transition-all uppercase">VIEW MORE VIDEOS</Link>
                </div>
            </section>

        </main>
    );
}
