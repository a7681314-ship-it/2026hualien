import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  CloudSun, 
  Sun,
  Moon,
  Umbrella,
  Info, 
  Calendar, 
  ChevronDown, 
  ChevronUp,
  Wind
} from 'lucide-react';

// --- 設定資料 ---

const TRIP_DATA = {
  title: "湘琴的休日",
  subtitle: "花蓮太魯閣・山海靜心之旅",
  dates: "2025.12.30 — 2026.01.01",
  hotel: {
    name: "煙波花蓮太魯閣",
    room: "沁海館",
    address: "花蓮縣新城鄉順安村草林10之6號"
  },
  tips: [
    "蘇花改全線速限 50-70 km/h，請開啟定速。",
    "連假去程清晨易塞，回程建議 15:00 前出發。",
    "放慢呼吸，感受山與海的頻率。"
  ]
};

const ITINERARY = [
  {
    day: 1,
    date: "12.30",
    weekday: "Tuesday",
    weather: { icon: "CloudSun", temp: "18°C", desc: "舒適" },
    events: [
      {
        time: "14:00",
        title: "台北出發",
        location: "雙連捷運站",
        desc: "調整心情，準備前往山海之間。",
        guide: "上國道五號前，確認輪胎與油量。車上播放輕柔的 Jazz 或 Lo-fi 音樂，讓心跳跟著慢下來。",
        mapQuery: "台北雙連捷運站"
      },
      {
        time: "16:30",
        title: "中途休憩",
        location: "蘇澳服務區",
        desc: "如船一般的休息站，短暫停留。",
        guide: "二樓有不錯的觀景視野。這裡是進入蘇花改前最後的舒適補給點，建議買杯咖啡提神。",
        mapQuery: "蘇澳服務區"
      },
      {
        time: "19:00",
        title: "抵達・入住",
        location: "煙波太魯閣 沁海館",
        desc: "卸下行囊，被海風擁抱。",
        guide: "Check-in 時不妨在大廳停留片刻，欣賞挑高空間的通透感。今晚不急著出門，就在飯店內享受慢食。",
        mapQuery: "煙波花蓮太魯閣"
      },
      {
        time: "21:00",
        title: "靜心時刻",
        location: "水療館 / 無邊際泳池",
        desc: "在溫水中洗去城市的喧囂。",
        guide: "夜晚的泳池畔點燈後非常迷人，即便不下水，坐在躺椅上聽海浪聲也是一種極致的療癒。",
        mapQuery: "煙波花蓮太魯閣"
      }
    ]
  },
  {
    day: 2,
    date: "12.31",
    weekday: "Wednesday",
    weather: { icon: "Sun", temp: "21°C", desc: "晴朗" },
    events: [
      {
        time: "09:00",
        title: "晨間・慢食",
        location: "漫饗食堂",
        desc: "睡到自然醒，享用在地豐盛早餐。",
        guide: "煙波的早餐時段很長，不必趕時間。推薦嘗試花蓮在地的野菜與海鮮粥。",
        mapQuery: "煙波花蓮太魯閣"
      },
      {
        time: "10:30",
        title: "曼波海灘",
        location: "步行 5 分鐘",
        desc: "花蓮的天空之鏡，與石疊塔對話。",
        guide: "這裡的鵝卵石圓潤可愛，可以試著疊石頭許願。記得帶相機，海天一色的背景怎麼拍都充滿空氣感。",
        mapQuery: "曼波海灘"
      },
      {
        time: "14:00",
        title: "練習曲書店",
        location: "新城老街",
        desc: "只借不賣書的書店，老屋裡的咖啡香。",
        guide: "如果這家店客滿，旁邊的「佳興冰果室」買瓶檸檬汁帶去海邊喝也是不錯的選擇。",
        mapQuery: "練習曲書店"
      },
      {
        time: "23:50",
        title: "跨年・倒數",
        location: "客房陽台",
        desc: "在太平洋旁，靜靜迎接 2026。",
        guide: "沒有擁擠的人潮，只有你們與星空。或許可以準備一點小酒，慶祝這一年的努力。",
        mapQuery: "煙波花蓮太魯閣"
      }
    ]
  },
  {
    day: 3,
    date: "01.01",
    weekday: "Thursday",
    weather: { icon: "CloudSun", temp: "19°C", desc: "多雲" },
    events: [
      {
        time: "11:00",
        title: "退房・告別",
        location: "煙波太魯閣",
        desc: "帶著充飽電的身心，準備返程。",
        guide: "離開前，再看一眼那片海。把這份平靜收進心裡，帶回城市。",
        mapQuery: "煙波花蓮太魯閣"
      },
      {
        time: "15:00",
        title: "返程",
        location: "蘇花改北上",
        desc: "務必準時出發，避開車潮。",
        guide: "若精神不濟，台泥 DAKA 園區適合做為中繼站。慢慢開，安全是回家唯一的路。",
        mapQuery: "台泥DAKA園區"
      }
    ]
  }
];

// --- 介面元件 ---

const WeatherIcon = ({ type }) => {
  const iconClass = "w-5 h-5 text-stone-400";
  switch(type) {
    case 'Sun': return <Sun className={iconClass} />;
    case 'CloudSun': return <CloudSun className={iconClass} />;
    case 'Moon': return <Moon className={iconClass} />;
    default: return <Wind className={iconClass} />;
  }
};

const TabButton = ({ isActive, onClick, label, date }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center py-3 px-6 min-w-[5rem] transition-all duration-500 relative ${
      isActive ? 'text-stone-800' : 'text-stone-300'
    }`}
  >
    <span className="text-[10px] font-bold tracking-widest uppercase mb-1 font-sans">{label}</span>
    <span className={`text-lg font-serif transition-transform duration-500 ${isActive ? 'scale-110' : 'scale-100'}`}>
      {date}
    </span>
    {isActive && (
      <span className="absolute bottom-0 w-1 h-1 bg-stone-800 rounded-full animate-pulse" />
    )}
  </button>
);

const EventItem = ({ event, isLast }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNav = (e) => {
    e.stopPropagation();
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.mapQuery)}`, '_blank');
  };

  return (
    <div className="relative pl-8 pb-12 group">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-[5px] top-2 bottom-0 w-[1px] bg-stone-100" />
      )}
      
      {/* Timeline Dot */}
      <div className="absolute left-0 top-2 w-[11px] h-[11px] rounded-full border border-stone-300 bg-stone-50 group-hover:bg-stone-200 transition-colors z-10" />

      {/* Content */}
      <div className="animate-in slide-in-from-bottom-2 duration-700">
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-xs font-mono text-stone-400 tracking-wider">{event.time}</span>
          <button 
            onClick={handleNav}
            className="text-[10px] text-stone-400 border border-stone-200 px-3 py-1 rounded-full hover:bg-stone-800 hover:text-white transition-all flex items-center gap-1"
          >
            <Navigation className="w-3 h-3" />
            NAV
          </button>
        </div>
        
        <h3 className="text-lg font-serif text-stone-800 mb-1 leading-snug">{event.title}</h3>
        <p className="text-sm text-stone-500 font-sans mb-1">{event.location}</p>
        <p className="text-sm text-stone-400 font-light leading-relaxed">{event.desc}</p>

        {/* Guide Section */}
        <div className="mt-4">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 text-xs text-stone-400 hover:text-stone-600 transition-colors group/btn"
          >
            {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            <span className="tracking-widest uppercase text-[10px]">Guide</span>
          </button>
          
          <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
            <div className="overflow-hidden">
              <div className="pt-3 pb-1">
                <p className="text-xs text-stone-500 leading-6 bg-stone-100/50 p-4 rounded-lg font-light tracking-wide">
                  {event.guide}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 主程式 ---

export default function App() {
  const [day, setDay] = useState(0);
  const [view, setView] = useState('trip'); // 'trip' | 'info'

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-stone-800 font-sans selection:bg-stone-200">
      
      {/* 頂部標題區 */}
      <header className="pt-16 pb-8 px-8">
        <p className="text-xs font-bold text-stone-400 tracking-[0.2em] uppercase mb-2">Itinerary</p>
        <h1 className="text-3xl font-serif font-medium text-stone-900 mb-2">{TRIP_DATA.title}</h1>
        <p className="text-sm text-stone-500 font-light tracking-wide">{TRIP_DATA.subtitle}</p>
      </header>

      {/* 日期切換 */}
      {view === 'trip' && (
        <div className="sticky top-0 z-50 bg-[#FDFCF8]/95 backdrop-blur-sm border-b border-stone-100 mb-8">
          <div className="flex justify-center items-center">
            {ITINERARY.map((d, i) => (
              <TabButton 
                key={i}
                isActive={day === i} 
                onClick={() => setDay(i)} 
                label={`DAY 0${d.day}`}
                date={d.date}
              />
            ))}
          </div>
        </div>
      )}

      {/* 主要內容區 */}
      <main className="px-8 pb-32 max-w-lg mx-auto min-h-[60vh]">
        {view === 'trip' ? (
          <div key={day} className="animate-in fade-in zoom-in-95 duration-500">
            {/* 當日天氣 */}
            <div className="flex items-center gap-3 mb-10 bg-white shadow-sm border border-stone-100/50 p-4 rounded-xl w-max">
              <WeatherIcon type={ITINERARY[day].weather.icon} />
              <div className="h-4 w-[1px] bg-stone-200" />
              <span className="text-sm text-stone-600 font-medium">{ITINERARY[day].weather.temp}</span>
              <span className="text-xs text-stone-400">{ITINERARY[day].weather.desc}</span>
            </div>

            {/* 行程列表 */}
            <div className="mt-4">
              {ITINERARY[day].events.map((event, i) => (
                <EventItem 
                  key={i} 
                  event={event} 
                  isLast={i === ITINERARY[day].events.length - 1} 
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-in slide-in-from-right duration-500 space-y-8 pt-4">
            <div className="bg-white p-8 rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.03)] border border-stone-50">
              <h3 className="font-serif text-xl mb-6 text-stone-900">Accommodation</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1">Hotel</label>
                  <p className="text-stone-800">{TRIP_DATA.hotel.name}</p>
                  <p className="text-stone-500 text-sm">{TRIP_DATA.hotel.room}</p>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1">Address</label>
                  <p className="text-stone-600 text-sm font-light">{TRIP_DATA.hotel.address}</p>
                </div>
                <button 
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(TRIP_DATA.hotel.name)}`)}
                  className="w-full mt-4 py-3 border border-stone-200 text-stone-600 text-xs tracking-widest uppercase hover:bg-stone-800 hover:text-white transition-colors"
                >
                  Navigate
                </button>
              </div>
            </div>

            <div className="bg-stone-50 p-8 rounded-2xl border border-stone-100">
              <h3 className="font-serif text-xl mb-6 text-stone-900">Driving Tips</h3>
              <ul className="space-y-4">
                {TRIP_DATA.tips.map((tip, i) => (
                  <li key={i} className="flex gap-4 text-sm text-stone-600 font-light leading-relaxed">
                    <span className="font-serif text-stone-300 italic">0{i+1}</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* 底部導航 */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-white/50 rounded-full px-2 py-2 flex gap-2 z-50">
        <button 
          onClick={() => setView('trip')}
          className={`px-6 py-3 rounded-full text-xs font-bold tracking-widest transition-all duration-300 ${
            view === 'trip' ? 'bg-stone-800 text-white shadow-md' : 'text-stone-400 hover:bg-stone-100'
          }`}
        >
          TRIP
        </button>
        <button 
          onClick={() => setView('info')}
          className={`px-6 py-3 rounded-full text-xs font-bold tracking-widest transition-all duration-300 ${
            view === 'info' ? 'bg-stone-800 text-white shadow-md' : 'text-stone-400 hover:bg-stone-100'
          }`}
        >
          INFO
        </button>
      </nav>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500&family=Noto+Serif+TC:wght@400;500&display=swap');
      `}</style>
    </div>
  );
}

