import { client } from '../../lib/microcms';

export const revalidate = 0;

async function getDiscography() {
  const data = await client.get({
    endpoint: 'discography',
    queries: { orders: '-release_date' } // 新しい順
  });
  return data.contents;
}

export default async function DiscoPage() {
  const disco = await getDiscography();

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      <div className="max-w-6xl mx-auto px-4 pt-24">
        <h1 className="text-4xl font-bold mb-16 text-center tracking-widest uppercase shippori-mincho">DISCOGRAPHY</h1>
        
        {/* グリッドレイアウト（PCは3列、スマホは1列） */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {disco.map((item) => (
            <div key={item.id} className="group">
              
              {/* ジャケット画像 */}
              <div className="aspect-square w-full overflow-hidden bg-white/5 border border-white/10 mb-6 shadow-2xl relative">
                {item.jacket ? (
                  <img 
                    src={item.jacket.url} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20 text-xs tracking-widest uppercase">No Image</div>
                )}
              </div>

              {/* 作品情報 */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] tracking-[0.2em] text-white/50 uppercase">{item.type}</span>
                  <span className="text-[10px] font-mono text-white/50">
                    {item.release_date ? new Date(item.release_date).toLocaleDateString('ja-JP').replace(/\//g, '.') : ''}
                  </span>
                </div>
                <h2 className="text-xl font-bold tracking-wider group-hover:text-gray-400 transition-colors">{item.title}</h2>
                
                {/* 収録曲（リッチエディタの内容を表示） */}
                {item.description && (
                  <div 
                    className="text-xs text-white/70 leading-relaxed line-clamp-3 mt-4 prose prose-invert"
                    dangerouslySetInnerHTML={{ __html: item.jacket ? item.description : '' }}
                  />
                )}

                {/* ボタン */}
                {item.link_url && (
                  <div className="pt-4">
                    <a 
                      href={item.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-full py-3 border border-white/20 text-[10px] tracking-[0.3em] text-center hover:bg-white hover:text-black transition-all duration-500"
                    >
                      LISTEN / BUY
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
