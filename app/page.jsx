import Link from 'next/link';
import { client } from '../lib/microcms';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// --- Data Fetching ---

async function getProfile() {
  try {
    const data = await client.get({ endpoint: 'profile' });
    return data.contents[0] || null;
  } catch (e) { return null; }
}

async function getNews() {
  try {
    const data = await client.get({ endpoint: 'news', queries: { orders: '-publishedAt', limit: 2 } });
    return data.contents || [];
  } catch (e) { return []; }
}

async function getSchedules() {
  try {
    const data = await client.get({
      endpoint: 'schedule',
      queries: { orders: '-publishedAt', limit: 1 } 
    });
    return data.contents || [];
  } catch (e) { return []; }
}

async function getDiscography() {
  try {
    const data = await client.get({ endpoint: 'discography', queries: { orders: '-publishedAt', limit: 1 } });
    return data.contents || [];
  } catch (e) { return []; }
}

async function getLatestVideo() {
  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY;
  const CHANNEL_ID = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID || process.env.YOUTUBE_CHANNEL_ID;
  if (!API_KEY || !CHANNEL_ID) return null;

  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=3&order=date&type=video&key=${API_KEY}`);
    const data = await res.json();
    if (!data.items || data.items.length === 0) return null;
    return {
      id: data.items[0].id.videoId,
      title: data.items[0].snippet.title,
      thumbnail: data.items[0].snippet.thumbnails.maxres?.url || data.items[0].snippet.thumbnails.high.url
    };
  } catch (e) { return null; }
}

// --- Main Page Component ---

export default async function HomePage() {
  const [profile, news, schedules, disco, video] = await Promise.all([
    getProfile(),
    getNews(),
    getSchedules(),
    getDiscography(),
    getLatestVideo()
  ]);

  const latestSchedule = schedules[0];
  const latestDisco = disco[0];

  return (
    <main className="bg-[#0a0a0a] text-white pb-32 space-y-32">
      
      {/* ① メインビジュアル (taglineの縮小・文字詰め・改行禁止) */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {profile?.artist_photo?.url && (
          <div className="absolute inset-0 z-0">
            <img 
              src={profile.artist_photo.url} 
              alt="ashroom" 
              className="w-full h-full object-cover brightness-[0.3] scale-105 animate-subtle-zoom" 
            />
          </div>
        )}
        <div className="relative z-10 text-center px-4 w-full overflow-hidden">
          {/* text-2xl md:text-4xl (80%サイズ)
            tracking-tighter (文字間隔詰め)
            whitespace-nowrap (絶対に改行しない)
          */}
          <p className="text-2xl md:text-4xl font-bold italic text-white tracking-tighter drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] whitespace-nowrap">
            {profile?.tagline || "Alternative Rock from Chiba/Tokyo"}
          </p>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#0a0a0a] to-transparent z-20" />
      </section>

      {/* ② トップのトピック (スライダー/簡易スクロール) */}
      <section className="px-4 max-w-6xl mx-auto w-full">
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 no-scrollbar">
          {latestSchedule?.flyer?.url && (
            <div className="min-w-[85%] md:min-w-[30%] snap-center">
              <img src={latestSchedule.flyer.url} alt="Latest Flyer" className="w-full aspect-[3/4] object-cover border border-white/10 shadow-2xl" />
              <p className="mt-4 text-[10px] tracking-widest text-center opacity-50 uppercase font-bold">Latest Flyer</p>
            </div>
          )}
          {latestDisco?.jacket?.url && (
            <div className="min-w-[85%] md:min-w-[30%] snap-center">
              <img src={latestDisco.jacket.url} alt="Latest Release" className="w-full aspect-square object-cover border border-white/10 shadow-2xl" />
              <p className="mt-4 text-[10px] tracking-widest text-center opacity-50 uppercase font-bold">Latest Release</p>
            </div>
          )}
          {video?.thumbnail && (
            <div className="min-w-[85%] md:min-w-[30%] snap-center flex flex-col justify-center">
              <img src={video.thumbnail} alt="Latest Video" className="w-full aspect-video object-cover border border-white/10 shadow-2xl" />
              <p className="mt-4 text-[10px] tracking-widest text-center opacity-50 uppercase font-bold">Latest Video</p>
            </div>
          )}
        </div>
      </section>

      {/* ③ NEWS */}
      <section className="px-4 max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl font-bold tracking-tight uppercase shippori-mincho">NEWS</h2>
          <Link href="/news" className="text-xs tracking-widest hover:opacity-50 border-b border-white/20 pb-1">VIEW ALL</Link>
        </div>
        <div className="divide-y divide-white/5 border-t border-white/5">
          {news.map((item) => (
            <Link key={item.id} href={`/news/${item.id}`} className="group flex flex-col md:flex-row md:items-center py-10 hover:bg-white/[0.02] transition-all px-4">
              <div className="flex items-center space-x-6 mb-3 md:mb-0 md:w-64 shrink-0 text-lg font-bold opacity-60 font-mono">
                {new Date(item.publishedAt).toLocaleDateString().replace(/\//g, '.')}
                {item.category && <span className="text-[9px] border border-white/20 px-3 py-1 uppercase tracking-widest">{item.category}</span>}
              </div>
              <h3 className="text-base md:text-lg group-hover:text-white transition-all">{item.title}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* ④ SCHEDULE */}
      <section className="px-4 max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl font-bold tracking-widest uppercase shippori-mincho">SCHEDULE</h2>
          <Link href="/schedule" className="text-xs tracking-widest hover:opacity-50 border-b border-white/20 pb-1">VIEW ALL</Link>
        </div>
        {latestSchedule && (
          <div className="bg-zinc-900/30 p-8 md:p-12 border border-white/5 flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-grow text-center md:text-left">
              <p className="text-2xl font-mono mb-2 opacity-60">{latestSchedule.date?.split('T')[0].replace(/-/g, '.')}</p>
              <h3 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight">{latestSchedule.venue}</h3>
              <Link href="/schedule" className="inline-block px-10 py-3 border border-white text-[10px] tracking-[0.4em] hover:bg-white hover:text-black transition-all">VIEW DETAILS</Link>
            </div>
          </div>
        )}
      </section>

      {/* ⑤ DISCOGRAPHY */}
      <section className="px-4 max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl font-bold tracking-widest uppercase shippori-mincho">DISCOGRAPHY</h2>
          <Link href="/discography" className="text-xs tracking-widest hover:opacity-50 border-b border-white/20 pb-1">VIEW ALL</Link>
        </div>
        {latestDisco && (
          <div className="flex flex-col md:flex-row gap-12 items-center bg-zinc-900/20 p-8 border border-white/5">
            <img src={latestDisco.jacket?.url} alt={latestDisco.title} className="w-full md:w-80 shadow-2xl border border-white/10" />
            <div className="space-y-6 text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold">{latestDisco.title}</h3>
              <p className="text-sm text-white/60 line-clamp-3 leading-relaxed">
                {latestDisco.description?.replace(/<[^>]*>?/gm, '')}
              </p>
              <Link href="/discography" className="inline-block px-8 py-3 border border-white/20 text-[10px] tracking-[0.4em] hover:bg-white hover:text-black transition-all">VIEW RELEASES</Link>
            </div>
          </div>
        )}
      </section>

      {/* ⑥ VIDEO (最後に配置) */}
      <section className="px-4 max-w-5xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl font-bold tracking-tight shippori-mincho uppercase">VIDEO</h2>
          <Link href="/video" className="text-xs tracking-widest hover:opacity-50 border-b border-white/20 pb-1">VIEW ALL</Link>
        </div>
        {video && (
          <div className="relative aspect-video overflow-hidden border border-white/10 group shadow-2xl">
             <iframe 
                className="absolute inset-0 w-full h-full" 
                src={`https://www.youtube.com/embed/${video.id}`} 
                title={video.title} 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
          </div>
        )}
      </section>

    </main>
  );
}
