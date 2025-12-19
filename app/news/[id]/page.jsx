import { client } from '../../../lib/microcms';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

// Next.jsの最新仕様に合わせて params を Promise として扱う
export default async function NewsDetailPage({ params }) {
    // paramsをawaitして展開する
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
                <p>Content not found.</p>
            </div>
        );
    }

    const dateObj = new Date(post.published);
    const dateStr = dateObj.toLocaleDateString('ja-JP').replace(/\//g, '.');
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const dayStr = days[dateObj.getDay()];

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white pb-24 px-4">
            <div className="max-w-3xl mx-auto pt-32">
                
                <div className="mb-12 border-b border-white/10 pb-8">
                    <div className="flex items-center space-x-4 mb-6">
                        <span className="text-lg font-bold tracking-widest text-white">
                            {dateStr} <span className="text-xs ml-1">[{dayStr}]</span>
                        </span>
                        {post.category && (
                            <span className="text-[10px] border border-white/20 px-2 py-0.5 text-white/40 uppercase">
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
                            <img src={post.image1.url} alt="" className="w-full h-auto rounded-sm shadow-2xl" />
                        </div>
                    )}

                    {/* dangerouslySetInnerHTML を使用する際は、要素に prose クラスを当てておくと表示が崩れにくいです */}
                    <div 
                        className="prose prose-invert max-w-none text-gray-300 leading-loose text-base md:text-lg whitespace-pre-wrap"
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
                        className="text-xs tracking-[0.3em] text-gray-500 hover:text-white transition-colors uppercase"
                    >
                        ← BACK TO NEWS
                    </Link>
                </div>
            </div>
        </main>
    );
}
