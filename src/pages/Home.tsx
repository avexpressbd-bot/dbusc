import { ArrowRight, Target, Users, Heart, Calendar, Loader2, Banknote, HandshakeIcon, Lightbulb, Briefcase, HeartHandshake, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { db } from "@/src/lib/firebase";
import { doc, getDoc, collection, getDocs, query, orderBy, limit } from "firebase/firestore";

interface NavLink {
  name: string;
  path: string;
}

const navLinks: NavLink[] = [
  { name: "হোম", path: "/" },
  { name: "সদস্য এরিয়া", path: "/member-area" },
  { name: "যোগাযোগ", path: "/contact" },
];

export default function Home() {
  const [settings, setSettings] = useState<any>(null);
  const [recentNews, setRecentNews] = useState<any[]>([]);
  const [iftarHighlight, setIftarHighlight] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const settingsSnap = await getDoc(doc(db, "settings", "site"));
        if (settingsSnap.exists()) setSettings(settingsSnap.data());

        const newsSnap = await getDocs(query(collection(db, "news"), orderBy("date", "desc"), limit(10)));
        const allNews = newsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
        setRecentNews(allNews.slice(0, 4));
        
        // Find iftar news in the last 10 items for highlighting
        const foundIftar = allNews.find(n => n.title.includes("ইফতার"));
        setIftarHighlight(foundIftar);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const isActive = (path: string): boolean => location.pathname === path;
  const toggleMenu = (): void => setIsOpen(!isOpen);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-12 h-12 text-emerald-900 animate-spin" />
      </div>
    );
  }

  const mainNews = recentNews[0];
  const otherNews = recentNews.slice(1);

  return (
    <div className="space-y-20 pb-20">
      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease forwards;
        }
        
        .animate-fade-in-up-delay-1 {
          animation: fadeInUp 0.8s ease 0.2s forwards;
          opacity: 0;
        }
        
        .animate-fade-in-up-delay-2 {
          animation: fadeInUp 0.8s ease 0.4s forwards;
          opacity: 0;
        }
        
        .animate-fade-in-up-delay-3 {
          animation: fadeInUp 0.8s ease 0.6s forwards;
          opacity: 0;
        }
      `}</style>

      {/* Premium Hero Section */}
      <section className="relative min-h-screen md:min-h-175 flex items-center justify-center overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={settings?.heroImage || "https://picsum.photos/seed/society-hero/1920/1080?blur=2"}
            alt="Hero Background"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Deep gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-r from-emerald-950/80 via-emerald-950/70 to-emerald-950/80" />
          <div className="absolute inset-0 bg-linear-to-t from-emerald-950/90 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Main Headline */}
            <h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight animate-fade-in-up"
              style={{
                fontFamily: "'Hind Siliguri', 'Kalpurush', 'SolaimanLipi', sans-serif",
                textShadow: "0 4px 12px rgba(0, 0, 0, 0.5)"
              }}
            >
              ঐক্যবদ্ধ বিষ্ণুপুর, সমৃদ্ধ ভবিষ্যৎ
            </h1>

            {/* Sub-headline Description */}
            <p 
              className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto animate-fade-in-up-delay-1"
              style={{
                fontFamily: "'Hind Siliguri', 'Kalpurush', 'SolaimanLipi', sans-serif"
              }}
            >
              ঢাকাস্থ বিষ্ণুপুর ইউনিয়ন সোসাইটি একটি অরাজনৈতিক ও সামাজিক সংগঠন। আমরা আমাদের ইউনিয়নের মানুষের কল্যাণে এবং ভ্রাতৃত্বের বন্ধন সুদৃঢ় করতে কাজ করে যাচ্ছি।
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-fade-in-up-delay-2">
              {/* Primary Button */}
              <Link
                to="/member-area"
                className="inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-4 bg-yellow-400 text-emerald-950 font-bold rounded-full hover:scale-105 transition-all duration-300 shadow-lg shadow-yellow-400/40 group"
              >
                <span>সদস্য হোন</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Secondary Ghost Button */}
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 sm:px-10 py-4 bg-white/10 backdrop-blur-md text-white border-2 border-white/40 font-bold rounded-full hover:bg-white/20 hover:border-white/60 transition-all duration-300"
                style={{
                  fontFamily: "'Hind Siliguri', 'Kalpurush', 'SolaimanLipi', sans-serif"
                }}
              >
                যোগাযোগ করুন
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white/50 text-center"
          >
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </div>
      </section>

      {/* Premium Centered Iftar Event Announcement */}
      {iftarHighlight && (
        <section className="w-full px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 overflow-hidden min-h-[88vh] flex items-center" style={{ backgroundColor: '#F8F8F8' }}>
          <div className="max-w-275 mx-auto py-10">
            <style>{`
              @keyframes pulse-badge {
                0%, 100% {
                  transform: scale(1);
                  box-shadow: 0 0 0 0 rgba(229, 185, 107, 0.65);
                }
                50% {
                  transform: scale(1.05);
                  box-shadow: 0 0 0 10px rgba(229, 185, 107, 0);
                }
              }

              @keyframes glow-pulse {
                0%, 100% {
                  opacity: 0.35;
                  transform: scale(1);
                }
                50% {
                  opacity: 0.55;
                  transform: scale(1.06);
                }
              }

              .animate-pulse-badge {
                animation: pulse-badge 2s infinite;
              }

              .iftar-glow {
                animation: glow-pulse 4s ease-in-out infinite;
              }
            `}</style>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div
                className="iftar-glow pointer-events-none absolute top-16 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(14, 90, 70, 0.16) 0%, rgba(14, 90, 70, 0.07) 35%, transparent 72%)',
                  filter: 'blur(38px)'
                }}
              />

              <div
                className="relative overflow-hidden rounded-3xl bg-white shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl"
                style={{
                  padding: 'clamp(32px, 4vw, 40px)',
                  backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #f8fcfa 100%)'
                }}
              >
                <div className="mb-4 flex justify-center">
                  <span
                    className="animate-pulse-badge inline-flex items-center rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider"
                    style={{
                      color: '#0E5A46',
                      border: '1px solid rgba(229, 185, 107, 0.35)',
                      background: 'linear-gradient(135deg, rgba(229, 185, 107, 0.20) 0%, rgba(229, 185, 107, 0.08) 100%)'
                    }}
                  >
                    বিশেষ ঘোষণা
                  </span>
                </div>

                <h2
                  className="mx-auto mb-3 max-w-4xl text-center text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl"
                  style={{
                    color: '#0E5A46',
                    textShadow: '0 8px 24px rgba(14, 90, 70, 0.08)',
                    fontFamily: "'Hind Siliguri', 'Kalpurush', 'SolaimanLipi', sans-serif"
                  }}
                >
                  {iftarHighlight.title || "ইফতার ও দোয়া মাহফিল ২০২৬"}
                </h2>

                <p
                  className="mx-auto mb-8 max-w-3xl text-center text-base leading-relaxed sm:text-lg"
                  style={{
                    color: '#2D2D2D',
                    fontFamily: "'Hind Siliguri', 'Kalpurush', 'SolaimanLipi', sans-serif"
                  }}
                >
                  পবিত্র রমজানের এই বিশেষ আয়োজনে পরিবার, বন্ধু ও প্রিয়জনদের সাথে একত্রিত হয়ে ভ্রাতৃত্ব, দোয়া ও সৌহার্দ্যের অনন্য মুহূর্ত ভাগ করে নিতে আপনাকে আন্তরিক আমন্ত্রণ।
                </p>

                <div id="iftar-full-details" className="mx-auto mb-8 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 scroll-mt-24">
                  <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                    <p className="mb-1.5 text-2xl">📅</p>
                    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-500">ইফতারের তারিখ</p>
                    <p className="text-lg font-bold" style={{ color: '#2D2D2D', fontFamily: "'Hind Siliguri', 'Kalpurush', 'SolaimanLipi', sans-serif" }}>০৭ মার্চ ২০২৬ (শনিবার)</p>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                    <p className="mb-1.5 text-2xl">⏳</p>
                    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-500">রেজিস্ট্রেশনের শেষ তারিখ</p>
                    <p className="text-base font-bold" style={{ color: '#2D2D2D', fontFamily: "'Hind Siliguri', 'Kalpurush', 'SolaimanLipi', sans-serif" }}>০৪ মার্চ ২০২৬</p>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                    <p className="mb-1.5 text-2xl">📍</p>
                    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-500">ভেন্যু</p>
                    <p className="text-base font-bold" style={{ color: '#2D2D2D', fontFamily: "'Hind Siliguri', 'Kalpurush', 'SolaimanLipi', sans-serif" }}>রহমানিয়া ইন্টারন্যাশনাল "সেন্ট্রাল ইন"</p>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                    <p className="mb-1.5 text-2xl">💰</p>
                    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-500">সাধারণ টিকিট</p>
                    <p className="text-xl font-bold" style={{ color: '#0E5A46', fontFamily: "'Hind Siliguri', 'Kalpurush', 'SolaimanLipi', sans-serif" }}>৯৫০ টাকা</p>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                    <p className="mb-1.5 text-2xl">🎓</p>
                    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-500">ছাত্রদের জন্য</p>
                    <p className="text-xl font-bold" style={{ color: '#0E5A46', fontFamily: "'Hind Siliguri', 'Kalpurush', 'SolaimanLipi', sans-serif" }}>৬৫০ টাকা</p>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                    <p className="mb-1.5 text-2xl">📞</p>
                    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-500">যোগাযোগ</p>
                    <div className="space-y-0.5">
                      <a
                        href="tel:01913986140"
                        className="block text-base font-bold transition-colors duration-300 hover:text-amber-500"
                        style={{ color: '#0E5A46', fontFamily: "'Hind Siliguri', 'Kalpurush', 'SolaimanLipi', sans-serif" }}
                      >
                        01913986140
                      </a>
                      <a
                        href="tel:01671990635"
                        className="block text-base font-bold transition-colors duration-300 hover:text-amber-500"
                        style={{ color: '#0E5A46', fontFamily: "'Hind Siliguri', 'Kalpurush', 'SolaimanLipi', sans-serif" }}
                      >
                        01671990635
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link
                    to="/iftar-registration"
                    className="inline-flex w-full items-center justify-center rounded-xl px-8 py-3.5 text-base sm:text-lg font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
                    style={{
                      background: 'linear-gradient(135deg, #0E5A46 0%, #166d56 100%)',
                      fontFamily: "'Hind Siliguri', 'Kalpurush', 'SolaimanLipi', sans-serif"
                    }}
                  >
                    রেজিস্ট্রেশন করুন
                  </Link>

                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-center rounded-xl border-2 px-8 py-3.5 text-base sm:text-lg font-bold transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-50 sm:w-auto"
                    style={{
                      borderColor: '#0E5A46',
                      color: '#0E5A46',
                      backgroundColor: 'rgba(14, 90, 70, 0.03)',
                      fontFamily: "'Hind Siliguri', 'Kalpurush', 'SolaimanLipi', sans-serif"
                    }}
                    onClick={() => {
                      const detailsSection = document.getElementById('iftar-full-details');
                      detailsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                  >
                    বিস্তারিত জানুন
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Modern Goals & Objectives Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 relative z-10" style={{ backgroundColor: '#F8F8F8', paddingTop: '80px', paddingBottom: '60px' }}>
        <div className="max-w-275 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4" 
              style={{
                backgroundColor: 'rgba(229, 185, 107, 0.15)',
                color: '#0E5A46',
                border: '1px solid rgba(229, 185, 107, 0.3)'
              }}
            >
              আমাদের মূল্যবোধ
            </div>
            <h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3"
              style={{
                color: '#0E5A46',
                fontFamily: "'Hind Siliguri', 'Kalpurush', 'SolaimanLipi', sans-serif"
              }}
            >
              লক্ষ্য ও উদ্দেশ্য
            </h2>
            <p 
              className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto"
              style={{
                fontFamily: "'Hind Siliguri', 'Kalpurush', 'SolaimanLipi', sans-serif"
              }}
            >
              একতা, সহযোগিতা ও মানবতার বন্ধনে আমরা গড়ে তুলছি একটি উন্নত সমাজ
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-center text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed"
            style={{
              fontFamily: "'Hind Siliguri', 'Kalpurush', 'SolaimanLipi', sans-serif"
            }}
          >
            ঢাকাস্থ বিষ্ণুপুর ইউনিয়ন সোসাইটির প্রধান লক্ষ্য হলো সদস্যদের পারস্পরিক সহযোগিতা, অর্থনৈতিক স্বাবলম্বন, সামাজিক উন্নয়ন এবং অসহায় মানুষের পাশে দাঁড়ানো। আমরা বিশ্বাস করি যে একসাথে আমরা আরও শক্তিশালী এবং আরও কার্যকর।
          </motion.p>

          {/* Mission Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {[
              {
                title: 'অর্থনৈতিক স্বাবলম্বন',
                desc: 'সোসাইটির ফান্ডের মাধ্যমে সদস্য ও অসহায় মানুষের আর্থিক সক্ষমতা বৃদ্ধি এবং দারিদ্র্য বিমোচন।'
              },
              {
                title: 'পারস্পরিক সহযোগিতা',
                desc: 'সদস্যদের পারস্পরিক উন্নয়ন, বিশ্বাস ও বন্ধুত্বের ভিত্তিতে একটি শক্তিশালী ঐক্য গড়ে তোলা।'
              },
              {
                title: 'সামাজিক উন্নয়ন',
                desc: 'শিক্ষা, স্বাস্থ্য, সংস্কৃতি এবং পেশাগত দক্ষতা বৃদ্ধির মাধ্যমে সমাজের উন্নয়ন।'
              },
              {
                title: 'কর্মসংস্থান সৃষ্টি',
                desc: 'স্থানীয় সম্পদ ব্যবহার করে কর্মসংস্থান ও আয়বৃদ্ধিমূলক উদ্যোগ গ্রহণ।'
              },
              {
                title: 'সেবামূলক কার্যক্রম',
                desc: 'দুর্যোগ মোকাবেলা, রক্তদান ও স্বাস্থ্য সচেতনতামূলক সামাজিক কার্যক্রম পরিচালনা।'
              },
              {
                title: 'আইনি ও প্রাতিষ্ঠানিক সহায়তা',
                desc: 'সদস্যদের অধিকার রক্ষা এবং অসহায় মানুষের সমস্যা সমাধানে সহযোগিতা।'
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-gray-300"
              >
                <h3 
                  className="mb-2 text-lg font-bold"
                  style={{
                    color: '#0E5A46',
                    fontFamily: "'Hind Siliguri', 'Kalpurush', 'SolaimanLipi', sans-serif"
                  }}
                >
                  {item.title}
                </h3>
                <p 
                  className="text-sm leading-relaxed text-gray-600"
                  style={{
                    fontFamily: "'Hind Siliguri', 'Kalpurush', 'SolaimanLipi', sans-serif"
                  }}
                >
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Emotional Closing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-12 pt-8 border-t border-gray-300"
          >
            <p 
              className="text-lg sm:text-xl font-bold"
              style={{
                color: '#0E5A46',
                fontFamily: "'Hind Siliguri', 'Kalpurush', 'SolaimanLipi', sans-serif"
              }}
            >
              একতা, মানবতা ও সহযোগিতার মাধ্যমে আমরা একসাথে গড়ে তুলছি একটি উন্নত আগামী।
            </p>
          </motion.div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="bg-emerald-900 py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">{settings?.statsMembers || "৫০০+"}</div>
              <div className="text-emerald-200 text-sm uppercase tracking-widest">সক্রিয় সদস্য</div>            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">{settings?.statsEvents || "২০+"}</div>
              <div className="text-emerald-200 text-sm uppercase tracking-widest">বার্ষিক ইভেন্ট</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">{settings?.statsProjects || "৫০+"}</div>
              <div className="text-emerald-200 text-sm uppercase tracking-widest">সফল প্রজেক্ট</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">{settings?.statsYears || "১০+"}</div>
              <div className="text-emerald-200 text-sm uppercase tracking-widest">বছর পথচলা</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent News Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-emerald-900 mb-2">সাম্প্রতিক কর্মকাণ্ড</h2>
            <p className="text-emerald-800/60">সংগঠনের সর্বশেষ সংবাদ ও নোটিশ বোর্ড</p>
          </div>
          <Link to="/news" className="text-emerald-700 font-bold flex items-center hover:text-amber-600 transition-colors">
            সবগুলো দেখুন <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mainNews ? (
            <div className="group relative overflow-hidden rounded-3xl shadow-lg aspect-video">
              <img
                src={mainNews.imageUrl}
                alt={mainNews.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-emerald-950/90 to-transparent" />
              <div className="absolute bottom-0 p-8">
                <div className="flex items-center text-amber-400 text-sm mb-3">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(mainNews.date).toLocaleDateString("bn-BD")}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{mainNews.title}</h3>
                <p className="text-emerald-100/80 line-clamp-2">{mainNews.content}</p>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 rounded-3xl aspect-video flex items-center justify-center text-emerald-300">
              কোনো নিউজ পাওয়া যায়নি
            </div>
          )}

          <div className="space-y-6">
            {otherNews.length > 0 ? otherNews.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 rounded-2xl hover:bg-white hover:shadow-sm transition-all group">
                <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <div className="text-xs text-emerald-600 font-semibold mb-1 uppercase">নোটিশ</div>
                  <h4 className="font-bold text-emerald-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-sm text-emerald-800/60 line-clamp-2 mt-1">
                    {item.content}
                  </p>
                </div>
              </div>
            )) : (
              <div className="text-emerald-300 italic">অতিরিক্ত কোনো নিউজ নেই</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
