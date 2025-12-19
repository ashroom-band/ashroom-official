import { client } from '../../../lib/microcms';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export default async function NewsDetailPage({ params }) {
    const { id } = await params;
    
    const post = await client.get({
        endpoint: 'news',
        contentId: id,
    });

    // 1日ズレを解決するロジック
    // 1. 文字列をそのままドット区切りに（ズレようがない）
    const dateStr = post.published ? post.published.replace(/-/g, '.') : '';
    // 2. 曜日取得時のみ、ハイフンをスラッシュに変換（これで日本時間として解釈される）
    const dayStr = post.published ? days[new Date(post.published.replace(/-/g, '/')).getDay()] : '';

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white pb-24 px-4">
            <div className="max-w-3xl mx-auto pt-32">
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

                <div className="space-y-12">
                    {post.image1?.url && (
                        <div className="w-full">
                            <img src={post.image1.url} alt="" className="w-full h-auto rounded-sm border border-white/5 shadow-2xl" />
                        </div>
                    )}

                    <div 
                        className="prose prose-invert max-w-none text-gray-300 leading-loose text-base md:text-lg whitespace-pre-wrap font-light"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {post.image2?.url && (
                        <div className="w-full">
                            <img src={post.image2.url} alt="" className="w-full h-auto rounded-sm border border-white/5 shadow-2xl" />
                        </div>
                    )}
                </div>

                <div className="mt-24 pt-12 border-t border-white/5 text-center">
                    <Link href="/news" className="text-xs tracking-[0.3em] text-gray-500 hover:text-white transition-all duration-300 uppercase inline-block hover:-translate-x-2">
                        ← BACK TO NEWS
                    </Link>
                </div>
            </div>
        </main>
    );
}
