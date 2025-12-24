// app/layout.js

import './globals.css';
import { siteConfig } from '../data/ashroomConfig';
import { client } from '../lib/microcms';
import Header from '../components/Header';
import { SNS_LINKS } from '../lib/constants';

// --- この getProfile 関数が不足しているためエラーになっています ---
async function getProfile() {
    try {
        const data = await client.get({ endpoint: 'profile' });
        return data.contents[0];
    } catch (error) {
        return null;
    }
}
// --------------------------------------------------------

export const metadata = {
    title: siteConfig.siteTitle,
    description: siteConfig.description,
};

export default async function RootLayout({ children }) {
    // ここで getProfile を呼び出しています
    const profile = await getProfile();

    return (
        <html lang="ja" className="scroll-smooth">
            <head>
                <link 
                    href="https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@700&display=swap" 
                    rel="stylesheet"
                />
            </head>
            <body className="bg-[#0a0a0a] font-sans text-white antialiased flex flex-col min-h-screen">
                <Header profile={profile} />

                <main id="top" className="flex-grow min-h-screen"> 
                    {children}
                </main>

                <footer className="bg-black py-24 px-4 border-t border-white/5">
                    <div className="max-w-4xl mx-auto flex flex-col items-center">
                        <div className="flex gap-10">
                            {SNS_LINKS.map((sns) => (
                                <a key={sns.name} href={sns.url} target="_blank" rel="noopener noreferrer" className="w-6 h-6 fill-current opacity-40 hover:opacity-100 transition-all">
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
