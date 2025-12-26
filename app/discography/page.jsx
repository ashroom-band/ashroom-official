import Link from 'next/link';
import { client } from '../../lib/microcms';

export const revalidate = 86400;

async function getDiscography() {
  const data = await client.get({
    endpoint: 'discography',
    queries: { orders: '-release_date' }
  });
  return data.contents;
}

export default async function DiscographyPage() {
  const disco = await getDiscography();

  return (
    <main className="bg-[#0a0a0a] text-white min-h-screen pb-32">
      {/* pt-40 でヘッダーとの被りを回避 */}
      <section className="px-4 max-w-[1400px] mx-auto pt-40 w-[90%] md:w-[80%]">
        {/* SCHEDULE と同様の中央寄せ・サイズ調整 */}
        <h1 className="text-5xl font-bold mb-20 tracking-widest uppercase shippori-mincho text-center">DISCOGRAPHY</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
          {disco.map((item) => (
            <div key={item.id} className="group">
              <div className="aspect-square bg-white/5 mb-8 shadow-2xl overflow-hidden relative">
                {item.jacket?.url ? (
                  <img
                    src={item.jacket.url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20 text-xs tracking-widest uppercase font-sans">No Image</div>
                )}
                
                {item.link && (
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  >
                    <span className="px-6 py-2 border border-white text-[10px] tracking-widest font-bold">LISTEN / BUY</span>
                  </a>
                )}
              </div>

              <div className="space-y-3">
                <p className="text-[10px] tracking-[0.3em] text-white/40 font-mono uppercase">
                  {item.release_date ? item.release_date.replace(/-/g, '.') : 'TBA'} {item.type && `| ${item.type}`}
                </p>
                <h2 className="text-2xl font-bold tracking-tight leading-tight group-hover:text-white/70 transition-colors">
                  {item.title}
                </h2>
                {item.description && (
                  <p className="text-xs text-white/50 leading-loose line-clamp-3">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-40 text-center">
          <Link href="/" className="text-xs tracking-[0.4em] text-white/40 hover:text-white transition-colors border-b border-white/10 pb-2 uppercase">
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
