import Link from 'next/link';
import { client } from '../../lib/microcms';

export const dynamic = 'force-dynamic';

const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export default async function NewsPage() {
    const data = await client.get({
        endpoint: 'news',
        queries: { orders: '-published' }
    });
    const newsItems = data.contents;

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white pb-24 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="pt-24 pb-12 border-b border-white/5 mb-16 text-center">
                    <h1 className="text-4xl font-bold tracking-tight uppercase shippori-mincho">NEWS</h1>
                </div>

                <div className="divide-y divide-white/5">
                    {newsItems.map((item) => {
                        // 日付のズレと Invalid Date を確実に回避する処理
                        let dateObj;
                        if (item.published) {
                            const parts = item.published.split('-'); // "2025-12-19" を分割
                            // new Date(year, monthIndex, day) ※monthIndexは0から始まるので -1
                            dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
                        } else {
                            dateObj = new Date();
                        }
                        
                        const dateStr = dateObj.toLocaleDateString('ja-JP').replace(/\//g, '.');
                        const dayStr = days[dateObj.getDay()];

                        return (
                            <Link 
                                key={item.id} 
                                href={`/news/${item.id}`}
                                className="group flex flex-col md:flex-row md:items-center py-10 hover:bg-white/[0.02] transition-all px-4"
                            >
                                <div className="flex items-center space-x-6 mb-3 md:mb-0 md:w-64 shrink-0">
                                    <div className="flex flex-col">
                                        <span className="text-lg font-bold tracking-widest text-white leading-none">
                                            {dateStr} <span className="text-xs ml-1">[{dayStr}]</span>
                                        </span>
                                    </div>
                                    {item.category && (
                                        <span className="text-[10px] border border-white/20 px-3 py-1 tracking-widest text-white/40 uppercase">
                                            {item.category}
                                        </span>
                                    )}
                                </div>

                                <div className="flex-grow">
                                    <h2 className="text-base md:text-lg font-normal tracking-wide text-gray-300 group-hover:text-white group-hover:font-semibold transition-all duration-300">
                                        {item.title}
                                    </h2>
                                </div>

                                <div className="hidden md:block opacity-20 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                        <path d="M9 18l6-6-6-6" />
                                    </svg>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
