import { client } from '../../../lib/microcms';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export default async function NewsDetailPage({ params }) {
    const { id } = await params;
    
    let post;
    try {
        post = await client.get({
            endpoint: 'news',
            contentId: id,
        });
    } catch (error) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <p className="opacity-50 tracking-widest uppercase">Content not found.</p>
            </div>
        );
    }

    // 日付のズレと Invalid Date を確実に回避する処理
    let dateObj;
    if (post.published) {
        const parts = post.published.split('-'); 
        // new Date(year, monthIndex, day)
        dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
    } else {
        dateObj = new Date();
    }
    
    const dateStr = dateObj.toLocaleDateString('ja-JP').replace(/\//g, '.');
    const dayStr = days[dateObj.getDay()];

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white pb-24 px-4">
            <div className="max-w-3xl mx-auto pt-32">
                
                {/* 記事ヘッダー */}
                <div className="mb-12 border-b border-white/10 pb-8">
                    <div className="flex items-center space-x-4 mb-6">
                        <span className="text-lg font-bold tracking-widest text-white leading-none">
                            {dateStr} <span className="text-xs ml-1">[{dayStr}]</span>
                        </span>
                        {post.category && (
                            <span className="text-[10px] border border-white/20 px-2 py-0.5 text-white/40 uppercase tracking-widest">
                                {post.category}
                            </span>
                        )}
                    </div>
                    <h1 className="text-2xl md:text-3xl font-normal leading-tight tracking-tight text-white">
                        {post.title}
                    </h1>
                </div>

                {/* 本文と画像 */}
                <div className="space-y-12">
                    {/* 画像1 */}
                    {post.image1?.url && (
                        <div className="w-full">
                            <img 
                                src={post.image1.url} 
                                alt="" 
                                className="w-full h-auto rounded-sm shadow-2xl border border-white/5" 
                            />
                        </div>
                    )}

                    {/* 本文：dangerouslySetInnerHTML で HTML をレンダリング */}
                    <div 
                        className="prose prose-invert max-w-none text-gray-300 leading-loose text-base md:text-lg whitespace-pre-wrap font-light"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* 画像2 */}
                    {post.image2?.url && (
                        <div className="w-full">
                            <img 
                                src={post.image2.url} 
                                alt="" 
                                className="w-full h-auto rounded-sm shadow-2xl border border-white/5" 
                            />
                        </div>
                    )}
                </div>

                {/* 戻るボタン */}
                <div className="mt-24 pt-12 border-t border-white/5 text-center">
                    <Link 
                        href="/news" 
                        className="text-xs tracking-[0.3em] text-gray-500 hover:text-white transition-all duration-300 uppercase inline-block hover:-translate-x-2"
                    >
                        ← BACK TO NEWS
                    </Link>
                </div>
            </div>
        </main>
    );
}
