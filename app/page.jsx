import Link from 'next/link';
import { client } from '../lib/microcms';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// --- Data Fetching ---

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
    return longVideo ? {
      id: longVideo.id,
      title: longVideo.snippet.title,
      thumbnail: longVideo.snippet.thumbnails.maxres?.url || longVideo.snippet.thumbnails.high.url
    } : null;
  } catch (e) { return null; }
}

// --- Main Page ---

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
      
      {/* HERO SECTION (外部ファイルを使わず直接記述) */}
      <section className="h-screen w-full relative overflow-hidden bg-black">
        {/* 背景スライダー（microCMSのDiscography画像や固定画像を表示する想定） */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/40 z-10" />
          {disco[0]?.jacket?.url && (
            <img 
              src={disco[0].jacket.url} 
              alt="Main Visual" 
              className="w-full h-full object-cover opacity-60 scale-105 animate-subtle-zoom"
            />
          )}
        </div>
        
        {/* ロゴやメインコピー（中央配置） */}
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-6xl md:text-8xl font-bold tracking-[0.3em] uppercase shippori-mincho mb-4 drop-shadow-2xl">
            ASHROOM
          </h1>
          <p className="text-sm md:text-base tracking-[0.5em] font-light opacity-80 uppercase">Official Website</p>
        </div>

        {/* 下部へのグラデーション */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#0a0a0a] to-transparent z-20" />
      </section>

      {/* NEWS */}
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
                <div className="flex items-center space-x-6 mb-3 md:mb-0 md:w-64 shrink-0 text-lg font-bold">
                  {dateStr}
                  {item.category && <span className="text-[10px] border border-white/20 px-3 py-1 text-white/40 uppercase tracking-widest">{item.category}</span>}
                </div>
                <h3 className="text-base md:text-lg text-gray-300 group-hover:text-white transition-all">{item.title}</h3>
              </Link>
            );
          })}
        </div>
      </section>

      {/* SCHEDULE */}
      <section className="px-4 max-w-4xl mx-auto w-full">
        <Link href="/schedule" className="block text-center mb-16 group">
          <h2 className="text-4xl font-bold tracking-widest uppercase shippori-mincho group-hover:opacity-50 transition-all">SCHEDULE</h2>
        </Link>
        <div className="space-y-20">
          {schedules.map((item) => {
            const d = new Date(item.date);
            const dateStr = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
            return (
              <div key={item.id} className="border-b border-white/10 pb-16 flex flex-col md:flex-row gap-8 items-start">
                {item.flyer?.url && (
                  <div className="w-full md:w-64 bg-black border border-white/10 shadow-2xl">
                    <img src={item.flyer.url} alt="" className="w-full h-auto" />
                  </div>
                )}
                <div className="flex-grow">
                  <span className="text-2xl font-mono">{dateStr}</span>
                  <h3 className="text-3xl font-bold mb-4 tracking-tight">{item.venue}</h3>
                  <p className="text-white/70 text-sm mb-8 line-clamp-3">{item.description}</p>
                  <Link href="/schedule" className="inline-block px-10 py-3 border border-white text-[10px] tracking-widest hover:bg-white hover:text-black transition-all">VIEW DETAILS</Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* DISCOGRAPHY */}
      <section className="px-4 max-w-4xl mx-auto w-full">
        <Link href="/discography" className="block text-center mb-16 group">
          <h2 className="text-4xl font-bold tracking-widest uppercase shippori-mincho group-hover:opacity-50 transition-all">DISCOGRAPHY</h2>
        </Link>
        {disco.map((item) => (
          <div key={item.id} className="flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-1/2 aspect-square bg-white/5 border border-white/10 overflow-hidden shadow-2xl">
              {item.jacket?.url && <img src={item.jacket.url} alt={item.title} className="w-full h-full object-cover" />}
            </div>
            <div className="w-full md:w-1/2 space-y-6">
              <span className="text-[13px] tracking-widest font-bold uppercase border-b border-white/10 pb-2 block">{item.type}</span>
              <h3 className="text-3xl font-bold">{item.title}</h3>
              <p className="text-sm text-white/80 line-clamp-5">{item.description?.replace(/<[^>]*>?/gm, '')}</p>
              {item.link_url && (
                <a href={item.link_url} target="_blank" rel="noopener noreferrer" className="inline-block w-full py-4 border border-white text-[10px] text-center tracking-[0.4em] hover:bg-white hover:text-black transition-all uppercase">LISTEN / BUY</a>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* VIDEO */}
      <section className="px-4 max-w-5xl mx-auto w-full">
        <Link href="/video" className="block text-center mb-16 group">
          <h2 className="text-4xl font-bold tracking-tight shippori-mincho uppercase group-hover:opacity-50 transition-all">VIDEO</h2>
        </Link>
        {video ? (
          <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer" className="block group">
            <div className="relative aspect-video overflow-hidden border border-white/10 shadow-2xl">
              <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0">
                <div className="w-20 h-14 bg-[#FF0000] rounded-xl flex items-center justify-center opacity-90 transition-transform group-hover:scale-110">
                  <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                </div>
              </div>
            </div>
            <h3 className="mt-8 text-2xl font-bold text-center group-hover:text-white/70 transition-all">{video.title}</h3>
          </a>
        ) : (
          <p className="text-center opacity-40">NO VIDEO AVAILABLE</p>
        )}
      </section>

    </main>
  );
}
