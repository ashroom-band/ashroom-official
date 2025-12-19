import { client } from '../../lib/microcms';

export default async function ProfilePage() {
    const data = await client.get({
        endpoint: 'profile',
        customRequestInit: { cache: 'no-store' },
    });

    return (
        <main className="min-h-screen bg-black text-white p-10 font-mono text-[10px] leading-relaxed">
            <h1 className="text-xl font-bold text-red-500 mb-4 uppercase tracking-widest">
                Raw Data Diagnosis
            </h1>
            <p className="mb-6 text-gray-400">
                この下に表示されている文字をコピーして教えていただくか、<br />
                "artist_photo" という文字のあとに "url" が続いている部分があるか確認してください。
            </p>
            
            <div className="bg-zinc-900 p-6 border border-zinc-800 rounded-lg overflow-auto">
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
        </main>
    );
}
