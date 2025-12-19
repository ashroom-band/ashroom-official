import { client } from '../../lib/microcms';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const PageTitle = ({ title }) => (
    <div className="pt-24 pb-12 border-b border-white/5 mb-16 text-center">
        <h1 className="text-4xl font-bold text-white tracking-tight uppercase shippori-mincho">{title}</h1>
    </div>
);

async function getProfile() {
    try {
        const data = await client.get({
            endpoint: 'profile',
        });
        return data.contents[0];
    } catch (error) {
        console.error("microCMS Fetch Error:", error);
        return null;
    }
}

export default async function ProfilePage() {
    const profile = await getProfile();

    if (!profile) {
        return (
            <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
                <p className="opacity-50 tracking-widest uppercase">Profile Not Found</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white pb-24">
            <div className="max-w-7xl mx-auto px-4"> {/* 横幅を少し広げました */}
                <PageTitle title="PROFILE" />
                
                <div className="mb-32 text-center max-w-5xl mx-auto">
                    {/* アーティストフォト */}
                    <div className="mb-20 flex justify-center">
                        <div className="w-full max-w-4xl overflow-hidden rounded-sm shadow-2xl border border-white/5">
                            {profile.artist_photo?.url && (
                                <img 
                                    src={profile.artist_photo.url} 
                                    alt="Artist Photo" 
                                    className="w-full h-auto object-cover"
                                />
                            )}
                        </div>
                    </div>

                    {/* バンドロゴ */}
                    <div className="mb-16 flex justify-center">
                        {profile.band_logo?.url ? (
                            <img 
                                src={profile.band_logo.url} 
                                alt={profile.band_name} 
                                className="h-48 md:h-64 w-auto object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
                            />
                        ) : (
                            <h2 className="text-6xl md:text-8xl font-bold text-white tracking-tighter uppercase">
                                {profile.band_name}
                            </h2>
                        )}
                    </div>

                    {profile.tagline && (
                        <p className="text-2xl md:text-3xl font-bold mb-10 text-white font-shippori italic tracking-tight leading-tight"> 
                            {profile.tagline}
                        </p>
                    )}
                    
                    {profile.description && (
                        <p className="text-base font-light text-gray-200 leading-relaxed tracking-tight whitespace-pre-wrap max-w-3xl mx-auto">
                            {profile.description}
                        </p>
                    )}
                </div>

                {/* メンバーリスト：PCで横一列 (lg:grid-cols-5) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-4 gap-y-20">
                    {profile.members?.map((member, index) => {
                        const instrumentText = Array.isArray(member.instrument) 
                            ? member.instrument.join(' / ') 
                            : member.instrument;

                        return (
                            <div key={index} className="flex flex-col items-center text-center group">
                                
                                {/* 写真サイズ：初期(w-32)より大きく、5列に収まる w-44 (176px) */}
                                <div className="w-48 h-48 sm:w-40 sm:h-40 lg:w-44 lg:h-44 mb-8 relative">
                                    <div className="w-full h-full bg-zinc-900 rounded-full border border-white/10 flex items-center justify-center overflow-hidden shadow-xl transition-all duration-500 group-hover:border-white/40 group-hover:scale-105">
                                        {member.image?.url ? (
                                            <img 
                                                src={member.image.url} 
                                                alt={member.name} 
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                            />
                                        ) : (
                                            <span className="text-gray-500 font-bold text-[10px] tracking-widest uppercase">
                                                {instrumentText}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4 w-full">
                                    <div>
                                        <h3 className="text-xl font-bold text-white tracking-tight mb-1">{member.name}</h3>
                                        <p className="text-[10px] font-bold text-white uppercase tracking-[0.2em] opacity-60">
                                            {instrumentText}
                                        </p>
                                    </div>

                                    {member.influences && (
                                        <div className="pt-2">
                                            <p className="text-[11px] text-gray-500 tracking-wider font-bold mb-2 uppercase">Influences</p>
                                            <ul className="space-y-0.5">
                                                {member.influences.split('\n').map((artist, i) => (
                                                    <li key={i} className="text-[12px] text-gray-300 font-normal tracking-tight">
                                                        {artist}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {member.instagram_url && (
                                        <div className="pt-4 opacity-40 group-hover:opacity-100 transition-opacity">
                                            <a 
                                                href={member.instagram_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="inline-block text-white hover:scale-110 transition-transform"
                                            >
                                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                                </svg>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
