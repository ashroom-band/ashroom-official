import { siteConfig, members } from '../../data/ashroomConfig';

// 共通コンポーネント定義
const PageTitle = ({ title }) => (
    <div className="pt-24 pb-12 border-b border-white/5 mb-16 text-center">
        <h1 className="text-4xl font-bold text-white tracking-tight uppercase shippori-mincho">{title}</h1>
    </div>
);

export default function ProfilePage() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white pb-24">
            <div className="max-w-6xl mx-auto px-4">
                <PageTitle title="PROFILE" />
                
                {/* バンド紹介セクション */}
                <div className="mb-32 text-center max-w-4xl mx-auto">
                    {/* アーティストフォト */}
                    <div className="mb-10 flex justify-center">
                        <div className="w-full max-w-2xl overflow-hidden rounded-sm shadow-2xl border border-white/5">
                            <img 
                                src="/artist-photo.jpg" 
                                alt="ashroom Artist Photo" 
                                className="w-full h-auto object-cover opacity-100"
                            />
                        </div>
                    </div>

                    {/* アーティストロゴ */}
                    <div className="mb-6">
                        <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter uppercase">
                            {siteConfig.siteTitle.replace(" Official Web Site", "")}
                        </h2>
                    </div>

                    {/* キャッチコピー */}
                    <p className="text-2xl md:text-4xl font-bold mb-10 text-white font-shippori italic tracking-tight leading-tight"> 
                        {siteConfig.tagline}
                    </p>
                    
                    <p className="text-base md:text-lg font-light text-gray-200 leading-relaxed tracking-tight">
                        {siteConfig.description}
                    </p>
                </div>

                {/* メンバープロフィール一覧 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-16">
                    {members.map((member, index) => (
                        <div key={index} className="flex flex-col items-center text-center group">
                            {/* メンバー写真エリア */}
                            <div className="w-32 h-32 mb-8 relative">
                                <div className="w-full h-full bg-gray-900 rounded-full border border-white/10 flex items-center justify-center overflow-hidden transition-colors duration-500 group-hover:border-white/30 shadow-2xl">
                                    <span className="text-gray-500 font-bold text-xs tracking-tighter group-hover:text-white transition-colors">
                                        {member.instrument}
                                    </span>
                                </div>
                            </div>

                            {/* テキスト情報 */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-white tracking-tight">{member.name}</h3>
                                    <p className="text-xs font-bold text-white uppercase tracking-widest opacity-80">{member.instrument}</p>
                                </div>

                                {/* 影響を受けたアーティスト */}
                                <div className="pt-2">
                                    {/* 見出し：濃い白(gray-200) */}
                                    <p className="text-[13px] text-gray-200 tracking-tighter font-bold mb-3">影響を受けたアーティスト</p>
                                    <ul className="space-y-1">
                                        {member.influences && member.influences.map((artist, i) => (
                                            /* アーティスト名：濃い白(gray-200)を維持し、サイズを一回り小さく */
                                            <li key={i} className="text-xs md:text-[13px] text-gray-200 font-normal tracking-tight">
                                                {artist}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            
                            {/* Instagramアイコン */}
                            <div className="mt-8">
                                {member.sns?.instagram && (
                                    <a 
                                        href={member.sns.instagram} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/10 text-white hover:bg-white hover:text-black transition-all duration-300"
                                    >
                                        <i className="fab fa-instagram text-xl"></i>
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}