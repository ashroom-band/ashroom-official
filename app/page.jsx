import { client } from '../lib/microcms';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

// --- 各セクションのタイトルコンポーネント ---
const SectionTitle = ({ title, path }) => (
    <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-10">
        <h2 className="text-2xl font-bold text-white tracking-[0.2em] shippori-mincho uppercase">{title}</h2>
        <Link href={path} className="text-[10px] text-white/40 hover:text-white tracking-widest transition-colors duration-500 uppercase">
            VIEW ALL &gt;
        </Link>
    </div>
);

export default async function Home() {
    // 1. microCMSから各データを取得
    const newsData = await client.get({ endpoint: 'news', queries: { limit: 2, orders: '-published' } });
    const scheduleData = await client.get({ endpoint: 'schedule', queries: { limit: 2, orders: 'date', filters: `date[greater_than]${new Date().toISOString()}` } });
    const discoData = await client.get({ endpoint: 'discography', queries: { limit: 2, orders: '-releaseDate' } });
    
    // VIDEO（YouTube ID）は設定ファイルまたはmicroCMSから
    const videoIds = ["dQw4w9WgXcQ"]; // ここは既存の管理方法に合わせて適宜変更してください
    const latestVideoId = videoIds[0];

    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    return (
        <div className="bg-[#0a0a0a] min-h-screen text-white">
            
            {/* --- HERO SECTION (PROFILEと同様の設計) --- */}
            <section className="relative h-[90vh] w-full flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/artist-photo.jpg" 
                        alt="ashroom" 
                        className="w-full h-full object-cover grayscale-[30%]" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0a0a0a]"></div>
                </div>
                
                <div className="relative z-10 text-center space-y-8">
                    {/* ロゴイメージ (PROFILEと共通) */}
                    <img src="/logo-white.png" alt="ashroom" className="w-48 md:w-64 mx-auto mb-4" />
                    <p className="text-lg md:text-xl font-light tracking-[0.3em] text-white/90 shippori-mincho italic">
                        灰の部屋から、静寂と轟音を。
                    </p>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-4 py-20 space-y-32">
                
                {/* --- LATEST SLIDER (各上位1件を表示) --- */}
                <section className="relative">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-1 border border-white/5 bg-white/5">
                        {/* SCHEDULE上位1 */}
                        {scheduleData.contents[0] && (
                            <Link href="/schedule" className="relative aspect-[4/5] overflow-hidden group">
                                <img src={scheduleData.contents[0].flyer?.url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" alt="" />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors"></div>
                                <div className="absolute bottom-4 left-4"><span className="text-[10px] tracking-widest border border-white/40 px-2 py-1">NEXT LIVE</span></div>
                            </Link>
                        )}
                        {/* DISCO上位1 */}
                        {discoData.contents[0] && (
                            <Link href="/discography" className="relative aspect-[4/5] overflow-hidden group border-x border-white/5">
                                <img src={discoData.contents[0].jacket?.url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" alt="" />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors"></div>
                                <div className="absolute bottom-4 left-4"><span className="text-[10px] tracking-widest border border-white/40 px-2 py-1">LATEST RELEASE</span></div>
                            </Link>
                        )}
                        {/* VIDEO上位1 */}
                        <Link href="/video" className="relative aspect-[4/5] overflow-hidden group">
                            <img src={`https://img.youtube.com/vi/${latestVideoId}/maxresdefault.jpg`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" alt="" />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors"></div>
                            <div className="absolute bottom-4 left-4"><span className="text-[10px] tracking-widest border border-white/40 px-2 py-1">LATEST VIDEO</span></div>
                        </Link>
                    </div>
                </section>

                {/* --- NEWS SECTION (上位2件) --- */}
                <section>
                    <SectionTitle title="NEWS" path="/news" />
                    <div className="divide-y divide-white/5">
                        {newsData.contents.map((item) => {
                            const dateObj = new Date(item.published.replace(/-/g, '/'));
                            return (
                                <Link key={item.id} href={`/news/${item.id}`} className="group block py-8 hover:bg-white/[0.02] transition-all px-4">
                                    <p className="text-xs text-white/40 mb-2 font-mono uppercase tracking-widest">
                                        {item.published.replace(/-/g, '.')} [{days[dateObj.getDay()]}]
                                    </p>
                                    <h3 className="text-base md:text-lg font-normal text-white/80 group-hover:text-white group-hover:font-semibold transition-all">
                                        {item.title}
                                    </h3>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* --- SCHEDULE SECTION (上位2件) --- */}
                <section>
                    <SectionTitle title="SCHEDULE" path="/schedule" />
                    <div className="space-y-12">
                        {scheduleData.contents.map((item) => {
                            const dateObj = new Date(item.date);
                            const dateStr = item.date.replace(/-/g, '.');
                            const dayStr = days[dateObj.getDay()];
                            return (
                                <Link key={item.id} href="/schedule" className="group flex flex-col md:flex-row md:items-center gap-6 p-4 hover:bg-white/[0.02] transition-all">
                                    <div className="md:w-48 shrink-0">
                                        <p className="text-2xl font-bold tracking-tighter italic">{dateStr} <span className="text-xs ml-1">[{dayStr}]</span></p>
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="text-xl font-bold group-hover:font-extrabold transition-all">{item.venue}</h3>
                                        <p className="text-sm text-white/60">『{item.name}』</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] tracking-[0.3em] border border-white/20 px-6 py-2 group-hover:bg-white group-hover:text-black transition-all duration-500 uppercase">Detail</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* --- RELEASE & VIDEO (上位2件/1件) --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <section>
                        <SectionTitle title="RELEASE" path="/discography" />
                        <div className="space-y-8">
                            {discoData.contents.map((item) => (
                                <Link key={item.id} href="/discography" className="group block">
                                    <div className="aspect-square overflow-hidden bg-white/5 mb-4 border border-white/5">
                                        <img src={item.jacket?.url} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" alt={item.title} />
                                    </div>
                                    <p className="text-[10px] tracking-widest text-white/40 uppercase mb-1">{item.type}</p>
                                    <h3 className="text-lg font-normal group-hover:font-semibold transition-all">{item.title}</h3>
                                </Link>
                            ))}
                        </div>
                    </section>

                    <section>
                        <SectionTitle title="VIDEO" path="/video" />
                        <a href={`https://www.youtube.com/watch?v=${latestVideoId}`} target="_blank" rel="noopener noreferrer" className="group block">
                            <div className="aspect-video relative overflow-hidden border border-white/5 bg-white/5">
                                <img src={`https://img.youtube.com/vi/${latestVideoId}/maxresdefault.jpg`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700" alt="" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-white/10 group-hover:scale-110 transition-all duration-500">
                                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                                    </div>
                                </div>
                            </div>
                            <h3 className="mt-6 text-lg font-normal group-hover:font-semibold transition-all tracking-tight uppercase shippori-mincho">Latest Music Video</h3>
                        </a>
                    </section>
                </div>

            </div>
        </div>
    );
}
