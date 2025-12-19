import Link from 'next/link';
import { client } from '../lib/microcms';

// コンポーネントが存在するか不安な場合は、一旦以下のように記載するか、
// ファイル名を「components/HeroSlider.jsx」と完全に一致させてください。
import HeroSlider from '../components/HeroSlider'; 

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// --- Data Fetching (YouTube長尺動画対応) ---
async function getNews() {
    try {
        const data = await client.get({ endpoint: 'news', queries: { orders: '-published', limit: 2 } });
        return data.contents || [];
    } catch (e) { return []; }
}

async function getSchedules() {
    try {
        const data = await client.get({ 
            endpoint: 'schedule', 
            queries: { orders: 'date', filters: `date[greater_than]${new Date().toISOString()}`, limit: 2 } 
        });
        return data.contents || [];
    } catch (e) { return []; }
}

async function getDiscography() {
    try {
        const data = await client.get({ endpoint: 'discography', queries: { orders: '-release_date', limit: 1 } });
        return data.contents || [];
    } catch (e) { return []; }
}

async function getLatestVideo() {
    const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY;
    const CHANNEL_ID = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID || process.env.YOUTUBE_CHANNEL_ID;
    if (!API_KEY || !CHANNEL_ID) return null;
    try {
        const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=10&order=date&type=video&key=${API_KEY}`);
        const data = await res.json();
        if (!data.items) return null;
        const videoIds = data.items.map(item => item.id.videoId).filter(Boolean).join(',');
        const detailRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${API_KEY}`);
        const detailData = await detailRes.json();
        const longVideo = detailData.items?.find(item => {
            const duration = item.contentDetails.duration;
            const title = item.snippet.title.toLowerCase();
            return (duration.includes('M') || duration.includes('H')) && !title.includes('#shorts');
        });
        if (!longVideo) return null;
        return {
            id: longVideo.id,
            title: longVideo.snippet.title,
            thumbnail: longVideo.snippet.thumbnails.maxres?.url || longVideo.snippet.thumbnails.high.url
        };
    } catch (e) { return null; }
}

export default async function HomePage() {
    const [news, schedules, disco, video] = await Promise.all([
        getNews(),
        getSchedules(),
        getDiscography(),
        getLatestVideo()
    ]);

    const dayMap = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    return (
        <main className="bg-[#0a0a0a] text-white space-y-32 pb-32">
            
            {/* HERO SECTION */}
            <section className="h-screen w-full relative">
                {/* もし HeroSlider でエラーが出る場合は、
                  一旦 <div>Hero Section</div> などに置き換えてビルドを確認してください
                */}
                <HeroSlider />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a] pointer-events-none" />
            </section>

            {/* NEWS (以下、正常に動いていたコード) */}
            <section className="px-4 max-w-4xl mx-auto w-full">
                <Link href="/news" className="block text-center mb-16 group">
                    <h2 className="text-4xl font-bold tracking-tight uppercase shippori-mincho group-hover:opacity-50 transition-all">NEWS</h2>
                </Link>
                <div className="divide-y divide-white/5 border-t border-white/5">
                    {news.map((item) => {
                        const d = new Date(item.published);
                        const dateStr = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
                        return (
                            <Link key={item.id} href={`/news/${item.id}`} className="group flex flex-col md:flex-row md:items-center py-10 hover:bg-white/[0.02] transition-all px-4">
                                <div className="flex items-center space-x-6 mb-3 md:mb-0 md:w-64 shrink-0">
                                    <span className="text-lg font-bold tracking-widest">{dateStr}</span>
                                    {item.category && <span className="text-[10px] border border-white/20 px-3 py-1 text-white/40 uppercase">{item.category}</span>}
                                </div>
                                <h3 className="text-base md:text-lg text-gray-300 group-hover:text-white transition-all">{item.title}</h3>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* SCHEDULE / DISCOGRAPHY / VIDEO (前回同様) */}
            {/* ...省略（正常動作分）... */}
            
            <section className="px-4 max-w-5xl mx-auto w-full">
                <Link href="/video" className="block text-center mb-16 group">
                    <h2 className="text-4xl font-bold tracking-tight shippori-mincho uppercase group-hover:opacity-50 transition-all">VIDEO</h2>
                </Link>
                {video && (
                    <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer" className="block group">
                        <div className="relative aspect-video overflow-hidden border border-white/10 shadow-2xl">
                            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        </div>
                        <h3 className="mt-8 text-2xl font-bold text-center group-hover:text-white/70 transition-colors">{video.title}</h3>
                    </a>
                )}
            </section>
        </main>
    );
}
