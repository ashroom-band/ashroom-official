import './globals.css';
import { siteConfig } from '../data/ashroomConfig';
import { client } from '../lib/microcms';
import Header from '../components/Header';
import { FaTwitter, FaInstagram, FaYoutube, FaApple, FaSpotify } from 'react-icons/fa';

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
                        {/* ヘッダーのメニューと同様のSNS種類とアイコン構成 */}
                        <div className="flex space-x-8 mb-10 text-xl opacity-50">
                            <a href="https://x.com/ashroom_band" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity">
                                <FaTwitter />
                            </a>
                            <a href="https://www.instagram.com/ashroom_band" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity">
                                <FaInstagram />
                            </a>
                            <a href="https://www.youtube.com/@ashroom-band" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity">
                                <FaYoutube />
                            </a>
                            <a href="https://music.apple.com/jp/artist/ashroom/1753733519" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity">
                                <FaApple />
                            </a>
                            <a href="https://open.spotify.com/artist/YOUR_ID" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity">
                                <FaSpotify />
                            </a>
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
