'use client';
import { useState } from 'react';
import Link from 'next/link';
import { SNS_LINKS } from '../lib/constants'; // インポート

export default function Header({ profile }) {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { name: 'NEWS', path: '/news' },
        { name: 'SCHEDULE', path: '/schedule' },
        { name: 'DISCOGRAPHY', path: '/discography' },
        { name: 'VIDEO', path: '/video' },
        { name: 'PROFILE', path: '/profile' },
        { name: 'CONTACT', path: '/contact' },
    ];

    return (
        <header className="fixed top-0 w-full z-[100]">
            {/* 修正⑤：背景を不透明度70%の黒（bg-black/70）に変更 */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-xl border-b border-white/5 z-[120]"></div>

            <div className="w-full flex items-center justify-between h-20 md:h-28 px-4 md:px-6 lg:px-10 relative z-[130]">
                {/* 修正②：ロゴサイズを1.5倍に（h-9→h-14, h-12→h-18 程度へ調整） */}
                <Link href="/#top" onClick={() => setIsOpen(false)} className="hover:opacity-70 transition-opacity">
                    {profile?.band_logo?.url ? (
                        <img src={profile.band_logo.url} alt="ashroom" className="h-14 md:h-18 w-auto object-contain" />
                    ) : (
                        <span className="text-3xl font-bold tracking-tighter uppercase">ashroom</span>
                    )}
                </Link>

                {/* 修正③：ナビゲーション。lg:flex（1024px以上）でのみ表示されるよう指定 */}
                <nav className="hidden lg:flex items-center gap-12">
                    <div className="flex items-center gap-10 text-sm md:text-lg font-bold tracking-[0.2em] shippori-mincho">
                        {menuItems.map((item) => (
                            <Link key={item.name} href={item.path} className="hover:text-white/50 transition-colors uppercase">
                                {item.name}
                            </Link>
                        ))}
                    </div>
                    {/* SNS共通化 */}
                    <div className="flex items-center gap-6 pl-10 border-l border-white/20">
                        {SNS_LINKS.map((sns) => (
                            <a key={sns.name} href={sns.url} target="_blank" rel="noopener noreferrer" className="w-5 h-5 fill-current hover:text-white/50 transition-colors">
                                <svg viewBox="0 0 24 24" className="w-full h-full overflow-visible">
                                    <path d={sns.iconPath} />
                                </svg>
                            </a>
                        ))}
                    </div>
                </nav>

                {/* ハンバーガーボタン：lg:hidden により1024px未満でのみ表示 */}
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="lg:hidden w-10 h-10 flex flex-col justify-center items-center relative z-[140]"
                    aria-label="Menu"
                >
                    <span className={`w-8 h-[2px] bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-[2px]' : 'mb-[8px]'}`} />
                    {!isOpen && <span className="w-8 h-[2px] bg-white mb-[8px] transition-all duration-300" />}
                    <span className={`w-8 h-[2px] bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-[0px]' : ''}`} />
                    {/* 微調整：上記translate-yの値などはロゴ拡大に合わせて微調整しています */}
                </button>
            </div>

            {/* モバイルメニュー */}
            <div className={`fixed inset-0 z-[110] transition-all duration-500 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
                <div className="absolute inset-0 bg-black/95 backdrop-blur-md"></div>
                <nav className="relative h-full w-full overflow-y-auto pt-32 pb-20 flex flex-col items-center">
                    <ul className="flex flex-col items-center gap-10 w-full px-6">
                        {menuItems.map((item) => (
                            <li key={item.name} className="w-full text-center">
                                <Link 
                                    href={item.path} 
                                    onClick={() => setIsOpen(false)}
                                    className="text-2xl font-bold tracking-[0.3em] shippori-mincho text-white hover:text-white/50 transition-colors block py-2"
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    
                    {/* SNS共通化 */}
                    <div className="flex gap-10 mt-16 flex-wrap justify-center px-10">
                        {SNS_LINKS.map((sns) => (
                            <a key={sns.name} href={sns.url} target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/50 transition-colors">
                                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current overflow-visible">
                                    <path d={sns.iconPath} />
                                </svg>
                            </a>
                        ))}
                    </div>
                </nav>
            </div>
        </header>
    );
}
