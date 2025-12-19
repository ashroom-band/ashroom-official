import { client } from '../../lib/microcms';

const PageTitle = ({ title }) => (
    <div className="pt-24 pb-12 border-b border-white/5 mb-16 text-center">
        <h1 className="text-4xl font-bold text-white tracking-tight uppercase shippori-mincho">{title}</h1>
    </div>
);

async function getProfile() {
    try {
        const data = await client.get({
            endpoint: 'profile',
            customRequestInit: {
                cache: 'no-store', // 常に最新を取得
            },
        });
        return data;
    } catch (error) {
        console.error("microCMS Fetch Error:", error);
        return null;
    }
}

export default async function ProfilePage() {
    const profile = await getProfile();

    // --- デバッグエリア：もしデータが空に見える場合はここが表示されます ---
    if (!profile || Object.keys(profile).length <= 3) { // id, createdAt, updatedAt 以外のキーがあるか
        return (
            <main className="min-h-screen bg-[#0a0a0a] text-white p-20">
                <h2 className="text-red-500 font-bold mb-4">【デバッグ情報】データ構造に問題があります</h2>
                <p className="text-sm mb-8">microCMSから届いたデータのキー一覧:</p>
                <pre className="bg-white/10 p-4 rounded text-xs overflow-auto">
                    {profile ? JSON.stringify(Object.keys(profile), null, 2) : "データ自体が取得できていません"}
                </pre>
                <p className="mt-8 text-sm text-gray-400">
                    ※ここに artist_photo や band_name が表示されていない場合、microCMSの[API設定]＞[APIスキーマ]の「フィールドID」が間違っています。
                </p>
            </main>
        );
    }
    // ------------------------------------------------------------------

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white pb-24">
            <div className="max-w-6xl mx-auto px-4">
                <PageTitle title="PROFILE" />
                
                <div className="mb-32 text-center max-w-4xl mx-auto">
                    {/* アーティストフォト */}
                    <div className="mb-12 flex justify-center">
                        <div className="w-full max-w-3xl overflow-hidden rounded-sm shadow-2xl border border-white/5">
                            {profile.artist_photo?.url ? (
                                <img 
                                    src={profile.artist_photo.url} 
                                    alt="Artist Photo" 
                                    className="w-full h-auto object-cover opacity-100"
                                />
                            ) : (
                                <div className="w-full aspect-video bg-white/5 flex items-center justify-center text-xs tracking-widest text-white/20">
                                    NO ARTIST PHOTO (Key: artist_photo)
                                </div>
                            )}
                        </div>
                    </div>

                    {/* バンドロゴ / バンド名 */}
                    <div className="mb-8 flex justify-center">
                        {profile.band_logo?.url ? (
                            <img 
                                src={profile.band_logo.url} 
                                alt={profile.band_name || "ashroom"} 
                                className="h-20 md:h-32 w-auto object-contain" 
                            />
                        ) : (
                            <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter uppercase">
                                {profile.band_name || "NO BAND NAME SET"}
                            </h2>
                        )}
                    </div>

                    {profile.tagline && (
                        <p className="text-2xl md:text-4xl font-bold mb-10 text-white font-shippori italic tracking-tight leading-tight"> 
                            {profile.tagline}
                        </p>
                    )}
                    
                    {profile.description && (
                        <p className="text-base md:text-lg font-light text-gray-200 leading-relaxed tracking-tight whitespace-pre-wrap">
                            {profile.description}
                        </p>
                    )}
                </div>

                {/* メンバーリスト */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-20">
                    {profile.members?.map((item, index) => {
                        // 繰り返しフィールドの場合、データが item.members[0] のような階層になることがあるため
                        // microCMSのカスタムフィールド設定に合わせて調整が必要な場合があります
                        return (
                            <div key={index} className="flex flex-col items-center text-center group">
                                <div className="w-32 h-32 mb-8 relative">
                                    <div className="w-full h-full bg-gray-900 rounded-full border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl transition-colors duration-500 group-hover:border-white/40">
                                        {item.image?.url ? (
                                            <img src={item.image.url} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-gray-500 font-bold text-[10px] tracking-widest uppercase">
                                                {item.instrument || 'MEMBER'}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4 w-full">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white tracking-tight mb-1">{item.name}</h3>
                                        <p className="text-[11px] font-bold text-white uppercase tracking-[0.2em] opacity-60">{item.instrument}</p>
                                    </div>
                                    {item.influences && (
                                        <div className="pt-2">
                                            <p className="text-[12px] text-gray-400 tracking-wider font-bold mb-3 uppercase">Influences</p>
                                            <ul className="space-y-1">
                                                {item.influences.split('\n').map((artist, i) => (
                                                    <li key={i} className="text-[13px] text-gray-200 font-normal tracking-tight">{artist}</li>
                                                ))}
                                            </ul>
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
