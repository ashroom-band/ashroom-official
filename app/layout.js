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
            <body className="bg-[#0a0a0a] font-sans text-white antialiased flex flex-col min-h-screen">
                <Header profile={profile} />

                <main id="top" className="flex-grow"> 
                    {children}
                </main>

                <footer className="bg-black py-20 px-4 border-t border-white/5">
                    <div className="max-w-4xl mx-auto flex flex-col items-center">
                        {/* SNS Icons */}
                        <div className="flex space-x-10 mb-10">
                            <a href="https://x.com/ashroom_band" target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100 transition-opacity">
                                <span className="text-xs tracking-[0.2em] font-bold uppercase">X (Twitter)</span>
                            </a>
                            <a href="https://www.instagram.com/ashroom_band" target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100 transition-opacity">
                                <span className="text-xs tracking-[0.2em] font-bold uppercase">Instagram</span>
                            </a>
                            <a href="https://www.youtube.com/@ashroom-band" target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100 transition-opacity">
                                <span className="text-xs tracking-[0.2em] font-bold uppercase">YouTube</span>
                            </a>
                            <a href="https://music.apple.com/jp/artist/ashroom/1753733519" target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100 transition-opacity">
                                <span className="text-xs tracking-[0.2em] font-bold uppercase">Apple Music</span>
                            </a>
                            <a href="https://open.spotify.com/intl-ja/artist/2L7Yw8TAnq03X4j37y37lY" target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100 transition-opacity">
                                <span className="text-xs tracking-[0.2em] font-bold uppercase">Spotify</span>
                            </a>
                        </div>
                        
                        <p className="text-gray-600 text-[10px] tracking-widest uppercase text-center">
                            &copy; {new Date().getFullYear()} ashroom
                        </p>
                    </div>
                </footer>
            </body>
        </html>
    );
}
