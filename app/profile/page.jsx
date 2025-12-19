import { client } from '../../lib/microcms';

// Vercelのビルドエラーを回避し、常に最新のデータを取得するための設定
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProfilePage() {
    let data = null;
    let errorInfo = null;

    try {
        data = await client.get({
            endpoint: 'profile',
        });
    } catch (e) {
        errorInfo = e.message;
    }

    return (
        <main className="min-h-screen bg-black text-white p-10 font-mono text-[11px] leading-relaxed">
            <h1 className="text-xl font-bold text-red-500 mb-4 uppercase tracking-widest">
                Data Connection Diagnosis
            </h1>
            
            {errorInfo ? (
                <div className="bg-red-900/20 border border-red-500 p-6 rounded-lg mb-6">
                    <p className="font-bold text-red-500">API接続エラーが発生しました:</p>
                    <pre className="mt-2 text-red-300">{errorInfo}</pre>
                </div>
            ) : (
                <div className="mb-6">
                    <p className="text-green-500 font-bold mb-2">✓ microCMSとの接続に成功しました。</p>
                    <p className="text-gray-400 mb-4">
                        以下のデータが現在届いています。特に "artist_photo" などのキー名が正しいか確認してください。
                    </p>
                    
                    <div className="bg-zinc-900 p-6 border border-zinc-800 rounded-lg overflow-auto">
                        <pre>{JSON.stringify(data, null, 2)}</pre>
                    </div>
                </div>
            )}

            <div className="mt-10 p-4 border border-white/10 text-gray-500">
                <p>※この画面が表示されている間は、通常のデザインは表示されません。</p>
                <p>※データが空（ {} ）の場合は、microCMS側で「公開」ボタンが押されているか確認してください。</p>
            </div>
        </main>
    );
}
