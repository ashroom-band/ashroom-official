import { client } from '../../lib/microcms';

export default async function ProfilePage() {
    const data = await client.get({
        endpoint: 'profile',
        customRequestInit: { cache: 'no-store' },
    });

    return (
        <main className="min-h-screen bg-black text-white p-10 font-mono text-xs">
            <h1 className="text-xl font-bold text-red-500 mb-4">【microCMS 生データ確認】</h1>
            <p className="mb-4">以下の文字の中に、あなたが入力したバンド名や画像URLが含まれているか探してください：</p>
            <pre className="bg-zinc-900 p-6 border border-zinc-700 overflow-auto max-h-[80vh]">
                {JSON.stringify(data, null, 2)}
            </pre>
        </main>
    );
}
