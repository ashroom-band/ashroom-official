import Link from 'next/link';
import { client } from '../lib/microcms';

export const revalidate = 60;

export default async function SchedulePage() {
  const data = await client.get({
    endpoint: 'schedule',
    queries: { orders: 'date' }
  });
  const schedules = data.contents;

  return (
    <main className="bg-[#0a0a0a] text-white min-h-screen pb-32">
      <section className="px-4 max-w-6xl mx-auto pt-32 w-full">
        <h1 className="text-5xl font-bold mb-20 tracking-widest uppercase shippori-mincho text-center">SCHEDULE</h1>

        <div className="space-y-24">
          {schedules.map((item) => (
            <div key={item.id} className="flex flex-col md:flex-row gap-12 items-start pb-20 border-b border-white/10 last:border-0">
              
              {/* 画像エリア：460px、4:3、中央配置、枠線なし */}
              <div className="w-full md:w-[460px] shrink-0">
                <div className="w-full aspect-[4/3] bg-black/40 shadow-2xl flex items-center justify-center overflow-hidden">
                  {item.flyer?.url ? (
                    <img 
                      src={item.flyer.url} 
                      alt={item.venue} 
                      className="max-w-full max-h-full object-contain" 
                    />
                  ) : (
                    <div className="text-[10px] tracking-[0.3em] text-white/20 uppercase font-sans">No Image</div>
                  )}
                </div>
              </div>

              {/* テキストエリア */}
              <div className="flex-grow w-full">
                <div className="mb-4 flex items-baseline gap-4">
                  <span className="text-3xl font-mono text-white tracking-tighter">
                    {item.date ? new Date(item.date).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Tokyo' }).replace(/\//g, '.') : 'DATE TBD'}
                  </span>
                  <span className="text-sm font-mono text-white/60 tracking-widest uppercase">
                    {item.date ? `[${new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'Asia/Tokyo' }).format(new Date(item.date)).toUpperCase()}]` : ''}
                  </span>
                </div>

                {item.name && (
                  <div className="text-xl font-bold text-white mb-4 tracking-wide leading-relaxed">
                    『{item.name}』
                  </div>
                )}

                <h2 className="text-4xl font-bold mb-8 text-white tracking-tight">{item.venue}</h2>

                <div className="grid grid-cols-1 gap-4 mb-8 border-y border-white/10 py-6">
                  <div className="flex gap-10 text-sm tracking-[0.2em] font-mono text-white">
                    {item.open_time && <div>OPEN <span className="ml-2 font-sans">{item.open_time}</span></div>}
                    {item.start_time && <div>START <span className="ml-2 font-sans">{item.start_time}</span></div>}
                  </div>
                  <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm tracking-widest text-white uppercase font-sans">
                    {item.adv_price && <div>ADV <span className="ml-1">¥{item.adv_price}</span></div>}
                    {item.door_price && <div>DOOR <span className="ml-1">¥{item.door_price}</span></div>}
                    {item.student_price && <div>STUDENT <span className="ml-1">¥{item.student_price}</span></div>}
                  </div>
                </div>

                {item.description && (
                  <div className="text-white/70 text-sm leading-loose mb-10 whitespace-pre-wrap max-w-2xl">
                    {item.description}
                  </div>
                )}

                <div className="flex flex-wrap gap-4">
                  {item.ticket_url ? (
                    <a 
                      href={item.ticket_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-block px-12 py-4 border border-white text-[10px] tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-500 font-bold"
                    >
                      TICKET & INFO
                    </a>
                  ) : (
                    <div className="text-[11px] text-white tracking-widest leading-loose w-full bg-white/5 p-4 border-l-2 border-white">
                      ※チケットのご予約は各SNSのDMにて受け付けております。
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-32 text-center">
          <Link href="/" className="text-xs tracking-[0.4em] text-white/40 hover:text-white transition-colors border-b border-white/10 pb-2">
            BACK TO HOME
          </Link>
        </div>
      </section>
    </main>
  );
}
