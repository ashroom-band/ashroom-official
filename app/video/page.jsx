// サーバー側で取得するための環境変数名に変更
const API_KEY = process.env.YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;

export const revalidate = 0; // テストのため一旦キャッシュを無効化

async function getLatestVideos() {
  if (!API_KEY || !CHANNEL_ID) {
    console.error("YouTube API Key or Channel ID is missing");
    return { error: "API configuration missing", items: [] };
  }

  try {
    // 1. まず動画リストを取得
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=15&order=date&type=video&key=${API_KEY}`,
      { cache: 'no-store' }
    );
    const data = await res.json();
    
    if (data.error) {
      console.error("YouTube API Error:", data.error);
      return { error: data.error.message, items: [] };
    }

    if (!data.items || data.items.length === 0) return { items: [] };

    // 2. 詳細（長さ）を取得
    const videoIds = data.items.map(item => item.id.videoId).join(',');
    const detailRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${API_KEY}`,
      { cache: 'no-store' }
    );
    const detailData = await detailRes.json();

    // 3. フィルタリング（Shortsを除外して5件）
    const filtered = detailData.items.filter(item => {
      const duration = item.contentDetails.duration;
      // 'M'(分) または 'H'(時) が含まれるもの＝長尺動画
      return duration.includes('M') || duration.includes('H');
    }).slice(0, 5);

    return { items: filtered };
  } catch (error) {
    console.error("Fetch Error:", error);
    return { error: "Failed to fetch data", items: [] };
  }
}

export default async function VideoPage() {
  const result = await getLatestVideos();
  const videos = result.items;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight shippori-mincho uppercase text-white">
            VIDEO
          </h1>
        </div>

        {result.error && (
          <div className="mb-8 p-4 bg-red-900/20 border border-red-500/50 text-red-200 text-xs font-mono">
            Error: {result.error}
          </div>
        )}

        {videos.length === 0 ? (
          <div className="py-40 text-center opacity-40 text-sm tracking-widest">
            {result.error ? "COULD NOT LOAD VIDEOS." : "NO VIDEOS FOUND."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {videos.map((video, index) => {
              const dateObj = new Date(video.snippet.publishedAt);
              const dateDisplay = new Intl.DateTimeFormat('ja-JP', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                timeZone: 'Asia/Tokyo'
              }).format(dateObj).replace(/\//g, '.');

              return (
                <div key={video.id} className={`${index === 0 ? 'md:col-span-2' : ''}`}>
                  <a 
                    href={`https://www.youtube.com/watch?v=${video.id}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block group"
                  >
                    <div className="relative aspect-video overflow-hidden bg-white/5 border border-white/10">
                      <img 
                        src={video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url} 
                        alt={video.snippet.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-12 bg-[#FF0000] rounded-xl flex items-center justify-center shadow-2xl opacity-90 transition-transform duration-300 group-hover:scale-110">
                          <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                        </div>
                      </div>
                      <div className="absolute bottom-0 right-0 p-3 bg-black/80 border-tl border-white/10">
                        <p className="text-[11px] font-mono font-bold tracking-tighter text-white">
                          {dateDisplay}
                        </p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h2 className={`font-bold leading-tight tracking-tight text-white group-hover:text-white/70 transition-colors ${index === 0 ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'}`}>
                        {video.snippet.title}
                      </h2>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-32 pt-16 border-t border-white/10 text-center">
          <a 
            href={`https://www.youtube.com/channel/${CHANNEL_ID}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-block border border-white px-12 py-4 text-[10px] font-bold tracking-[0.3em] text-white hover:bg-white hover:text-black transition-all duration-500 uppercase"
          >
            VIEW MORE ON YOUTUBE
          </a>
        </div>
      </div>
    </main>
  );
}
