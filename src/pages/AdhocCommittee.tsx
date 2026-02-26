import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Phone, Loader2 } from "lucide-react";
import { db } from "@/src/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

interface CommitteeMember {
  id: string;
  name: string;
  designation: string;
  imageUrl: string;
  phone?: string;
}

export default function AdhocCommittee() {
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(query(collection(db, "adhoc_committee"), orderBy("orderIndex", "asc")));
        setMembers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CommitteeMember)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="py-20 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-emerald-900 mb-4">আহ্বায়ক কমিটি</h1>
          <p className="text-emerald-800/60 max-w-2xl mx-auto">
            সংগঠনের আহ্বায়ক কমিটির সম্মানিত সদস্যবৃন্দ যারা সংগঠনের পুনর্গঠন ও বিশেষ দায়িত্ব পালনে নিয়োজিত।
          </p>
          <div className="w-24 h-1 bg-amber-400 mx-auto rounded-full mt-6" />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin h-12 w-12 text-emerald-900" />
          </div>
        ) : members.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {members.map((member, idx) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-emerald-100 group"
              >
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={member.imageUrl || "https://picsum.photos/seed/placeholder/400/400"}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-emerald-900 mb-1">{member.name}</h3>
                  <p className="text-amber-600 font-semibold text-sm uppercase tracking-wider mb-4">
                    {member.designation}
                  </p>
                  {member.phone && (
                    <div className="flex justify-center items-center gap-2 text-emerald-700 font-medium bg-emerald-50 py-2 px-4 rounded-xl">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{member.phone}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-emerald-800/40 italic">
            বর্তমানে কোনো আহ্বায়ক কমিটি তথ্য পাওয়া যায়নি।
          </div>
        )}
      </div>
    </div>
  );
}
