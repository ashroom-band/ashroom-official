// data/ashroomConfig.js

// A. サイト全体の基本設定
export const siteConfig = {
    siteTitle: "ashroom Official Web Site",
    tagline: "NEO VIBES & GROOVE from CHIBA",
    description: "千葉出身、東京を拠点に活動する5人組ミクスチャーロックバンド。 ファンク／シティポップ／ロックをクロスオーバーしたサウンドに、都会的で遊び心のある世界観を乗せている。 2025年11月には3rd Single「OVERDRIVE」をリリース。ライブハウスシーンを中心に、エネルギッシュかつ多彩な演奏で精力的に活動中。",
    contactEmail: "ashroom.official@gmail.com",
};

// B. SNSリンク情報
export const snsLinks = [
    { name: "YouTube", icon: "fab fa-youtube", url: "https://youtube.com/@ashroom_official?si=Cki4y0pGSwvoN_I9" },
    { name: "X (Twitter)", icon: "fab fa-twitter", url: "https://x.com/ashroom_band?s=21" },
    { name: "Instagram", icon: "fab fa-instagram", url: "https://www.instagram.com/ashroom_official" },
    { name: "TikTok", icon: "fab fa-tiktok", url: "https://www.tiktok.com/@ashroom__official?_r=1&_d=ej2ehffhf24ej5&sec_uid=MS4wLjABAAAAJl8NN441LMwOxXMyf345x5viJ70PiOMx6HJPK4rAWzMuT5uuhGSPwIBo9tyRZV_v&share_author_id=7475405113919849473&sharer_language=ja&source=h5_t&u_code=ej2ei2467k4dcc&item_author_type=1&utm_source=copy&tt_from=copy&enable_checksum=1&utm_medium=ios&share_link_id=D2261F6C-01DB-4CC7-B053-7A980385B408&user_id=7475405113919849473&sec_user_id=MS4wLjABAAAAJl8NN441LMwOxXMyf345x5viJ70PiOMx6HJPK4rAWzMuT5uuhGSPwIBo9tyRZV_v&social_share_type=4&ug_btm=b8727,b0&utm_campaign=client_share&share_app_id=1180" },
];

// C. ニュース情報 (最新のものから順に記述)
export const latestNews = [
    { 
        date: "2026.01.05", 
        title: "ashroom主催企画ライブ「Groove Circuit vol.1」開催決定！", 
        link: "#" 
    },
    { 
        date: "2025.12.20", 
        title: "3rd Digital Single「OVERDRIVE」Music Video公開！", 
        link: "https://www.youtube.com/watch?v=F38b2k0r8L8" 
    },
    { 
        date: "2025.12.01", 
        title: "3rd Digital Single「OVERDRIVE」配信スタート！", 
        link: "#" 
    },
    { 
        date: "2025.11.10", 
        title: "Official Goods Storeをオープンしました。", 
        link: "#" 
    },
];

// D. YouTube動画ID (最新のものから順に記述)
// Home/Videoページで使用
export const videoIds = [
    "aikXhG1JVXs", 
    "CQsl4VSx9zQ", 
    "pbx3vUJC7Gs", 
];

// E. 最新ディスコグラフィー情報
export const discography = [
  {
    id: 1,
    title: "Odd Radio",
    type: "Digital Single",
    releaseDate: "2025.07.15",
    jacket: "/oddradio-jacket.jpg", // publicフォルダ内の画像パス
    link: "https://linkco.re/20XHvfaY" // LinkCoreのURL
  },
   {
    id: 2,
    title: "R.I.B.",
    type: "Digital Single",
    releaseDate: "2025.10.29",
    jacket: "/rib-jacket.jpg", // publicフォルダ内の画像パス
    link: "https://linkco.re/fPsx7S1a" // LinkCoreのURL
  },
   {
    id: 3,
    title: "OVERDRIVE",
    type: "Digital Single",
    releaseDate: "2025.11.23",
    jacket: "/overdrive-jacket.jpg", // publicフォルダ内の画像パス
    link: "https://linkco.re/tY9U5U6s" // LinkCoreのURL
  },
];


// F. メンバープロフィール情報
// PROFILEページで使用
export const members = [
    {
        name: "Nasjun",
        instrument: "Vocal/Guiter",
        // 影響を受けたアーティストを3つ配列で入れる
        influences: [
            "Bruno Mars",
            "藤井風",
            "Official髭男dism"
        ],
        // SNS情報をオブジェクト形式で入れる
        sns: {
            instagram: "https://www.instagram.com/nasjun_ashroom/", 
        },
    },
    { 
        name: "Ryo", 
        instrument: "Guitar", 
        // 影響を受けたアーティストを3つ配列で入れる
        influences: [
            "TAIKING",
            "長岡亮介",
            "John Mayer"
        ],
        // SNS情報をオブジェクト形式で入れる
        sns: {
            instagram: "https://www.instagram.com/jinsei_31500/", 
        },
    },
    {
        name: "Hisa",
        instrument: "Bass",
        // 影響を受けたアーティストを3つ配列で入れる
        influences: [
            "Red Hot Chilli Peppers",
            "grasanpark",
            "Tempalay"
        ],
        // SNS情報をオブジェクト形式で入れる
        sns: {
            instagram: "https://www.instagram.com/hisa_ashroom/", 
        },
    },
    { 
        name: "Neo", 
        instrument: "Keyboard", 
        influences: [
            "LAGHEADS",
            "Kroi",
            "marasy"
        ],
        // SNS情報をオブジェクト形式で入れる
        sns: {
            instagram: "https://www.instagram.com/neo_ashroom/", 
        },
    },
    { 
        name: "Kylie", 
        instrument: "Drums", 
        influences: [
            "ONE OK ROCK",
            "Panic! at the Disco",
            "Rage Against the Machine"
        ],
        // SNS情報をオブジェクト形式で入れる
        sns: {
            instagram: "https://www.instagram.com/kylie_ashroom/", 
        },
    },
];

export const schedules = [
    // 【今後の出演予定】
    {
        id: '20250116',
        date: '2025.01.16',
        dayOfWeek: 'FRI',
        title: 'The Playlist',
        venue: '赤坂navey floor',
        open: '18:30',
        start: '19:00',
        ticket: '¥2,500 (+1D)',
        link: 'https://tiget.net/events/450981', // チケット予約URLなど
        flyer: '/banner-live-1.jpg',
        status: 'upcoming'
    },
    {
        id: '20250203',
        date: '2025.02.03',
        dayOfWeek: 'THU',
        title: 'SOUND CONNECT vol.2',
        venue: '下北沢ReG',
        open: '17:00',
        start: '17:30',
        ticket: '¥2,000 (+1D)',
        link: '#',
        flyer: '/banner-live-2.jpg',
        status: 'upcoming'
    },
    // 【過去の履歴 - 例】
    {
        id: '20241122',
        date: '2024.11.22',
        dayOfWeek: 'SAT',
        title: 'exhibit',
        venue: '大宮ヒソミネ',
        status: 'past'
    }
];