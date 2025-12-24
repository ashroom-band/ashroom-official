// app/layout.js

import './globals.css';
import { siteConfig } from '../data/ashroomConfig';
import { client } from '../lib/microcms';
import Header from '../components/Header';
import { SNS_LINKS } from '../lib/constants';

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
        <html lang="ja" className="scroll-smooth">
            {/* ... head部分は変更なし ... */}
            <body className="bg-[#0a0a0a] font-sans text-white antialiased flex flex-col min-h-screen">
                <Header profile={profile} />

                <main id="top" className="flex-grow min-h-screen"> 
                    {children}
                </main>

                <footer className="bg-black py-24 px-4 border-t border-white/5">
                    <div className="max-w-4xl mx-auto flex flex-col items-center">
                        <div className="flex gap-12">
                            {SNS_LINKS.map((sns) => (
                                <a 
                                    key={sns.name} 
                                    href={sns.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    /* 修正：サイズをw-8 h-8 (約1.4倍強)、色を不透明度80%の白 (text-white/80) に変更 */
                                    className="w-8 h-8 fill-current text-white/80 hover:text-white transition-all"
                                >
                                    <svg viewBox="0 0 24 24" className="w-full h-full">
                                        <path d={sns.iconPath} />
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>
                </footer>
            </body>
        </html>
    );
}
