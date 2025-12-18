// app/news/page.jsx

import { latestNews } from '../../data/ashroomConfig';

// 共通コンポーネント定義 (ページタイトル用)
const PageTitle = ({ title }) => (
    <div className="pt-16 pb-8 border-b border-gray-700 mb-10 text-center">
        <h2 className="text-4xl font-extrabold text-white tracking-widest">{title}</h2>
    </div>
);

export default function NewsPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <PageTitle title="NEWS" />
            
            <ul className="space-y-6">
                {latestNews.map((item, index) => (
                    <li key={index} className="pb-4 border-b border-gray-800">
                        <a href={item.link} className="block hover:bg-gray-800 p-3 -m-3 rounded transition-colors">
                            {/* 修正: 日付をHOMEのスタイルに統一 */}
                            <p className="text-sm text-gray-400 font-bold">{item.date} {index === 0 && <span className="text-ash-accent font-bold ml-2">NEW!</span>}</p>
                            {/* 修正: タイトルをHOMEのスタイルに統一 */}
                            <p className="text-base text-white font-light mt-1 leading-snug">{item.title}</p>
                        </a>
                    </li>
                ))}
                {/* ダミーのニュースを追加 */}
                <li className="pb-4 border-b border-gray-800">
                    <a href="#" className="block hover:bg-gray-800 p-3 -m-3 rounded transition-colors">
                        <p className="text-sm text-gray-400 font-bold">2025.11.01</p>
                        <p className="text-base text-white font-light mt-1 leading-snug">ashroom official web site リニューアル</p>
                    </a>
                </li>
            </ul>

            {/* 今後のページング機能のためのスペース */}
            <div className="text-center mt-12">
                <p className="text-gray-500">--- END OF LIST ---</p>
            </div>
        </div>
    );
}