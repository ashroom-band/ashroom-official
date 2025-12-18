// app/contact/page.jsx

import { siteConfig } from '../../data/ashroomConfig';

// 共通コンポーネント定義
const PageTitle = ({ title }) => (
    <div className="pt-16 pb-8 border-b border-gray-700 mb-10 text-center">
        <h2 className="text-4xl font-extrabold text-white tracking-widest">{title}</h2>
    </div>
);

export default function ContactPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-8 text-center">
            <PageTitle title="CONTACT" />
            
            <p className="text-lg text-gray-300 mb-10 leading-relaxed">
                ライブ出演、取材、その他のお問い合わせにつきましては、以下のメールアドレスにご連絡ください。
            </p>

            <div className="bg-gray-900 p-8 rounded-lg shadow-xl inline-block">
                <h3 className="text-2xl font-bold text-ash-accent mb-2">E-mail Address</h3>
                <p className="text-3xl text-white font-mono break-all">
                    {siteConfig.contactEmail}
                </p>
                <a 
                    href={`mailto:${siteConfig.contactEmail}`} 
                    className="mt-6 inline-block bg-ash-accent text-dark-bg font-bold py-3 px-8 rounded hover:bg-ash-accent/80 transition-colors"
                >
                    メールを送る
                </a>
            </div>

            <div className="mt-16 text-gray-500 text-sm">
                ※ ファンレターやプレゼントの送り先については、改めて告知いたします。
            </div>
        </div>
    );
}