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
            <body className="bg-[#0a0a0a] font-sans text-white antialiased">
                <Header profile={profile} />

                {/* ヘッダーの高さ分、少し上部マージンを調整 */}
                <main id="top" className="min-h-screen"> 
                    {children}
                </main>

                <footer className="bg-black py-16 px-4 border-t border-white/5">
                    <div className="max-w-4xl mx-auto flex flex-col items-center">
                        <p className="text-gray-600 text-[10px] tracking-widest uppercase text-center">
                            &copy; {new Date().getFullYear()} ashroom
                        </p>
                    </div>
                </footer>
            </body>
        </html>
    );
}
