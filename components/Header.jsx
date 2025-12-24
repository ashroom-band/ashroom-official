'use client';
import { useState } from 'react';
import Link from 'next/link';
import { SNS_LINKS } from '../lib/constants';

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
            {/* 修正：背景を明るい透過色に変更（bg-white/10） */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl border-b border-white/10 z-[120]"></div>

            <div className="w-full flex items-center justify-between h-24 md:h-32 px-6 md:px-10 relative z-[130]">
                {/* 修正：ロゴサイズをさらに拡大（h-20 md:h-28） */}
                <Link href="/#top" onClick={() => setIsOpen(false)} className="hover:opacity-70 transition-opacity">
                    {profile?.band_logo?.url ? (
                        <img src={profile.band_logo.url} alt="ashroom" className="h-20 md:h-28 w-auto object-contain" />
                    ) : (
                        <span className="text-4xl font-bold tracking-tighter uppercase">ashroom</span>
                    )}
                </Link>

                {/* ナビゲーション：xl(1280px)以上で表示。それ未満はハンバーガーへ */}
                <nav className="hidden xl:flex items-center gap-12">
                    <div className="flex items-center gap-10 text-lg font-bold tracking-[0.2em] shippori-mincho">
                        {menuItems.map((item) => (
                            <Link key={item.name} href={item.path} className="hover:text-white/50 transition-colors uppercase">
                                {item.name}
                            </Link>
                        ))}
                    </div>
                    <div className="flex items-center gap-6 pl-10 border-l border-white/20">
                        {SNS_LINKS.map((sns) => (
                            <a key={sns.name} href={sns.url} target="_blank" rel="noopener noreferrer" className="w-6 h-6 fill-current hover:text-white/50 transition-colors">
                                <svg viewBox="0 0 24 24" className="w-full h-full overflow-visible">
                                    <path d={sns.iconPath} />
                                </svg>
                            </a>
                        ))}
                    </div>
                </nav>

                {/* ハンバーガーボタン：xl(1280px)未満で表示 */}
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="xl:hidden w-12 h-12 flex flex-col justify-center items-center relative z-[140]"
                    aria-label="Menu"
                >
                    <span className={`w-9 h-[2px] bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-[2px]' : 'mb-[10px]'}`} />
                    {!isOpen && <span className="w-9 h-[2px] bg-white mb-[10px] transition-all duration-300" />}
                    <span className={`w-9 h-[2px] bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-[0px]' : ''}`} />
                </button>
            </div>

            {/* モバイルメニュー（フルスクリーン） */}
            <div className={`fixed inset-0 z-[110] transition-all duration-500 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
                <div className="absolute inset-0 bg-black/95 backdrop-blur-md"></div>
                <nav className="relative h-full w-full overflow-y-auto pt-40 pb-20 flex flex-col items-center">
                    <ul className="flex flex-col items-center gap-12 w-full px-6">
                        {menuItems.map((item) => (
                            <li key={item.name} className="w-full text-center">
                                <Link 
                                    href={item.path} 
                                    onClick={() => setIsOpen(false)}
                                    className="text-3xl font-bold tracking-[0.3em] shippori-mincho text-white hover:text-white/50 transition-colors block py-2"
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="flex gap-10 mt-20 flex-wrap justify-center px-10">
                        {SNS_LINKS.map((sns) => (
                            <a key={sns.name} href={sns.url} target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/50 transition-colors">
                                <svg viewBox="0 0 24 24" className="w-10 h-10 fill-current">
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
