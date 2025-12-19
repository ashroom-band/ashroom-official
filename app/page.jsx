import Link from 'next/link';
import { client } from '../lib/microcms';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// --- 共通コンポーネント：セクションタイトル ---
const SectionTitle = ({ title, path }) => (
    <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-10">
        <h2 className="text-2xl font-bold text-white tracking-[0.2em] shippori-mincho uppercase">{title}</h2>
        <Link href={path} className="text-[10px] text-white/40 hover:text-white tracking-widest transition-colors duration-500 uppercase">
            VIEW ALL &gt;
        </Link>
    </div>
);

export default async function Home() {
    // 1. 各エンドポイントからデータを一括取得
    const [profileData, newsData, scheduleData, discoData] = await Promise.all([
        client.get({ endpoint: 'profile' }),
        client.get({ endpoint: 'news', queries: { limit: 2, orders: '-published' } }),
        client.get({ endpoint: 'schedule', queries: { limit: 1, orders: 'date', filters: `date[greater_than]${new Date().toISOString()}` } }),
        client.get({ endpoint: 'discography', queries: { limit: 2, orders: '-releaseDate' } })
    ]);

    const profile = profileData.contents[0];
    const latestLive = scheduleData.contents[0];
    const latestDisco = discoData.contents[0];
    const latestVideoId = "t96q-B-F1rU";

    const slides = [
        { src: latestLive?.flyer?.url, link: '/schedule', label: 'NEXT LIVE', title: latestLive?.venue },
        { src: latestDisco?.jacket?.url, link: '/discography', label: 'NEW RELEASE', title: latestDisco?.title },
        { src: `https://img.youtube.com/vi/${latestVideoId}/maxresdefault.jpg`, link: '/video', label: 'LATEST VIDEO', title: 'Music Video' }
    ].filter(s => s.src);

    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    return (
        <div className="bg-[#0a0a0a] min-h-screen text-white">
            
            {/* --- HEADER NAVIGATION (ロゴを左端に配置) --- */}
            <nav className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
                <Link href="/">
                    {profile?.band_logo?.url && (
                        <img src={profile.band_logo.url} alt="ashroom" className="h-8 md:h-10 w-auto object-contain" />
                    )}
                </Link>
                {/* 既存のメニューなどが必要な場合はここにLinkを追加 */}
            </nav>

            {/* --- HERO SECTION --- */}
            <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {profile?.artist_photo?.url && (
                        <img 
                            src={profile.artist_photo.url} 
                            alt="ashroom" 
                            className="w-full h-full object-cover grayscale-[20%]" 
                        />
                    )}
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>

                <div className="relative z-10 text-center px-4 w-full">
                    {profile?.tagline && (
                        <h1 className="text-2xl md:text-5xl font-extrabold tracking-tighter text-white shippori-mincho italic drop-shadow-[0_0_20px_rgba(0,0,0,0.8)] whitespace-nowrap overflow-hidden">
                            {profile.tagline}
                        </h1>
                    )}
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-4 py-20 space-y-32">
                
                {/* --- SLIDER AREA --- */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {slides.map((slide, i) => (
                        <Link key={i} href={slide.link} className="group relative aspect-[4/5] overflow-hidden border border-white/5 bg-zinc-900">
                            <img src={slide.src} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" alt="" />
                            <div className="absolute top-4 left-4 border border-white/20 bg-black/60 text-[9px] tracking-widest px-2 py-1 uppercase z-10">
                                {slide.label}
                            </div>
                            <div className="absolute bottom-4 left-4 right-4 z-10">
                                <p className="text-xs font-bold tracking-tight truncate shippori-mincho">{slide.title}</p>
                            </div>
                        </Link>
                    ))}
                </section>

                {/* --- NEWS SECTION --- */}
                <section>
                    <SectionTitle title="NEWS" path="/news" />
                    <div className="divide-y divide-white/5">
                        {newsData.contents.map((item) => {
                            const dateObj = new Date(item.published);
                            return (
                                <Link key={item.id} href={`/news/${item.id}`} className="group block py-10 hover:bg-white/[0.02] transition-all px-4">
                                    <p className="text-xs text-white/40 mb-3 font-mono tracking-widest uppercase">
                                        {item.published.split('T')[0].replace(/-/g, '.')} [{days[dateObj.getDay()]}]
                                    </p>
                                    <h3 className="text-base md:text-lg font-normal text-white/80 group-hover:text-white group-hover:font-semibold transition-all duration-300">
                                        {item.title}
                                    </h3>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* --- SCHEDULE SECTION --- */}
                <section>
                    <SectionTitle title="SCHEDULE" path="/schedule" />
                    <div className="space-y-4">
                        {scheduleData.contents.map((item) => (
                            <Link key={item.id} href="/schedule" className="group flex flex-col md:flex-row md:items-center gap-6 p-6 hover:bg-white/[0.02] transition-all border border-white/5">
                                <div className="md:w-48 shrink-0">
                                    <p className="text-2xl font-bold tracking-tighter italic">{item.date.replace(/-/g, '.')}</p>
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-xl font-bold group-hover:font-semibold transition-all duration-300">{item.venue}</h3>
                                    <p className="text-sm text-white/40 tracking-widest uppercase mt-1">『{item.name}』</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] tracking-[0.3em] border border-white/20 px-8 py-3 group-hover:bg-white group-hover:text-black transition-all duration-500 uppercase">View Detail</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* --- RELEASE & VIDEO --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <section>
                        <SectionTitle title="RELEASE" path="/discography" />
                        <div className="space-y-10">
                            {discoData.contents.map((item) => (
                                <Link key={item.id} href="/discography" className="group block">
                                    <div className="aspect-square overflow-hidden bg-white/5 mb-6 border border-white/5">
                                        <img src={item.jacket?.url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" alt="" />
                                    </div>
                                    <p className="text-[10px] tracking-widest text-white/40 uppercase mb-2">{item.type}</p>
                                    <h3 className="text-lg font-normal group-hover:font-semibold transition-all duration-300">{item.title}</h3>
                                </Link>
                            ))}
                        </div>
                    </section>

                    <section>
                        <SectionTitle title="VIDEO" path="/video" />
                        <a href={`https://www.youtube.com/watch?v=${latestVideoId}`} target="_blank" rel="noopener noreferrer" className="group block">
                            <div className="aspect-video relative overflow-hidden border border-white/5 bg-white/5">
                                <img src={`https://img.youtube.com/vi/${latestVideoId}/maxresdefault.jpg`} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" alt="" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-white/10 group-hover:scale-110 transition-all duration-500">
                                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                                    </div>
                                </div>
                            </div>
                            <h3 className="mt-8 text-lg font-normal group-hover:font-semibold transition-all tracking-[0.1em] uppercase shippori-mincho">Latest Music Video</h3>
                        </a>
                    </section>
                </div>

            </div>
        </div>
    );
}
