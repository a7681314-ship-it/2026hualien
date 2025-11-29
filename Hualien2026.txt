import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  CloudSun, 
  Coffee, 
  BedDouble, 
  Car, 
  Info, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Sun,
  Moon,
  Umbrella,
  BookOpen
} from 'lucide-react';

// --- Data & Configuration ---

const TRIP_DATA = {
  title: "湘琴的療癒之旅",
  dates: "2025.12.30 - 2026.01.01",
  accommodation: {
    name: "煙波花蓮太魯閣 - 沁海館",
    address: "花蓮縣新城鄉順安村草林10之6號",
    phone: "03-861-2000",
    checkIn: "15:00",
    checkOut: "11:00",
    notes: "沁海館擁有無邊際泳池，記得攜帶泳衣。飯店停車場位於地下室，可直達大廳。",
    mapQuery: "煙波花蓮太魯閣"
  },
  transport_tips: [
    "蘇花改（台9線）全線速限約 50-70 km/h，區間測速多，請開啟定速。",
    "連假期間，南下（去程）易壅塞時段為清晨 5:00-7:00；北上（回程）為下午 13:00-17:00。",
    "長途駕駛建議每 2 小時休息一次，蘇澳服務區與台泥 DAKA 園區是不錯的休息點。",
    "回程請務必於 15:00 前出發，以免卡在雪隧。"
  ]
};

const ITINERARY = [
  {
    day: 1,
    date: "12/30 (二)",
    weather: { icon: "CloudSun", temp: "18°C", desc: "舒適多雲" },
    events: [
      {
        time: "14:00",
        title: "台北雙連捷運站 出發",
        type: "transport",
        location: "台北市大同區雙連捷運站",
        desc: "準時出發，開啟美好旅程。沿國道五號經雪隧，轉蘇花改。",
        guide: "出發前檢查胎壓與油量。雙連附近若需補給，可先至超商購買咖啡與零食。",
        mapQuery: "雙連捷運站"
      },
      {
        time: "16:30",
        title: "蘇澳服務區 / 東澳",
        type: "rest",
        location: "蘇澳服務區",
        desc: "中途休息，伸展筋骨，上廁所。",
        guide: "蘇澳服務區外型像一艘大船，二樓有觀景台。這裡的廁所非常乾淨，是進入蘇花改前的最後大補給站。",
        mapQuery: "蘇澳服務區"
      },
      {
        time: "19:00",
        title: "抵達 煙波太魯閣",
        type: "stay",
        location: "煙波花蓮太魯閣 沁海館",
        desc: "辦理入住，卸下行李與疲憊。",
        guide: "沁海館是煙波集團中較新的館別，主打山海交會的景致。大廳設計採用大量落地窗，即便晚上也能感受空間的通透感。",
        mapQuery: "煙波花蓮太魯閣"
      },
      {
        time: "19:30",
        title: "晚餐：漫饗食堂",
        type: "food",
        location: "煙波花蓮太魯閣 漫饗食堂",
        desc: "享用飯店精緻海陸料理，不用奔波。",
        guide: "漫饗食堂主打在地食材，推薦嘗試他們的「花蓮曼波魚」料理或原住民風味野菜。",
        mapQuery: "煙波花蓮太魯閣 漫饗食堂"
      },
      {
        time: "21:00",
        title: "設施體驗：水療與泳池",
        type: "activity",
        location: "沁海館 2F",
        desc: "無邊際泳池、溫水池、烤箱。",
        guide: "晚上的無邊際泳池雖然看不到海，但打光後的氛圍非常浪漫，且人潮通常比白天少，適合拍照與放鬆。",
        mapQuery: "煙波花蓮太魯閣"
      }
    ]
  },
  {
    day: 2,
    date: "12/31 (三)",
    weather: { icon: "Sun", temp: "21°C", desc: "晴朗溫暖" },
    events: [
      {
        time: "08:30",
        title: "慢活早午餐",
        type: "food",
        location: "漫饗食堂",
        desc: "睡到自然醒，享受煙波著名的 Buffet。",
        guide: "煙波的早餐素有口碑，營業時間較長，建議可以慢慢吃。必吃「牧羊人派」或現煮的「海鮮粥」。",
        mapQuery: "煙波花蓮太魯閣"
      },
      {
        time: "10:30",
        title: "曼波海灘 散策",
        type: "sight",
        location: "曼波海灘",
        desc: "步行 5 分鐘即達，花蓮的天空之鏡。",
        guide: "這裡不同於七星潭，人潮較少。海灘上有許多疊石藝術，適合拍攝日系清新風格的照片。建議脫鞋感受圓潤的礫石。",
        mapQuery: "曼波海灘"
      },
      {
        time: "13:00",
        title: "新城文青午茶",
        type: "food",
        location: "練習曲書店 / 新城老街",
        desc: "車程約 10 分鐘，感受老屋新生的魅力。",
        guide: "「練習曲書店」只借不賣書，是棒球教練為了偏鄉孩子開的。旁邊的「佳興冰果室」檸檬汁是必買伴手禮，連皮打汁特別香。",
        mapQuery: "練習曲書店"
      },
      {
        time: "16:00",
        title: "飯店發呆亭 / 陽台",
        type: "activity",
        location: "沁海館",
        desc: "回飯店休息，享受午後寧靜。",
        guide: "旅行不一定要填滿行程。在房間陽台泡杯茶，看著太平洋發呆，是最高級的享受。",
        mapQuery: "煙波花蓮太魯閣"
      },
      {
        time: "22:00",
        title: "溫馨跨年夜",
        type: "stay",
        location: "客房內 / 戶外平台",
        desc: "告別 2025，迎接 2026。",
        guide: "太魯閣地區光害較少，天氣好的話，抬頭就能看到滿天星斗。兩個人靜靜地倒數，比人擠人的演唱會更溫馨。",
        mapQuery: "煙波花蓮太魯閣"
      }
    ]
  },
  {
    day: 3,
    date: "01/01 (四)",
    weather: { icon: "CloudSun", temp: "19°C", desc: "多雲轉陰" },
    events: [
      {
        time: "09:00",
        title: "新年早餐",
        type: "food",
        location: "漫饗食堂",
        desc: "2026年的第一餐，吃飽喝足。",
        guide: "把握最後的度假時光，可以再去泳池畔拍幾張白天的海景照。",
        mapQuery: "煙波花蓮太魯閣"
      },
      {
        time: "12:00",
        title: "退房 / 啟程",
        type: "transport",
        location: "煙波花蓮太魯閣",
        desc: "辦理退房，準備午餐後返程。",
        guide: "記得檢查充電器、衣物是否遺落在房間。離開前可至櫃檯拿幾顆迎賓糖果。",
        mapQuery: "煙波花蓮太魯閣"
      },
      {
        time: "15:00",
        title: "全速返程",
        type: "transport",
        location: "蘇花改北上",
        desc: "務必於 15:00 前出發，避開最塞時段。",
        guide: "回程若精神不濟，建議在台泥 DAKA 園區稍作停留。進入雪隧前請將油箱加滿。",
        mapQuery: "台泥DAKA園區"
      },
      {
        time: "19:00",
        title: "抵達 土城",
        type: "home",
        location: "土城台北新貴社區",
        desc: "平安抵達，旅程圓滿結束。",
        guide: "辛苦了！回到家後先熱敷眼睛，消除駕駛疲勞。",
        mapQuery: "土城台北新貴社區"
      }
    ]
  }
];

// --- Components ---

const WeatherWidget = ({ weather }) => {
  const icons = {
    Sun: <Sun className="w-5 h-5 text-amber-500" />,
    CloudSun: <CloudSun className="w-5 h-5 text-amber-500" />,
    Moon: <Moon className="w-5 h-5 text-indigo-400" />,
    Umbrella: <Umbrella className="w-5 h-5 text-blue-400" />
  };

  return (
    <div className="flex items-center gap-2 bg-stone-100/50 px-3 py-1.5 rounded-full border border-stone-200 shadow-sm backdrop-blur-sm">
      {icons[weather.icon] || icons.CloudSun}
      <span className="text-sm font-medium text-stone-600">{weather.temp}</span>
      <span className="text-xs text-stone-400 border-l border-stone-300 pl-2 ml-1">{weather.desc}</span>
    </div>
  );
};

const EventCard = ({ event }) => {
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const getIcon = (type) => {
    switch (type) {
      case 'transport': return <Car className="w-4 h-4" />;
      case 'food': return <Coffee className="w-4 h-4" />;
      case 'stay': return <BedDouble className="w-4 h-4" />;
      case 'sight': return <MapPin className="w-4 h-4" />;
      case 'home': return <Navigation className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'transport': return 'bg-stone-200 text-stone-600';
      case 'food': return 'bg-orange-100 text-orange-600';
      case 'stay': return 'bg-indigo-50 text-indigo-600';
      case 'sight': return 'bg-emerald-50 text-emerald-600';
      case 'home': return 'bg-stone-800 text-stone-100';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const handleNavigate = () => {
    const query = encodeURIComponent(event.mapQuery || event.location);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="relative pl-6 pb-8 last:pb-0 border-l border-stone-200 ml-4">
      {/* Timeline Dot */}
      <div className={`absolute -left-2 top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${getTypeColor(event.type)} flex items-center justify-center`}>
        {/* Simple dot or tiny icon inside */}
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 transition-all active:scale-[0.99] hover:shadow-md">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-wider text-stone-400 bg-stone-50 px-2 py-1 rounded-md">
              {event.time}
            </span>
            <span className={`p-1 rounded-full ${getTypeColor(event.type)}`}>
              {getIcon(event.type)}
            </span>
          </div>
          <button 
            onClick={handleNavigate}
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
          >
            <Navigation className="w-3 h-3" />
            導航
          </button>
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold text-stone-800 mb-1">{event.title}</h3>
        <p className="text-sm text-stone-500 mb-3 leading-relaxed">{event.desc}</p>

        {/* Guide Toggle */}
        {event.guide && (
          <div className="mt-3">
            <button 
              onClick={() => setIsGuideOpen(!isGuideOpen)}
              className="flex items-center gap-1 text-xs text-stone-400 hover:text-stone-600 transition-colors w-full"
            >
              <BookOpen className="w-3 h-3" />
              <span>{isGuideOpen ? '收起景點故事' : '查看景點故事'}</span>
              {isGuideOpen ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />}
            </button>
            
            {isGuideOpen && (
              <div className="mt-2 p-3 bg-stone-50 rounded-xl text-xs text-stone-600 leading-relaxed border border-stone-100 animate-in fade-in slide-in-from-top-1">
                <span className="font-bold text-stone-400 block mb-1">INFO</span>
                {event.guide}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const InfoSection = ({ data }) => (
  <div className="space-y-6 px-4 pb-24 animate-in fade-in">
    {/* Hotel Card */}
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
          <BedDouble className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-stone-800">住宿資訊</h3>
          <p className="text-xs text-stone-400">入住兩晚</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="block">
          <p className="text-sm font-semibold text-stone-800">{data.accommodation.name}</p>
          <p className="text-xs text-stone-500 mt-0.5">{data.accommodation.address}</p>
        </div>
        <div className="flex justify-between text-sm border-t border-stone-100 pt-3">
          <div className="text-center w-1/2 border-r border-stone-100">
            <span className="block text-xs text-stone-400">Check-in</span>
            <span className="font-bold text-stone-700">{data.accommodation.checkIn}</span>
          </div>
          <div className="text-center w-1/2">
            <span className="block text-xs text-stone-400">Check-out</span>
            <span className="font-bold text-stone-700">{data.accommodation.checkOut}</span>
          </div>
        </div>
        <div className="bg-stone-50 p-3 rounded-xl text-xs text-stone-600 mt-2">
          {data.accommodation.notes}
        </div>
        <button 
          onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.accommodation.address)}`)}
          className="w-full py-3 bg-stone-800 text-white text-sm font-medium rounded-xl mt-2 active:bg-stone-700"
        >
          導航至飯店
        </button>
      </div>
    </div>

    {/* Transport Card */}
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-stone-100 rounded-2xl text-stone-600">
          <Car className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-stone-800">自駕 / 蘇花改提醒</h3>
          <p className="text-xs text-stone-400">行車安全第一</p>
        </div>
      </div>
      <ul className="space-y-3">
        {data.transport_tips.map((tip, idx) => (
          <li key={idx} className="flex gap-3 text-sm text-stone-600 items-start">
            <span className="flex-shrink-0 w-1.5 h-1.5 bg-stone-300 rounded-full mt-2" />
            <span className="leading-relaxed">{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

// --- Main App Component ---

export default function App() {
  const [activeTab, setActiveTab] = useState('itinerary'); // 'itinerary' | 'info'
  const [currentDay, setCurrentDay] = useState(0);

  // Scroll to top when switching days
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentDay]);

  return (
    <div className="min-h-screen bg-[#F7F6F2] font-sans text-stone-800 pb-20 selection:bg-stone-200">
      
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-[#F7F6F2]/90 backdrop-blur-md border-b border-stone-200/50 pt-safe-top">
        <div className="px-6 pt-6 pb-4">
          <p className="text-xs font-bold text-stone-400 tracking-widest uppercase mb-1">TRAVEL GUIDE</p>
          <h1 className="text-2xl font-bold text-stone-800">{TRIP_DATA.title}</h1>
          <p className="text-sm text-stone-500 mt-1 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {TRIP_DATA.dates}
          </p>
        </div>

        {/* Day Tabs (Only visible in Itinerary mode) */}
        {activeTab === 'itinerary' && (
          <div className="flex px-4 pb-2 gap-2 overflow-x-auto no-scrollbar snap-x">
            {ITINERARY.map((item, index) => (
              <button
                key={index}
                onClick={() => setCurrentDay(index)}
                className={`snap-start flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  currentDay === index
                    ? 'bg-stone-800 text-white shadow-md'
                    : 'bg-white text-stone-500 border border-stone-200'
                }`}
              >
                {item.date}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="pt-4 max-w-md mx-auto">
        {activeTab === 'itinerary' ? (
          <div className="px-4 pb-24 animate-in fade-in">
            {/* Daily Weather Header */}
            <div className="flex justify-between items-center mb-6 px-2">
              <h2 className="text-xl font-bold text-stone-700">
                Day {ITINERARY[currentDay].day}
              </h2>
              <WeatherWidget weather={ITINERARY[currentDay].weather} />
            </div>

            {/* Timeline */}
            <div className="mt-2">
              {ITINERARY[currentDay].events.map((event, idx) => (
                <EventCard key={idx} event={event} />
              ))}
            </div>
            
            <div className="text-center mt-8 mb-4">
              <p className="text-xs text-stone-300 italic">Enjoy your relax trip</p>
            </div>
          </div>
        ) : (
          <InfoSection data={TRIP_DATA} />
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-stone-200 pb-safe-bottom z-50">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`flex flex-col items-center gap-1 w-full h-full justify-center transition-colors ${
              activeTab === 'itinerary' ? 'text-stone-800' : 'text-stone-400'
            }`}
          >
            <MapPin className={`w-6 h-6 ${activeTab === 'itinerary' ? 'fill-stone-100' : ''}`} />
            <span className="text-[10px] font-bold tracking-wide">行程</span>
          </button>
          
          <button
            onClick={() => setActiveTab('info')}
            className={`flex flex-col items-center gap-1 w-full h-full justify-center transition-colors ${
              activeTab === 'info' ? 'text-stone-800' : 'text-stone-400'
            }`}
          >
            <Info className={`w-6 h-6 ${activeTab === 'info' ? 'fill-stone-100' : ''}`} />
            <span className="text-[10px] font-bold tracking-wide">資訊</span>
          </button>
        </div>
      </nav>
      
      {/* CSS Utility for safe area padding (iPhone) */}
      <style>{`
        .pt-safe-top { padding-top: env(safe-area-inset-top); }
        .pb-safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

