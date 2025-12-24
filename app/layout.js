// ... (上部のインポートはそのまま)

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
                        {/* 修正：ここに以前あった <p>（コピーライト）を完全に削除しました */}
                    </div>
                </footer>
            </body>
        </html>
    );
}
