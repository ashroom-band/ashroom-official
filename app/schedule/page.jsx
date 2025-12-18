import { client } from '../../lib/microcms';
export const revalidate = 0;

async function getSchedules() {
  const data = await client.get({
    endpoint: 'schedule',
    queries: { orders: '-date' }
  });
  return data.contents;
}

export default async function SchedulePage() {
  const schedules = await getSchedules();

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      <div className="max-w-4xl mx-auto px-4 pt-24">
        <h1 className="text-4xl font-bold mb-16 text-center tracking-widest uppercase shippori-mincho">SCHEDULE</h1>
        
        <div className="space-y-16">
          {schedules.map((item) => (
            <div key={item.id} className="border-b border-white/10 pb-16 flex flex-col md:flex-row gap-8">
              {/* フライヤー画像 */}
              {item.image && (
                <div className="w-full md:w-56 shrink-0">
                  <img 
                    src={item.image.url} 
                    alt={item.venue} 
                    className="w-full h-auto rounded-sm shadow-xl border border-white/5"
                  />
                </div>
              )}
              
              <div className="flex-grow">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-2xl font-mono text-gray-400">
                    {new Date(item.date).toLocaleDateString('ja-JP').replace(/\//g, '.')}
                  </span>
                </div>
                
                <h2 className="text-3xl font-bold mb-6 tracking-tight">{item.venue}</h2>
                
                {/* 時刻情報 */}
                <div className="flex gap-6 mb-6 text-sm tracking-widest font-mono border-y border-white/5 py-3">
                  {item.open_time && <div>OPEN <span className="text-gray-400 ml-2">{item.open_time}</span></div>}
                  {item.start_time && <div>START <span className="text-gray-400 ml-2">{item.start_time}</span></div>}
                </div>

                {/* ライブ詳細 */}
                <div className="text-gray-300 text-sm leading-relaxed mb-8 whitespace-pre-wrap">
                  {item.description}
                </div>

                {/* チケット・URL情報（ある場合のみ表示） */}
                <div className="flex flex-wrap gap-4 items-center">
                  {item.student_price && (
                    <span className="text-xs text-gray-400">学割: ¥{item.student_price}</span>
                  )}
                  {item.stream_price && (
                    <span className="text-xs text-gray-400">配信: ¥{item.stream_price}</span>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  {item.ticket_url && (
                    <a 
                      href={item.ticket_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-8 py-3 border border-white text-[10px] tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500"
                    >
                      TICKET & INFO
                    </a>
                  )}
                  {item.stream_url && (
                    <a 
                      href={item.stream_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-8 py-3 border border-white/30 text-[10px] tracking-[0.2em] hover:border-white transition-all duration-500"
                    >
                      STREAMING URL
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
