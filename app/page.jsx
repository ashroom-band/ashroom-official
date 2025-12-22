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
    <main className="bg-[#0a0a0a] text-white pb-32">
      
      {/* ① メインビジュアル */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden mb-32">
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
          <p className="text-2xl md:text-4xl font-bold italic text-white tracking-tighter drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] whitespace-nowrap">
            {profile?.tagline || "Alternative Rock from Chiba/Tokyo"}
          </p>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#0a0a0a] to-transparent z-20" />
      </section>

      {/* ② トップのトピック */}
      <section className="px-4 max-w-6xl mx-auto w-full mb-32">
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

      <hr className="border-t border-white/10 max-w-4xl mx-auto my-32" />

      {/* ③ NEWS */}
      <section className="px-4 max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl font-bold tracking-tight uppercase shippori-mincho">NEWS</h2>
          <Link href="/news" className="text-xs tracking-widest hover:opacity-50 border-b border-white/20 pb-1">VIEW ALL</Link>
        </div>
        
        <div className="divide-y divide-white/5 border-t border-white/5">
          {news.map((item) => {
            const dateObj = item.publishedAt ? new Date(item.publishedAt) : null;
            const dateDisplay = dateObj ? dateObj.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Tokyo' }).replace(/\//g, '.') : '';
            const dayIndex = dateObj ? new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'Asia/Tokyo' }).format(dateObj).toUpperCase() : '';
            const dayDisplay = dayIndex ? `[${dayIndex}]` : '';

            return (
              <Link 
                key={item.id} 
                href={`/news/${item.id}`} 
                className="group flex flex-col md:flex-row md:items-center py-10 hover:bg-white/[0.02] transition-all px-4"
              >
                <div className="flex items-center space-x-6 mb-3 md:mb-0 md:w-64 shrink-0">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold tracking-widest text-white leading-none">
                      {dateDisplay} <span className="text-xs ml-1 font-mono">{dayDisplay}</span>
                    </span>
                  </div>
                  {item.category && (
                    <span className="text-[10px] border border-white/20 px-3 py-1 tracking-widest text-white/40 uppercase">
                      {item.category}
                    </span>
                  )}
                </div>
                <div className="flex-grow">
                  <h3 className="text-base md:text-lg font-normal tracking-wide text-gray-300 group-hover:text-white group-hover:font-semibold transition-all duration-300">
                    {item.title}
                  </h3>
                </div>
                <div className="hidden md:block opacity-20 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <hr className="border-t border-white/10 max-w-4xl mx-auto my-32" />

      {/* ④ SCHEDULE */}
      <section className="px-4 max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl font-bold tracking-widest uppercase shippori-mincho">SCHEDULE</h2>
          <Link href="/schedule" className="text-xs tracking-widest hover:opacity-50 border-b border-white/20 pb-1">VIEW ALL</Link>
        </div>

        {latestSchedule ? (
          <div className="flex flex-col md:flex-row gap-8 items-start border-b border-white/20 pb-16">
            <div className="w-full md:w-64 shrink-0">
              {latestSchedule.flyer?.url ? (
                <div className="w-full bg-black border border-white/10 shadow-2xl">
                  <img src={latestSchedule.flyer.url} alt={latestSchedule.venue} className="w-full h-auto object-contain" />
                </div>
              ) : (
                <div className="w-full aspect-video bg-white/5 border border-white/10 flex items-center justify-center">
                  <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Coming Soon</span>
                </div>
              )}
            </div>
            
            <div className="flex-grow w-full">
              <div className="mb-2 flex items-baseline gap-3">
                <span className="text-2xl font-mono text-white tracking-tighter">
                  {latestSchedule.date ? new Date(latestSchedule.date).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Tokyo' }).replace(/\//g, '.') : 'DATE TBD'}
                </span>
                <span className="text-sm font-mono text-white tracking-widest uppercase">
                  {latestSchedule.date ? `[${new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'Asia/Tokyo' }).format(new Date(latestSchedule.date)).toUpperCase()}]` : ''}
                </span>
              </div>
              {latestSchedule.name && (
                <div className="text-xl font-bold text-white mb-3 tracking-wide leading-relaxed">『{latestSchedule.name}』</div>
              )}
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
                  <a href={latestSchedule.ticket_url} target="_blank" rel="noopener noreferrer" className="inline-block px-10 py-3 border border-white text-[10px] tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500">TICKET & INFO</a>
                ) : (
                  <p className="text-[11px] text-white tracking-widest leading-loose w-full mb-2 bg-white/5 p-3 border-l-2 border-white">※TICKET取り置きは、各SNSのDMでご連絡ください。</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm tracking-[0.3em] text-white/40 uppercase shippori-mincho text-center py-20">No scheduled live at the moment.</p>
        )}
      </section>

      <hr className="border-t border-white/10 max-w-4xl mx-auto my-32" />

      {/* ⑤ DISCOGRAPHY */}
      <section className="px-4 max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl font-bold tracking-widest uppercase shippori-mincho">DISCOGRAPHY</h2>
          <Link href="/discography" className="text-xs tracking-widest hover:opacity-50 border-b border-white/20 pb-1">VIEW ALL</Link>
        </div>

        {latestDisco ? (() => {
          const dateObj = latestDisco.release_date ? new Date(latestDisco.release_date) : null;
          const dateDisplay = dateObj ? new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Tokyo' }).format(dateObj).replace(/\//g, '.') : '';
          return (
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="w-full md:w-80 shrink-0 shadow-2xl border border-white/10 aspect-square overflow-hidden bg-white/5">
                {latestDisco.jacket ? <img src={latestDisco.jacket.url} alt={latestDisco.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white/20 text-[10px] tracking-widest uppercase">No Image</div>}
              </div>
              <div className="flex-grow w-full space-y-5">
                <div className="border-b border-white/10 pb-2">
                  <div className="text-[13px] tracking-[0.2em] text-white font-bold uppercase mb-1">{latestDisco.type}</div>
                  <div className="text-[12px] font-mono text-white/60 tracking-tighter">{dateDisplay}</div>
                </div>
                <h3 className="text-3xl font-bold tracking-wider text-white pt-1">{latestDisco.title}</h3>
                {latestDisco.description && (
                  <div className="text-sm text-white/80 leading-relaxed mt-4 prose prose-invert max-w-none line-clamp-4 md:line-clamp-none" dangerouslySetInnerHTML={{ __html: latestDisco.description }} />
                )}
                {latestDisco.link_url && (
                  <div className="pt-4">
                    <a href={latestDisco.link_url} target="_blank" rel="noopener noreferrer" className="inline-block w-full md:w-fit md:px-12 py-4 border border-white text-[10px] tracking-[0.4em] text-center text-white hover:bg-white hover:text-black transition-all duration-500 uppercase">LISTEN / BUY</a>
                  </div>
                )}
              </div>
            </div>
          );
        })() : <p className="text-sm tracking-[0.3em] text-white/40 uppercase shippori-mincho text-center py-10">No discography found.</p>}
      </section>

      <hr className="border-t border-white/10 max-w-4xl mx-auto my-32" />

      {/* ⑥ VIDEO */}
      <section className="px-4 max-w-5xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl font-bold tracking-tight shippori-mincho uppercase">VIDEO</h2>
          <Link href="/video" className="text-xs tracking-widest hover:opacity-50 border-b border-white/20 pb-1">VIEW ALL</Link>
        </div>
        {video && (
          <div className="relative aspect-video overflow-hidden border border-white/10 group shadow-2xl">
            <iframe className="absolute inset-0 w-full h-full" src={`https://www.youtube.com/embed/${video.id}`} title={video.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          </div>
        )}
      </section>

    </main>
  );
}
