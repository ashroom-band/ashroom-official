import { client } from '../../lib/microcms';

export const revalidate = 0;

async function getDiscography() {
  const data = await client.get({
    endpoint: 'discography',
    queries: { orders: '-release_date' }
  });
  return data.contents;
}

export default async function DiscoPage() {
  const disco = await getDiscography();

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      <div className="max-w-6xl mx-auto px-4 pt-24">
        <h1 className="text-5xl font-bold mb-20 tracking-widest uppercase shippori-mincho text-center">DISCOGRAPHY</h1>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {disco.map((item) => {
            const dateObj = item.release_date ? new Date(item.release_date) : null;
            const dateDisplay = dateObj ? new Intl.DateTimeFormat('ja-JP', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              timeZone: 'Asia/Tokyo'
            }).format(dateObj).replace(/\//g, '.') : '';

            return (
              <div key={item.id} className="block">
                
                {/* ジャケット画像（ズーム効果を削除） */}
                <div className="aspect-square w-full overflow-hidden bg-white/5 border border-white/10 mb-6 shadow-2xl relative">
                  {item.jacket ? (
                    <img 
                      src={item.jacket.url} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20 text-xs tracking-widest uppercase font-sans">No Image</div>
                  )}
                </div>

                {/* 作品情報 */}
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline border-b border-white/10 pb-2">
                    <span className="text-[13px] tracking-[0.2em] text-white font-bold uppercase">{item.type}</span>
                    <span className="text-[13px] font-mono text-white tracking-tighter">
                      {dateDisplay}
                    </span>
                  </div>
                  
                  {/* タイトル（ホバー時の色変化を削除） */}
                  <h2 className="text-2xl font-bold tracking-wider text-white pt-1">{item.title}</h2>
                  
                  {/* 解説 */}
                  {item.description && (
                    <div 
                      className="text-sm text-white/80 leading-relaxed mt-4 prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  )}

                  {/* リンクボタン */}
                  {item.link_url && (
                    <div className="pt-6">
                      <a 
                        href={item.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block w-full py-4 border border-white text-[10px] tracking-[0.4em] text-center text-white hover:bg-white hover:text-black transition-all duration-500 uppercase"
                      >
                        LISTEN / BUY
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
