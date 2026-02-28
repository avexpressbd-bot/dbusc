import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, Download, Info, Smartphone, Monitor } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { db } from "@/src/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const navLinks = [
  { name: "হোম", path: "/" },
  { name: "কার্যনির্বাহী কমিটি", path: "/committee" },
  { name: "আহ্বায়ক কমিটি", path: "/adhoc-committee" },
  { name: "ইফতার রেজিস্ট্রেশন", path: "/iftar-registration" },
  { name: "নিউজ ও ইভেন্ট", path: "/news" },
  { name: "দান/তহবিল", path: "/donation" },
  { name: "যোগাযোগ", path: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    });

    window.addEventListener('appinstalled', () => {
      setShowInstallBtn(false);
      setDeferredPrompt(null);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBtn(false);
    }
    setDeferredPrompt(null);
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsSnap = await getDoc(doc(db, "settings", "site"));
        if (settingsSnap.exists()) {
          setSettings(settingsSnap.data());
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <nav className="bg-emerald-900 text-white sticky top-0 z-50 shadow-lg border-b border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              {settings?.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className="w-12 h-12 object-contain" />
              ) : (
                <div className="w-10 h-10 bg-amber-400 rounded-lg flex items-center justify-center font-bold text-emerald-900">
                  {settings?.siteName ? settings.siteName.charAt(0) : "B"}
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-amber-400 leading-tight">
                  {settings?.siteName || "বিষ্ণুপুর ইউনিয়ন সোসাইটি"}
                </span>
                <span className="text-xs font-medium text-emerald-100/80">
                  {settings?.siteTagline || "ঢাকায়স্থ সামাজিক সংগঠন"}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname === link.path
                      ? "bg-emerald-800 text-amber-400"
                      : "hover:bg-emerald-800 hover:text-amber-200"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/member-area"
                className="ml-4 inline-flex items-center px-4 py-2 border border-amber-400 text-sm font-medium rounded-full text-amber-400 hover:bg-amber-400 hover:text-emerald-900 transition-all"
              >
                <User className="w-4 h-4 mr-2" />
                সদস্য এলাকা
              </Link>
              {showInstallBtn ? (
                <button
                  onClick={handleInstallClick}
                  className="ml-2 inline-flex items-center px-4 py-2 bg-amber-400 text-emerald-900 text-sm font-bold rounded-full hover:bg-amber-300 transition-all animate-pulse"
                >
                  <Download className="w-4 h-4 mr-2" />
                  অ্যাপ ইন্সটল
                </button>
              ) : (
                <button
                  onClick={() => setShowInstallModal(true)}
                  className="ml-2 inline-flex items-center px-4 py-2 bg-emerald-800 text-emerald-100 text-sm font-medium rounded-full hover:bg-emerald-700 transition-all"
                >
                  <Info className="w-4 h-4 mr-2" />
                  অ্যাপ কিভাবে পাবেন?
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-emerald-100 hover:text-white hover:bg-emerald-800 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-emerald-950 border-t border-emerald-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  location.pathname === link.path
                    ? "bg-emerald-800 text-amber-400"
                    : "text-emerald-100 hover:bg-emerald-800 hover:text-white"
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/member-area"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-amber-400 border border-amber-400/30 mt-4"
            >
              সদস্য এলাকা
            </Link>
            {showInstallBtn ? (
              <button
                onClick={() => {
                  handleInstallClick();
                  setIsOpen(false);
                }}
                className="w-full mt-4 flex items-center justify-center px-4 py-3 bg-amber-400 text-emerald-900 font-bold rounded-xl"
              >
                <Download className="w-5 h-5 mr-2" />
                অ্যাপ ইন্সটল করুন
              </button>
            ) : (
              <button
                onClick={() => {
                  setShowInstallModal(true);
                  setIsOpen(false);
                }}
                className="w-full mt-4 flex items-center justify-center px-4 py-3 bg-emerald-800 text-emerald-100 font-medium rounded-xl"
              >
                <Info className="w-5 h-5 mr-2" />
                অ্যাপ কিভাবে পাবেন?
              </button>
            )}
          </div>
        </div>
      )}

      {/* Installation Help Modal */}
      <AnimatePresence>
        {showInstallModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-emerald-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              <button 
                onClick={() => setShowInstallModal(false)}
                className="absolute top-6 right-6 p-2 hover:bg-emerald-50 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-emerald-900" />
              </button>

              <div className="text-center mb-8">
                <div className="bg-amber-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-emerald-900">অ্যাপটি আপনার ফোনে পান</h3>
                <p className="text-emerald-800/60 mt-2">খুব সহজেই আপনি এটি অ্যাপ হিসেবে ব্যবহার করতে পারেন</p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-emerald-50 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-emerald-600">১</div>
                  <div>
                    <h4 className="font-bold text-emerald-900">অ্যান্ড্রয়েড ইউজারদের জন্য:</h4>
                    <p className="text-sm text-emerald-800/70">ব্রাউজারের উপরে ডানদিকের (৩টি ডট) মেনুতে ক্লিক করে <span className="font-bold text-emerald-900">"Install App"</span> অথবা <span className="font-bold text-emerald-900">"Add to Home Screen"</span> এ ক্লিক করুন।</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-emerald-50 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-emerald-600">২</div>
                  <div>
                    <h4 className="font-bold text-emerald-900">আইফোন (iPhone) ইউজারদের জন্য:</h4>
                    <p className="text-sm text-emerald-800/70">Safari ব্রাউজারের নিচে থাকা <span className="font-bold text-emerald-900">Share</span> বাটনে ক্লিক করে নিচে স্ক্রল করে <span className="font-bold text-emerald-900">"Add to Home Screen"</span> এ ক্লিক করুন।</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-emerald-50 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-emerald-600">৩</div>
                  <div>
                    <h4 className="font-bold text-emerald-900">কম্পিউটার ইউজারদের জন্য:</h4>
                    <p className="text-sm text-emerald-800/70">ব্রাউজারের অ্যাড্রেস বারের ডানদিকে থাকা <span className="font-bold text-emerald-900">ইন্সটল আইকনে</span> ক্লিক করুন।</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowInstallModal(false)}
                className="w-full mt-10 py-4 bg-emerald-900 text-white font-bold rounded-2xl hover:bg-emerald-800 transition-all"
              >
                বুঝেছি, ধন্যবাদ
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
}
