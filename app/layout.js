import './globals.css';
import { siteConfig, snsLinks } from '../data/ashroomConfig';
import { client } from '../lib/microcms';
import Link from 'next/link';

// SNSアイコンのコンポーネント
const SnsIcon = ({ icon, url, header }) => (
    <a href={url} target="_blank" rel="noopener noreferrer" 
       className={`text-white hover:text-white/50 transition-colors ${header ? 'text-sm md:text-base' : 'text-2xl'}`}>
        <i className={icon}></i>
    </a>
);

// microCMSからプロフィール（ロゴ）を取得
async function getProfile() {
    try {
        const data = await client.get({ endpoint: 'profile' });
        return data.contents[0];
    } catch (error) {
        return null;
    }
}

export const metadata = {
    title: siteConfig.siteTitle,
    description: siteConfig.description,
};

export default async function RootLayout({ children }) {
    const profile = await getProfile();

    return (
        <html lang="ja">
            <head>
                <link rel="stylesheet" href="/css/fontawesome.min.css" />
                <link 
                    href="https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@700&display=swap" 
                    rel="stylesheet"
                />
            </head>
            
            <body className="bg-[#0a0a0a] font-sans text-white scroll-smooth">
                {/* --- HEADER (固定ヘッダー) --- */}
                <header className="fixed top-0 w-full bg-black/80 backdrop-blur-md z-50 border-b border-white/5">
                    <div className="max-w-[1400px] mx-auto flex items-center h-16 md:h-20 px-4 md:px-8">
                        
                        {/* 左端：ロゴ（クリックでHOME最上部へ） */}
                        <div className="flex-shrink-0">
                            <Link href="/#top" className="hover:opacity-70 transition-opacity block">
                                {profile?.band_logo?.url ? (
                                    <img 
                                        src={profile.band_logo.url} 
                                        alt="ashroom" 
                                        className="h-6 md:h-8 w-auto object-contain" 
                                    />
                                ) : (
                                    <span className="text-xl font-bold tracking-tighter uppercase">ashroom</span>
                                )}
                            </Link>
                        </div>
                        
                        <div className="flex-grow"></div>
                        
                        {/* 右側メニュー：ご指定の並び順 */}
                        <div className="flex items-center gap-4 md:gap-8">
                            <nav className="hidden lg:flex items-center space-x-6 md:space-x-8 text-[10px] font-bold tracking-[0.2em] shippori-mincho">
                                <Link href="/news" className="hover:text-white/50 transition-colors">NEWS</Link>
                                <Link href="/schedule" className="hover:text-white/50 transition-colors">SCHEDULE</Link>
                                <Link href="/discography" className="hover:text-white/50 transition-colors">DISCOGRAPHY</Link>
                                <Link href="/video" className="hover:text-white/50 transition-colors">VIDEO</Link>
                                <Link href="/profile" className="hover:text-white/50 transition-colors">PROFILE</Link>
                                <Link href="/contact" className="hover:text-white/50 transition-colors">CONTACT</Link>
                            </nav>
                            
                            {/* SNSアイコン（境界線あり） */}
                            <div className="flex items-center space-x-4 pl-4 md:pl-8 border-l border-white/20">
                                {snsLinks.map(link => (
                                    <SnsIcon key={link.name} icon={link.icon} url={link.url} header={true} />
                                ))}
                            </div>
                        </div>
                    </div>
                </header>

                {/* メインコンテンツ（アンカー用のIDを付与） */}
                <main id="top" className="pt-16 md:pt-20 min-h-[calc(100vh-120px)]"> 
                    {children}
                </main>

                {/* --- FOOTER --- */}
                <footer className="bg-black py-16 px-4 border-t border-white/5">
                    <div className="max-w-4xl mx-auto flex flex-col items-center">
                        <div className="flex space-x-8 mb-8">
                            {snsLinks.map(link => (
                                <SnsIcon key={link.name} icon={link.icon} url={link.url} header={false} />
                            ))}
                        </div>
                        <p className="text-gray-600 text-[10px] tracking-widest mt-2 uppercase text-center">
                            &copy; {new Date().getFullYear()} ashroom
                        </p>
                    </div>
                </footer>
            </body>
        </html>
    );
}
