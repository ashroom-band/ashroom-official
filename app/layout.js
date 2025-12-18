// app/layout.js
import './globals.css';
import { siteConfig, snsLinks } from '../data/ashroomConfig';

// SNSアイコンのコンポーネント
const SnsIcon = ({ icon, url, header }) => (
    <a href={url} target="_blank" rel="noopener noreferrer" 
       className={`text-white hover:text-[#E2FF00] transition-colors ${header ? 'text-base md:text-lg' : 'text-2xl'}`}>
        <i className={icon}></i>
    </a>
);

export const metadata = {
    title: siteConfig.siteTitle,
    description: siteConfig.description,
};

export default function RootLayout({ children }) {
    return (
        <html lang="ja">
            <head>
                <link rel="stylesheet" href="/css/fontawesome.min.css" />
                <link 
                    href="https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@700&display=swap" 
                    rel="stylesheet"
                />
            </head>
            
            <body className="bg-[#0a0a0a] font-sans text-white">
                {/* --- HEADER --- */}
                <header className="fixed top-0 w-full bg-black/60 backdrop-blur-md z-50 border-b border-white/5">
                    <div className="max-w-[1400px] mx-auto flex items-center h-16 md:h-20 px-3 md:px-6">
                        {/* ロゴエリア */}
                        <h1 className="text-lg md:text-2xl font-bold text-white tracking-tighter hover:text-[#E2FF00] transition-colors flex-shrink-0">
                            <a href="/">
                                {siteConfig.siteTitle.replace(" Official Web Site", "")}
                            </a>
                        </h1>
                        
                        <div className="flex-grow"></div>
                        
                        {/* メニューエリア：ご指定の並び順で1行に表示 */}
                        <div className="flex items-center overflow-hidden ml-2 md:ml-4">
                            <nav className="flex items-center space-x-1 sm:space-x-3 md:space-x-6">
                                {[
                                    { name: 'HOME', path: '/' },
                                    { name: 'NEWS', path: '/news' },
                                    { name: 'SCHEDULE', path: '/schedule' },
                                    { name: 'DISCOGRAPHY', path: '/discography' },
                                    { name: 'VIDEO', path: '/video' },
                                    { name: 'PROFILE', path: '/profile' },
                                    { name: 'CONTACT', path: '/contact' }
                                ].map((item) => (
                                    <a 
                                        key={item.name}
                                        href={item.path} 
                                        className="text-[9px] sm:text-[11px] md:text-sm font-bold text-white hover:text-[#E2FF00] transition-colors whitespace-nowrap tracking-tighter"
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </nav>
                            
                            {/* SNSアイコン */}
                            <div className="flex items-center space-x-1.5 md:space-x-4 flex-shrink-0 ml-1.5 sm:ml-4 pl-1.5 sm:pl-4 border-l border-white/10">
                                {snsLinks.map(link => (
                                    <SnsIcon key={link.name} icon={link.icon} url={link.url} header={true} />
                                ))}
                            </div>
                        </div>
                    </div>
                </header>

                {/* メインコンテンツ */}
                <main className="pt-16 md:pt-20 min-h-[calc(100vh-120px)]"> 
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
                            &copy; {new Date().getFullYear()} {siteConfig.siteTitle.replace(" Official Web Site", "")}
                        </p>
                    </div>
                </footer>
            </body>
        </html>
    );
}