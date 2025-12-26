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

  // 日本時間での曜日取得用の関数
  const getJSTDateWithDay = (dateStr) => {
    if (!dateStr) return { date: 'TBA', day: '' };
    const date = new Date(dateStr);
    const dateFormatted = date.toLocaleDateString('ja-JP', { 
      year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Tokyo' 
    }).replace(/\//g, '.');
    const dayFormatted = new Intl.DateTimeFormat('en-US', { 
      weekday: 'short', timeZone: 'Asia/Tokyo' 
    }).format(date).toUpperCase();
    return { date: dateFormatted, day: `[${dayFormatted}]` };
  };

  return (
    <main className="bg-[#0a0a0a] text-white min-h-screen pb-40">
      <section className="px-4 max-w-[1400px] mx-auto pt-40 w-[90%] md:w-[80%]">
        <h1 className="text-5xl font-bold mb-24 tracking-widest uppercase shippori-mincho text-center">DISCOGRAPHY</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-32">
          {disco.map((item) => {
            const { date, day } = getJSTDateWithDay(item.release_date);
            
            return (
              <div key={item.id} className="group">
                {/* ジャケット写真エリア */}
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
                  {/* 日付：1.5倍、濃い白、日本時間曜日付き */}
                  <div className="flex items-baseline gap-3">
                    <p className="text-xl tracking-[0.2em] text-white/90 font-mono">
                      {date}
                    </p>
                    <p className="text-sm tracking-widest text-white/50 font-mono">
                      {day}
                    </p>
                    {item.type && (
                      <p className="text-xs tracking-widest text-white/30 uppercase font-mono ml-2 border-l border-white/20 pl-3">
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

                  {/* LISTEN / BUY ボタンの再実装：以前と同様のリンクへ */}
                  <div className="pt-4">
                    {item.link ? (
                      <a 
                        href={item.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-block px-12 py-4 border border-white text-[10px] tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-500 font-bold"
                      >
                        LISTEN / BUY
                      </a>
                    ) : (
                      <div className="text-[11px] text-white/30 tracking-widest uppercase py-4">
                        Coming Soon
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
