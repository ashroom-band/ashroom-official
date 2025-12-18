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
  const dayOfWeekStr = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      <div className="max-w-4xl mx-auto px-4 pt-24">
        <h1 className="text-4xl font-bold mb-16 text-center tracking-widest uppercase shippori-mincho text-white">SCHEDULE</h1>
        
        <div className="space-y-24">
          {schedules.map((item) => {
            // タイムゾーンのズレを補正して日本時間として扱う
            const dateObj = item.date ? new Date(item.date) : null;
            
            // 表示用の日付（YYYY.MM.DD）
            const dateDisplay = dateObj ? dateObj.toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              timeZone: 'Asia/Tokyo'
            }).replace(/\//g, '.') : 'DATE TBD';

            // 曜日の取得（日本時間基準）
            const dayIndex = dateObj ? new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'Asia/Tokyo' }).format(dateObj).toUpperCase() : '';
            const dayDisplay = dayIndex ? `[${dayIndex}]` : '';

            return (
              <div key={item.id} className="border-b border-white/20 pb-16 flex flex-col md:flex-row gap-8 items-start">
                
                <div className="w-full md:w-64 shrink-0">
                  {item.flyer && item.flyer.url ? (
                    <div className="w-full bg-black flex items-center justify-center border border-white/10 shadow-2xl">
                      <img 
                        src={item.flyer.url} 
                        alt={item.name || item.venue} 
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-video bg-white/5 border border-white/10 flex items-center justify-center">
                      <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Coming Soon</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-grow w-full">
                  <div className="mb-2 flex items-baseline gap-3">
                    <span className="text-2xl font-mono text-white tracking-tighter">
                      {dateDisplay}
                    </span>
                    <span className="text-sm font-mono text-white tracking-widest uppercase">
                      {dayDisplay}
                    </span>
                  </div>

                  {item.name && (
                    <div className="text-xl font-bold text-white mb-3 tracking-wide leading-relaxed">
                      『{item.name}』
                    </div>
                  )}
                  
                  <h2 className="text-3xl font-bold mb-6 text-white tracking-tight">{item.venue}</h2>
                  
                  <div className="grid grid-cols-1 gap-4 mb-8 border-y border-white/10 py-5">
                    <div className="flex gap-8 text-sm tracking-widest font-mono text-white">
                      {item.open_time && <div>OPEN <span className="ml-2 font-sans">{item.open_time}</span></div>}
                      {item.start_time && <div>START <span className="ml-2 font-sans">{item.start_time}</span></div>}
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm tracking-widest text-white uppercase font-sans">
                      {item.adv_price && <div>ADV <span className="ml-1">¥{item.adv_price}</span></div>}
                      {item.door_price && <div>DOOR <span className="ml-1">¥{item.door_price}</span></div>}
                      {item.student_price && <div>STUDENT <span className="ml-1">¥{item.student_price}</span></div>}
                      {item.stream_price && <div>STREAM <span className="ml-1">¥{item.stream_price}</span></div>}
                    </div>
                  </div>

                  <div className="text-white text-sm leading-relaxed mb-8 whitespace-pre-wrap">
                    {item.description}
                  </div>

                  <div className="flex flex-wrap gap-4">
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
                      <p className="text-[11px] text-white tracking-widest leading-loose w-full mb-2 bg-white/5 p-3 border-l-2 border-white">
                        ※TICKET取り置きは、各SNSのDMでご連絡ください。
                      </p>
                    )}

                    {item.stream_url && (
                      <a 
                        href={item.stream_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block w-fit px-10 py-3 border border-white text-[10px] tracking-[0.2em] text-white hover:bg-white hover:text-black transition-all duration-500"
                      >
                        STREAMING URL
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
