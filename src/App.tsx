/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  RefreshCw, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles,
  Volume2,
  Gamepad2,
  Download,
  Info,
  X
} from 'lucide-react';

interface Word {
  persian: string;
  finglish: string;
  category: string;
  image: string;
}

const WORDS: Word[] = [
  { persian: 'سلام', finglish: 'salam', category: 'احوال‌پرسی', image: '👋' },
  { persian: 'سیب', finglish: 'sib', category: 'میوه', image: '🍎' },
  { persian: 'گربه', finglish: 'gorbe', category: 'حیوان', image: '🐱' },
  { persian: 'مامان', finglish: 'maman', category: 'خانواده', image: '👩' },
  { persian: 'بابا', finglish: 'baba', category: 'خانواده', image: '👨' },
  { persian: 'آب', finglish: 'ab', category: 'نوشیدنی', image: '🚰' },
  { persian: 'نان', finglish: 'nan', category: 'غذا', image: '🍞' },
  { persian: 'کتاب', finglish: 'ketab', category: 'وسیله', image: '📚' },
  { persian: 'درخت', finglish: 'derakht', category: 'طبیعت', image: '🌳' },
  { persian: 'خورشید', finglish: 'khorshid', category: 'طبیعت', image: '☀️' },
  { persian: 'ماه', finglish: 'mah', category: 'طبیعت', image: '🌙' },
  { persian: 'مداد', finglish: 'medad', category: 'مدرسه', image: '✏️' },
  { persian: 'موز', finglish: 'moz', category: 'میوه', image: '🍌' },
  { persian: 'گل', finglish: 'gol', category: 'طبیعت', image: '🌹' },
  { persian: 'خانه', finglish: 'khane', category: 'مکان', image: '🏠' },
  { persian: 'سگ', finglish: 'sag', category: 'حیوان', image: '🐶' },
  { persian: 'شیر', finglish: 'shir', category: 'حیوان', image: '🦁' },
  { persian: 'فیل', finglish: 'fil', category: 'حیوان', image: '🐘' },
  { persian: 'خرگوش', finglish: 'khargosh', category: 'حیوان', image: '🐰' },
  { persian: 'جوجه', finglish: 'joje', category: 'حیوان', image: '🐥' },
  { persian: 'پرتقال', finglish: 'porteghal', category: 'میوه', image: '🍊' },
  { persian: 'خیار', finglish: 'khiar', category: 'میوه', image: '🥒' },
  { persian: 'انار', finglish: 'anar', category: 'میوه', image: '🍎' },
  { persian: 'هویج', finglish: 'havij', category: 'سبزیجات', image: '🥕' },
  { persian: 'کیف', finglish: 'kif', category: 'وسیله', image: '🎒' },
  { persian: 'کفش', finglish: 'kafsh', category: 'پوشاک', image: '👟' },
  { persian: 'لیوان', finglish: 'livan', category: 'آشپزخانه', image: '🥛' },
  { persian: 'قاشق', finglish: 'ghashogh', category: 'آشپزخانه', image: '🥄' },
  { persian: 'صندلی', finglish: 'sandali', category: 'خانه', image: '🪑' },
  { persian: 'میز', finglish: 'miz', category: 'خانه', image: '🗄️' },
  { persian: 'دوچرخه', finglish: 'docharkhe', category: 'نقلیه', image: '🚲' },
  { persian: 'ماشین', finglish: 'mashin', category: 'نقلیه', image: '🚗' },
  { persian: 'هواپیما', finglish: 'havapeyma', category: 'نقلیه', image: '✈️' },
  { persian: 'کشتی', finglish: 'kashti', category: 'نقلیه', image: '🚢' },
  { persian: 'توپ', finglish: 'top', category: 'بازی', image: '⚽' },
  { persian: 'چای', finglish: 'chay', category: 'نوشیدنی', image: '☕' },
  { persian: 'پنیر', finglish: 'panir', category: 'غذا', image: '🧀' },
  { persian: 'عسل', finglish: 'asal', category: 'غذا', image: '🍯' },
  { persian: 'بستنی', finglish: 'bastani', category: 'غذا', image: '🍦' },
  { persian: 'اردک', finglish: 'ordak', category: 'حیوان', image: '🦆' },
  { persian: 'اسب', finglish: 'asb', category: 'حیوان', image: '🐎' },
];

const ENGLISH_TO_PERSIAN_CHAR: Record<string, string> = {
  a: 'آ', b: 'ب', c: 'س', d: 'د', e: 'اِ', f: 'ف', g: 'گ', h: 'ه', 
  i: 'ای', j: 'ج', k: 'ک', l: 'ل', m: 'م', n: 'ن', o: 'اُ', p: 'پ', 
  q: 'ق', r: 'ر', s: 'س', t: 'ت', u: 'یو', v: 'و', w: 'و', x: 'ایکس', 
  y: 'ی', z: 'ز'
};

export default function App() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showDownloadGuide, setShowDownloadGuide] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentWord = WORDS[currentWordIndex];

  useEffect(() => {
    // Focus input on mount and word change
    inputRef.current?.focus();
  }, [currentWordIndex]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z]/g, '');
    
    // Only allow typing up to the word length
    if (value.length <= currentWord.finglish.length) {
      setUserInput(value);

      // Check if word is completed correctly
      if (value === currentWord.finglish) {
        setIsCompleted(true);
        setShowCelebration(true);
        // Delay moving to next word to show celebration
        setTimeout(() => {
          handleNext();
        }, 1500);
      }
    }
  };

  const handleNext = () => {
    setShowCelebration(false);
    setIsCompleted(false);
    setUserInput('');
    setCurrentWordIndex((prev) => (prev + 1) % WORDS.length);
  };

  const handlePrevious = () => {
    setShowCelebration(false);
    setIsCompleted(false);
    setUserInput('');
    setCurrentWordIndex((prev) => (prev - 1 + WORDS.length) % WORDS.length);
  };

  const resetGame = () => {
    setCurrentWordIndex(0);
    setUserInput('');
    setIsCompleted(false);
    setShowCelebration(false);
  };

  const getLetterStatus = (letter: string, index: number) => {
    if (index >= userInput.length) return 'pending';
    return userInput[index] === currentWord.finglish[index] ? 'correct' : 'incorrect';
  };

  return (
    <div 
      className="h-screen w-full flex flex-col items-center justify-between p-4 md:p-6 bg-[#F8FAFC] relative overflow-hidden font-sans select-none cursor-pointer" 
      dir="rtl"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Decorative Assets */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 select-none pointer-events-none">🎈</div>
      <div className="absolute bottom-10 right-10 text-6xl opacity-20 select-none pointer-events-none">🎨</div>
      <div className="absolute top-1/2 right-4 text-6xl opacity-20 select-none pointer-events-none">🚀</div>

      {/* Header */}
      <header className="w-full max-w-4xl flex flex-row items-center justify-between z-10 gap-4 shrink-0">
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <span className="text-lg font-bold text-slate-700 font-persian leading-none">
            {currentWordIndex * 10}
          </span>
        </div>
        
        <h1 className="text-2xl md:text-4xl font-black text-slate-800 font-persian">آموزش فینگلیش</h1>

        <div className="flex items-center gap-2 md:gap-3">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowDownloadGuide(true);
            }}
            className="p-3 bg-blue-50 rounded-2xl shadow-sm border border-blue-100 hover:bg-blue-100 transition-colors text-blue-600 flex items-center gap-2"
            title="آموزش دانلود"
          >
            <Download className="w-5 h-5" />
            <span className="hidden md:inline font-bold font-persian">نسخه آفلاین</span>
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              resetGame();
            }}
            className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-slate-400" />
          </button>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center border-4 border-white shadow-md text-xl">
            👦
          </div>
        </div>
      </header>

      {/* Main Game Card */}
      <main className="w-full max-w-4xl flex-1 flex flex-col items-center justify-center gap-6 z-10 py-4 min-h-0">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentWordIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full bg-white rounded-[40px] p-6 md:p-10 shadow-xl border border-slate-100 flex flex-col items-center gap-6 relative"
          >
            {/* Word Category & Image */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-slate-400 text-base font-medium font-persian">
                کلمه رو فینگلیش بنویس!
              </span>
              <div className="text-7xl md:text-8xl select-none leading-none">
                {currentWord.image}
              </div>
            </div>

            {/* Persian Word */}
            <div className="text-6xl md:text-8xl font-black text-blue-600 font-persian tracking-tight text-center leading-tight">
              {currentWord.persian}
            </div>

            {/* Display Finglish letters with feedback */}
            <div className="flex flex-row gap-2 md:gap-4 mt-2 flex-wrap justify-center overflow-auto max-h-[30vh]" dir="ltr">
              {currentWord.finglish.split('').map((letter, idx) => {
                const status = getLetterStatus(letter, idx);
                return (
                  <motion.div
                    key={idx}
                    animate={status === 'correct' ? { scale: [1, 1.1, 1] } : {}}
                    className={`
                      w-12 h-12 md:w-24 md:h-24 rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-5xl font-bold transition-all shadow-md shrink-0
                      ${status === 'pending' ? 'bg-slate-100 text-slate-300 border-2 border-dashed border-slate-300 shadow-none' : ''}
                      ${status === 'correct' ? 'bg-emerald-500 text-white border-b-4 md:border-b-8 border-emerald-700' : ''}
                      ${status === 'incorrect' ? 'bg-rose-500 text-white border-b-4 md:border-b-8 border-rose-700 animate-shake' : ''}
                    `}
                  >
                    {userInput[idx] || (status === 'pending' ? '?' : letter.toUpperCase())}
                  </motion.div>
                );
              })}
            </div>

            {/* Feedback Message */}
            <div className="h-10 flex items-center shrink-0">
              <AnimatePresence>
                {userInput.length > 0 && userInput !== currentWord.finglish.slice(0, userInput.length) && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xl md:text-2xl font-bold text-rose-500 font-persian"
                  >
                    این حرفِ «{ENGLISH_TO_PERSIAN_CHAR[userInput[userInput.length - 1]] || '؟'}» است! ❌
                  </motion.div>
                )}
                {userInput === "" && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-slate-400 font-persian text-base md:text-lg flex items-center gap-2"
                  >
                    <Volume2 className="w-5 h-5 text-blue-400" />
                    <span>حتما کیبوردت رو روی انگلیسی بگذار!</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Hidden Input field */}
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          disabled={isCompleted}
          className="fixed -top-10 left-0 opacity-0"
          autoFocus
        />
      </main>

      {/* Footer Navigation */}
      <footer className="w-full max-w-4xl flex items-center justify-between z-10 pb-4 gap-4 shrink-0">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handlePrevious();
          }}
          className="px-6 py-3 bg-slate-200 text-slate-600 rounded-xl font-bold text-base md:text-xl hover:bg-slate-300 transition-colors font-persian active:scale-95"
        >
          قبلی
        </button>

        <div className="flex-1 h-4 md:h-6 bg-slate-200 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${((currentWordIndex + 1) / WORDS.length) * 100}%` }}
            className="h-full bg-blue-500 rounded-full"
          />
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-base md:text-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-colors font-persian active:scale-95"
        >
          بعدی
        </button>
      </footer>

      {/* Final Success Overlay */}

      {/* Download Guide Modal */}
      <AnimatePresence>
        {showDownloadGuide && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDownloadGuide(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl p-8 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
                    <Info className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 font-persian">راهنمای اجرای آفلاین</h3>
                </div>
                <button 
                  onClick={() => setShowDownloadGuide(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="space-y-4 font-persian text-slate-600 leading-relaxed text-right">
                <p className="font-bold text-slate-800">برای استفاده از برنامه در سیستم دیگر بدون اینترنت مراحل زیر را انجام دهید:</p>
                <ol className="list-decimal list-inside space-y-3 pr-2">
                  <li>از منوی <span className="font-bold text-blue-600">Settings</span> (آیکون چرخ‌دنده در بالای صفحه)， گزینه <span className="font-bold bg-blue-50 px-2 rounded">Export to ZIP</span> را انتخاب کنید.</li>
                  <li>فایل دانلود شده را در سیستم مقصد (آفلاین) از حالت فشرده خارج کنید.</li>
                  <li>در صورت داشتن Node.js روی سیستم مقصد، دستور <code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono">npm install</code> و سپس <code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono">npm run build</code> را اجرا کنید.</li>
                </ol>
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 mt-6 text-sm">
                  <p className="text-amber-800 font-medium font-persian">💡 نکته: اگر سیستم مقصد اینترنت ندارد، حتماً قبل از انتقال، یک بار دستور <code className="font-mono text-xs">npm install</code> را در سیستمی که اینترنت دارد اجرا کنید و سپس کل پوشه را منتقل کنید.</p>
                </div>
              </div>

              <button 
                onClick={() => setShowDownloadGuide(false)}
                className="w-full mt-8 py-4 bg-slate-800 text-white rounded-2xl font-bold font-persian hover:bg-slate-900 transition-colors"
              >
                متوجه شدم، ممنون!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCompleted && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 flex flex-col items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-white/80 backdrop-blur-md p-12 rounded-[4rem] flex flex-col items-center gap-6 shadow-2xl border-4 border-emerald-400">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              >
                <Trophy className="w-32 h-32 text-yellow-500 fill-yellow-200" />
              </motion.div>
              <h2 className="text-5xl font-bold text-emerald-700 font-persian">آفرین! صد آفرین</h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
