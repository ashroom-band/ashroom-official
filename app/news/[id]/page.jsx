import { client } from '../../../lib/microcms';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

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

    // SCHEDULEと同じ日付処理ロジック
    const dateObj = post.published ? new Date(post.published) : null;
    
    const dateDisplay = dateObj ? dateObj.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'Asia/Tokyo'
    }).replace(/\//g, '.') : '';

    const dayIndex = dateObj ? new Intl.DateTimeFormat('en-US', { 
        weekday: 'short', 
        timeZone: 'Asia/Tokyo' 
    }).format(dateObj).toUpperCase() : '';
    
    const dayDisplay = dayIndex ? `[${dayIndex}]` : '';

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white pb-24 px-4">
            <div className="max-w-3xl mx-auto pt-32">
                
                <div className="mb-12 border-b border-white/10 pb-8">
                    <div className="flex items-center space-x-4 mb-6">
                        <span className="text-lg font-bold tracking-widest text-white leading-none">
                            {dateDisplay} <span className="text-xs ml-1 font-mono">{dayDisplay}</span>
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
                            <img 
                                src={post.image1.url} 
                                alt="" 
                                className="w-full h-auto rounded-sm shadow-2xl border border-white/5" 
                            />
                        </div>
                    )}

                    <div 
                        className="prose prose-invert max-w-none text-gray-300 leading-loose text-base md:text-lg whitespace-pre-wrap font-light"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

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
