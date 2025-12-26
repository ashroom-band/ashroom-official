import { client } from '../../lib/microcms';

export const revalidate = 86400;

async function getDiscography() {
  const data = await client.get({
    endpoint: 'discography',
    queries: { orders: '-release_date' }
  });
  return data.contents;
}

export default async function DiscographyPage() {
  const disco = await getDiscography();

  return (
    <main className="bg-[#0a0a0a] text-white min-h-screen pb-40">
      <section className="px-4 max-w-[1400px] mx-auto pt-40 w-[90%] md:w-[80%]">
        <h1 className="text-5xl font-bold mb-24 tracking-widest uppercase shippori-mincho text-center">DISCOGRAPHY</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-32">
          {disco.map((item) => {
            // 日付と曜日の生成
            const dateObj = item.release_date ? new Date(item.release_date) : null;
            const dateStr = dateObj ? dateObj.toLocaleDateString('ja-JP', { 
              year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Tokyo' 
            }).replace(/\//g, '.') : 'TBA';
            
            const dayStr = dateObj ? `[${new Intl.DateTimeFormat('en-US', { 
              weekday: 'short', timeZone: 'Asia/Tokyo' 
            }).format(dateObj).toUpperCase()}]` : '';

            // リンクの優先順位付け
            const targetLink = item.link || item.purchase_url || item.url;

            return (
              <div key={item.id} className="group">
                {/* ジャケット写真 */}
                <div className="aspect-square bg-white/5 mb-10 shadow-2xl overflow-hidden">
                  {item.jacket?.url ? (
                    <img
                      src={item.jacket.url}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/50 text-sm tracking-[0.3em] uppercase font-sans font-bold">Coming soon...</div>
                  )}
                </div>

                <div className="space-y-6">
                  {/* 日付・曜日・Type：すべて同じサイズ(text-xl)と濃い白(text-white/90)に統一 */}
                  <div className="flex flex-wrap items-baseline gap-2">
                    {/* tracking-tighter で字間を詰めました */}
                    <p className="text-xl tracking-tighter text-white/90 font-mono">
                      {dateStr}
                    </p>
                    <p className="text-xl tracking-tighter text-white/90 font-mono">
                      {dayStr}
                    </p>
                    {item.type && (
                      <p className="text-xl tracking-tighter text-white/90 font-mono ml-2 border-l border-white/20 pl-3">
                        {item.type}
                      </p>
                    )}
                  </div>

                  <h2 className="text-4xl font-bold tracking-tight leading-tight group-hover:text-white/70 transition-colors">
                    {item.title}
                  </h2>
                  
                  {item.description && (
                    <p className="text-sm text-white/50 leading-loose max-w-xl">
                      {item.description}
                    </p>
                  )}

                  <div className="pt-4">
                    {targetLink ? (
                      <a 
                        href={targetLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="relative z-10 inline-block px-12 py-4 border border-white text-[10px] tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-500 font-bold"
                      >
                        LISTEN / BUY
                      </a>
                    ) : (
                      <div className="text-[11px] text-white/30 tracking-widest uppercase py-4">
                        Release information coming soon
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
