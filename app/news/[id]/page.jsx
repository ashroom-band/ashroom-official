import { client } from '../../../lib/microcms';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function NewsDetailPage({ params }) {
    const { id } = params;
    
    const post = await client.get({
        endpoint: 'news',
        contentId: id,
    });

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white pb-24 px-4">
            <div className="max-w-3xl mx-auto pt-32">
                
                {/* 記事ヘッダー */}
                <div className="mb-12 border-b border-white/10 pb-8">
                    <div className="flex items-center space-x-4 mb-6">
                        <span className="text-sm font-mono text-gray-500">
                            {post.published ? post.published.replace(/-/g, '.') : ''}
                        </span>
                        {post.category && (
                            <span className="text-[10px] border border-white/20 px-2 py-0.5 text-white/60 uppercase">
                                {post.category}
                            </span>
                        )}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tighter">
                        {post.title}
                    </h1>
                </div>

                {/* 本文と画像 */}
                <div className="space-y-12">
                    {post.image1?.url && (
                        <div className="w-full">
                            <img src={post.image1.url} alt="" className="w-full h-auto rounded-sm shadow-2xl" />
                        </div>
                    )}

                    <div 
                        className="prose prose-invert max-w-none text-gray-300 leading-loose text-lg whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {post.image2?.url && (
                        <div className="w-full">
                            <img src={post.image2.url} alt="" className="w-full h-auto rounded-sm shadow-2xl" />
                        </div>
                    )}
                </div>

                <div className="mt-24 pt-12 border-t border-white/5 text-center">
                    <Link 
                        href="/news" 
                        className="text-sm tracking-[0.3em] text-gray-500 hover:text-white transition-colors uppercase"
                    >
                        ← BACK TO NEWS
                    </Link>
                </div>
            </div>
        </main>
    );
}
