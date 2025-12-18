import { client } from '../../lib/microcms';

export const revalidate = 0; // 常に最新のデータを取得

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
        <h1 className="text-4xl font-bold mb-16 text-center tracking-widest uppercase shippori-mincho text-white">SCHEDULE</h1>
        
        <div className="space-y-20">
          {schedules.map((item) => (
            <div key={item.id} className="border-b border-white/20 pb-16 flex flex-col md:flex-row gap-8 items-start">
              
              {/* フライヤー画像 / Coming Soon */}
              <div className="w-full md:w-56 shrink-0 aspect-[3/4] bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                {item.image ? (
                  <img 
                    src={item.image.url} 
                    alt={item.venue} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Coming Soon</span>
                )}
              </div>
              
              <div className="flex-grow w-full">
                {/* 日付 */}
                <div className="mb-2">
                  <span className="text-2xl font-mono text-white tracking-tighter">
                    {new Date(item.date).toLocaleDateString('ja-JP').replace(/\//g, '.')}
                  </span>
                </div>
                
                {/* 会場名 */}
                <h2 className="text-3xl font-bold mb-6 text-white tracking-tight">{item.venue}</h2>
                
                {/* 時刻・価格情報セクション */}
                <div className="grid grid-cols-1 gap-4 mb-8 border-y border-white/10 py-5">
                  {/* 時刻 */}
                  <div className="flex gap-8 text-sm tracking-widest font-mono text-white">
                    {item.open_time && <div>OPEN <span className="ml-2">{item.open_time}</span></div>}
                    {item.start_time && <div>START <span className="ml-2">{item.start_time}</span></div>}
                  </div>

                  {/* 価格（複数表示対応） */}
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm tracking-widest text-white">
                    {item.adv_price && <div>ADV <span className="ml-2">¥{item.adv_price}</span></div>}
                    {item.door_price && <div>DOOR <span className="ml-2">¥{item.door_price}</span></div>}
                    {item.student_price && <div>STUDENT <span className="ml-2">¥{item.student_price}</span></div>}
                    {item.stream_price && <div>STREAM <span className="ml-2">¥{item.stream_price}</span></div>}
                  </div>
                </div>

                {/* ライブ詳細 */}
                <div className="text-white text-sm leading-relaxed mb-8 whitespace-pre-wrap opacity-90">
                  {item.description}
                </div>

                {/* チケットボタン / メッセージ */}
                <div className="flex flex-col gap-4">
                  {item.ticket_url ? (
                    <a 
                      href={item.ticket_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-fit px-10 py-3 border border-white text-[10px] tracking-[0.2em] text-white hover:bg-white hover:text-black transition-all duration-500"
                    >
                      TICKET & INFO
                    </a>
                  ) : (
                    <p className="text-[11px] text-white/70 tracking-widest leading-loose">
                      ※TICKET取り置きは、各SNSのDMでご連絡ください。
                    </p>
                  )}

                  {item.stream_url && (
                    <a 
                      href={item.stream_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-fit px-10 py-3 border border-white/30 text-[10px] tracking-[0.2em] text-white hover:border-white transition-all duration-500"
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
