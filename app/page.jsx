// --- app/page.jsx の return 内 Hero Section 周辺 ---
<div id="top" className="bg-[#0a0a0a] min-h-screen text-white scroll-smooth">
    {/* 重複する nav は削除しました */}

    {/* --- HERO SECTION --- */}
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
            {profile?.artist_photo?.url && (
                <img 
                    src={profile.artist_photo.url} 
                    alt="ashroom" 
                    className="w-full h-full object-cover grayscale-[20%]" 
                />
            )}
            <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 text-center px-4 w-full">
            {profile?.tagline && (
                <h1 className="text-xl md:text-3xl font-bold tracking-tight text-white/95 shippori-mincho italic drop-shadow-[0_0_15px_rgba(0,0,0,0.7)] whitespace-nowrap">
                    {profile.tagline}
                </h1>
            )}
        </div>
    </section>
    {/* 以降、NEWSセクションなどはそのまま */}
</div>
