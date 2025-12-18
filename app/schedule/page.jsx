import { client } from '../../lib/microcms'; // 先ほど作ったファイルを読み込む

// microCMSからデータを取得する関数
async function getSchedules() {
  const data = await client.get({
    endpoint: 'schedule', // microCMSで設定したコンテンツID
    queries: { orders: '-date' } // 日付が新しい順に並べる
  });
  return data.contents;
}

export default async function SchedulePage() {
  const schedules = await getSchedules();

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      <div className="max-w-4xl mx-auto px-4 pt-24">
        <h1 className="text-4xl font-bold mb-16 text-center tracking-widest uppercase shippori-mincho">SCHEDULE</h1>
        
        <div className="space-y-12">
          {schedules.map((item) => (
            <div key={item.id} className="border-b border-white/10 pb-12 flex flex-col md:flex-row gap-8">
              {/* フライヤー画像がある場合に表示 */}
              {item.image && (
                <div className="w-full md:w-48 shrink-0">
                  <img 
                    src={item.image.url} 
                    alt={item.venue} 
                    className="w-full h-auto rounded-sm shadow-lg border border-white/5"
                  />
                </div>
              )}
              
              <div className="flex-grow">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-xl font-mono text-gray-400">
                    {new Date(item.date).toLocaleDateString('ja-JP').replace(/\//g, '.')}
                  </span>
                  <span className="px-2 py-1 bg-white/10 text-[10px] tracking-tighter uppercase">Livehouse</span>
                </div>
                
                <h2 className="text-2xl font-bold mb-4 tracking-tight">{item.venue}</h2>
                
                {/* ライブ詳細テキスト */}
                <div className="text-gray-300 text-sm leading-relaxed mb-6 whitespace-pre-wrap">
                  {item.description}
                </div>

                {/* チケットURLがある場合に表示 */}
                {item.ticket_url && (
                  <a 
                    href={item.ticket_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-2 border border-white text-xs tracking-widest hover:bg-white hover:text-black transition-all duration-300"
                  >
                    TICKET & INFO
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
