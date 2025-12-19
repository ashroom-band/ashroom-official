export const revalidate = 3600; // 1時間に1回最新情報をチェック

async function getLatestVideos() {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  const channelId = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;
  
  if (!apiKey || !channelId) return [];

  try {
    // 1. 最新の動画20件を検索
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=20&order=date&type=video&key=${apiKey}`
    );
    const data = await res.json();
    
    if (!data.items) return [];

    // 2. 詳細な情報を取得（動画の長さを確認するため）
    const videoIds = data.items.map(item => item.id.videoId).join(',');
    const detailRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${apiKey}`
    );
    const detailData = await detailRes.json();

    // 3. 長尺動画（Shorts以外）をフィルタリングして5本抽出
    // YouTubeのduration形式: PT1M30S (1分30秒) など。M(分)かH(時)が含まれれば長尺と判定
    return detailData.items.filter(item => {
      const duration = item.contentDetails.duration;
      return duration.includes('M') || duration.includes('H');
    }).slice(0, 5);
  } catch (error) {
    console.error("YouTube API Error:", error);
    return [];
  }
}

export default async function VideoPage() {
  const videos = await getLatestVideos();
  const channelId = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight shippori-mincho uppercase text-white">
            VIDEO
          </h1>
        </div>

        {videos.length === 0 ? (
          <div className="py-40 text-center opacity-40 text-sm tracking-widest">
            NO VIDEOS FOUND.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            {videos.map((video, index) => {
              // 日本時間基準での日付表示
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
                      {/* サムネイル画像 */}
                      <img 
                        src={video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url} 
                        alt={video.snippet.title}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* プレイボタン風の装飾 */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-12 bg-[#FF0000] rounded-xl flex items-center justify-center shadow-2xl opacity-90 transition-transform duration-300 group-hover:scale-110">
                          <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                        </div>
                      </div>

                      {/* 公開日表示 */}
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
            href={`https://www.youtube.com/channel/${channelId}`} 
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
