import Link from 'next/link';
import { client } from '../lib/microcms';

export const revalidate = 3600;

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
    const now = new Date().toISOString();
    const data = await client.get({
      endpoint: 'schedule',
      queries: { 
        orders: 'date',
        filters: `date[greater_than]${now}`,
        limit: 3
      } 
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
  const API_KEY = process.env.YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;
  if (!API_KEY || !CHANNEL_ID) return null;

  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=10&order=date&type=video&key=${API_KEY}`, { cache: 'no-store' });
    const searchData = await res.json();
    if (!searchData.items) return null;

    const videoIds = searchData.items.filter(item => item.id.videoId).map(item => item.id.videoId).join(',');
    const detailRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${API_KEY}`);
    const detailData = await detailRes.json();

    const filtered = detailData.items.filter(item => {
      const duration = item.contentDetails.duration;
      return (duration.includes('M') || duration.includes('H')) && !item.snippet.title.toLowerCase().includes('#shorts');
    });

    return filtered.length > 0 ? filtered[0] : detailData.items[0];
  } catch (e) { return null; }
}

// --- Main Page Component ---
export default async function HomePage() {
  const [profile, news, schedules, disco, video] = await Promise.all([
    getProfile(), getNews(), getSchedules(), getDiscography(), getLatestVideo()
  ]);

  const latestSchedule = schedules[0];
  const latestDisco = disco[0];

  const sliderItems = [
    { img: latestSchedule?.flyer?.url || null, href: '/schedule', label: 'LATEST SCHEDULE' },
    { img: latestDisco?.jacket?.url || null, href: '/discography', label: 'LATEST RELEASE' },
    { img: video?.snippet?.thumbnails?.maxres?.url || video?.snippet?.thumbnails?.high?.url || null, href: '/video', label: 'LATEST VIDEO' }
  ].filter(item => item.img !== null);

  return (
    <main className="bg-[#0a0a0a] text-white pb-32">
      
      {/* ① メインビジュアル */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden mb-32">
        {profile?.artist_photo?.url && (
          <div className="absolute inset-0 z-0">
            <img src={profile.artist_photo.url} alt="ashroom" className="w-full h-full object-cover brightness-[0.3] scale-105 animate-subtle-zoom" />
          </div>
        )}
        <div className="relative z-10 text-center px-4 w-full overflow-hidden">
          <p className="text-2xl md:text-4xl font-bold italic text-white tracking-tighter drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] whitespace-nowrap">
            {profile?.tagline || "Alternative Rock from Chiba/Tokyo"}
          </p>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#0a0a0a] to-transparent z-20" />
      </section>

      {/* ② トピックスライダー */}
      <section className="px-4 max-w-[1400px] mx-auto w-full mb-32 relative group">
        <div className="flex items-center gap-4">
          <button type="button" id="prev-btn" className="hidden md:flex shrink-0 w-16 h-16 items-center justify-center rounded-full border border-white/10 hover:bg-white/10 transition-all z-30">
            <span className="text-3xl font-light mt-[-4px] text-white/40 hover:text-white transition-colors leading-none select-none">＜</span>
          </button>
          <div className="relative flex-grow overflow-hidden shadow-2xl bg-black/20">
            <div id="topic-slider" className="flex overflow-x-hidden snap-x snap-mandatory no-scrollbar scroll-smooth">
              {sliderItems.map((item, idx) => (
                <div key={idx} className="min-w-full snap-center flex items-center justify-center aspect-[4/3] relative">
                  <Link href={item.href} className="w-full h-full flex items-center justify-center group/item p-2">
                    <img src={item.img} alt="" className="max-w-full max-h-full object-contain block shadow-xl" />
                    <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 border-l-2 border-white opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                      <p className="text-[10px] tracking-[0.3em] font-bold text-white">{item.label}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <button type="button" id="next-btn" className="hidden md:flex shrink-0 w-16 h-16 items-center justify-center rounded-full border border-white/10 hover:bg-white/10 transition-all z-30">
            <span className="text-3xl font-light mt-[-4px] text-white/40 hover:text-white transition-colors leading-none select-none">＞</span>
          </button>
        </div>
        <div className="mt-8 flex justify-center gap-3">
          {sliderItems.map((_, i) => (<div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20"></div>))}
        </div>
        <script dangerouslySetInnerHTML={{ __html: `
          document.getElementById('next-btn')?.addEventListener('click', function() { const s = document.getElementById('topic-slider'); s.scrollBy({left: s.clientWidth, behavior: 'smooth'}); });
          document.getElementById('prev-btn')?.addEventListener('click', function() { const s = document.getElementById('topic-slider'); s.scrollBy({left: -s.clientWidth, behavior: 'smooth'}); });
        `}} />
      </section>

      <hr className="border-t border-white/20 max-w-4xl mx-auto my-32" />

      {/* ③ NEWS */}
      <section className="px-4 max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl font-bold tracking-tight uppercase shippori-mincho">NEWS</h2>
          <Link href="/news" className="text-xs tracking-widest hover:opacity-50 border-b border-white/20 pb-1">VIEW ALL</Link>
        </div>
        <div className="divide-y divide-white/5 border-t border-white/5">
          {news.map((item) => (
            <Link key={item.id} href={`/news/${item.id}`} className="group flex flex-col md:flex-row md:items-center py-10 hover:bg-white/[0.02] transition-all px-4">
              <div className="flex items-center space-x-6 mb-3 md:mb-0 md:w-64 shrink-0">
                <span className="text-lg font-bold tracking-widest text-white leading-none">
                  {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('ja-JP').replace(/\//g, '.') : ''}
                </span>
                {item.category && <span className="text-[10px] border border-white/20 px-3 py-1 tracking-widest text-white/40 uppercase">{item.category}</span>}
              </div>
              <div className="flex-grow">
                <h3 className="text-base md:text-lg font-normal tracking-wide text-gray-300 group-hover:text-white transition-all">{item.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <hr className="border-t border-white/20 max-w-4xl mx-auto my-32" />

      {/* ④ SCHEDULE */}
      <section className="px-4 max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl font-bold tracking-widest uppercase shippori-mincho">SCHEDULE</h2>
          <Link href="/schedule" className="text-xs tracking-widest hover:opacity-50 border-b border-white/20 pb-1">VIEW ALL</Link>
        </div>
        {latestSchedule ? (
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="w-full md:w-[460px] shrink-0">
              <div className="w-full aspect-[4/3] bg-black/40 shadow-2xl flex items-center justify-center overflow-hidden">
                {latestSchedule.flyer?.url ? (
                  <img src={latestSchedule.flyer.url} alt={latestSchedule.venue} className="max-w-full max-h-full object-contain" />
                ) : (
                  <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Coming Soon</span>
                )}
              </div>
            </div>
            <div className="flex-grow w-full">
              <div className="mb-2 flex items-baseline gap-3">
                <span className="text-2xl font-mono text-white tracking-tighter">
                  {latestSchedule.date ? new Date(latestSchedule.date).toLocaleDateString('ja-JP').replace(/\//g, '.') : ''}
                </span>
              </div>
              {latestSchedule.name && <div className="text-xl font-bold text-white mb-3 tracking-wide">『{latestSchedule.name}』</div>}
              <h3 className="text-3xl font-bold mb-6 text-white tracking-tight">{latestSchedule.venue}</h3>
              <div className="grid grid-cols-1 gap-4 mb-8 border-y border-white/10 py-5">
                <div className="flex gap-8 text-sm tracking-widest font-mono text-white">
                  {latestSchedule.open_time && <div>OPEN <span className="ml-2 font-sans">{latestSchedule.open_time}</span></div>}
                  {latestSchedule.start_time && <div>START <span className="ml-2 font-sans">{latestSchedule.start_time}</span></div>}
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm tracking-widest text-white uppercase font-sans">
                  {latestSchedule.adv_price && <div>ADV <span className="ml-1">¥{latestSchedule.adv_price}</span></div>}
                  {latestSchedule.door_price && <div>DOOR <span className="ml-1">¥{latestSchedule.door_price}</span></div>}
                  {latestSchedule.student_price && <div>STUDENT <span className="ml-1">¥{latestSchedule.student_price}</span></div>}
                </div>
              </div>
              <div className="text-white text-sm leading-relaxed mb-8 whitespace-pre-wrap opacity-80">{latestSchedule.description}</div>
              <div className="flex flex-wrap gap-4">
                {latestSchedule.ticket_url ? (
                  <a href={latestSchedule.ticket_url} target="_blank" rel="noopener noreferrer" className="inline-block px-10 py-3 border border-white text-[10px] tracking-[0.2em] hover:bg-white hover:text-black transition-all">TICKET & INFO</a>
                ) : (
                  <p className="text-[11px] text-white tracking-widest bg-white/5 p-3 border-l-2 border-white">※DMで予約受付中</p>
                )}
              </div>
            </div>
          </div>
        ) : <p className="text-center py-20 opacity-40 uppercase">No live scheduled.</p>}
      </section>

      <hr className="border-t border-white/20 max-w-4xl mx-auto my-32" />

      {/* ⑤ DISCOGRAPHY */}
      <section className="px-4 max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl font-bold tracking-widest uppercase shippori-mincho">DISCOGRAPHY</h2>
          <Link href="/discography" className="text-xs tracking-widest hover:opacity-50 border-b border-white/20 pb-1">VIEW ALL</Link>
        </div>
        {latestDisco ? (
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="w-full md:w-80 shrink-0 shadow-2xl aspect-square overflow-hidden bg-white/5 flex items-center justify-center">
              {latestDisco.jacket ? <img src={latestDisco.jacket.url} alt="" className="max-w-full max-h-full object-contain" /> : <div className="text-white/20 text-xs uppercase">No Image</div>}
            </div>
            <div className="flex-grow w-full space-y-5">
              <div className="border-b border-white/10 pb-2">
                <div className="text-[13px] tracking-[0.2em] text-white font-bold uppercase">{latestDisco.type}</div>
              </div>
              <h3 className="text-3xl font-bold tracking-wider text-white">{latestDisco.title}</h3>
              {latestDisco.link_url && (
                <div className="pt-4">
                  <a href={latestDisco.link_url} target="_blank" rel="noopener noreferrer" className="inline-block px-12 py-4 border border-white text-[10px] tracking-[0.4em] hover:bg-white hover:text-black transition-all uppercase">LISTEN / BUY</a>
                </div>
              )}
            </div>
          </div>
        ) : <p className="text-center py-10 opacity-40 uppercase">No release found.</p>}
      </section>

      <hr className="border-t border-white/20 max-w-4xl mx-auto my-32" />

      {/* ⑥ VIDEO */}
      <section className="px-4 max-w-5xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl font-bold tracking-tight shippori-mincho uppercase">VIDEO</h2>
          <Link href="/video" className="text-xs tracking-widest hover:opacity-50 border-b border-white/20 pb-1">VIEW ALL</Link>
        </div>
        {video ? (
          <div className="w-full">
            <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer" className="block group">
              <div className="relative aspect-video overflow-hidden bg-white/5 shadow-2xl">
                <img src={video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-14 bg-[#FF0000] rounded-2xl flex items-center justify-center opacity-90 transition-transform group-hover:scale-110">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-white/70 transition-colors">{video.snippet.title}</h3>
              </div>
            </a>
          </div>
        ) : <div className="py-20 text-center opacity-40 uppercase">No video found.</div>}
      </section>

    </main>
  );
}
