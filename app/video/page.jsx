import Link from 'next/link';
import { client } from '../../lib/microcms';

export const revalidate = 86400; // 24時間キャッシュ

const API_KEY = process.env.YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

async function getAllVideos() {
  if (!API_KEY) return [];
  try {
    // 1. microCMSから全動画URLを取得（最大50件程度）
    const videoData = await client.get({ 
      endpoint: 'video',
      queries: { limit: 50 } 
    });
    
    const urls = videoData.contents.map(c => c.youtube_url).filter(Boolean);
    if (urls.length === 0) return [];

    // 2. IDを抽出
    const videoIds = urls.map(url => {
      if (url.includes('youtu.be/')) return url.split('youtu.be/')[1].split(/[?#]/)[0];
      if (url.includes('v=')) return url.split('v=')[1].split(/[&?#]/)[0];
      const match = url.match(/(?:embed\/|shorts\/|v\/|vi\/|e\/)([^#\?&]{11})/);
      return match ? match[1] : null;
    }).filter(id => id && id.length === 11);

    if (videoIds.length === 0) return [];

    // 3. YouTube APIで一括取得
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoIds.join(',')}&key=${API_KEY}`
    );
    const data = await res.json();

    if (!data.items) return [];

    // 4. YouTubeの公開日順に並び替え（最新が上）
    return data.items.sort((a, b) => {
      return new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt);
    });

  } catch (e) {
    console.error(e);
    return [];
  }
}

export default async function VideoPage() {
  const videos = await getAllVideos();

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white pt-40 pb-32 px-4">
      <div className="max-w-[1400px] mx-auto w-[90%] md:w-[80%]">
        <h1 className="text-5xl font-bold tracking-tighter mb-20 shippori-mincho">VIDEO</h1>

        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
            {videos.map((video) => (
              <a 
                key={video.id} 
                href={`https://www.youtube.com/watch?v=${video.id}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group"
              >
                <div className="relative aspect-video overflow-hidden bg-white/5 shadow-2xl mb-8">
                  <img 
                    src={video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url} 
                    alt="" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-10 bg-[#FF0000] rounded-xl flex items-center justify-center opacity-90 transition-transform duration-300 group-hover:scale-110">
                      <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold leading-tight group-hover:text-white/70 transition-colors tracking-tight">
                    {video.snippet.title}
                  </h2>
                  <p className="text-[10px] tracking-widest text-white/40 mt-3 font-mono">
                    {new Date(video.snippet.publishedAt).toLocaleDateString('ja-JP').replace(/\//g, '.')}
                  </p>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-center py-40 opacity-40 uppercase tracking-widest text-sm">
            No videos found.
          </p>
        )}
      </div>
    </div>
  );
}
