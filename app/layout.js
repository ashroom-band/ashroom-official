import './globals.css';
import { siteConfig } from '../data/ashroomConfig';
import { client } from '../lib/microcms';
import Header from '../components/Header';

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

// ヘッダーと共通のSNSデータ（SVGパス）
const footerSnsLinks = [
    { name: 'Instagram', url: 'https://www.instagram.com/ashroom_official/', icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /> },
    { name: 'X', url: 'https://x.com/ashroom_band', icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /> },
    { name: 'YouTube', url: 'https://youtube.com/@ashroom_official?si=CdMu-kdG2aowDEoa', icon: <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /> },
    { name: 'TikTok', url: 'https://www.tiktok.com/@ashroom__official?is_from_webapp=1&sender_device=pc', icon: <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.6-4.12-1.31a8.776 8.776 0 0 1-1.87-1.41c-.01 3.53.01 7.06-.01 10.58-.1 2.4-1.13 4.89-3.05 6.43-1.92 1.54-4.63 2.05-6.95 1.34-2.32-.71-4.23-2.61-4.88-4.93-.65-2.32-.14-4.98 1.39-6.91 1.53-1.93 3.94-3.03 6.36-3.08 0 1.26 0 2.52.01 3.79-1.31.02-2.66.45-3.64 1.34-1 1-1.47 2.45-1.25 3.84.21 1.39 1.18 2.65 2.47 3.2 1.29.55 2.85.42 4.02-.35 1.17-.77 1.88-2.14 1.95-3.53.05-5.11.01-10.21.01-15.31z" /> }
];

export default async function RootLayout({ children }) {
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

                <footer className="bg-black py-20 px-4 border-t border-white/5">
                    <div className="max-w-4xl mx-auto flex flex-col items-center">
                        {/* ヘッダーと同一のSNSアイコンを配置 */}
                        <div className="flex gap-8 mb-10">
                            {footerSnsLinks.map((sns) => (
                                <a key={sns.name} href={sns.url} target="_blank" rel="noopener noreferrer" className="w-5 h-5 fill-current opacity-40 hover:opacity-100 transition-all">
                                    <svg viewBox="0 0 24 24" className="w-full h-full overflow-visible">
                                        {sns.icon}
                                    </svg>
                                </a>
                            ))}
                        </div>
                        
                        <p className="text-gray-600 text-[10px] tracking-widest uppercase text-center">
                            © {new Date().getFullYear()} ashroom
                        </p>
                    </div>
                </footer>
            </body>
        </html>
    );
}
