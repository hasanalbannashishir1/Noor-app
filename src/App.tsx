/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  ExternalLink,
  Play, 
  Pause, 
  BookOpen, 
  Info, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  Volume2, 
  VolumeX,
  Music,
  ScrollText,
  Loader2,
  CheckCircle2,
  Clock,
  Calendar,
  Settings,
  LayoutDashboard,
  SkipForward,
  Check,
  Home,
  Compass,
  MapPin,
  Sparkles,
  BarChart3,
  Calculator,
  Download,
  Heart,
  Bookmark,
  RefreshCw,
  Quote,
  Flame,
  User,
  History,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  X,
  Mail,
  Book,
  List,
  Building2,
  ClipboardList,
  Headphones,
  AlertCircle,
  XCircle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { quranService } from './services/quranService';
import { quranUserService } from './services/quranUserService';
import { 
  Surah, 
  Recitation, 
  Tafsir, 
  SurahInfo, 
  PrayerRequirement, 
  RakatDetail,
  Bookmark as BookmarkType,
  Dua,
  DashboardStats
} from './types';
import { cn } from './lib/utils';
import { DUAS, DUA_CATEGORIES } from './constants/duas';

const SALAH_REQUIREMENTS: PrayerRequirement[] = [
  {
    name: 'Fajr',
    rakats: [
      { id: 'fajr_sunnah_2', count: 2, category: 'Sunnah Muakkadah', label: 'Sunnah' },
      { id: 'fajr_fardh_2', count: 2, category: 'Fardh', label: 'Fardh' },
    ]
  },
  {
    name: 'Dhuhr',
    rakats: [
      { id: 'dhuhr_sunnah_4', count: 4, category: 'Sunnah Muakkadah', label: 'Sunnah' },
      { id: 'dhuhr_fardh_4', count: 4, category: 'Fardh', label: 'Fardh' },
      { id: 'dhuhr_sunnah_2', count: 2, category: 'Sunnah Muakkadah', label: 'Sunnah' },
      { id: 'dhuhr_nafl_2', count: 2, category: 'Nafl', label: 'Nafl' },
    ]
  },
  {
    name: 'Asr',
    rakats: [
      { id: 'asr_sunnah_4', count: 4, category: 'Sunnah Ghair Muakkadah', label: 'Sunnah (Opt)' },
      { id: 'asr_fardh_4', count: 4, category: 'Fardh', label: 'Fardh' },
    ]
  },
  {
    name: 'Maghrib',
    rakats: [
      { id: 'maghrib_fardh_3', count: 3, category: 'Fardh', label: 'Fardh' },
      { id: 'maghrib_sunnah_2', count: 2, category: 'Sunnah Muakkadah', label: 'Sunnah' },
      { id: 'maghrib_nafl_2', count: 2, category: 'Nafl', label: 'Nafl' },
    ]
  },
  {
    name: 'Isha',
    rakats: [
      { id: 'isha_sunnah_4', count: 4, category: 'Sunnah Ghair Muakkadah', label: 'Sunnah (Opt)' },
      { id: 'isha_fardh_4', count: 4, category: 'Fardh', label: 'Fardh' },
      { id: 'isha_sunnah_2', count: 2, category: 'Sunnah Muakkadah', label: 'Sunnah' },
      { id: 'isha_nafl_2', count: 2, category: 'Nafl', label: 'Nafl' },
      { id: 'isha_witr_3', count: 3, category: 'Wajib', label: 'Witr' },
      { id: 'isha_nafl_2_end', count: 2, category: 'Nafl', label: 'Nafl' },
    ]
  }
];

const TASBIH_PHRASES = [
  { text: 'SubhanAllah', limit: 33 },
  { text: 'Bismillah', limit: 33 },
  { text: 'Alhamdulillah', limit: 33 },
  { text: 'Astaghfirullah', limit: 33 },
  { text: 'La-ilaha ilallah', limit: 33 },
  { text: 'La hawla wala Kuwata illa bilah', limit: 33 },
  { text: 'Subhanallahi wa bihamdihi', limit: 33 },
  { text: 'Subhanallahil Azeem', limit: 33 },
  { text: 'Allahu - Akbar', limit: 33 }
];

const SMALL_HADITHS = [
  { text: "The best of you are those who learn the Quran and teach it.", source: "Sahih Bukhari" },
  { text: "Cleanliness is half of faith.", source: "Sahih Muslim" },
  { text: "The best among you is the one who is best to his family.", source: "Sunan al-Tirmidhi" },
  { text: "A good word is charity.", source: "Sahih Bukhari" },
  { text: "The most beloved of deeds to Allah are those that are most consistent, even if they are small.", source: "Sahih Bukhari" },
  { text: "The best of people are those that are most useful to people.", source: "Al-Mu’jam al-Awsat" },
  { text: "None of you will have faith until he loves for his brother what he loves for himself.", source: "Sahih Bukhari" },
  { text: "The strong man is not the one who can wrestle, but the one who can control himself when he is angry.", source: "Sahih Bukhari" },
  { text: "Seeking knowledge is an obligation upon every Muslim.", source: "Sunan Ibn Majah" },
  { text: "Allah does not look at your appearance or your wealth, but He looks at your hearts and your deeds.", source: "Sahih Muslim" },
  { text: "He who does not show mercy to our young ones and acknowledge the rights of our elders is not one of us.", source: "Sunan Abi Dawud" },
  { text: "The world is a prison for the believer and a paradise for the disbeliever.", source: "Sahih Muslim" },
  { text: "Modesty is part of faith.", source: "Sahih Bukhari" },
  { text: "The most perfect man in his faith among the believers is the one whose behavior is most excellent.", source: "Sunan al-Tirmidhi" },
  { text: "Whoever believes in Allah and the Last Day, let him speak good or remain silent.", source: "Sahih Bukhari" }
];

const UPCOMING_EVENTS = [
  { name: "Ramadan 2026", date: "March 2026", description: "The holy month of fasting, prayer, and reflection." },
  { name: "Eid al-Fitr", date: "March 31, 2026", description: "Festival of breaking the fast." },
  { name: "Hajj 2026", date: "June 2026", description: "The annual pilgrimage to Mecca." },
  { name: "Eid al-Adha", date: "June 6, 2026", description: "Festival of Sacrifice." },
  { name: "Islamic New Year", date: "June 26, 2026", description: "Beginning of the year 1448 AH." }
];

const PRAYER_STEPS = [
  { title: "Wudu (Ablution)", steps: ["Wash hands", "Rinse mouth", "Clean nose", "Wash face", "Wash arms", "Wipe head", "Wash feet"] },
  { title: "Salah (Prayer)", steps: ["Takbir (Allahu Akbar)", "Qiyam (Standing)", "Ruku (Bowing)", "Sujud (Prostration)", "Tashahhud (Sitting)"] }
];

const ESSENTIAL_SURAHS = [
  { 
    name: "Surah Al-Fatihah", 
    arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ (1) الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ (2) الرَّحْمَنِ الرَّحِيمِ (3) مَالِكِ يَوْمِ الدِّينِ (4) إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ (5) اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ (6) صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ (7)",
    pronunciation: "Bismillaahir-Rahmaanir-Raheem. Al-hamdu lillaahi Rabbil-'aalameen. Ar-Rahmaanir-Raheem. Maaliki Yawmid-Deen. Iyyaaka na'budu wa iyyaaka nasta'een. Ihdinas-siraatal-mustaqeem. Siraatal-ladheena an'amta 'alaihim ghairil-maghdoobi 'alaihim wa lad-daalleen."
  },
  { 
    name: "Surah Al-Fil", 
    arabic: "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ (1) أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ (2) وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ (3) تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ (4) فَجَعَلَهُمْ كَعَصْفٍ مَّأْكُولٍ (5)",
    pronunciation: "Alam tara kaifa fa'ala rabbuka bi ashaabil feel. Alam yaj'al kaidahum fee tadleel. Wa arsala 'alaihim tairan abaabeel. Tarmeehim bihijaaratim min sijjeel. Faja'alahum ka'asfim ma'kool."
  },
  { 
    name: "Surah Quraysh", 
    arabic: "لِإِيلَافِ قُرَيْشٍ (1) إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ (2) فَلْيَعْبُدُوا رَبَّ هَذَا الْبَيْتِ (3) الَّذِي أَطْعَمَهُم مِّن جُوعٍ وَآمَنَهُم مِّنْ خَوْفٍ (4)",
    pronunciation: "Li-eelaafi quraish. Eelaafihim rihlatash shitaaa'i wassaif. Falya'budoo rabba haadhal bait. Alladheee at'amahum min joo'inw wa aamanahum min khauf."
  },
  { 
    name: "Surah Al-Ma'un", 
    arabic: "أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ (1) فَذَلِكَ الَّذِي يَدُعُّ الْيَتِيمَ (2) وَلَا يَحُضُّ عَلَى طَعَامِ الْمِسْكِينِ (3) فَوَيْلٌ لِّلْمُصَلِّينَ (4) الَّذِينَ هُمْ عَن صَلَاتِهِمْ سَاهُونَ (5) الَّذِينَ هُمْ يُرَاؤُونَ (6) وَيَمْنَعُونَ الْمَاعُونَ (7)",
    pronunciation: "Ara'aytal ladhee yukadhdhibu biddeen. Fadhaalikal ladhee yadu''ul yateem. Wa laa yahuddu 'alaa ta'aamil miskeen. Fawailul lil musalleen. Alladheena hum 'an salaatihim saahoon. Alladheena hum yuraaa'oon. Wa yamna'oonal maa'oon."
  },
  { 
    name: "Surah Al-Kawthar", 
    arabic: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ (1) فَصَلِّ لِرَبِّكَ وَانْحَرْ (2) إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ (3)",
    pronunciation: "Innaaa a'tainaakal kawthar. Fasalli lirabbika wanhar. Inna shaani'aka huwal abtar."
  },
  { 
    name: "Surah Al-Kafirun", 
    arabic: "قُلْ يَا أَيُّهَا الْكَافِرُونَ (1) لَا أَعْبُدُ مَا تَعْبُدُونَ (2) وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ (3) وَلَا أَنَا عَابِدٌ مَّا عَبَدتُّمْ (4) وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ (5) لَكُمْ دِينُكُمْ وَلِيَ دِينِ (6)",
    pronunciation: "Qul yaaa-ayyuhal kaafiroon. Laaa a'budu maa ta'budoon. Wa laaa antum 'aabidoona maaa a'bud. Wa laaa ana 'aabidum maa 'abattum. Wa laaa antum 'aabidoona maaa a'bud. Lakum deenukum wa liya deen."
  },
  { 
    name: "Surah An-Nasr", 
    arabic: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ (1) وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا (2) فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ إِنَّهُ كَانَ تَوَّابًا (3)",
    pronunciation: "Idhaa jaaa'a nasrullaahi walfath. Wa ra'aitan naasa yadkhuloona fee deenillaahi afwaajaa. Fasabbih bihamdi rabbika wastaghfirh; innahoo kaana tawwaabaa."
  },
  { 
    name: "Surah Al-Masad", 
    arabic: "تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ (1) مَا أَغْنَى عَنْهُ مَالُهُ وَمَا كَسَبَ (2) سَيَصْلَى نَارًا ذَاتَ لَهَبٍ (3) وَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ (4) فِي جِيدِهَا حَبْلٌ مِّن مَّسَدٍ (5)",
    pronunciation: "Tabbat yadaaa abee lahabinw wa tabb. Maaa aghnaa 'anhu maaluhuu wa maa kasab. Sayaslaa naaran dhaata lahab. Wamra-atuhuu hammaalatal hatab. Fee jeedihaa hablum mim masad."
  },
  { 
    name: "Surah Al-Ikhlas", 
    arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ (1) اللَّهُ الصَّمَدُ (2) لَمْ يَلِدْ وَلَمْ يُولَدْ (3) وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ (4)",
    pronunciation: "Qul huwal laahu ahad. Allahus-samad. Lam yalid wa lam yoolad. Wa lam yakul-lahoo kufuwan ahad."
  },
  { 
    name: "Surah Al-Falaq", 
    arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ (1) مِن شَرِّ مَا خَلَقَ (2) وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ (3) وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ (4) وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ (5)",
    pronunciation: "Qul a'oodhu bi rabbil-falaq. Min sharri maa khalaq. Wa min sharri ghaasiqin idhaa waqab. Wa min sharri naffaathaati fil 'uqad. Wa min sharri haasidin idhaa hasad."
  },
  { 
    name: "Surah An-Nas", 
    arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ (1) مَلِكِ النَّاسِ (2) إِلَهِ النَّاسِ (3) مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ (4) الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ (5) مِنَ الْجِنَّةِ وَالنَّاسِ (6)",
    pronunciation: "Qul a'oodhu bi rabbin-naas. Malikin-naas. Ilaahin-naas. Min sharril waswaasil khannaas. Alladhee yuwaswisu fee sudoorin-naas. Minal jinnati wannaas."
  }
];

const HAJJ_GUIDES = [
  {
    title: "1. Description of Hajj, types and conditions",
    desc: "Understanding the pilgrimage types and when it becomes mandatory.",
    content: (
      <div className="space-y-6">
        <section>
          <h5 className="font-bold text-slate-900 border-b pb-1 mb-2">Description of Hajj</h5>
          <p className="text-sm text-slate-600 leading-relaxed italic border-l-2 border-emerald-500 pl-3">
            Hajj is the annual pilgrimage to the holy city of Mecca in Islam. It is the fifth pillar of Islam and an act of worship that must be performed at a specific time (8th–12th of Dhul-Hijjah). It involves a series of rituals including Ihram (sacral state), Tawaf (circling the Kaaba), Sa’i (walking between Safa and Marwah), standing at Arafat, and stoning the Jamarat.
          </p>
        </section>

        <section>
          <h5 className="font-bold text-slate-900 border-b pb-1 mb-2">Types of Hajj</h5>
          <div className="space-y-3">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="font-bold text-slate-800 text-sm">1. Ifrad (Single)</p>
              <p className="text-xs text-slate-600 mt-1">Performing Hajj alone without Umrah. The pilgrim enters Ihram for Hajj only.</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
              <p className="font-bold text-emerald-800 text-sm">2. Qiran (Combined)</p>
              <p className="text-xs text-emerald-700 mt-1">Performing Hajj and Umrah together in a single Ihram with no break between them.</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 shadow-sm ring-1 ring-indigo-200">
              <div className="flex justify-between items-start">
                <p className="font-bold text-indigo-800 text-sm">3. Tamattu’ (Enjoyment)</p>
                <span className="text-[8px] font-black uppercase tracking-widest bg-indigo-600 text-white px-2 py-0.5 rounded-full">Recommended</span>
              </div>
              <p className="text-xs text-indigo-700 mt-1">Performing Umrah during the Hajj season, then exiting Ihram, and finally re-entering Ihram for Hajj on the 8th of Dhul-Hijjah. This is the most recommended type for most pilgrims.</p>
            </div>
          </div>
        </section>

        <section>
          <h5 className="font-bold text-slate-900 border-b pb-1 mb-2">Conditions Making Hajj Obligatory</h5>
          <div className="grid grid-cols-1 gap-2">
            {[
              { t: "Islam", d: "Only Muslims are required to perform Hajj." },
              { t: "Sanity (Reason)", d: "The person must be of sound mind." },
              { t: "Adulthood (Buloogh)", d: "The person must have reached puberty." },
              { t: "Freedom", d: "Only a free person is obligated (not a slave)." },
              { t: "Ability (Istita’ah)", d: "Includes Physical, Financial, Safe travel, and Transportation/Provisions." }
            ].map((item, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="font-black text-emerald-600 shrink-0">{i + 1}.</span>
                <div>
                  <p className="font-bold text-slate-800 leading-none mb-1">{item.t}</p>
                  <p className="text-xs text-slate-500">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    )
  },
  {
    title: "2. The obligatory, obligatory, and sunnah acts of Hajj",
    desc: "Distinguishing between Fard, Wajib, and Sunnah rituals.",
    content: (
      <div className="space-y-6">
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Pillars</div>
            <h5 className="font-bold text-slate-900">1. Obligatory (Fard) Acts</h5>
          </div>
          <p className="text-[10px] text-rose-500 font-bold uppercase mb-2 italic">If missed, Hajj is invalid and must be repeated.</p>
          <ul className="space-y-2">
            <li className="text-sm bg-rose-50/50 p-2 rounded-lg border border-rose-100 flex items-start gap-2 text-slate-700">
              <span className="text-rose-600 font-black mt-0.5">•</span>
              <span><strong>Ihram:</strong> Entering the sacred state with the intention of Hajj.</span>
            </li>
            <li className="text-sm bg-rose-50/50 p-2 rounded-lg border border-rose-100 flex items-start gap-2 text-slate-700">
              <span className="text-rose-600 font-black mt-0.5">•</span>
              <span><strong>Standing at Arafat (Wuquf):</strong> Presence at Arafat between 9th-10th Dhul-Hijjah.</span>
            </li>
            <li className="text-sm bg-rose-50/50 p-2 rounded-lg border border-rose-100 flex items-start gap-2 text-slate-700">
              <span className="text-rose-600 font-black mt-0.5">•</span>
              <span><strong>Tawaf al-Ifadah:</strong> The main circumambulation around the Kaaba.</span>
            </li>
            <li className="text-sm bg-rose-50/50 p-2 rounded-lg border border-rose-100 flex items-start gap-2 text-slate-700">
              <span className="text-rose-600 font-black mt-0.5">•</span>
              <span><strong>Sa’i:</strong> Completing seven laps between Safa and Marwah.</span>
            </li>
          </ul>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Required</div>
            <h5 className="font-bold text-slate-900">2. Necessary (Wajib) Acts</h5>
          </div>
          <p className="text-[10px] text-amber-600 font-bold uppercase mb-2 italic">If missed, Hajj is valid but requires a penalty (Damm).</p>
          <ul className="grid grid-cols-1 gap-2">
            {[
              "Ihram from the Miqat",
              "Staying at Muzdalifah after Arafat",
              "Ramy al-Jamarat (Stoning the pillars)",
              "Shaving or trimming hair (Halq/Taqsir)",
              "Tawaf al-Wada (Farewell Tawaf)",
              "Praying two rak’ahs after Tawaf"
            ].map((item, i) => (
              <li key={i} className="text-xs flex items-center gap-2 text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <div className="w-1 h-1 bg-amber-400 rounded-full" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Recommended</div>
            <h5 className="font-bold text-slate-900">3. Sunnah Acts</h5>
          </div>
          <p className="text-[10px] text-emerald-600 font-bold uppercase mb-2 italic">If missed, no penalty. Doing them brings reward.</p>
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
            <ul className="text-xs text-emerald-900 space-y-2">
              <li>• Reciting the <strong>Talbiyah</strong> loudly.</li>
              <li>• Wearing white <strong>Ihram cloth</strong> (Izār and Ridā’).</li>
              <li>• Performing <strong>Tawaf al-Qudum</strong> (Arrival).</li>
              <li>• Kissing or pointing to the <strong>Black Stone</strong>.</li>
              <li>• Performing <strong>Idtiba’</strong> and <strong>Ramal</strong> (for men).</li>
              <li>• Spending nights in <strong>Mina</strong> and <strong>Muzdalifah</strong>.</li>
              <li>• Abundant <strong>Supplicating (Du’a)</strong> during rituals.</li>
            </ul>
          </div>
        </section>
      </div>
    )
  },
  {
    title: "3. Prohibited Acts for Men & Women (Common)",
    desc: "Actions to avoid while in the state of Ihram and their penalties.",
    content: (
      <div className="space-y-6">
        <section>
          <h5 className="font-bold text-slate-900 border-b pb-1 mb-3 text-sm uppercase tracking-tight">Common Prohibited Acts</h5>
          <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 shadow-sm">
            <ul className="grid grid-cols-1 gap-2 text-xs text-rose-900 leading-tight">
              {[
                "Removing hair (from armpits, pubic area, or anywhere on the body).",
                "Clipping nails (fingernails or toenails).",
                "Applying perfume (includes scented soaps, oils, and deodorants).",
                "Wearing stitched clothing (for men only).",
                "Covering the head (for men only).",
                "Wearing a face veil (Niqab) or burqa (for women only).",
                "Wearing gloves (for women only).",
                "Sexual intercourse (invalidates Hajj/Umrah if before Tawaf al-Ifadah).",
                "Sexual touching, kissing, or lustful foreplay (major sin).",
                "Marriage contract (cannot propose, marry, or officiate).",
                "Hunting or killing land animals (including lice, excluding harmful pests).",
                "Cutting or uprooting plants/trees within the Haram sanctuary.",
                "Using foul, abusive, or vain speech (arguing, fighting, lying)."
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="font-black text-rose-400 shrink-0">{i + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <h5 className="font-bold text-slate-900 border-b pb-1 mb-3 text-sm uppercase tracking-tight">Specific Prohibitions by Gender</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h6 className="font-black text-slate-900 text-[10px] uppercase mb-2 text-center bg-slate-200 rounded py-1">For Men Only</h6>
              <ul className="text-[10px] text-slate-600 space-y-2 list-disc list-inside mt-2">
                <li>Sewn/stitched clothing (shirts, pants, socks, etc.)</li>
                <li>Covering head (cap, turban, hood, pillow)</li>
                <li>Shoes/boots covering ankle bone/top of foot</li>
              </ul>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h6 className="font-black text-slate-900 text-[10px] uppercase mb-2 text-center bg-slate-200 rounded py-1">For Women Only</h6>
              <ul className="text-[10px] text-slate-600 space-y-2 list-disc list-inside mt-2">
                <li>Covering face (Niqab, burqa, or veil)</li>
                <li>Wearing gloves</li>
                <li>Face and hands must remain exposed</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
            <h5 className="font-black text-sm mb-4 uppercase tracking-tighter flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Summary of Penalties (Fidyah)
            </h5>
            <div className="space-y-3">
              {[
                { t: "Sacrifice", d: "Slaughter a sheep/goat and distribute meat to poor in Mecca." },
                { t: "Feed the poor", d: "Feed 6 poor people (approx. 1.5-2 kg of food each)." },
                { t: "Fast", d: "Fast 3 days (anywhere, anytime)." }
              ].map((p, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-3 flex gap-4 items-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-black text-xs shrink-0">{i + 1}</div>
                  <div>
                    <h6 className="font-bold text-xs">{p.t}</h6>
                    <p className="text-[10px] text-slate-400">{p.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    )
  },
  {
    title: "4. Description of Umrah and the rules for performing Umrah",
    desc: "A spiritual journey to Makkah. Understanding the minor pilgrimage.",
    content: (
      <div className="space-y-6">
        <section>
          <h5 className="font-bold text-slate-900 border-b pb-1 mb-2">Description of Umrah</h5>
          <p className="text-sm text-slate-600 leading-relaxed italic border-l-2 border-emerald-500 pl-3">
            Umrah is the minor pilgrimage to Mecca, often called the "lesser Hajj." Unlike Hajj, it is not time-specific and has fewer rituals. While not usually obligatory, it is a confirmed, highly recommended practice (Sunnah Mu’akkadah).
          </p>
        </section>

        <section>
          <h5 className="font-bold text-slate-900 border-b pb-1 mb-3 text-sm uppercase tracking-tight">The 4 Pillars (Essential Acts)</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { t: "1. Ihram", d: "Entrance with intention and Talbiyah." },
              { t: "2. Tawaf", d: "Circling Kaaba 7 times counter-clockwise." },
              { t: "3. Sa’i", d: "Walking 7 laps between Safa and Marwah." },
              { t: "4. Halq/Taqsir", d: "Shaving or trimming the hair." }
            ].map((p, i) => (
              <div key={i} className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex flex-col gap-1">
                <p className="font-black text-emerald-800 text-xs">{p.t}</p>
                <p className="text-[10px] text-emerald-600 font-medium">{p.d}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-rose-500 font-bold mt-2 italic px-2">If any of these is missed, the Umrah is invalid.</p>
        </section>

        <section>
          <h5 className="font-bold text-slate-900 border-b pb-1 mb-3 text-sm uppercase tracking-tight">Rules & Conditions</h5>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <h6 className="font-bold text-slate-900 text-xs mb-2">Entering Ihram – Key Rules</h6>
              <ul className="text-[10px] text-slate-500 space-y-1 list-disc list-inside">
                <li>Miqat: Must enter Ihram before boundary points.</li>
                <li>Remove stitched clothing (men only).</li>
                <li>No perfume once in the state of Ihram.</li>
                <li>Recit Talbiyah frequently until Tawaf starts.</li>
              </ul>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <h6 className="font-bold text-slate-900 text-xs mb-2">During Tawaf & Sa’i – Rules</h6>
              <ul className="text-[10px] text-slate-500 space-y-1 list-disc list-inside">
                <li>Ritual Purity (Wudu): Required for Tawaf.</li>
                <li>Order: Must begin at Safa and end at Marwah.</li>
                <li>Properly covering Awrah is mandatory.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
          <h5 className="font-bold text-amber-900 text-[10px] uppercase mb-2 flex items-center gap-2">
            <Info size={14} />
            Important Note
          </h5>
          <p className="text-[10px] text-amber-800 leading-relaxed font-medium">
            Unlike Hajj, there is no Tawaf al-Wada (Farewell Tawaf) for Umrah, though it is highly recommended to perform one before leaving Mecca.
          </p>
        </section>
      </div>
    )
  },
  {
    title: "5. Rules for wearing clothes for Hajj and Ihram",
    desc: "Correct attire and state rules for both men and women.",
    content: (
      <div className="space-y-6">
        <section>
          <h5 className="font-bold text-slate-900 border-b pb-1 mb-3 text-sm uppercase tracking-tight">Before Ihram (Normal State)</h5>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-[10px] text-slate-600 space-y-2">
            <p>• <strong>Men & Women:</strong> May wear any lawful, clean clothing. No restrictions on stitched garments or face veils.</p>
            <p>• <strong>Recommended:</strong> Perform Ghusl (bath), trim nails, remove pubic/armpit hair, and apply perfume (non-alcoholic) <strong>before</strong> entering Ihram.</p>
          </div>
        </section>

        <section>
          <h5 className="font-bold text-slate-900 border-b pb-1 mb-3 text-sm uppercase tracking-tight">During Ihram (Sacred State)</h5>
          
          <div className="space-y-4">
            <div className="border border-emerald-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-emerald-600 px-4 py-2 text-white font-black text-[10px] uppercase tracking-widest text-center">For Men</div>
              <div className="grid grid-cols-2 text-[10px]">
                <div className="p-3 bg-emerald-50/50 border-r border-emerald-100">
                  <h6 className="font-bold text-emerald-800 mb-2 uppercase text-[8px]">Allowed</h6>
                  <ul className="space-y-1 text-emerald-700">
                    <li>Two white unstitched cloths (Izār & Ridā’)</li>
                    <li>Sandals/Flip-flops (ankles exposed)</li>
                    <li>Belt or money pouch</li>
                    <li>Plain ring or watch</li>
                  </ul>
                </div>
                <div className="p-3 bg-rose-50/50">
                  <h6 className="font-bold text-rose-800 mb-2 uppercase text-[8px]">Not Allowed</h6>
                  <ul className="space-y-1 text-rose-700">
                    <li>Stitched clothing (shirts, underwear, socks)</li>
                    <li>Head coverings (caps, turbans, hoods)</li>
                    <li>Tying a knot in the Ihram cloth</li>
                    <li>Covering nose/mouth with cloth</li>
                  </ul>
                </div>
              </div>
              <div className="p-3 bg-slate-50 border-t border-emerald-100 text-[9px] italic text-slate-500 text-center font-medium">
                Note: Head must remain uncovered. Umbrellas are allowed as long as they don't touch the head.
              </div>
            </div>

            <div className="border border-indigo-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-indigo-600 px-4 py-2 text-white font-black text-[10px] uppercase tracking-widest text-center">For Women</div>
              <div className="grid grid-cols-2 text-[10px]">
                <div className="p-3 bg-indigo-50/50 border-r border-indigo-100">
                  <h6 className="font-bold text-indigo-800 mb-2 uppercase text-[8px]">Allowed</h6>
                  <ul className="space-y-1 text-indigo-700">
                    <li>Regular sewn clothing (modest & dark)</li>
                    <li>Headscarf (Hijab)</li>
                    <li>Socks and shoes (any kind)</li>
                    <li>Loose abaya or jilbab</li>
                  </ul>
                </div>
                <div className="p-3 bg-rose-50/50">
                  <h6 className="font-bold text-rose-800 mb-2 uppercase text-[8px]">Not Allowed</h6>
                  <ul className="space-y-1 text-rose-700">
                    <li>Face veil (Niqab)</li>
                    <li>Gloves (separate hand coverings)</li>
                    <li>Revealing or tight clothing</li>
                    <li>Perfume on body or clothes</li>
                  </ul>
                </div>
              </div>
              <div className="p-3 bg-slate-50 border-t border-indigo-100 text-[9px] italic text-slate-500 text-center font-medium">
                Note: Face and hands must be uncovered. Draw a loose cloth over face near non-mahrams if it doesn't touch skin.
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  },
  {
    title: "6. Pilgrimage to Madinah",
    desc: "A spiritual visit to the Masjid an-Nabawi.",
    content: (
      <div className="space-y-6">
        <section>
          <div className="bg-emerald-900 rounded-2xl p-6 text-white text-center shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <Sparkles size={40} />
            </div>
            <h5 className="font-black text-sm uppercase tracking-tighter mb-2">Importance of Visiting Madinah</h5>
            <div className="space-y-3 text-[10px] text-emerald-100 text-left leading-relaxed">
              <p>• Not obligatory but highly recommended (Sunnah) for spiritual growth.</p>
              <p>• One prayer in the Prophet's Mosque is better than 1,000 elsewhere (except Makkah).</p>
              <p>• Visiting the Prophet (ﷺ) is a means of his intercession.</p>
            </div>
          </div>
        </section>

        <section>
          <h5 className="font-bold text-slate-900 border-b pb-1 mb-3 text-sm uppercase tracking-tight font-sans">What to Do in Madinah</h5>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <h6 className="font-black text-slate-900 text-[10px] uppercase mb-2">1. Visit the Prophet's Mosque</h6>
              <ul className="text-[10px] text-slate-500 space-y-1 list-disc list-inside">
                <li>Enter with humility (right foot first).</li>
                <li>Pray 2 rak'ahs of Tahiyyat al-Masjid.</li>
                <li>Pray in the <strong>Rawdah</strong> (indicated by green carpet).</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <h6 className="font-black text-slate-900 text-[10px] uppercase mb-2">2. Visit the Prophet's Grave (ﷺ)</h6>
              <ul className="text-[10px] text-slate-500 space-y-1 list-disc list-inside">
                <li>Say: <em>"Assalamu 'alayka ayyuhan-Nabiyyu..."</em></li>
                <li>Greet Abu Bakr (RA) and Umar (RA) to the right.</li>
                <li>Do not raise voice or touch the walls.</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h5 className="font-bold text-slate-900 border-b pb-1 mb-3 text-sm uppercase tracking-tight">Historical Sites Table</h5>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[9px] border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="p-2 border border-slate-200 font-black uppercase">Site</th>
                  <th className="p-2 border border-slate-200 font-black uppercase">Description</th>
                </tr>
              </thead>
              <tbody className="text-slate-600">
                <tr>
                  <td className="p-2 border border-slate-200 font-bold text-emerald-700">Jannat al-Baqi'</td>
                  <td className="p-2 border border-slate-200">Main cemetery of Madinah where Sahabah and Ahl al-Bayt rest.</td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-200 font-bold text-emerald-700">Masjid Quba</td>
                  <td className="p-2 border border-slate-200">First mosque in Islam. Reward for praying here is like an Umrah.</td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-200 font-bold text-emerald-700">Mount Uhud</td>
                  <td className="p-2 border border-slate-200">Site of the martyrs of Uhud, including Hamza ibn Abdul-Muttalib (RA).</td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-200 font-bold text-emerald-700">Masjid al-Qiblatayn</td>
                  <td className="p-2 border border-slate-200">Where the Qiblah was changed from Jerusalem to Makkah.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h5 className="font-bold text-rose-900 border-b border-rose-100 pb-1 mb-3 text-sm uppercase tracking-tight">Common Mistakes</h5>
          <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100 space-y-3">
            {[
              { m: "Making Du'a directly to the Prophet", c: "Du'a is only to Allah. Ask Allah for the Prophet's intercession." },
              { m: "Touching or kissing the grave walls", c: "Not allowed. Blessings come from Sunnah, not physical contact." },
              { m: "Believing it is part of Hajj", c: "Hajj is complete without Madinah, but visiting is highly recommended." }
            ].map((err, i) => (
              <div key={i} className="flex gap-3">
                <X size={14} className="text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-rose-900 text-[10px]">{err.m}</p>
                  <p className="text-[9px] text-rose-700 italic">Correct: {err.c}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-900 rounded-3xl p-6 text-white">
          <h5 className="font-black text-xs uppercase mb-4 text-emerald-400">Farewell Du'a</h5>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
            <p className="text-right text-lg font-arabic leading-loose uppercase tracking-tight">اللَّهُمَّ لَا تَجْعَلْهُ آخِرَ الْعَهْدِ مِنْ مَسْجِدِ نَبِيِّكَ، وَارْزُقْنِي زِيَارَةً أُخْرَى فِي حَيَاتِي</p>
            <p className="text-[10px] text-slate-300 italic">"Allahumma la taj'alhu aakhiral 'ahdi min masjidi nabiyyika, warzuqni ziyaratan ukhra fi hayati."</p>
            <p className="text-[10px] text-slate-400">(O Allah, do not make this the last time I visit the mosque of Your Prophet, and grant me another visit during my lifetime.)</p>
          </div>
        </section>
      </div>
    )
  }
];

const SALAH_DUAS = [
  {
    id: 'wudu',
    title: "Wudu's Dua",
    arabic: "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ. اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ",
    transliteration: "Ashhadu an la ilaha illallahu wahdahu la sharika lahu wa ashhadu anna Muhammadan 'abduhu wa Rasuluhu. Allahummaj'alni minat-tawwabina waj'alni minal-mutatahhirin.",
    translation: "I bear witness that there is no god but Allah, alone, without partner, and I bear witness that Muhammad is His servant and His Messenger. O Allah, make me among those who repent and make me among those who purify themselves."
  },
  {
    id: 'sana',
    title: "Sana Dua",
    arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلَا إِلَهَ غَيْرُكَ",
    transliteration: "Subhanakallahumma wa bihamdika wa tabarakasmuka wa ta'ala jadduka wa la ilaha ghayruk.",
    translation: "Glory be to You, O Allah, and all praise is Yours. Blessed is Your name and exalted is Your majesty. There is no god besides You."
  },
  {
    id: 'satan',
    title: "Prayer to escape from Satan’s deception",
    arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
    transliteration: "A'udhu billahi minash-shaytanir-rajim.",
    translation: "I seek refuge in Allah from Satan the outcast."
  },
  {
    id: 'ruku',
    title: "Tasbih of Ruku",
    arabic: "سُبْحَانَ رَبِّيَ الْعَظِيمِ",
    transliteration: "Subhana Rabbiyal 'Azim.",
    translation: "Glory be to my Lord, the Almighty."
  },
  {
    id: 'rising',
    title: "Dua After Rising from Ruku",
    arabic: "سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ. رَبَّنَا لَكَ الْحَمْدُ",
    transliteration: "Sami'allahu liman hamidah. Rabbana lakal hamd.",
    translation: "Allah hears those who praise Him. Our Lord, all praise is Yours."
  },
  {
    id: 'sujud',
    title: "Sijdar tasbih",
    arabic: "سُبْحَانَ رَبِّيَ الْأَعْلَى",
    transliteration: "Subhana Rabbiyal A'la.",
    translation: "Glory be to my Lord, the Most High."
  },
  {
    id: 'between',
    title: "Prayer between two prostrations",
    arabic: "رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي",
    transliteration: "Rabbighfirli, Rabbighfirli.",
    translation: "My Lord, forgive me. My Lord, forgive me."
  },
  {
    id: 'tashahhud',
    title: "Tashahhud (Attahiyatu)",
    arabic: "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    transliteration: "At-tahiyyatu lillahi was-salawatu wat-tayyibatu, as-salamu 'alayka ayyuhan-nabiyyu wa rahmatullahi wa barakatuhu, as-salamu 'alayna wa 'ala 'ibadillahis-salihin, ashhadu an la ilaha illallahu wa ashhadu anna Muhammadan 'abduhu wa Rasuluhu.",
    translation: "All compliments, prayers, and pure words are due to Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings. Peace be upon us and upon the righteous servants of Allah. I bear witness that there is no god but Allah, and I bear witness that Muhammad is His servant and His Messenger."
  },
  {
    id: 'durood',
    title: "Durood Sharif",
    arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ. اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ",
    transliteration: "Allahumma salli 'ala Muhammadin wa 'ala ali Muhammadin kama sallayta 'ala Ibrahima wa 'ala ali Ibrahima innaka Hamidum Majid. Allahumma barik 'ala Muhammadin wa 'ala ali Muhammadin kama barakta 'ala Ibrahima wa 'ala ali Ibrahima innaka Hamidum Majid.",
    translation: "O Allah, send prayers upon Muhammad and upon the family of Muhammad, as You sent prayers upon Ibrahim and upon the family of Ibrahim; You are indeed Worthy of Praise, Full of Glory. O Allah, send blessings upon Muhammad and upon the family of Muhammad, as You sent blessings upon Ibrahim and upon the family of Ibrahim; You are indeed Worthy of Praise, Full of Glory."
  },
  {
    id: 'masura',
    title: "Dua Masura",
    arabic: "اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي ظُلْمًا كَثِيرًا وَلَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ، فَاغْفِرْ لِي مَغْفِرَةً مِنْ عِنْدِكَ وَارْحَمْنِي إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ",
    transliteration: "Allahumma inni zalamtu nafsi zulman kathiran wa la yaghfiru dhunuba illa Anta, faghfir li maghfiratan min 'indika warhamni innaka Antal-Ghafurur-Rahim.",
    translation: "O Allah, I have greatly wronged myself, and no one forgives sins but You. So, grant me forgiveness from You and have mercy on me. You are the Oft-Forgiving, Most Merciful."
  },
  {
    id: 'kunut',
    title: "Dua Kunut",
    arabic: "اللَّهُمَّ إِنَّا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ وَنُؤْمِنُ بِكَ وَنَتَوَكَّلُ عَلَيْكَ وَنُثْنِي عَلَيْكَ الْخَيْرَ وَنَشْكُرُكَ وَلَا نَكْفُرُكَ وَنَخْلَعُ وَنَتْرُكُ مَنْ يَفْجُرُكَ. اللَّهُمَّ إِيَّاكَ نَعْبُدُ وَلَكَ نُصَلِّي وَنَسْجُدُ وَإِلَيْكَ نَسْعَى وَنَحْفِدُ وَنَرْجُو رَحْمَتَكَ وَنَخْشَى عَذَابَكَ إِنَّ عَذَابَكَ بِالْكُفَّارِ مُلْحِقٌ",
    transliteration: "Allahumma inna nasta'inuka wa nastaghfiruka wa nu'minu bika wa natawakkalu 'alayka wa nuthni 'alaykal-khayra wa nashkuruka wa la nakfuruka wa nakhla'u wa natruku man yafjuruk. Allahumma iyyaka na'budu wa laka nusalli wa nasjudu wa ilayka nas'a wa nahfidu wa narju rahmataka wa nakhsha 'adhabaka inna 'adhabaka bil-kuffari mulhiq.",
    translation: "O Allah, we seek Your help and Your forgiveness, we believe in You and rely on You. We praise You for all the good, we thank You and are not ungrateful to You. We cast off and leave those who disobey You. O Allah, You alone we worship, to You we pray and prostrate, for You we strive and serve. We hope for Your mercy and fear Your punishment. Indeed, Your punishment will overtake the disbelievers."
  }
];

const KALIMAS = [
  {
    id: 1,
    title: "First Kalima (Tayyaba)",
    arabic: "لَا إِلٰهَ إِلَّا اللهُ مُحَمَّدٌ رَسُولُ اللهِ",
    transliteration: "La ilaha illallahu Muhammadur Rasulullah",
    translation: "There is no god but Allah, and Muhammad is the messenger of Allah."
  },
  {
    id: 2,
    title: "Second Kalima (Shahadat)",
    arabic: "أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    transliteration: "Ash-hadu an la ilaha illallahu wahdahu la sharika lahu wa ash-hadu anna Muhammadan abduhu wa Rasuluhu",
    translation: "I bear witness that there is no god but Allah, He is alone and has no partner, and I bear witness that Muhammad is His servant and messenger."
  },
  {
    id: 3,
    title: "Third Kalima (Tamjeed)",
    arabic: "سُبْحَانَ اللهِ وَالْحَمْدُ لِلهِ وَلَا إِلٰهَ إِلَّا اللهُ وَاللهُ أَكْبَرُ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ الْعَلِيِّ الْعَظِيمِ",
    transliteration: "Subhanallahi wal-hamdu lillahi wa la ilaha illallahu wallahu akbar wa la hawla wa la quwwata illa billahil-aliyyil-azim",
    translation: "Glory be to Allah, and all praise be to Allah, and there is no god but Allah, and Allah is the Greatest. And there is no power and no strength except with Allah, the Most High, the Most Great."
  },
  {
    id: 4,
    title: "Fourth Kalima (Tauheed)",
    arabic: "لَا إِلٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ حَيٌّ لَا يَمُوتُ أَبَدًا أَبَدًا ذُو الْجَلَالِ وَالْإِكْرَامِ بِيَدِهِ الْخَيْرُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration: "La ilaha illallahu wahdahu la sharika lahu lahul-mulku wa lahul-hamdu yuhyi wa yumitu wa huwa hayyul-la yamutu abadan abada dhul-jalali wal-ikram biyadihil-khayr wa huwa ala kulli shay'in qadir",
    translation: "There is no god but Allah, He is alone and has no partner. For Him is the kingdom and for Him is the praise. He gives life and causes death, and He is living, He never dies, never ever. Possessor of Majesty and Honor. In His hand is all good, and He has power over all things."
  },
  {
    id: 5,
    title: "Fifth Kalima (Istighfar)",
    arabic: "أَسْتَغْفِرُ اللهَ رَبِّي مِنْ كُلِّ ذَنْبٍ أَذْنَبْتُهُ عَمَدًا أَوْ خَطَأً سِرًّا أَوْ عَلَانِيَةً وَأَتُوبُ إِلَيْهِ مِنَ الذَّنْبِ الَّذِي أَعْلَمُ وَمِنَ الذَّنْبِ الَّذِي لَا أَعْلَمُ إِنَّكَ أَنْتَ عَلَّامُ الْغُيُوبِ وَسَتَّارُ الْعُيُوبِ وَغَفَّارُ الذُّنُوبِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ الْعَلِيِّ الْعَظِيمِ",
    transliteration: "Astaghfirullaha rabbi min kulli dhanbin adhnabtuhu amadan aw khata'an sirran aw alaniyatan wa atubu ilayhi minadh-dhanbilladhi alamu wa minadh-dhanbilladhi la alamu innaka anta allamul-ghuyubi wa sattarul-uyubi wa ghaffarudh-dhunubi wa la hawla wa la quwwata illa billahil-aliyyil-azim",
    translation: "I seek forgiveness from Allah, my Lord, from every sin I committed knowingly or unknowingly, secretly or openly, and I turn to Him from the sin that I know and from the sin that I do not know. Indeed You, You are the Knower of the unseen, and the Concealer of faults, and the Forgiver of sins. And there is no power and no strength except with Allah, the Most High, the Most Great."
  },
  {
    id: 6,
    title: "Sixth Kalima (Radde Kufr)",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ أَنْ أُشْرِكَ بِكَ شَيْئًا وَأَنَا أَعْلَمُ بِهِ وَأَسْتَغْفِرُكَ لِمَا لَا أَعْلَمُ بِهِ تُبْتُ عَنْهُ وَتَبَرَّأْتُ مِنَ الْكُفْرِ وَالشِّرْكِ وَالْكِذْبِ وَالْغِيبَةِ وَالْبِدْعَةِ وَالنَّمِيمَةِ وَالْفَوَاحِشِ وَالْبُهْتَانِ وَالْمَعَاصِي كُلِّهَا وَأَسْلَمْتُ وَأَقُولُ لَا إِلٰهَ إِلَّا اللهُ مُحَمَّدٌ رَسُولُ اللهِ",
    transliteration: "Allahumma inni audhu bika min an ushrika bika shay'an wa ana alamu bihi wa astaghfiruka lima la alamu bihi tubtu anhu wa tabarratu minal-kufri wash-shirki wal-kidhbi wal-ghibati wal-bidati wan-namimati wal-fawahishi wal-buhtani wal-maasi kulliha wa aslamtu wa aqulu la ilaha illallahu Muhammadur Rasulullah",
    translation: "O Allah! I seek refuge in You from that I should associate anything with You while I know it. And I seek Your forgiveness for that which I do not know. I repent from it and I disassociate myself from disbelief and polytheism and lies and backbiting and innovation and slander and lewdness and calumny and all sins. And I submit and I say: There is no god but Allah, Muhammad is the messenger of Allah."
  }
];

const PILLAR_GUIDES = [
  {
    title: "Shahadah",
    desc: "The Testimony of Faith",
    icon: "☝️",
    content: (
      <div className="space-y-6 text-slate-700">
        <section className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
          <h4 className="text-xl font-black text-emerald-900 mb-3 flex items-center gap-2">
            <span className="text-2xl">☝️</span> Shahadah
          </h4>
          <p className="text-sm text-emerald-800 leading-relaxed font-bold">
            The Declaration of Faith. The testimony that makes a person a Muslim.
          </p>
        </section>

        <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
          <h5 className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mb-4">Arabic Testimony</h5>
          <div className="text-2xl font-arabic leading-relaxed mb-4 text-slate-900">
            أَشْهَدُ أَنْ لَا إِلَـٰــهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ
          </div>
          <p className="text-xs text-slate-500 italic mb-4">
            "Ash-hadu an la ilaha illallah, wa ash-hadu anna Muhammadan abduhu wa rasuluhu"
          </p>
          <div className="p-4 bg-emerald-50 rounded-2xl text-[10px] text-emerald-900 font-medium leading-relaxed">
            "I bear witness that there is no god worthy of worship except Allah, and I bear witness that Muhammad is His servant and messenger."
          </div>
        </section>

        <section>
          <h5 className="font-bold text-slate-900 border-b pb-1 mb-4 text-sm uppercase tracking-tight flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-500" />
            Conditions for Validity
          </h5>
          <div className="grid grid-cols-1 gap-2">
            {[
              "Said with full knowledge and understanding",
              "Said with certainty and sincerity (no doubt)",
              "Said from the heart, not just the tongue",
              "Rejecting all false gods"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 font-medium">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles size={40} />
          </div>
          <h5 className="font-black text-xs uppercase tracking-widest text-emerald-400 mb-2">The Effect</h5>
          <p className="text-xs text-slate-300 leading-relaxed">
            Entering Islam. All previous sins are forgiven, and a new life begins. It is the foundation upon which all other pillars are built.
          </p>
        </section>
      </div>
    )
  },
  {
    title: "Salah",
    desc: "The Five Daily Prayers",
    icon: "🧎",
    content: (
      <div className="space-y-6">
        <section className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
          <h4 className="text-xl font-black text-indigo-900 mb-3 flex items-center gap-2">
            <span className="text-2xl">🧎</span> Salah
          </h4>
          <p className="text-sm text-indigo-800 leading-relaxed">
            The second pillar and the most important act of worship after Shahadah. A direct link between the Creator and the created.
          </p>
        </section>

        <section>
          <div className="flex justify-between items-end mb-4">
            <h5 className="font-bold text-slate-900 text-sm uppercase tracking-tight">Prayer Schedule</h5>
            <div className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">17 Units (Rak'ah) Daily</div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left text-[10px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-bold text-slate-400 uppercase">Prayer</th>
                  <th className="px-4 py-3 font-bold text-slate-400 uppercase">Time Window</th>
                  <th className="px-4 py-3 font-bold text-slate-400 uppercase text-center">Rak'ah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { n: "Fajr", t: "Dawn until before sunrise", r: 2 },
                  { n: "Dhuhr", t: "After noon until afternoon", r: 4 },
                  { n: "Asr", t: "Late afternoon until sunset", r: 4 },
                  { n: "Maghrib", t: "Just after sunset until twilight", r: 3 },
                  { n: "Isha", t: "Night until dawn", r: 4 }
                ].map((p, i) => (
                  <tr key={i} className="bg-white">
                    <td className="px-4 py-3 font-black text-slate-900">{p.n}</td>
                    <td className="px-4 py-3 text-slate-500">{p.t}</td>
                    <td className="px-4 py-3 font-bold text-indigo-600 text-center">{p.r}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <h6 className="font-black text-slate-900 text-[10px] uppercase mb-3 flex items-center gap-2">
                <Check size={14} className="text-emerald-500" /> Prerequisites
              </h6>
              <ul className="space-y-2 text-[10px] text-slate-500">
                <li>• Ritual purity (Wudu)</li>
                <li>• Clean body, clothes, and place</li>
                <li>• Covering the Awrah</li>
                <li>• Facing the Qiblah</li>
                <li>• Intention (Niyyah) in heart</li>
              </ul>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <h6 className="font-black text-slate-900 text-[10px] uppercase mb-3 flex items-center gap-2">
                <AlertCircle size={14} className="text-rose-500" /> Invalidators
              </h6>
              <ul className="space-y-2 text-[10px] text-slate-500">
                <li>• Breaking Wudu (gas, toilet)</li>
                <li>• Talking intentionally</li>
                <li>• Laughing out loud</li>
                <li>• Eating or drinking</li>
                <li>• Turning away from Qiblah</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
          <h5 className="font-black text-slate-900 text-[10px] uppercase mb-4">Who is Exempt?</h5>
          <div className="grid grid-cols-1 gap-3">
            {[
              "Menstruating or postpartum women",
              "The unconscious or insane",
              "Children below puberty (encouraged but not obligated)"
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-3 text-[10px] text-slate-600">
                <div className="w-1 h-1 bg-slate-300 rounded-full" />
                {t}
              </div>
            ))}
          </div>
        </section>
      </div>
    )
  },
  {
    title: "Zakat",
    desc: "The Obligatory Charity",
    icon: "💰",
    content: (
      <div className="space-y-6">
        <section className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
          <h4 className="text-xl font-black text-amber-900 mb-3 flex items-center gap-2">
            <span className="text-2xl">💰</span> Zakat
          </h4>
          <p className="text-sm text-amber-800 leading-relaxed font-bold">
            2.5% of saved wealth given annually to the poor. Purifies wealth and soul.
          </p>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-amber-100 text-center">
            <p className="text-2xl font-black text-amber-600 mb-1">2.5%</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rate of Zakat</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-amber-100 text-center">
            <p className="text-[10px] font-black text-amber-600 mb-1">Nisab Threshold</p>
            <p className="text-[9px] text-slate-500 leading-tight">85g Gold / 595g Silver value</p>
          </div>
        </section>

        <section>
          <h5 className="font-bold text-slate-900 border-b pb-1 mb-4 text-sm uppercase tracking-tight">Assets Subject to Zakat</h5>
          <div className="grid grid-cols-2 gap-3">
            {[
              "Gold & Silver Jewelry",
              "Cash & Bank Savings",
              "Business Inventory",
              "Agricultural Produce",
              "Livestock",
              "Rental Income"
            ].map((t, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[10px] font-bold text-slate-600 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                {t}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h5 className="font-bold text-slate-900 border-b pb-1 mb-4 text-sm uppercase tracking-tight">The 8 Eligible Recipients</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              "The Poor (little/nothing)",
              "The Needy (insufficient)",
              "Zakat Collectors",
              "New Muslims (hearts reconciled)",
              "Freeing Slaves/Captives",
              "Those in Debt",
              "In the Path of Allah (students, etc)",
              "Stranded Travelers (Wayfarers)"
            ].map((t, i) => (
              <div key={i} className="p-3 bg-indigo-50/50 rounded-xl text-[10px] text-indigo-900 font-medium flex items-center gap-3">
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-[9px] font-black shadow-sm shrink-0">{i+1}</div>
                {t}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-900 rounded-3xl p-6 text-white text-center shadow-xl">
          <h5 className="font-black text-xs uppercase tracking-widest text-amber-400 mb-3">Benefits</h5>
          <p className="text-[10px] text-slate-400 leading-relaxed mb-4">
            "Purifies wealth, removes greed, helps society, and increases blessings."
          </p>
          <div className="flex justify-center gap-4">
            <Heart size={20} className="text-rose-400" />
            <Sparkles size={20} className="text-amber-400" />
            <Calculator size={20} className="text-emerald-400" />
          </div>
        </section>
      </div>
    )
  },
  {
    title: "Sawm",
    desc: "Fasting in Ramadan",
    icon: "🌙",
    content: (
      <div className="space-y-6">
        <section className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
          <h4 className="text-xl font-black text-emerald-900 mb-3 flex items-center gap-2">
            <span className="text-2xl">🌙</span> Sawm
          </h4>
          <p className="text-sm text-emerald-800 leading-relaxed">
            Complete abstinence from food, drink, and marital relations from dawn to sunset during the holy month of Ramadan.
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="p-4 bg-white rounded-2xl border border-slate-200">
            <h6 className="text-[8px] uppercase font-black text-slate-400 mb-1">Suhoor</h6>
            <p className="text-[10px] font-bold text-slate-700">Pre-dawn Meal</p>
          </div>
          <div className="p-4 bg-emerald-900 text-white rounded-2xl shadow-lg">
            <h6 className="text-[8px] uppercase font-black text-emerald-400 mb-1">Duration</h6>
            <p className="text-[10px] font-bold">29-30 Days</p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200">
            <h6 className="text-[8px] uppercase font-black text-slate-400 mb-1">Iftar</h6>
            <p className="text-[10px] font-bold text-slate-700">Break at Sunset</p>
          </div>
        </section>

        <section>
          <h5 className="font-bold text-slate-900 border-b pb-1 mb-4 text-sm uppercase tracking-tight">What Breaks the Fast?</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "Eating or drinking intentionally",
              "Vomiting deliberately",
              "Menstruation or postpartum bleeding",
              "Marital relations during day",
              "Nutritional injections"
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-rose-50 rounded-xl text-[10px] text-rose-900 font-bold">
                <XCircle size={14} className="text-rose-400 shrink-0" />
                {t}
              </div>
            ))}
          </div>
          <p className="mt-3 text-[9px] text-slate-400 leading-relaxed italic">
            Note: Forgetting and eating/drinking does NOT break the fast. You should complete it.
          </p>
        </section>

        <section>
          <h5 className="font-bold text-slate-900 border-b pb-1 mb-4 text-sm uppercase tracking-tight">Exemptions</h5>
          <div className="grid grid-cols-2 gap-3">
            {[
              { l: "Sick", d: "Make up later" },
              { l: "Traveler", d: "Make up later" },
              { l: "Pregnant", d: "Make up later" },
              { l: "Elderly", d: "Pay Fidyah" }
            ].map((item, i) => (
              <div key={i} className="p-3 bg-white border border-slate-200 rounded-xl">
                <p className="text-[10px] font-black text-slate-900">{item.l}</p>
                <p className="text-[8px] text-emerald-600 font-bold uppercase">{item.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-900 rounded-3xl p-6 text-white text-center">
          <h5 className="font-black text-xs uppercase text-emerald-400 mb-4">Expiation (Kaffarah)</h5>
          <p className="text-[10px] text-slate-400 leading-relaxed mb-4 px-4">
            For intentionally breaking fast without excuse: Fast 60 consecutive days OR feed 60 poor people.
          </p>
        </section>
      </div>
    )
  },
  {
    title: "Hajj",
    desc: "The Pilgrimage to Makkah",
    icon: "🕋",
    content: (
      <div className="space-y-6">
        <section className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
          <h4 className="text-xl font-black text-amber-900 mb-3 flex items-center gap-2">
            <span className="text-2xl">🕋</span> Hajj
          </h4>
          <p className="text-sm text-amber-800 leading-relaxed font-bold">
            Journey to the holy city of Makkah performed once in a lifetime by those who are able.
          </p>
        </section>

        <section>
          <h5 className="font-bold text-slate-900 border-b pb-1 mb-4 text-sm uppercase tracking-tight">Conditions for Obligation</h5>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            {["Muslim", "Adult", "Sane", "Physically Able", "Financially Able", "Safe Route", "Mahram (Women)"].map((t, i) => (
              <div key={i} className="p-2 bg-white border border-slate-100 rounded-xl text-[8px] font-bold text-slate-500 flex items-center justify-center uppercase">{t}</div>
            ))}
          </div>
        </section>

        <section>
          <h5 className="font-bold text-slate-900 text-sm uppercase mb-4">Core Rituals (Pillars)</h5>
          <div className="grid grid-cols-1 gap-3">
            {[
              { t: "1. Ihram", d: "Sacred state with intention and special clothing" },
              { t: "2. Wuquf", d: "Standing at Arafat on 9th Dhul-Hijjah" },
              { t: "3. Tawaf al-Ifadah", d: "Circling the Kaaba 7 times" },
              { t: "4. Sa'i", d: "Walking between Safa and Marwah 7 times" }
            ].map((item, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <h6 className="font-bold text-amber-900 text-[10px] uppercase mb-1">{item.t}</h6>
                <p className="text-[10px] text-slate-500 leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h5 className="font-bold text-slate-900 text-sm uppercase mb-4">Hajj Timeline</h5>
          <div className="space-y-3">
            {[
              { d: "8th Dhul-Hijjah", a: "Enter Ihram, go to Mina" },
              { d: "9th Dhul-Hijjah", a: "Arafat (Noon-Sunset), then Muzdalifah" },
              { d: "10th Dhul-Hijjah", a: "Stoning, Sacrifice, Shave, Tawaf" },
              { d: "11-13th", a: "Stone all Jamarat, Farewell Tawaf" }
            ].map((step, i) => (
              <div key={i} className="flex gap-4 p-4 bg-white border border-slate-100 rounded-2xl">
                <div className="w-16 shrink-0">
                  <p className="text-[8px] font-black text-amber-600 uppercase leading-tight">{step.d}</p>
                </div>
                <div className="border-l border-slate-100 pl-4">
                  <p className="text-[10px] font-bold text-slate-700 leading-relaxed">{step.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-emerald-900 rounded-3xl p-6 text-white text-center shadow-xl">
          <h5 className="font-black text-xs uppercase tracking-widest text-emerald-400 mb-3">Virtues</h5>
          <p className="text-[10px] text-emerald-100/70 leading-relaxed italic">
            "All past sins forgiven, guaranteed Paradise (if accepted), and unity of Muslims worldwide."
          </p>
        </section>
      </div>
    )
  }
];

const FESTIVAL_GUIDES = [
  {
    title: "Eid ul-Fitr",
    desc: "The festival of breaking the fast. Joy after Ramadan.",
    icon: "🌙",
    content: (
      <div className="space-y-6 text-slate-700">
        <section className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
          <h4 className="text-xl font-black text-emerald-900 mb-3 flex items-center gap-2">
            <span className="text-2xl">🌙</span> Eid al-Fitr
          </h4>
          <p className="text-sm text-emerald-800 leading-relaxed italic">
            Eid ul Fitr is one of the most important and joyful festivals in Islam. It marks the end of the holy month of Ramadan, during which Muslims fast from dawn to sunset.
          </p>
        </section>

        <section>
          <h5 className="font-bold text-slate-900 border-b pb-1 mb-4 text-sm uppercase tracking-tight flex items-center gap-2">
            <Sparkles size={16} className="text-amber-500" />
            Meaning & Significance
          </h5>
          <div className="grid grid-cols-1 gap-3">
            {[
              { t: "“Eid” means festival and “Fitr” means breaking the fast", i: "✨" },
              { t: "It is a day of gratitude to Allah for giving strength to complete Ramadan", i: "🤲" },
              { t: "A time for forgiveness, unity, and generosity", i: "🤝" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                <span className="text-xl shrink-0">{item.i}</span>
                <span className="text-sm font-medium text-slate-600">{item.t}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h5 className="font-bold text-slate-900 border-b pb-1 mb-4 text-sm uppercase tracking-tight flex items-center gap-2">
            <Building2 size={16} className="text-emerald-600" />
            Key Practices
          </h5>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h6 className="font-bold text-emerald-900 text-xs mb-2 uppercase">1. Eid Prayer (Salah)</h6>
              <p className="text-[10px] text-slate-500 leading-relaxed">Performed in congregation, usually in open grounds or mosques. Offered shortly after sunrise.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h6 className="font-bold text-emerald-900 text-xs mb-2 uppercase">2. Zakat al-Fitr</h6>
              <p className="text-[10px] text-slate-500 leading-relaxed">A special charity given before the Eid prayer. Ensures that even the poor can celebrate Eid.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h6 className="font-bold text-emerald-900 text-xs mb-2 uppercase">3. Takbir</h6>
              <p className="text-[10px] text-slate-500 mb-2 italic">"Allahu Akbar, Allahu Akbar, La ilaha illallah..."</p>
              <p className="text-[10px] text-slate-500 leading-relaxed">Recited from the night before Eid until the prayer.</p>
            </div>
          </div>
        </section>

        <section>
          <h5 className="font-bold text-slate-900 border-b pb-1 mb-4 text-sm uppercase tracking-tight flex items-center gap-2">
            <Heart size={16} className="text-rose-500" />
            How Muslims Celebrate
          </h5>
          <div className="grid grid-cols-2 gap-3">
            {[
              "Wear new or clean clothes",
              "Greet with 'Eid Mubarak'",
              "Visit family & friends",
              "Share sweets (semai, dates)",
              "Give gifts (Eidi) to children"
            ].map((item, i) => (
              <div key={i} className="p-3 bg-white rounded-xl border border-rose-100 text-[10px] font-bold text-rose-900 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-rose-400 rounded-full" />
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-900 rounded-3xl p-6 text-white text-center">
          <h5 className="font-black text-xs uppercase tracking-widest text-emerald-400 mb-4">Spiritual Message</h5>
          <p className="text-[10px] text-slate-300 leading-relaxed italic mb-4">
            "Eid ul Fitr is not just a celebration—it’s a reminder to continue good habits built in Ramadan, stay connected to prayer, and care for the needy."
          </p>
          <div className="grid grid-cols-3 gap-2">
            {["Continue Rituals", "Stay Connected", "Show Care"].map((t, i) => (
              <div key={i} className="py-2 px-1 bg-white/10 rounded-lg text-[8px] font-bold uppercase">{t}</div>
            ))}
          </div>
        </section>
      </div>
    )
  },
  {
    title: "Eid ul-Adha",
    desc: "The festival of sacrifice. Commemorating devotion.",
    icon: "🐐",
    content: (
      <div className="space-y-6">
        <section className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
          <h4 className="text-xl font-black text-amber-900 mb-3 flex items-center gap-2">
            <span className="text-2xl">🐐</span> Eid al-Adha
          </h4>
          <p className="text-sm text-amber-800 leading-relaxed italic">
            Eid ul Adha is the second major festival in Islam, celebrated on the 10th day of Dhul-Hijjah. It commemorates the devotion of Prophet Ibrahim (AS).
          </p>
        </section>

        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200">
              <h6 className="font-black text-slate-900 text-[10px] uppercase mb-2">Meaning & Importance</h6>
              <ul className="text-[10px] text-slate-500 space-y-2">
                <li>• “Eid” = festival, “Adha” = sacrifice</li>
                <li>• Symbolizes complete submission to Allah</li>
                <li>• Reminds us to let go of ego and selfishness</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200">
              <h6 className="font-black text-slate-900 text-[10px] uppercase mb-2">Sunnah Acts</h6>
              <ul className="text-[10px] text-slate-500 space-y-2">
                <li>• Take Ghusl (bath) before prayer</li>
                <li>• Wear clean or best clothes</li>
                <li>• Avoid eating before Eid prayer</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h5 className="font-bold text-slate-900 border-b pb-1 mb-4 text-sm uppercase tracking-tight flex items-center gap-2">
            <ClipboardList size={16} className="text-amber-600" />
            Key Religious Practices
          </h5>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h6 className="font-bold text-amber-900 text-xs mb-1 uppercase">1. Eid Prayer (Salah)</h6>
              <p className="text-[10px] text-slate-500">Performed after sunrise, followed by a khutbah (sermon).</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
              <h6 className="font-bold text-amber-900 text-xs mb-3 uppercase">2. Qurbani (Sacrifice)</h6>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { l: "Family", v: "1/3" },
                  { l: "Relatives", v: "1/3" },
                  { l: "The Poor", v: "1/3" }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-2 rounded-xl text-center border border-amber-100 shadow-sm">
                    <p className="text-[12px] font-black text-amber-600 mb-1">{item.v}</p>
                    <p className="text-[8px] uppercase font-bold text-slate-400">{item.l}</p>
                  </div>
                ))}
              </div>
              <p className="text-[9px] text-amber-700 mt-3 italic font-medium">Animals: Goat, sheep, cow, or camel. Done after prayer.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h6 className="font-bold text-amber-900 text-xs mb-1 uppercase">3. Takbir (Glorification)</h6>
              <p className="text-[10px] text-slate-500 mb-1 font-arabic text-right">اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، لَا إِلَهَ إِلَّا اللَّهُ</p>
              <p className="text-[9px] text-slate-400 leading-relaxed italic">Recited from 9th to 13th Dhul-Hijjah after every prayer.</p>
            </div>
          </div>
        </section>

        <section className="p-6 bg-slate-900 rounded-3xl text-white relative overflow-hidden">
          <div className="absolute bottom-0 right-0 p-4 opacity-5">
            <Compass size={60} />
          </div>
          <h5 className="font-black text-xs uppercase mb-3 text-emerald-400">Connection with Hajj</h5>
          <p className="text-[10px] text-slate-400 leading-relaxed px-1">
            Eid ul Adha occurs during Hajj. Pilgrims in Makkah perform special rites while Muslims worldwide join in spirit via sacrifice.
          </p>
        </section>
      </div>
    )
  }
];

const ZakatCalculator = () => {
  const [step, setStep] = useState(1);
  
  // Step 1: Nisab
  const [nisab, setNisab] = useState<string>('');
  
  // Step 2: Gold & Silver
  const [goldQuantity, setGoldQuantity] = useState<string>('');
  const [goldPrice, setGoldPrice] = useState<string>(''); // Price per 10g
  const [silverQuantity, setSilverQuantity] = useState<string>('');
  const [silverPrice, setSilverPrice] = useState<string>(''); // Price per 10g

  // Step 3: Property & Assets
  const [cash, setCash] = useState<string>('');
  const [investments, setInvestments] = useState<string>('');
  const [property, setProperty] = useState<string>('');
  const [business, setBusiness] = useState<string>('');
  const [agricultural, setAgricultural] = useState<string>('');
  const [others, setOthers] = useState<string>('');

  // Step 4: Liabilities
  const [debts, setDebts] = useState<string>('');
  const [liabilities, setLiabilities] = useState<string>('');

  const parse = (val: string) => parseFloat(val) || 0;

  const totalAssets = () => {
    const goldVal = (parse(goldQuantity) / 10) * parse(goldPrice);
    const silverVal = (parse(silverQuantity) / 10) * parse(silverPrice);
    return goldVal + silverVal + parse(cash) + parse(investments) + parse(property) + parse(business) + parse(agricultural) + parse(others);
  };

  const totalLiabilities = () => parse(debts) + parse(liabilities);
  
  const netWealth = totalAssets() - totalLiabilities();
  const nisabVal = parse(nisab);
  const isEligible = netWealth >= nisabVal && nisabVal > 0;
  const zakatPayable = isEligible ? netWealth * 0.025 : 0;

  const nextStep = () => setStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const saveSummary = () => {
    const summary = `
Zakat Calculation Summary
-------------------------
Nisab: ${nisab}
Total Assets: ${totalAssets().toFixed(2)}
Total Liabilities: ${totalLiabilities().toFixed(2)}
Net Wealth: ${netWealth.toFixed(2)}
Eligible: ${isEligible ? 'Yes' : 'No'}
Zakat Payable: ${zakatPayable.toFixed(2)}
    `;
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zakat_summary.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center shadow-inner">
            <Calculator size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">Zakat Calculator</h3>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Step {step} of 5</p>
          </div>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(s => (
            <div key={s} className={`w-8 h-1.5 rounded-full transition-all duration-500 ${step >= s ? 'bg-emerald-500' : 'bg-slate-100'}`} />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
              <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
                <span className="text-lg">Step 1:</span> Nisab Value
              </h4>
              <p className="text-sm text-emerald-800 leading-relaxed">
                Enter the Value of Nisab in your local currency. According to Sharia Law, Nisab is the minimum amount a person possesses for over a year in order to be obliged to pay Zakah. You can calculate nisab in terms of either Gold or Silver value. For Silver, the standard nisab is 21 ounces of silver (612.36 grams) or its equivalent in cash. For Gold, the standard nisab is 3 ounces of gold (87.48 grams) or its cash equivalent. (Note: check the value of gold and silver in your local currency)
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Nisab in Local Currency</label>
              <input 
                type="number"
                value={nisab}
                onChange={(e) => setNisab(e.target.value)}
                placeholder="Enter amount..."
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all text-lg font-bold"
              />
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
              <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
                <span className="text-lg">Step 2:</span> Gold & Silver
              </h4>
              <p className="text-sm text-emerald-800 leading-relaxed">
                In the next step, add the quantity of Gold and silver that you have possessed for more then a year and its price per 10 gram in your local currency. Each type (in Carats) of Gold you possess must be added separately as their values are different.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h5 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-400" /> Gold
                </h5>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Total Quantity (Grams)</label>
                  <input 
                    type="number"
                    value={goldQuantity}
                    onChange={(e) => setGoldQuantity(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Price per 10g</label>
                  <input 
                    type="number"
                    value={goldPrice}
                    onChange={(e) => setGoldPrice(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-300" /> Silver
                </h5>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Total Quantity (Grams)</label>
                  <input 
                    type="number"
                    value={silverQuantity}
                    onChange={(e) => setSilverQuantity(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Price per 10g</label>
                  <input 
                    type="number"
                    value={silverPrice}
                    onChange={(e) => setSilverPrice(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
              <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
                <span className="text-lg">Step 3:</span> Property & Assets
              </h4>
              <p className="text-sm text-emerald-800 leading-relaxed">
                In this step, add the values of Cash, Properties and stocks in your possession for more then a year as Zakat is applicable on them as well.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Cash in Hand/Bank', value: cash, setter: setCash },
                { label: 'Investments/Stocks', value: investments, setter: setInvestments },
                { label: 'Property Value', value: property, setter: setProperty },
                { label: 'Business Assets', value: business, setter: setBusiness },
                { label: 'Agricultural Assets', value: agricultural, setter: setAgricultural },
                { label: 'Other Assets', value: others, setter: setOthers },
              ].map((item, i) => (
                <div key={i}>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{item.label}</label>
                  <input 
                    type="number"
                    value={item.value}
                    onChange={(e) => item.setter(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 outline-none"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div 
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
              <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
                <span className="text-lg">Step 4:</span> Liabilities & Debts
              </h4>
              <p className="text-sm text-emerald-800 leading-relaxed">
                In this final step, you need to add your debts and liabilities, the payments that are due on you and debts that you have to give. These amounts are subtracted from your assets/possessions in the final calculation to determine the Zakah obligatory on you.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Debts to be Paid</label>
                <input 
                  type="number"
                  value={debts}
                  onChange={(e) => setDebts(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Other Liabilities</label>
                <input 
                  type="number"
                  value={liabilities}
                  onChange={(e) => setLiabilities(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 outline-none"
                />
              </div>
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div 
            key="step5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
              <div className="relative z-10">
                <h4 className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-4">Calculation Summary</h4>
                <p className="text-xs text-slate-400 mb-6">
                  After completion of the steps above, a summary appears which tells you whether you are eligible to pay Zakat and, if you are, the zakat that you have to pay appears. The payable zakat is 2.5% of your overall possessions.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-slate-400 text-sm">Total Assets</span>
                    <span className="font-bold">{totalAssets().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-slate-400 text-sm">Total Liabilities</span>
                    <span className="font-bold text-red-400">-{totalLiabilities().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-slate-400 text-sm">Net Wealth</span>
                    <span className="font-bold text-emerald-400">{netWealth.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Nisab Threshold</span>
                    <span className="font-bold">{nisabVal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                  {isEligible ? (
                    <>
                      <p className="text-emerald-400 font-bold mb-1">You are eligible to pay Zakat</p>
                      <p className="text-4xl font-black text-white mb-2">{zakatPayable.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">2.5% of Net Wealth</p>
                    </>
                  ) : (
                    <p className="text-slate-400 font-medium">Your net wealth is below the Nisab threshold. Zakat is not obligatory.</p>
                  )}
                </div>
              </div>
            </div>

            <button 
              onClick={saveSummary}
              className="w-full py-4 bg-slate-100 text-slate-900 font-bold rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
            >
              <Download size={20} />
              Save Summary to Record
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 pt-8 border-t border-slate-100 flex gap-4">
        {step > 1 && (
          <button 
            onClick={prevStep}
            className="flex-1 py-4 bg-slate-50 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
          >
            <ChevronLeft size={20} />
            Back
          </button>
        )}
        {step < 5 && (
          <button 
            onClick={nextStep}
            className="flex-[2] py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
          >
            Continue
            <ChevronRight size={20} />
          </button>
        )}
        {step === 5 && (
          <button 
            onClick={() => setStep(1)}
            className="flex-1 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all"
          >
            Recalculate
          </button>
        )}
      </div>
    </div>
  );
};

const TasbihCounter = ({ onIncrement }: { onIncrement: (phrase: string) => void }) => {
  const [count, setCount] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const phrases = TASBIH_PHRASES;

  const currentPhrase = phrases[phraseIndex];
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playClickSound = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const audioCtx = audioCtxRef.current;
      
      // Resume context if it's suspended (browser policy)
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      // Satisfying click sound: 
      // A very fast frequency sweep from high to low with a square/triangle mix
      oscillator.type = 'triangle'; 
      oscillator.frequency.setValueAtTime(1800, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.02);

      // Quick attack and decay for a "clicky" feel
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.002); // Loud but short
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.02);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.02);
    } catch (e) {
      console.error('Audio context error:', e);
    }
  };

  const handleIncrement = () => {
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }
    
    // Sound feedback
    playClickSound();

    // Update global stats
    onIncrement(currentPhrase.text);

    if (count + 1 >= currentPhrase.limit) {
      setCount(0);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    } else {
      setCount(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCount(0);
    setPhraseIndex((prev) => (prev - 1 + phrases.length) % phrases.length);
  };

  const handleNext = () => {
    setCount(0);
    setPhraseIndex((prev) => (prev + 1) % phrases.length);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm overflow-hidden border border-slate-100">
            <img 
              src="https://i.postimg.cc/bZwcYCK9/tasbih.png" 
              alt="Tasbih beads" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Tasbih Counter</h3>
            <p className="text-xs text-slate-500">Digital prayer beads</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrevious}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={handleNext}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
          >
            <ChevronLeft size={20} className="rotate-180" />
          </button>
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <h4 className="text-xl font-bold text-emerald-700 mb-1">{currentPhrase.text}</h4>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Limit: {currentPhrase.limit}</p>
        </div>

        <button 
          onClick={handleIncrement}
          className="w-40 h-40 rounded-full bg-slate-900 text-white flex flex-col items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all border-8 border-slate-800"
        >
          <span className="text-5xl font-black mb-1">{count}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Tap to Count</span>
        </button>

        <div className="flex items-center gap-4 w-full">
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${(count / currentPhrase.limit) * 100}%` }}
            />
          </div>
          <button 
            onClick={() => setCount(0)}
            className="text-[10px] font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

const DailySurahReminder = ({ 
  surahs, 
  onPlay, 
  playingId, 
  isPlaying, 
  isLoading 
}: { 
  surahs: Surah[], 
  onPlay: (e: React.MouseEvent, surah: Surah) => void,
  playingId: number | null,
  isPlaying: boolean,
  isLoading: number | null
}) => {
  const [offset, setOffset] = useState(0);

  if (!surahs || surahs.length === 0) return null;

  // Select "Surah of the Moment" based on today's date + local offset
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const dailySurahIndex = (dayOfYear + offset) % surahs.length;
  const dailySurah = surahs[dailySurahIndex];

  const isCurrentPlaying = playingId === dailySurah.id;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextOffset = offset + 1;
    setOffset(nextOffset);
    const nextSurahIndex = (dayOfYear + nextOffset) % surahs.length;
    const nextSurah = surahs[nextSurahIndex];
    onPlay(e, nextSurah);
  };

  return (
    <div className="bg-sepia-50 rounded-2xl p-6 border border-sepia-200 shadow-sm mb-4 group hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center shadow-inner border border-emerald-100 group-hover:scale-105 transition-transform overflow-hidden relative">
            <img 
              src="https://i.postimg.cc/gnnhbNnm/quran-3.png" 
              alt="Surah Listening" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-sepia-900">Surah of the Moment</h3>
              <div className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[8px] font-black uppercase rounded-full tracking-widest">Recommended</div>
            </div>
            <p className="text-xs text-emerald-700 font-bold tracking-tight">
              {dailySurah.name_simple} <span className="opacity-40 mx-1">•</span> {dailySurah.translated_name.name}
            </p>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-[10px] font-bold text-sepia-600 flex items-center gap-1">
                 <List size={12} className="text-sepia-400" /> {dailySurah.verses_count} Verses
              </span>
              <span className="text-[10px] font-bold text-sepia-600 flex items-center gap-1">
                 <MapPin size={12} className="text-sepia-400" /> {dailySurah.revelation_place}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Play Button */}
          <button 
            onClick={(e) => onPlay(e, dailySurah)}
            disabled={isLoading === dailySurah.id}
            className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 relative overflow-hidden group/btn",
              isCurrentPlaying && isPlaying 
                ? "bg-rose-500 text-white shadow-lg shadow-rose-100" 
                : "bg-emerald-600 text-white shadow-lg shadow-emerald-100 hover:scale-105 active:scale-95"
            )}
          >
            {isLoading === dailySurah.id ? (
              <Loader2 size={24} className="animate-spin" />
            ) : isCurrentPlaying && isPlaying ? (
              <Pause size={24} fill="currentColor" />
            ) : (
              <Play size={24} className="ml-1" fill="currentColor" />
            )}

            {/* Decorative Wave Design inside button */}
            <div className="absolute -bottom-2 left-0 right-0 h-1 flex gap-0.5 px-3 items-end opacity-40">
               {[0.4, 0.7, 0.3, 0.9, 0.5, 0.8, 0.4].map((h, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "flex-1 bg-white rounded-t-sm",
                      isCurrentPlaying && isPlaying && "animate-pulse"
                    )} 
                    style={{ height: `${h * 100}%` }} 
                  />
               ))}
            </div>
          </button>

          {/* Next Button */}
          <button 
            onClick={handleNext}
            className="w-12 h-12 bg-sepia-200/50 text-sepia-600 rounded-2xl flex items-center justify-center hover:bg-sepia-200 hover:text-sepia-900 transition-all active:scale-95 border border-sepia-300 shadow-sm group/next"
            title="Next Surah"
          >
            <ArrowRight size={22} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

const SalahDashboard = ({ 
  salahHistory, 
  selectedDate, 
  onDateChange 
}: { 
  salahHistory: { [date: string]: string[] },
  selectedDate: string,
  onDateChange: (date: string) => void
}) => {
  const currentProgress = salahHistory[selectedDate] || [];
  
  const totalRakats = SALAH_REQUIREMENTS.reduce((acc, prayer) => 
    acc + prayer.rakats.reduce((pAcc, r) => pAcc + r.count, 0), 0
  );
  
  const completedRakats = SALAH_REQUIREMENTS.reduce((acc, prayer) => 
    acc + prayer.rakats.reduce((pAcc, r) => 
      currentProgress.includes(r.id) ? pAcc + r.count : pAcc, 0
    ), 0
  );

  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toDateString();
  });

  const headers = [
    { title: 'Sunnah', sub: 'Muakkadah/Ghair' },
    { title: 'Fardh', sub: 'Obligatory' },
    { title: 'Sunnah', sub: 'Muakkadah' },
    { title: 'Nafl', sub: 'Voluntary' },
    { title: 'Witr', sub: 'Wajib' },
    { title: 'Nafl', sub: 'Voluntary' }
  ];
  
  const getRakatForCell = (prayerName: string, colIndex: number) => {
    const prayer = SALAH_REQUIREMENTS.find(p => p.name === prayerName);
    if (!prayer) return null;

    if (prayerName === 'Fajr') {
      if (colIndex === 0) return prayer.rakats[0];
      if (colIndex === 1) return prayer.rakats[1];
    }
    if (prayerName === 'Dhuhr') {
      if (colIndex === 0) return prayer.rakats[0];
      if (colIndex === 1) return prayer.rakats[1];
      if (colIndex === 2) return prayer.rakats[2];
      if (colIndex === 3) return prayer.rakats[3];
    }
    if (prayerName === 'Asr') {
      if (colIndex === 0) return prayer.rakats[0];
      if (colIndex === 1) return prayer.rakats[1];
    }
    if (prayerName === 'Maghrib') {
      if (colIndex === 1) return prayer.rakats[0];
      if (colIndex === 2) return prayer.rakats[1];
      if (colIndex === 3) return prayer.rakats[2];
    }
    if (prayerName === 'Isha') {
      return prayer.rakats[colIndex];
    }
    return null;
  };

  return (
    <div className="bg-white border-2 border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
      <div className="p-2 sm:p-3 border-b-2 border-black bg-black text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h3 className="font-black uppercase text-lg sm:text-2xl flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            Salah Performance
          </h3>
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/20 rounded-md border border-emerald-500/30">
            <span className="text-[8px] sm:text-[10px] font-black text-emerald-400">
              {completedRakats}/{totalRakats} <span className="hidden sm:inline">Rakats</span>
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <select 
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="bg-slate-800 text-white text-[9px] sm:text-[10px] font-bold uppercase py-1 pl-2 pr-6 rounded border border-slate-700 outline-none appearance-none cursor-pointer hover:bg-slate-700 transition-colors"
            >
              {last30Days.map(date => (
                <option key={date} value={date}>
                  {date === new Date().toDateString() ? 'Today' : date}
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
          </div>
          <span className="text-[8px] sm:text-[9px] font-normal text-slate-400 uppercase">Read Only</span>
        </div>
      </div>
      <div className="w-full overflow-hidden">
        <table className="w-full border-collapse table-fixed">
          <thead>
            <tr className="bg-slate-50">
              <th className="border-b border-r border-black py-2 sm:py-4 px-1 text-[7px] sm:text-[9px] font-normal uppercase text-black text-center w-[14%]">Prayer</th>
              {headers.map((h, i) => (
                <th key={i} className="border-b border-r border-black py-2 sm:py-4 px-0.5 text-center w-[14.3%]">
                  <div className="flex flex-col leading-none">
                    <span className="text-[7px] sm:text-[9px] font-normal uppercase text-black truncate">{h.title}</span>
                    <span className="text-[5px] sm:text-[7px] font-normal uppercase text-black mt-0.5 truncate px-0.5">
                      {h.sub.split('/')[0]}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((pName) => (
              <tr key={pName} className="group hover:bg-slate-50/50 transition-colors">
                <td className="border-b border-r border-black py-2 sm:py-4 px-1 font-normal text-[8px] sm:text-[10px] uppercase text-black bg-slate-50/50 group-hover:bg-slate-100 transition-colors truncate text-center">
                  {pName}
                </td>
                {headers.map((_, i) => {
                  const rakat = getRakatForCell(pName, i);
                  if (!rakat) return <td key={i} className="border-b border-r border-black py-2 sm:py-4 px-0.5 bg-slate-100/10" />;
                  
                  const isCompleted = currentProgress.includes(rakat.id);
                  
                  return (
                    <td key={i} className="border-b border-r border-black py-2 sm:py-4 px-0.5 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        {isCompleted ? (
                          <div className="w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shadow-sm">
                            <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={4} />
                          </div>
                        ) : (
                          <div className="w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-md bg-rose-50 text-rose-400 flex items-center justify-center border border-rose-100 shadow-sm">
                            <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={4} />
                          </div>
                        )}
                        <span className="text-[6px] sm:text-[8px] font-normal text-slate-900 leading-none">
                          {rakat.count}R
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DailyAmalIcon = ({ size, className }: { size?: number, className?: string }) => (
  <img 
    src="https://i.postimg.cc/ft7nmt83/koran-1.png" 
    alt="Daily Amal" 
    style={{ width: size, height: size }} 
    className={cn("object-contain", className)}
    referrerPolicy="no-referrer"
  />
);

const HomeNavIcon = ({ size, className }: { size?: number, className?: string }) => (
  <img 
    src="https://i.postimg.cc/5XZ2mzS8/moon-1.png" 
    alt="Home" 
    style={{ width: size, height: size }} 
    className={cn("object-contain", className)}
    referrerPolicy="no-referrer"
  />
);

const DeenNavIcon = ({ size, className }: { size?: number, className?: string }) => (
  <img 
    src="https://i.postimg.cc/QKptBdT0/islamic-pattern.png" 
    alt="Deen" 
    style={{ width: size, height: size }} 
    className={cn("object-contain", className)}
    referrerPolicy="no-referrer"
  />
);

const DashboardNavIcon = ({ size, className }: { size?: number, className?: string }) => (
  <img 
    src="https://i.postimg.cc/0z6NmnDt/koran-2.png" 
    alt="Dashboard" 
    style={{ width: size, height: size }} 
    className={cn("object-contain", className)}
    referrerPolicy="no-referrer"
  />
);

const TasbihDashboard = ({ stats }: { stats: { daily: { [key: string]: number }, lifetime: { [key: string]: number } } }) => {
  return (
    <div className="bg-white border-2 border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
      <div className="p-2 sm:p-3 border-b-2 border-black bg-black text-white flex items-center justify-between">
        <h3 className="font-black uppercase text-lg sm:text-2xl flex items-center gap-1.5 sm:gap-2">
          <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse" />
          Tasbih Counter Dashboard
        </h3>
        <span className="text-[8px] sm:text-[9px] font-normal text-black uppercase">Read Only</span>
      </div>
      <div className="w-full overflow-hidden">
        <table className="w-full border-collapse table-fixed">
          <thead>
            <tr className="bg-slate-50">
              <th className="border-b border-r border-black py-2 sm:py-4 px-1 text-[7px] sm:text-[9px] font-normal uppercase text-black text-center w-[40%]">Dua / Phrase</th>
              <th className="border-b border-r border-black py-2 sm:py-4 px-1 text-[7px] sm:text-[9px] font-normal uppercase text-black text-center w-[30%]">Today</th>
              <th className="border-b border-black py-2 sm:py-4 px-1 text-[7px] sm:text-[9px] font-normal uppercase text-black text-center w-[30%]">Lifetime</th>
            </tr>
          </thead>
          <tbody>
            {TASBIH_PHRASES.map((phrase) => (
              <tr key={phrase.text} className="group hover:bg-slate-50/50 transition-colors">
                <td className="border-b border-r border-black py-2 sm:py-4 px-2 font-normal text-[8px] sm:text-[10px] uppercase text-black bg-slate-50/50 group-hover:bg-slate-100 transition-colors truncate">
                  {phrase.text}
                </td>
                <td className="border-b border-r border-black py-2 sm:py-4 px-1 text-center font-black text-emerald-600 text-[9px] sm:text-[12px]">
                  {stats.daily[phrase.text] || 0}
                </td>
                <td className="border-b border-black py-2 sm:py-4 px-1 text-center font-black text-blue-600 text-[9px] sm:text-[12px]">
                  {stats.lifetime[phrase.text] || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const NamesOfAllah = () => {
  const names = [
    { ar: 'ٱللَّٰه', en: 'Allah', tr: 'The One and Only God' },
    { ar: 'ٱلرَّحْمَٰنُ', en: 'Ar-Rahman', tr: 'The Most Gracious' },
    { ar: 'ٱلرَّحِيمُ', en: 'Ar-Raheem', tr: 'The Most Merciful' },
    { ar: 'ٱلْمَلِكُ', en: 'Al-Malik', tr: 'The King' },
    { ar: 'ٱلْقُدُّوسُ', en: 'Al-Quddus', tr: 'The Most Holy' },
    { ar: 'ٱلسَّلَامُ', en: 'As-Salam', tr: 'The Source of Peace' },
    { ar: 'ٱلْمُؤْمِنُ', en: 'Al-Mu\'min', tr: 'The Giver of Faith' },
    { ar: 'ٱلْمُهَيْمِنُ', en: 'Al-Muhaymin', tr: 'The Guardian' },
    { ar: 'ٱلْعَزِيزُ', en: 'Al-Aziz', tr: 'The Almighty' },
    { ar: 'ٱلْجَبَّارُ', en: 'Al-Jabbar', tr: 'The Compeller' },
    { ar: 'ٱلْمُتَكَبِّرُ', en: 'Al-Mutakabbir', tr: 'The Supreme' },
    { ar: 'ٱلْخَالِقُ', en: 'Al-Khaliq', tr: 'The Creator' },
    { ar: 'ٱلْبَارِئُ', en: 'Al-Bari\'', tr: 'The Evolver' },
    { ar: 'ٱلْمُصَوِّرُ', en: 'Al-Musawwir', tr: 'The Fashioner' },
    { ar: 'ٱلْغَفَّارُ', en: 'Al-Ghaffar', tr: 'The Forgiver' },
    { ar: 'ٱلْقَهَّارُ', en: 'Al-Qahhar', tr: 'The Subduer' },
    { ar: 'ٱلْوَهَّابُ', en: 'Al-Wahhab', tr: 'The Bestower' },
    { ar: 'ٱلرَّزَّاقُ', en: 'Ar-Razzaq', tr: 'The Provider' },
    { ar: 'ٱلْفَتَّاحُ', en: 'Al-Fattah', tr: 'The Opener' },
    { ar: 'ٱلْعَلِيمُ', en: 'Al-Alim', tr: 'The All-Knowing' },
    { ar: 'ٱلْقَابِضُ', en: 'Al-Qabid', tr: 'The Withholder' },
    { ar: 'ٱلْبَاسِطُ', en: 'Al-Basit', tr: 'The Expander' },
    { ar: 'ٱلْخَافِضُ', en: 'Al-Khafid', tr: 'The Abaser' },
    { ar: 'ٱلرَّافِعُ', en: 'Ar-Rafi\'', tr: 'The Exalter' },
    { ar: 'ٱلْمُعِزُّ', en: 'Al-Mu\'izz', tr: 'The Bestower of Honor' },
    { ar: 'ٱلْمُذِلُّ', en: 'Al-Mudhill', tr: 'The Humiliator' },
    { ar: 'ٱلسَّمِيعُ', en: 'As-Sami\'', tr: 'The All-Hearing' },
    { ar: 'ٱلْبَصِيرُ', en: 'Al-Basir', tr: 'The All-Seeing' },
    { ar: 'ٱلْحَكَمُ', en: 'Al-Hakam', tr: 'The Judge' },
    { ar: 'ٱلْعَدْلُ', en: 'Al-Adl', tr: 'The Just' },
    { ar: 'ٱللَّطِيفُ', en: 'Al-Latif', tr: 'The Subtle One' },
    { ar: 'ٱلْخَبِيرُ', en: 'Al-Khabir', tr: 'The All-Aware' },
    { ar: 'ٱلْحَلِيمُ', en: 'Al-Halim', tr: 'The Forbearing' },
    { ar: 'ٱلْعَظِيمُ', en: 'Al-Azim', tr: 'The Magnificent' },
    { ar: 'ٱلْغَفُورُ', en: 'Al-Ghafur', tr: 'The All-Forgiving' },
    { ar: 'ٱلشَّكُورُ', en: 'Ash-Shakur', tr: 'The Appreciative' },
    { ar: 'ٱلْعَلِيُّ', en: 'Al-Aliyy', tr: 'The Most High' },
    { ar: 'ٱلْكَبِيرُ', en: 'Al-Kabir', tr: 'The Most Great' },
    { ar: 'ٱلْحَفِيظُ', en: 'Al-Hafiz', tr: 'The Preserver' },
    { ar: 'ٱلْمُقِيتُ', en: 'Al-Muqit', tr: 'The Sustainer' },
    { ar: 'ٱلْحَسِيبُ', en: 'Al-Hasib', tr: 'The Reckoner' },
    { ar: 'ٱلْجَلِيلُ', en: 'Al-Jalil', tr: 'The Majestic' },
    { ar: 'ٱلْكَرِيمُ', en: 'Al-Karim', tr: 'The Generous' },
    { ar: 'ٱلرَّقِيبُ', en: 'Ar-Raqib', tr: 'The Watchful' },
    { ar: 'ٱلْمُجِيبُ', en: 'Al-Mujib', tr: 'The Responsive' },
    { ar: 'ٱلْوَاسِعُ', en: 'Al-Wasi\'', tr: 'The All-Encompassing' },
    { ar: 'ٱلْحَكِيمُ', en: 'Al-Hakim', tr: 'The Wise' },
    { ar: 'ٱلْوَدُودُ', en: 'Al-Wadud', tr: 'The Loving' },
    { ar: 'ٱلْمَجِيدُ', en: 'Al-Majid', tr: 'The Glorious' },
    { ar: 'ٱلْبَاعِثُ', en: 'Al-Ba\'ith', tr: 'The Resurrector' },
    { ar: 'ٱلشَّهِيدُ', en: 'Ash-Shahid', tr: 'The Witness' },
    { ar: 'ٱلْحَقُّ', en: 'Al-Haqq', tr: 'The Truth' },
    { ar: 'ٱلْوَكِيلُ', en: 'Al-Wakil', tr: 'The Trustee' },
    { ar: 'ٱلْقَوِيُّ', en: 'Al-Qawiyy', tr: 'The Strong' },
    { ar: 'ٱلْمَتِينُ', en: 'Al-Matin', tr: 'The Firm' },
    { ar: 'ٱلْوَلِيُّ', en: 'Al-Waliyy', tr: 'The Protecting Friend' },
    { ar: 'ٱلْحَمِيدُ', en: 'Al-Hamid', tr: 'The Praiseworthy' },
    { ar: 'ٱلْمُحْصِي', en: 'Al-Muhsi', tr: 'The Counter' },
    { ar: 'ٱلْمُبْدِئُ', en: 'Al-Mubdi\'', tr: 'The Originator' },
    { ar: 'ٱلْمُعِيدُ', en: 'Al-Mu\'id', tr: 'The Restorer' },
    { ar: 'ٱلْمُحْيِي', en: 'Al-Muhyi', tr: 'The Giver of Life' },
    { ar: 'ٱلْمُممِيتُ', en: 'Al-Mumit', tr: 'The Bringer of Death' },
    { ar: 'ٱلْحَيُّ', en: 'Al-Hayy', tr: 'The Ever-Living' },
    { ar: 'ٱلْقَيُّومُ', en: 'Al-Qayyum', tr: 'The Self-Subsisting' },
    { ar: 'ٱلْوَاجِدُ', en: 'Al-Wajid', tr: 'The Finder' },
    { ar: 'ٱلْمَاجِدُ', en: 'Al-Maajid', tr: 'The Noble' },
    { ar: 'ٱلْوَاحِدُ', en: 'Al-Wahid', tr: 'The Unique' },
    { ar: 'ٱلْأَحَدُ', en: 'Al-Ahad', tr: 'The One' },
    { ar: 'ٱصَّمَدُ', en: 'As-Samad', tr: 'The Eternal' },
    { ar: 'ٱلْقَادِرُ', en: 'Al-Qadir', tr: 'The Able' },
    { ar: 'ٱلْمُقْتَدِرُ', en: 'Al-Muqtadir', tr: 'The Powerful' },
    { ar: 'ٱلْمُقَدِّمُ', en: 'Al-Muqaddim', tr: 'The Expediter' },
    { ar: 'ٱلْمُؤَخِّرُ', en: 'Al-Mu\'akhkhir', tr: 'The Delayer' },
    { ar: 'ٱلْأَوَّلُ', en: 'Al-Awwal', tr: 'The First' },
    { ar: 'ٱلْآخِرُ', en: 'Al-Akhir', tr: 'The Last' },
    { ar: 'ٱلظَّاهِرُ', en: 'Az-Zahir', tr: 'The Manifest' },
    { ar: 'ٱلْبَاطِنُ', en: 'Al-Batin', tr: 'The Hidden' },
    { ar: 'ٱلْوَالِي', en: 'Al-Wali', tr: 'The Governor' },
    { ar: 'ٱلْمُتَعَالِي', en: 'Al-Muta\'ali', tr: 'The Most Exalted' },
    { ar: 'ٱلْبَرُّ', en: 'Al-Barr', tr: 'The Source of All Goodness' },
    { ar: 'ٱلتَّوَّابُ', en: 'At-Tawwab', tr: 'The Acceptor of Repentance' },
    { ar: 'ٱلْمُنْتَقِمُ', en: 'Al-Muntaqim', tr: 'The Avenger' },
    { ar: 'ٱلْعَفُوُّ', en: 'Al-Afuww', tr: 'The Pardoner' },
    { ar: 'ٱلرَّؤُوفُ', en: 'Ar-Ra\'uf', tr: 'The Compassionate' },
    { ar: 'مَالِكُ ٱلْمُلْكِ', en: 'Malik-ul-Mulk', tr: 'The Owner of All Sovereignty' },
    { ar: 'ذُو ٱلْجَلَالِ وَٱلْإِكْرَامِ', en: 'Dhul-Jalal wal-Ikram', tr: 'The Lord of Majesty and Generosity' },
    { ar: 'ٱلْمُقْسِطُ', en: 'Al-Muqsit', tr: 'The Equitable' },
    { ar: 'ٱلْجَامِعُ', en: 'Al-Jami\'', tr: 'The Gatherer' },
    { ar: 'ٱلْغَنِيُّ', en: 'Al-Ghaniyy', tr: 'The Self-Sufficient' },
    { ar: 'ٱلْمُغْنِي', en: 'Al-Mughni', tr: 'The Enricher' },
    { ar: 'ٱلْمَانِعُ', en: 'Al-Mani\'', tr: 'The Preventer' },
    { ar: 'ٱلضَّارُّ', en: 'Ad-Darr', tr: 'The Distresser' },
    { ar: 'ٱلنَّافِعُ', en: 'An-Nafi\'', tr: 'The Propitious' },
    { ar: 'ٱلنُّورُ', en: 'An-Nur', tr: 'The Light' },
    { ar: 'ٱلْهَادِي', en: 'Al-Hadi', tr: 'The Guide' },
    { ar: 'ٱلْبَدِيعُ', en: 'Al-Badi\'', tr: 'The Incomparable' },
    { ar: 'ٱلْبَاقِي', en: 'Al-Baqi', tr: 'The Everlasting' },
    { ar: 'ٱلْوَارِثُ', en: 'Al-Warith', tr: 'The Inheritor' },
    { ar: 'ٱلرَّشِيدُ', en: 'Ar-Rashid', tr: 'The Guide to the Right Path' },
    { ar: 'ٱلصَّبُورُ', en: 'As-Sabur', tr: 'The Patient' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center">
          <Heart size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">99 Names</h3>
          <p className="text-xs text-slate-500">Asma-ul-Husna</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {names.map(name => (
          <div key={name.en} className="p-6 bg-white rounded-2xl border border-slate-200 text-center hover:border-amber-400 hover:shadow-lg transition-all group">
            <p className="text-4xl font-arabic text-amber-700 mb-3 group-hover:scale-105 transition-transform">{name.ar}</p>
            <p className="text-sm font-bold text-slate-900 mb-1">{name.en}</p>
            <p className="text-xs text-slate-500 leading-relaxed italic">{name.tr}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
const MAJOR_HADITH_COLLECTIONS = [
  { name: 'Sahih al-Bukhari', link: 'https://sunnah.com/bukhari' },
  { name: 'Sahih Muslim', link: 'https://sunnah.com/muslim' },
  { name: 'Sunan Abu Dawud', link: 'https://sunnah.com/abudawud' },
  { name: 'Jami` at-Tirmidhi', link: 'https://sunnah.com/tirmidhi' },
  { name: 'Sunan an-Nasa\'i', link: 'https://sunnah.com/nasai' },
  { name: 'Sunan Ibn Majah', link: 'https://sunnah.com/ibnmajah' },
];

const OTHER_HADITH_COLLECTIONS = [
  { name: 'Muwatta Malik', link: 'https://sunnah.com/malik' },
  { name: 'Riyad as-Salihin', link: 'https://sunnah.com/riyad' },
  { name: 'Forty Hadith Nawawi', link: 'https://sunnah.com/nawawi40' },
  { name: 'Al-Adab al-Mufrad', link: 'https://sunnah.com/adab' },
  { name: 'Bulugh al-Maram', link: 'https://sunnah.com/bulugh' },
  { name: 'Shama\'il Muhammadiyah', link: 'https://sunnah.com/shamail' },
  { name: 'Musnad Ahmad', link: 'https://sunnah.com/ahmad' },
  { name: 'Sunan ad-Darimi', link: 'https://sunnah.com/darimi' },
  { name: 'Sahih (Darussalam)', link: 'https://sunnah.com/darusalam' },
];

const HadithSection = () => {
  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
        <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-2">Daily Reminder</h4>
        <p className="text-slate-700 font-medium italic">"I have left among you two things; you will never go astray as long as you hold fast to them; the book of Allah and my Sunnah."</p>
        <p className="text-[10px] text-slate-400 mt-2">— Prophet Muhammad (PBUH) (Al-Muwatta, Imam Malik)</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center overflow-hidden">
            <img 
              src="https://i.postimg.cc/5XXFJb6m/hadith-collection-icon.png" 
              alt="Hadith Collection" 
              className="w-6 h-6 object-contain" 
              referrerPolicy="no-referrer" 
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Major Collections</h3>
            <p className="text-xs text-slate-500">The Six Authentic Books (Kutub al-Sittah)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MAJOR_HADITH_COLLECTIONS.map(book => (
            <a
              key={book.name}
              href={book.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-6 rounded-2xl border border-slate-200 text-left hover:border-indigo-500 hover:shadow-md transition-all group flex flex-col items-center justify-center text-center gap-4"
            >
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 transition-all duration-300 overflow-hidden">
                <img 
                  src="https://i.postimg.cc/mzf9VJZY/hadith-icon.png" 
                  alt={book.name} 
                  className="w-8 h-8 object-contain group-hover:brightness-0 group-hover:invert transition-all duration-300" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight text-sm">{book.name}</h4>
                <div className="flex items-center justify-center gap-1.5 text-slate-400 group-hover:text-indigo-400 transition-colors">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Read Collection</span>
                  <ExternalLink size={10} />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
            <ScrollText size={20} className="text-slate-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Other Collections</h3>
            <p className="text-xs text-slate-500">Additional authentic Hadith compilations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {OTHER_HADITH_COLLECTIONS.map(book => (
            <a
              key={book.name}
              href={book.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-6 rounded-2xl border border-slate-200 text-left hover:border-emerald-500 hover:shadow-md transition-all group flex flex-col items-center justify-center text-center gap-4"
            >
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 transition-all duration-300 overflow-hidden">
                <img 
                  src="https://i.postimg.cc/mzf9VJZY/hadith-icon.png" 
                  alt={book.name} 
                  className="w-8 h-8 object-contain group-hover:brightness-0 group-hover:invert transition-all duration-300" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors uppercase tracking-tight text-sm">{book.name}</h4>
                <div className="flex items-center justify-center gap-1.5 text-slate-400 group-hover:text-emerald-400 transition-colors">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Read Collection</span>
                  <ExternalLink size={10} />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

const SavedItemsView = ({ 
  bookmarkedSurahs, 
  surahs, 
  setActiveTab, 
  setDeenSubTab, 
  handleSurahClick, 
  toggleSurahBookmark, 
  bookmarkedDuas, 
  DUAS, 
  toggleDuaBookmark,
  isCollapsible = false,
  isExpanded = true,
  onToggle = () => {}
}: any) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div 
        className={cn(
          "p-6 flex items-center justify-between",
          (isExpanded || !isCollapsible) && "border-b border-slate-100",
          isCollapsible && "cursor-pointer hover:bg-slate-50 transition-colors"
        )}
        onClick={isCollapsible ? onToggle : undefined}
      >
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <Bookmark className="text-amber-600" size={20} />
          Saved Items
        </h3>
        {isCollapsible && (
          <ChevronDown 
            size={20} 
            className={cn("text-slate-400 transition-transform duration-300", isExpanded && "rotate-180")} 
          />
        )}
      </div>
      <AnimatePresence>
        {(isExpanded || !isCollapsible) && (
          <motion.div 
            initial={isCollapsible ? { height: 0, opacity: 0 } : false}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 space-y-8">
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Saved Surahs</h4>
                {bookmarkedSurahs.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">No saved surahs yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {surahs.filter((s: any) => bookmarkedSurahs.includes(s.id)).map((surah: any) => (
                      <motion.div
                        key={surah.id}
                        onClick={() => {
                          setActiveTab('deen');
                          setDeenSubTab('quran');
                          handleSurahClick(surah);
                        }}
                        className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-emerald-200 transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[10px] font-black text-slate-400">
                            {surah.id}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-xs">{surah.name_simple}</h4>
                            <p className="text-[8px] text-slate-500">{surah.translated_name.name}</p>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => toggleSurahBookmark(e, surah.id)}
                          className="text-amber-600 p-1.5"
                        >
                          <Bookmark size={14} fill="currentColor" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Saved Duas</h4>
                {bookmarkedDuas.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">No saved duas yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {DUAS.filter((d: any) => bookmarkedDuas.includes(d.id)).map((dua: any) => (
                      <div key={dua.id} className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest">{dua.category}</span>
                          <button onClick={() => toggleDuaBookmark(dua.id)} className="text-emerald-600">
                            <Bookmark size={16} fill="currentColor" />
                          </button>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm mb-2">{dua.title}</h4>
                        <p className="text-right text-base font-arabic mb-3 leading-relaxed">{dua.arabic}</p>
                        <p className="text-[10px] text-slate-500 leading-relaxed">{dua.translation}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StreakCalendar = ({ visitedDates }: { visitedDates: string[] }) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const todayStr = now.toISOString().split('T')[0];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const monthName = now.toLocaleString('default', { month: 'long' });

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const date = new Date(currentYear, currentMonth, day);
    const dateStr = date.toISOString().split('T')[0];
    const isVisited = visitedDates.includes(dateStr);
    const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
    const isToday = dateStr === todayStr;

    return { day, dateStr, isVisited, isPast, isToday };
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Flame className="text-orange-500" size={20} />
            Streak Calendar
          </h3>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{monthName} {currentYear}</span>
        </div>
        <p className="text-xs text-slate-500 font-medium italic">“Keep going, you’re doing great”</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-tighter">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {days.map(d => (
            <div key={d.day} className={cn(
              "relative flex flex-col items-center justify-center p-2 rounded-xl border aspect-square transition-all",
              d.isToday ? "border-indigo-200 bg-indigo-50/30" : "border-slate-50 bg-slate-50/50"
            )}>
              <span className={cn(
                "text-xs font-bold",
                d.isToday ? "text-indigo-600" : "text-slate-600"
              )}>
                {d.day}
              </span>
              <div className="absolute -top-1 -right-1">
                {d.isVisited ? (
                  <div className="bg-orange-500 text-white rounded-full p-0.5 shadow-sm">
                    <Flame size={10} fill="currentColor" />
                  </div>
                ) : d.isPast ? (
                  <div className="bg-rose-500 text-white rounded-full p-0.5 shadow-sm">
                    <X size={10} />
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [quranAuthToken, setQuranAuthToken] = useState<string | null>(() => {
    return localStorage.getItem('quran_foundation_token');
  });

  const handleQuranConnect = async () => {
    try {
      const { url } = await quranUserService.getAuthUrl();
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const authWindow = window.open(
        url,
        'quran_foundation_login',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!authWindow) {
        alert('Please allow popups to connect your Quran Foundation account.');
      }
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  const syncQuranData = async () => {
    if (!quranAuthToken) return;
    try {
      const data = await quranUserService.syncBookmarks(quranAuthToken);
      alert(data.message || 'Successfully synchronized with Quran Foundation!');
      logActivity('quran', 'Synchronized with Quran Foundation');
    } catch (error) {
      console.error('Sync failed:', error);
      alert('Cloud sync failed. Please try again.');
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // In production, validate origin
      if (event.data?.type === 'QURAN_AUTH_SUCCESS') {
        const token = event.data.token;
        setQuranAuthToken(token);
        localStorage.setItem('quran_foundation_token', token);
        logActivity('quran', 'Connected to Quran Foundation');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const [activeTab, setActiveTab] = useState<'home' | 'deen' | 'amal' | 'dashboard'>('home');
  const [deenSubTab, setDeenSubTab] = useState<'grid' | 'quran' | 'names' | 'hadith' | 'prayer' | 'saved' | 'zakat' | 'events' | 'ramadan' | 'hajj' | 'qibla' | 'calendar' | 'dua_deen' | 'kalima' | 'pillars' | 'festivals'>('grid');
  const [prayerSubTab, setPrayerSubTab] = useState<'menu' | 'wudu' | 'salah' | 'surah' | 'steps'>('menu');
  const [amalSubTab, setAmalSubTab] = useState<'quran' | 'dua'>('quran');
  const [selectedSalahDua, setSelectedSalahDua] = useState<string | null>(null);
  const [selectedEssentialSurah, setSelectedEssentialSurah] = useState<number | null>(null);
  const [selectedHajjGuide, setSelectedHajjGuide] = useState<number | null>(null);
  
  // Clock and Calendars
  const [timeString, setTimeString] = useState<string>(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
  const [hijriDate, setHijriDate] = useState<string>('');
  const [hijriCalendar, setHijriCalendar] = useState<any[]>([]);

  // Quran States
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [surahDetail, setSurahDetail] = useState<any>(null);
  const [tafsir, setTafsir] = useState<Tafsir[]>([]);
  const [surahInfo, setSurahInfo] = useState<SurahInfo | null>(null);
  const [audio, setAudio] = useState<Recitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [surahTab, setSurahTab] = useState<'verses' | 'tafsir' | 'info'>('verses');
  const [listPlayingId, setListPlayingId] = useState<number | null>(null);
  const [listAudioLoading, setListAudioLoading] = useState<number | null>(null);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [homeHadith, setHomeHadith] = useState<{ text: string, source: string } | null>(null);
  const [isDashboardSavedItemsExpanded, setIsDashboardSavedItemsExpanded] = useState(false);

  // Khatam Player States
  const [khatamSurahIndex, setKhatamSurahIndex] = useState<number>(() => {
    const saved = localStorage.getItem('khatam_surah_index');
    return saved ? parseInt(saved) : 0;
  });
  const [khatamTime, setKhatamTime] = useState<number>(() => {
    const saved = localStorage.getItem('khatam_time');
    return saved ? parseFloat(saved) : 0;
  });
  const [isKhatamMode, setIsKhatamMode] = useState<boolean>(false);

  // Salah Tracker States
  const [salahHistory, setSalahHistory] = useState<{ [date: string]: string[] }>(() => {
    const saved = localStorage.getItem('salah_history');
    if (saved) return JSON.parse(saved);
    
    // Migration from old salah_progress
    const oldSaved = localStorage.getItem('salah_progress');
    if (oldSaved) {
      const { date, completed } = JSON.parse(oldSaved);
      return { [date]: completed };
    }
    return {};
  });

  // Tasbih Stats
  const [tasbihStats, setTasbihStats] = useState<{
    daily: { [phrase: string]: number },
    lifetime: { [phrase: string]: number },
    lastUpdate: string
  }>(() => {
    const saved = localStorage.getItem('tasbih_stats');
    const today = new Date().toDateString();
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.lastUpdate === today) {
        return parsed;
      } else {
        return {
          ...parsed,
          daily: {},
          lastUpdate: today
        };
      }
    }
    return { daily: {}, lifetime: {}, lastUpdate: today };
  });

  useEffect(() => {
    localStorage.setItem('tasbih_stats', JSON.stringify(tasbihStats));
  }, [tasbihStats]);

  const updateTasbihCount = (phrase: string) => {
    setTasbihStats(prev => {
      const today = new Date().toDateString();
      const isNewDay = prev.lastUpdate !== today;
      
      const newDaily = isNewDay ? { [phrase]: 1 } : {
        ...prev.daily,
        [phrase]: (prev.daily[phrase] || 0) + 1
      };
      
      const newLifetime = {
        ...prev.lifetime,
        [phrase]: (prev.lifetime[phrase] || 0) + 1
      };
      
      return {
        daily: newDaily,
        lifetime: newLifetime,
        lastUpdate: today
      };
    });
  };

  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  const [currentPrayer, setCurrentPrayer] = useState<string | null>(null);
  const [showAllSalah, setShowAllSalah] = useState(false);
  const [showForbiddenTimes, setShowForbiddenTimes] = useState(false);
  const [nextPrayerInfo, setNextPrayerInfo] = useState<{ name: string, remaining: string } | null>(null);

  const convertTo12Hour = (time24: string) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const calculateTimeRemaining = (timings: any) => {
    if (!timings) return;
    const now = new Date();
    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    
    let nextP = null;
    let nextPTime = null;

    for (const p of prayers) {
      const [h, m] = timings[p].split(':').map(Number);
      const pDate = new Date();
      pDate.setHours(h, m, 0, 0);
      
      if (pDate > now) {
        nextP = p;
        nextPTime = pDate;
        break;
      }
    }

    if (!nextP) {
      // Next is tomorrow's Fajr
      nextP = 'Fajr';
      const [h, m] = timings['Fajr'].split(':').map(Number);
      nextPTime = new Date();
      nextPTime.setDate(nextPTime.getDate() + 1);
      nextPTime.setHours(h, m, 0, 0);
    }

    const diff = nextPTime.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setNextPrayerInfo({
      name: nextP,
      remaining: `${hours}h ${minutes}m ${seconds}s`
    });
  };

  const getPrayerIcon = (prayer: string, isActive: boolean = false) => {
    const size = 18;
    const colorClass = isActive ? "text-white" : {
      'Fajr': "text-orange-600",
      'Dhuhr': "text-yellow-600",
      'Asr': "text-amber-700",
      'Maghrib': "text-rose-600",
      'Isha': "text-indigo-600",
    }[prayer] || "text-slate-400";

    switch (prayer) {
      case 'Fajr': return <Sunrise className={cn(colorClass, "drop-shadow-sm")} size={size} />;
      case 'Dhuhr': return <Sun className={cn(colorClass, "drop-shadow-sm")} size={size} />;
      case 'Asr': return <Sun className={cn(colorClass, "drop-shadow-sm")} size={size} />;
      case 'Maghrib': return <Sunset className={cn(colorClass, "drop-shadow-sm")} size={size} />;
      case 'Isha': return <Moon className={cn(colorClass, "drop-shadow-sm")} size={size} />;
      default: return <Clock className={cn(colorClass, "drop-shadow-sm")} size={size} />;
    }
  };

  // Daily Amal
  const [amalBookmarks, setAmalBookmarks] = useState<BookmarkType[]>([]);
  const [selectedDuaCategory, setSelectedDuaCategory] = useState<string | null>(null);

  // Dashboard
  const [dashboardHistory, setDashboardHistory] = useState<DashboardStats[]>(() => {
    const saved = localStorage.getItem('dashboard_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [surahsListenedCount, setSurahsListenedCount] = useState<number>(() => {
    const saved = localStorage.getItem('surahs_listened_count');
    return saved ? parseInt(saved) : 0;
  });

  const [bookmarkedDuas, setBookmarkedDuas] = useState<string[]>(() => {
    const saved = localStorage.getItem('bookmarked_duas');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedDashboardDate, setSelectedDashboardDate] = useState<string>(new Date().toDateString());
  const [selectedRamadanGuide, setSelectedRamadanGuide] = useState<number | null>(null);
  const [selectedFestival, setSelectedFestival] = useState<number | null>(null);
  const [selectedPillar, setSelectedPillar] = useState<number | null>(null);

  const salahProgress = salahHistory[new Date().toDateString()] || [];

  const setSalahProgress = (update: string[] | ((prev: string[]) => string[])) => {
    setSalahHistory(prevHistory => {
      const today = new Date().toDateString();
      const current = prevHistory[today] || [];
      const next = typeof update === 'function' ? update(current) : update;
      
      // Check if actually changed to prevent unnecessary re-renders
      if (current.length === next.length && current.every((val, index) => next.includes(val))) {
        return prevHistory;
      }
      
      return {
        ...prevHistory,
        [today]: next
      };
    });
  };

  const [bookmarkedSurahs, setBookmarkedSurahs] = useState<number[]>(() => {
    const saved = localStorage.getItem('bookmarked_surahs');
    return saved ? JSON.parse(saved) : [];
  });

  // Streak System
  const [streakCount, setStreakCount] = useState<number>(() => {
    const saved = localStorage.getItem('user_streak_count');
    return saved ? parseInt(saved) : 0;
  });

  const [visitedDates, setVisitedDates] = useState<string[]>(() => {
    const saved = localStorage.getItem('visited_dates');
    return saved ? JSON.parse(saved) : [];
  });

  // Scroll to top on navigation changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [deenSubTab, selectedRamadanGuide, selectedHajjGuide, selectedFestival, selectedPillar, selectedSurah]);

  useEffect(() => {
    const updateStreak = () => {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const lastVisit = localStorage.getItem('last_visit_date');
      
      // Update visited dates
      setVisitedDates(prev => {
        if (!prev.includes(today)) {
          const newDates = [...prev, today];
          localStorage.setItem('visited_dates', JSON.stringify(newDates));
          return newDates;
        }
        return prev;
      });

      if (!lastVisit) {
        setStreakCount(1);
        localStorage.setItem('user_streak_count', '1');
        localStorage.setItem('last_visit_date', today);
      } else if (lastVisit !== today) {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (lastVisit === yesterdayStr) {
          const newStreak = streakCount + 1;
          setStreakCount(newStreak);
          localStorage.setItem('user_streak_count', newStreak.toString());
        } else {
          setStreakCount(1);
          localStorage.setItem('user_streak_count', '1');
        }
        localStorage.setItem('last_visit_date', today);
      }
    };

    updateStreak();
  }, []);

  const [recentActivity, setRecentActivity] = useState<{ id: string, type: 'salah' | 'quran', title: string, time: string }[]>(() => {
    const saved = localStorage.getItem('recent_activity');
    return saved ? JSON.parse(saved) : [];
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    localStorage.setItem('dashboard_history', JSON.stringify(dashboardHistory));
  }, [dashboardHistory]);

  useEffect(() => {
    localStorage.setItem('surahs_listened_count', surahsListenedCount.toString());
  }, [surahsListenedCount]);

  useEffect(() => {
    localStorage.setItem('bookmarked_duas', JSON.stringify(bookmarkedDuas));
  }, [bookmarkedDuas]);

  useEffect(() => {
    localStorage.setItem('bookmarked_surahs', JSON.stringify(bookmarkedSurahs));
  }, [bookmarkedSurahs]);

  useEffect(() => {
    localStorage.setItem('recent_activity', JSON.stringify(recentActivity));
  }, [recentActivity]);

  const logActivity = (type: 'salah' | 'quran', title: string) => {
    const newActivity = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    };
    setRecentActivity(prev => [newActivity, ...prev].slice(0, 10));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeString(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
      if (prayerTimes) {
        calculateTimeRemaining(prayerTimes);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [prayerTimes]);

  useEffect(() => {
    const stats: DashboardStats = {
      date: new Date().toDateString(),
      completedRakats: getDailyStats().completed,
      totalRakats: getDailyStats().total,
      surahListens: surahsListenedCount,
      missedPrayers: (() => {
        let missed = 0;
        ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].forEach(p => {
          if (getPrayerStats(p).isMissed) missed++;
        });
        return missed;
      })()
    };
    
    setDashboardHistory(prev => {
      // Only update if stats have actually changed to prevent infinite loops
      const today = stats.date;
      const existing = prev.find(h => h.date === today);
      
      if (existing && 
          existing.completedRakats === stats.completedRakats && 
          existing.totalRakats === stats.totalRakats && 
          existing.surahListens === stats.surahListens && 
          existing.missedPrayers === stats.missedPrayers) {
        return prev;
      }

      const filtered = prev.filter(h => h.date !== today);
      const updated = [stats, ...filtered].slice(0, 15);
      return updated;
    });
  }, [salahHistory, surahsListenedCount, currentPrayer]);

  useEffect(() => {
    const fetchHijri = async () => {
      try {
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-GB').replace(/\//g, '-');
        const response = await fetch(`https://api.aladhan.com/v1/gToH?date=${dateStr}`);
        const data = await response.json();
        if (data.data) {
          setHijriDate(`${data.data.hijri.day} ${data.data.hijri.month.en} ${data.data.hijri.year} AH`);
        }

        // Fetch full month calendar
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        const calResponse = await fetch(`https://api.aladhan.com/v1/gToHCalendar/${month}/${year}`);
        const calData = await calResponse.json();
        if (calData.data) {
          setHijriCalendar(calData.data);
        }
      } catch (err) {
        console.error("Hijri fetch error:", err);
      }
    };
    fetchHijri();
  }, []);


  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const data = await quranService.getSurahs();
        setSurahs(data);
        setFilteredSurahs(data);
      } catch (error) {
        console.error('Error fetching surahs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSurahs();
  }, []);

  // Safe play function
  const safePlay = async () => {
    if (audioRef.current) {
      try {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error("Playback error:", error);
          setIsPlaying(false);
        }
      }
    }
  };

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      safePlay();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, audio?.audio_url]);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        // Default to London if geolocation fails
        let lat = 51.5074;
        let lng = -0.1278;

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((pos) => {
            lat = pos.coords.latitude;
            lng = pos.coords.longitude;
            fetchTimes(lat, lng);
          }, () => fetchTimes(lat, lng));
        } else {
          fetchTimes(lat, lng);
        }
      } catch (error) {
        console.error('Error fetching prayer times:', error);
      }
    };

    const fetchTimes = async (lat: number, lng: number) => {
      try {
        const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=2`);
        const data = await response.json();
        if (data.data) {
          setPrayerTimes(data.data.timings);
          detectCurrentPrayer(data.data.timings);
        }
      } catch (err) {
        console.error("Fetch times error:", err);
      }
    };

    fetchPrayerTimes();
  }, []);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * SMALL_HADITHS.length);
    setHomeHadith(SMALL_HADITHS[randomIndex]);
  }, []);

  const detectCurrentPrayer = (timings: any) => {
    const now = new Date();
    const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    let detected = 'Isha'; // Default to Isha if it's late night

    for (let i = 0; i < prayers.length; i++) {
      const prayerTime = timings[prayers[i]];
      const nextPrayerTime = timings[prayers[i + 1]] || timings['Fajr']; // Loop back to Fajr

      if (currentTimeStr >= prayerTime && (i === prayers.length - 1 || currentTimeStr < nextPrayerTime)) {
        detected = prayers[i];
        break;
      }
    }
    if (currentPrayer !== detected) {
      setCurrentPrayer(detected);
    }
  };

  useEffect(() => {
    localStorage.setItem('salah_history', JSON.stringify(salahHistory));
  }, [salahHistory]);

  const toggleSalahProgress = (id: string) => {
    const prayer = SALAH_REQUIREMENTS.find(p => p.rakats.some(r => r.id === id));
    if (!prayer || prayer.name !== currentPrayer) return;

    const isCompleting = !salahProgress.includes(id);
    setSalahProgress(prev => 
      isCompleting ? [...prev, id] : prev.filter(p => p !== id)
    );
    
    if (isCompleting) {
      const rakat = prayer.rakats.find(r => r.id === id);
      if (rakat) {
        logActivity('salah', `Completed ${rakat.count} ${rakat.label} for ${prayer.name}`);
      }
    }
  };

  const toggleDuaBookmark = (duaId: string) => {
    setBookmarkedDuas(prev => 
      prev.includes(duaId) 
        ? prev.filter(id => id !== duaId) 
        : [...prev, duaId]
    );
  };

  const toggleSurahBookmark = (e: React.MouseEvent, surahId: number) => {
    e.stopPropagation();
    setBookmarkedSurahs(prev => 
      prev.includes(surahId) 
        ? prev.filter(id => id !== surahId) 
        : [...prev, surahId]
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Fardh': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Wajib': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Sunnah Muakkadah': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Sunnah Ghair Muakkadah': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Nafl': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getPrayerStats = (prayerName: string, date: string = new Date().toDateString()) => {
    const progress = salahHistory[date] || [];
    const prayer = SALAH_REQUIREMENTS.find(p => p.name === prayerName);
    if (!prayer) return { total: 0, completed: 0, isMissed: false };

    const total = prayer.rakats.reduce((acc, r) => acc + r.count, 0);
    const completedRakats = prayer.rakats.filter(r => progress.includes(r.id));
    const completed = completedRakats.reduce((acc, r) => acc + r.count, 0);

    let isMissed = false;
    const isPastDate = new Date(date) < new Date(new Date().toDateString());

    if (isPastDate) {
      if (completed < total) isMissed = true;
    } else if (prayerTimes) {
      const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
      const currentIndex = prayers.indexOf(currentPrayer || '');
      const prayerIndex = prayers.indexOf(prayerName);

      // If the prayer is in the past and not fully completed
      if (prayerIndex < currentIndex && completed < total) {
        isMissed = true;
      }
    }

    return { total, completed, isMissed };
  };

  const getDailyStats = (date: string = new Date().toDateString()) => {
    const progress = salahHistory[date] || [];
    let total = 0;
    let completed = 0;

    SALAH_REQUIREMENTS.forEach(prayer => {
      total += prayer.rakats.reduce((acc, r) => acc + r.count, 0);
      completed += prayer.rakats
        .filter(r => progress.includes(r.id))
        .reduce((acc, r) => acc + r.count, 0);
    });

    return { total, completed };
  };

  useEffect(() => {
    const filtered = surahs.filter(s => 
      s.name_simple.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.translated_name.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toString() === searchQuery
    );
    setFilteredSurahs(filtered);
  }, [searchQuery, surahs]);

  const handleSurahClick = async (surah: Surah) => {
    const isSameSurah = selectedSurah?.id === surah.id;
    const wasPlayingSameSurah = listPlayingId === surah.id && isPlaying;
    
    if (isSameSurah) {
      setSurahTab('verses');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSelectedSurah(surah);
    setDetailLoading(true);
    setSurahTab('verses');
    // Don't reset isPlaying if we're already playing this surah
    if (!wasPlayingSameSurah) {
      setIsPlaying(false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    try {
      // If we're already playing this surah from the list, we don't need to re-fetch audio
      const fetchPromises: any[] = [
        quranService.getSurahTranslation(surah.id),
        quranService.getSurahTafsir(surah.id),
        quranService.getArabicText(surah.id),
        quranService.getSurahInfo(surah.id)
      ];
      
      if (!wasPlayingSameSurah) {
        fetchPromises.push(quranService.getSurahAudio(surah.id));
      }
      
      const results = await Promise.all(fetchPromises);
      const translation = results[0];
      const tafsirData = results[1];
      const arabicData = results[2];
      const infoData = results[3];
      const audioData = wasPlayingSameSurah ? audio : results[4];
      
      // Merge arabic text into translation data for easier display
      const mergedAyahs = translation.ayahs.map((ayah: any, index: number) => ({
        ...ayah,
        arabicText: arabicData.ayahs[index].text
      }));
      
      setSurahDetail({ ...translation, ayahs: mergedAyahs });
      if (audioData) setAudio(audioData);
      setTafsir(tafsirData);
      setSurahInfo(infoData);
    } catch (error) {
      console.error('Error fetching surah details:', error);
    } finally {
      setDetailLoading(false);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleListPlay = async (e: React.MouseEvent, surah: Surah) => {
    e.stopPropagation();
    
    if (listPlayingId === surah.id) {
      setIsPlaying(!isPlaying);
      if (isKhatamMode) setIsKhatamMode(false);
      return;
    }

    setListAudioLoading(surah.id);
    try {
      const audioData = await quranService.getSurahAudio(surah.id);
      setAudio(audioData);
      setListPlayingId(surah.id);
      setIsPlaying(true);
      setIsKhatamMode(false);
      setSurahsListenedCount(prev => prev + 1);
      logActivity('quran', `Started listening to Surah ${surah.name_simple}`);
    } catch (error) {
      console.error('Error playing list audio:', error);
    } finally {
      setListAudioLoading(null);
    }
  };

  const handleKhatamPlay = async () => {
    if (!surahs.length) return;

    const currentSurah = surahs[khatamSurahIndex];
    
    // If we're already in Khatam mode and playing this surah, just toggle
    if (isKhatamMode && listPlayingId === currentSurah.id) {
      setIsPlaying(!isPlaying);
      return;
    }

    // If we're switching to Khatam mode but the surah is already loaded (e.g. from Al-Quran)
    if (listPlayingId === currentSurah.id) {
      setIsKhatamMode(true);
      if (audioRef.current) {
        // Use a small delay to ensure state is updated and audio is ready
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.currentTime = khatamTime;
            setIsPlaying(true);
          }
        }, 100);
      } else {
        setIsPlaying(true);
      }
      return;
    }

    setListAudioLoading(currentSurah.id);
    setIsKhatamMode(true);
    try {
      const audioData = await quranService.getSurahAudio(currentSurah.id);
      
      const isSameUrl = audio?.audio_url === audioData.audio_url;
      
      setAudio(audioData);
      setListPlayingId(currentSurah.id);
      setIsPlaying(true);

      if (isSameUrl && audioRef.current) {
        audioRef.current.currentTime = khatamTime;
      }
    } catch (error) {
      console.error('Error playing Khatam audio:', error);
    } finally {
      setListAudioLoading(null);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setAudioCurrentTime(time);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading Quran...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sepia-100 text-sepia-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-sepia-50/80 backdrop-blur-md border-b border-sepia-200 px-4 py-2">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-slate-100">
              <img 
                src="https://i.postimg.cc/JsqDDRFR/star.png" 
                alt="Noor App Logo" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 leading-tight">Noor App</h1>
              <p className="text-[10px] md:text-xs text-slate-500 font-medium leading-tight">Light of the Qur’an in Your Hands</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Streak Level in Header */}
            <div className="flex items-center gap-1.5 bg-orange-50 px-2 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl border border-orange-100 shadow-sm">
              <Flame size={14} className="text-orange-500 md:w-4 md:h-4" fill="currentColor" />
              <div className="flex flex-col">
                <span className="hidden md:block text-[8px] font-bold text-orange-600 uppercase tracking-widest leading-none">Streak</span>
                <span className="text-[10px] md:text-xs font-black text-slate-900 leading-none md:mt-0.5">Lvl {streakCount}</span>
              </div>
            </div>

            <div className="hidden lg:hidden items-center gap-2 bg-slate-100 p-1 rounded-xl">
              {[
                { id: 'home', icon: HomeNavIcon, label: 'Home' },
                { id: 'deen', icon: DeenNavIcon, label: 'Deen' },
                { id: 'amal', icon: DailyAmalIcon, label: 'Daily Amal' },
                { id: 'dashboard', icon: DashboardNavIcon, label: 'Dashboard' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === 'deen') {
                      setDeenSubTab('grid');
                      setSelectedRamadanGuide(null);
                      setPrayerSubTab('menu');
                      setSelectedSalahDua(null);
                      setSelectedEssentialSurah(null);
                      setSelectedSurah(null);
                    }
                    setActiveTab(tab.id as any);
                  }}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                    activeTab === tab.id ? "bg-white text-black shadow-sm border border-emerald-500" : "text-black/60 hover:text-black border border-transparent"
                  )}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setIsMenuOpen(true)}
              className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all"
            >
              <User size={18} className="md:w-6 md:h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Side Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-white z-50 shadow-2xl p-6 overflow-y-auto"
            >
              <div className="flex justify-end mb-8">
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="w-10 h-10 rounded-full bg-sepia-100 flex items-center justify-center text-sepia-600 hover:bg-red-50 hover:text-red-500 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-sepia-200 text-sepia-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <User size={40} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-sepia-900">Assalamu Alaikum</h2>
                    <p className="text-emerald-700 font-bold mt-1">Welcome to My Noor App</p>
                  </div>
                </div>

                {/* Cloud Sync Integration (Quran Foundation User API) */}
                <div className="bg-sepia-100 rounded-3xl p-5 border border-sepia-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                       <RefreshCw className={cn("text-emerald-500", quranAuthToken && "animate-spin-slow")} size={18} />
                       <span className="text-xs font-black uppercase tracking-widest text-sepia-900">Cloud Sync</span>
                    </div>
                    {quranAuthToken && (
                      <span className="text-[10px] font-bold text-white bg-emerald-500 px-2 py-0.5 rounded-full ring-2 ring-emerald-100">Linked</span>
                    )}
                  </div>
                  
                  <p className="text-[10px] text-sepia-600 mb-4 leading-relaxed font-medium">
                    {quranAuthToken 
                      ? "Your spiritual journey is linked to the Quran Foundation cloud. Sync your progress and bookmarks across devices."
                      : "Connect with your Quran Foundation account to save your progress, bookmarks, and journey to the cloud."}
                  </p>

                  {quranAuthToken ? (
                    <div className="space-y-2">
                      <button 
                        onClick={syncQuranData}
                        className="w-full py-3 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 text-xs shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all"
                      >
                        <Download size={16} />
                        Sync Now
                      </button>
                      <button 
                        onClick={() => {
                          setQuranAuthToken(null);
                          localStorage.removeItem('quran_foundation_token');
                        }}
                        className="w-full py-2 text-slate-400 hover:text-rose-500 font-bold text-[10px] uppercase tracking-widest transition-all"
                      >
                        Disconnect Account
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={handleQuranConnect}
                      className="w-full py-3 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 text-xs shadow-lg shadow-slate-200 hover:bg-black active:scale-95 transition-all"
                    >
                      <User size={16} />
                      Connect to Quran.com
                    </button>
                  )}
                </div>

                <div className="h-px bg-slate-100" />

                <div className="space-y-6">
                  <div className="space-y-2">
                    <a
                      href="mailto:hasanalbannashishir@gmail.com"
                      className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold text-slate-600 hover:bg-slate-50"
                    >
                      <Mail size={20} />
                      Contact
                    </a>
                  </div>

                  <div className="pt-4 space-y-4 px-2">
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                      My Noor App is your personal Islamic companion — built to help you read, listen, reflect and grow closer to Allah every single day.
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                      My Noor App is here to walk with you — one Surah, one Hadith, one habit at a time.
                    </p>
                    <div className="pt-12 text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Version 1.0.0</p>
                      <p className="text-xs text-slate-500 mt-1 font-medium">Made with ❤️ for the Ummah</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="max-w-3xl mx-auto px-4 py-8 pb-32">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Time and Calendars Combined */}
              <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex flex-row items-center justify-between gap-2 md:gap-6">
                  {/* Gregorian Calendar */}
                  <div className="flex flex-col items-center md:items-start flex-1 min-w-0">
                    <div className="flex items-center gap-1 md:gap-2 text-blue-600 mb-1">
                      <Calendar size={14} className="md:w-[18px] md:h-[18px]" />
                      <span className="text-[8px] md:text-xs font-bold uppercase tracking-widest truncate">Gregorian</span>
                    </div>
                    <h3 className="text-[10px] md:text-lg font-bold text-slate-900 truncate w-full text-center md:text-left">
                      {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      <span className="hidden md:inline">, {new Date().getFullYear()}</span>
                    </h3>
                  </div>
                  
                  <div className="h-8 md:h-12 w-px bg-slate-100 flex-shrink-0" />
                  
                  {/* Current Time */}
                  <div className="flex flex-col items-center flex-1 min-w-0">
                    <div className="flex items-center gap-1 md:gap-2 text-emerald-600 mb-1">
                      <Clock size={14} className="md:w-[20px] md:h-[20px]" />
                      <span className="text-[8px] md:text-xs font-bold uppercase tracking-widest truncate">Time</span>
                    </div>
                    <h2 className="text-lg md:text-5xl font-black text-slate-900 tracking-tighter truncate">{timeString}</h2>
                  </div>

                  <div className="h-8 md:h-12 w-px bg-slate-100 flex-shrink-0" />

                  {/* Hijri Calendar */}
                  <div className="flex flex-col items-center md:items-end flex-1 min-w-0">
                    <div className="flex items-center gap-1 md:gap-2 text-amber-600 mb-1">
                      <History size={14} className="md:w-[18px] md:h-[18px]" />
                      <span className="text-[8px] md:text-xs font-bold uppercase tracking-widest truncate">Hijri</span>
                    </div>
                    <h3 className="text-[10px] md:text-lg font-bold text-slate-900 truncate w-full text-center md:text-right">
                      {hijriDate ? hijriDate.split(' ').slice(0, 2).join(' ') : '...'}
                      <span className="hidden md:inline"> {hijriDate ? hijriDate.split(' ').slice(2).join(' ') : ''}</span>
                    </h3>
                  </div>
                </div>
              </div>

              {/* Prayer Times */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center shadow-sm overflow-hidden border border-slate-100">
                      <img 
                        src="https://i.postimg.cc/tsSYMyC1/time.png" 
                        alt="Prayer Times" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    Prayer Times
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-600 uppercase tracking-wider mt-2 bg-amber-50 w-fit px-2 py-1 rounded-lg border border-amber-100">
                    <MapPin size={12} />
                    Please turn on location
                  </div>
                  {nextPrayerInfo && (
                    <p className="text-sm font-medium text-slate-500 mt-1">
                      Next: <span className="text-emerald-600 font-bold">{nextPrayerInfo.name}</span> in <span className="font-mono text-slate-700">{nextPrayerInfo.remaining}</span>
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-5 gap-2 sm:gap-3">
                  {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((p) => {
                    const isActive = currentPrayer === p;
                    const prayerStyles = {
                      'Fajr': "bg-gradient-to-br from-orange-50 to-rose-50 border-orange-100",
                      'Dhuhr': "bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-100",
                      'Asr': "bg-gradient-to-br from-amber-50 to-orange-100 border-amber-100",
                      'Maghrib': "bg-gradient-to-br from-rose-50 to-purple-50 border-rose-100",
                      'Isha': "bg-gradient-to-br from-indigo-50 to-slate-100 border-indigo-100"
                    }[p] || "bg-slate-50 border-slate-100";

                    return (
                      <div 
                        key={p} 
                        className={cn(
                          "flex flex-col items-center gap-3 p-3 rounded-2xl border transition-all duration-300",
                          isActive 
                            ? "bg-emerald-50/50 border-emerald-300 shadow-sm" 
                            : `${prayerStyles} shadow-sm opacity-80 hover:opacity-100`
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-all border",
                          isActive 
                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200 border-emerald-500" 
                            : "bg-white border-slate-100 shadow-sm"
                        )}>
                          {getPrayerIcon(p, isActive)}
                        </div>
                        <div className="text-center space-y-1">
                          <p className={cn(
                            "text-[10px] font-bold uppercase tracking-wider transition-colors",
                            isActive ? "text-emerald-700" : "text-slate-400"
                          )}>
                            {p}
                          </p>
                          <p className={cn(
                            "text-xs sm:text-sm font-bold whitespace-nowrap transition-colors",
                            isActive ? "text-slate-900" : "text-slate-500"
                          )}>
                            {prayerTimes ? convertTo12Hour(prayerTimes[p]) : '--:--'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Forbidden Times for Salah */}
              <div className="bg-sepia-50 rounded-2xl border border-sepia-200 shadow-sm overflow-hidden group">
                <button 
                  onClick={() => setShowForbiddenTimes(!showForbiddenTimes)}
                  className="w-full p-4 flex items-center justify-between hover:bg-sepia-100 transition-all active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-lg border border-rose-100 group-hover:scale-110 transition-transform">
                      🚫
                    </div>
                    <div className="text-left">
                      <h3 className="text-sm font-bold text-sepia-900">Forbidden Times for Salah</h3>
                      <p className="text-[10px] text-sepia-600 font-medium">Times when prayer is prohibited</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-sepia-400 hidden sm:block">
                      {showForbiddenTimes ? 'Collapse' : 'Expand'}
                    </span>
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                      showForbiddenTimes ? "bg-sepia-200 text-sepia-900" : "bg-sepia-100 text-sepia-400"
                    )}>
                      <ChevronDown 
                        size={18} 
                        className={cn("transition-transform duration-500 ease-out", showForbiddenTimes && "rotate-180")} 
                      />
                    </div>
                  </div>
                </button>
                
                <AnimatePresence>
                  {showForbiddenTimes && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 space-y-4 border-t border-sepia-100">
                        <div className="bg-orange-50/50 p-3 rounded-xl border border-orange-100">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">🌅</span>
                            <h4 className="text-xs font-bold text-orange-900 uppercase tracking-wider">Sunrise</h4>
                          </div>
                          <p className="text-xs text-orange-800 leading-relaxed">
                            From sunrise → ~10–15 min after
                          </p>
                          <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-rose-600 uppercase tracking-widest bg-white/50 w-fit px-2 py-1 rounded-lg border border-rose-100">
                            ❌ Prayer not allowed (Sunrise time)
                          </div>
                        </div>

                        <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">☀️</span>
                            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">Zawal (Midday)</h4>
                          </div>
                          <p className="text-xs text-amber-800 leading-relaxed">
                            ~5–10 min before Dhuhr
                          </p>
                          <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-rose-600 uppercase tracking-widest bg-white/50 w-fit px-2 py-1 rounded-lg border border-rose-100">
                            ❌ Prayer not allowed (Zawal time)
                          </div>
                        </div>

                        <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-100">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">🌇</span>
                            <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider">Sunset</h4>
                          </div>
                          <p className="text-xs text-rose-800 leading-relaxed">
                            From sunset start → until Maghrib
                          </p>
                          <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-rose-600 uppercase tracking-widest bg-white/50 w-fit px-2 py-1 rounded-lg border border-rose-100">
                            ❌ Prayer not allowed (Sunset time)
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quranic Verse about Salah */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center">
                  <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 shadow-sm max-w-2xl text-center">
                    <Quote className="text-emerald-200 absolute -top-2 -left-2 rotate-180" size={24} />
                    <p className="text-lg font-arabic text-emerald-800 mb-2 leading-relaxed">
                      وَأَقِمِ الصَّلَاةَ ۖ إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ
                    </p>
                    <p className="text-xs text-slate-600 font-medium italic leading-relaxed">
                      "And establish prayer. Indeed, prayer prohibits immorality and wrongdoing, and the remembrance of Allah is greater."
                    </p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-2">— Surah Al-Ankabut [29:45]</p>
                  </div>
                </div>
              </div>

              {/* Salah Tracker */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-extrabold text-sepia-900 flex items-center gap-2">
                      <div className="w-7 h-7 bg-sepia-50 rounded-lg flex items-center justify-center shadow-sm overflow-hidden border border-sepia-200">
                        <img 
                          src="https://i.postimg.cc/CRGNtSvJ/mosque.png" 
                          alt="Salah Tracker" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      Salah Tracker
                    </h3>
                    <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1.5 px-1">
                      <Sparkles size={10} className="animate-pulse" />
                      Tap the prayers below to make it count!
                    </p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <button 
                      onClick={() => setShowAllSalah(!showAllSalah)}
                      className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-full transition-all shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-95 group"
                    >
                      <span>{showAllSalah ? 'View Current' : 'View All Prayers'}</span>
                      <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                        <ChevronDown size={14} className={cn("transition-transform duration-500 ease-out", showAllSalah && "rotate-180")} />
                      </div>
                    </button>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Daily Progress</p>
                      <p className="text-sm font-black text-emerald-600">{getDailyStats().completed} / {getDailyStats().total} Rakats</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {SALAH_REQUIREMENTS.filter(p => showAllSalah || p.name === currentPrayer || (!currentPrayer && p.name === 'Fajr')).map((prayer) => {
                    const stats = getPrayerStats(prayer.name);
                    return (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={prayer.name}
                        className={cn(
                          "bg-sepia-50 rounded-xl p-3 border transition-all h-fit",
                          currentPrayer === prayer.name ? "border-emerald-500 shadow-md ring-2 ring-emerald-500/10" : "border-sepia-200",
                          stats.isMissed && "border-rose-200 bg-rose-50/50"
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className={cn("text-[11px] font-black uppercase tracking-widest", stats.isMissed ? "text-rose-700" : "text-sepia-800")}>
                               {prayer.name}
                            </h4>
                            <span className="text-[12px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 leading-none">
                              {stats.completed}/{stats.total}
                            </span>
                          </div>
                          {stats.isMissed && <span className="text-[8px] font-black text-rose-500 uppercase tracking-tighter">Missed</span>}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {prayer.rakats.map((rakat, i) => {
                            const isCompleted = salahProgress.includes(rakat.id);
                            const isActive = currentPrayer === prayer.name;
                            return (
                              <button
                                key={rakat.id}
                                onClick={() => toggleSalahProgress(rakat.id)}
                                disabled={!isActive}
                                style={{ animationDelay: isCompleted || !isActive ? '0s' : `${i * 0.5}s` }}
                                className={cn(
                                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[9px] font-black transition-all shrink-0 active:scale-90",
                                  isCompleted 
                                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-100 ring-2 ring-emerald-500/20" 
                                    : cn(
                                        "bg-sepia-100/80 border-sepia-300 text-sepia-700 shadow-sm", 
                                        isActive && "hover:border-emerald-400 hover:bg-sepia-200/50 animate-indicator-blink"
                                      ),
                                  !isActive && "opacity-40 grayscale-[0.3] cursor-not-allowed"
                                )}
                              >
                                <div className={cn(
                                  "w-3 h-3 rounded-md flex items-center justify-center transition-all",
                                  isCompleted ? "bg-white text-emerald-600" : "bg-sepia-300/30 text-sepia-600/30"
                                )}>
                                  <Check size={10} strokeWidth={isCompleted ? 4 : 3} />
                                </div>
                                <span className="tracking-tight">{rakat.count} {rakat.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <DailySurahReminder 
                surahs={surahs}
                onPlay={handleListPlay}
                playingId={listPlayingId}
                isPlaying={isPlaying}
                isLoading={listAudioLoading}
              />
              <TasbihCounter onIncrement={updateTasbihCount} />

              {/* Daily Home Hadith */}
              {homeHadith && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                  <Quote className="text-slate-100 absolute -top-2 -right-2 rotate-180" size={48} />
                  <p className="text-sm text-slate-600 italic leading-relaxed mb-3 relative z-10">
                    "{homeHadith.text}"
                  </p>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">— {homeHadith.source}</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === 'deen' && (
            <motion.div
              key="deen"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {!selectedSurah ? (
                <div className="space-y-8">
                  {deenSubTab === 'grid' ? (
                      <div className="grid grid-cols-3 gap-3">
                        {/* 1. Al Quran Option */}
                        <button 
                          onClick={() => setDeenSubTab('quran')}
                          className="group bg-white p-3 rounded-xl border border-slate-200 text-slate-900 text-center transition-all hover:border-slate-400 hover:shadow-md"
                        >
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform shadow-sm overflow-hidden border border-slate-100">
                            <img 
                              src="https://i.postimg.cc/mcjXTZVB/quran.png" 
                              alt="Al Quran" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <h3 className="text-[10px] font-bold uppercase tracking-tight">Al-Quran</h3>
                        </button>

                        {/* 2. Hadith Option */}
                        <button 
                          onClick={() => setDeenSubTab('hadith')}
                          className="group bg-white p-3 rounded-xl border border-slate-200 text-slate-900 text-center transition-all hover:border-slate-400 hover:shadow-md"
                        >
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform shadow-sm overflow-hidden border border-slate-100">
                            <img 
                              src="https://i.postimg.cc/LJCnbR6X/quran-2.png" 
                              alt="Hadith" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <h3 className="text-[10px] font-bold uppercase tracking-tight">Hadith</h3>
                        </button>

                        {/* 3. 99 Names Option */}
                        <button 
                          onClick={() => setDeenSubTab('names')}
                          className="group bg-white p-3 rounded-xl border border-slate-200 text-slate-900 text-center transition-all hover:border-slate-400 hover:shadow-md"
                        >
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform shadow-sm overflow-hidden border border-slate-100">
                            <img 
                              src="https://i.postimg.cc/LJCnbR6J/islamic.png" 
                              alt="99 Names" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <h3 className="text-[10px] font-bold uppercase tracking-tight">99 Names</h3>
                        </button>

                        {/* 4. Prayer Learning Option */}
                        <button 
                          onClick={() => {
                            setDeenSubTab('prayer');
                            setPrayerSubTab('menu');
                          }}
                          className="group bg-white p-3 rounded-xl border border-slate-200 text-slate-900 text-center transition-all hover:border-slate-400 hover:shadow-md"
                        >
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform shadow-sm overflow-hidden border border-slate-100">
                            <img 
                              src="https://i.postimg.cc/0bWqDNy3/salah-8.png" 
                              alt="Prayer Learning" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <h3 className="text-[10px] font-bold uppercase tracking-tight">Prayer learning</h3>
                        </button>

                        {/* 5. Ramadan Option */}
                        <button 
                          onClick={() => setDeenSubTab('ramadan')}
                          className="group bg-white p-3 rounded-xl border border-slate-200 text-slate-900 text-center transition-all hover:border-slate-400 hover:shadow-md"
                        >
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform shadow-sm overflow-hidden border border-slate-100">
                            <img 
                              src="https://i.postimg.cc/Mc1w5B6x/ramadan.png" 
                              alt="Ramadan" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <h3 className="text-[10px] font-bold uppercase tracking-tight">Ramadan</h3>
                        </button>

                        {/* 6. Hajj & Umrah Option */}
                        <button 
                          onClick={() => setDeenSubTab('hajj')}
                          className="group bg-white p-3 rounded-xl border border-slate-200 text-slate-900 text-center transition-all hover:border-slate-400 hover:shadow-md"
                        >
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform shadow-sm overflow-hidden border border-slate-100">
                            <img 
                              src="https://i.postimg.cc/bGgCqYLP/hajj.png" 
                              alt="Hajj & Umrah" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <h3 className="text-[10px] font-bold uppercase tracking-tight">Hajj & Umrah</h3>
                        </button>

                        {/* 7. Zakat Option */}
                        <button 
                          onClick={() => setDeenSubTab('zakat')}
                          className="group bg-white p-3 rounded-xl border border-slate-200 text-slate-900 text-center transition-all hover:border-slate-400 hover:shadow-md"
                        >
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform shadow-sm overflow-hidden border border-slate-100">
                            <img 
                              src="https://i.postimg.cc/XXB5TrTH/zakat.png" 
                              alt="Zakat" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <h3 className="text-[10px] font-bold uppercase tracking-tight">Zakat</h3>
                        </button>

                        {/* 8. Islamic Calendar Option */}
                        <button 
                          onClick={() => setDeenSubTab('calendar')}
                          className="group bg-white p-3 rounded-xl border border-slate-200 text-slate-900 text-center transition-all hover:border-slate-400 hover:shadow-md"
                        >
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform shadow-sm overflow-hidden border border-slate-100">
                            <img 
                              src="https://i.postimg.cc/bZCsB8ND/calendar.png" 
                              alt="Islamic Calendar" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <h3 className="text-[10px] font-bold uppercase tracking-tight">Islamic Calendar</h3>
                        </button>

                        {/* 10. Qibla Option */}
                        <button 
                          onClick={() => setDeenSubTab('qibla')}
                          className="group bg-white p-3 rounded-xl border border-slate-200 text-slate-900 text-center transition-all hover:border-slate-400 hover:shadow-md"
                        >
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform shadow-sm overflow-hidden border border-slate-100">
                            <img 
                              src="https://i.postimg.cc/186b1ZLf/qibla.png" 
                              alt="Qibla" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <h3 className="text-[10px] font-bold uppercase tracking-tight">Qibla</h3>
                        </button>

                        {/* 14. Dua Option */}
                        <button 
                          onClick={() => setDeenSubTab('dua_deen')}
                          className="group bg-white p-3 rounded-xl border border-slate-200 text-slate-900 text-center transition-all hover:border-slate-400 hover:shadow-md"
                        >
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform shadow-sm overflow-hidden border border-slate-100">
                            <img 
                              src="https://i.postimg.cc/sGZ6syrV/open-hands.png" 
                              alt="Dua" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <h3 className="text-[10px] font-bold uppercase tracking-tight">Dua</h3>
                        </button>

                        {/* 15. Kalima Option */}
                        <button 
                          onClick={() => setDeenSubTab('kalima')}
                          className="group bg-white p-3 rounded-xl border border-slate-200 text-slate-900 text-center transition-all hover:border-slate-400 hover:shadow-md"
                        >
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform shadow-sm overflow-hidden border border-slate-100">
                            <img 
                              src="https://i.postimg.cc/GHnwtgSJ/ornament.png" 
                              alt="Kalima" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <h3 className="text-[10px] font-bold uppercase tracking-tight">Kalima</h3>
                        </button>

                        {/* 16. Pillar of Islam Option */}
                        <button 
                          onClick={() => setDeenSubTab('pillars')}
                          className="group bg-white p-3 rounded-xl border border-slate-200 text-slate-900 text-center transition-all hover:border-slate-400 hover:shadow-md"
                        >
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform shadow-sm overflow-hidden border border-slate-100">
                            <img 
                              src="https://i.postimg.cc/rRtnMckw/window.png" 
                              alt="Pillar of Islam" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <h3 className="text-[10px] font-bold uppercase tracking-tight">Pillar of Islam</h3>
                        </button>

                        {/* 17. Festivals in Islam Option */}
                        <button 
                          onClick={() => setDeenSubTab('festivals')}
                          className="group bg-white p-3 rounded-xl border border-slate-200 text-slate-900 text-center transition-all hover:border-slate-400 hover:shadow-md"
                        >
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform shadow-sm overflow-hidden border border-slate-100">
                            <img 
                              src="https://i.postimg.cc/LgZC2Rp4/eid-al-fitr.png" 
                              alt="Festivals in Islam" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <h3 className="text-[10px] font-bold uppercase tracking-tight">Festivals in Islam</h3>
                        </button>

                        {/* 13. Saved Items Option */}
                        <button 
                          onClick={() => setDeenSubTab('saved')}
                          className="group bg-white p-3 rounded-xl border border-slate-200 text-slate-900 text-center transition-all hover:border-slate-400 hover:shadow-md"
                        >
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform shadow-sm overflow-hidden border border-slate-100">
                            <img 
                              src="https://i.postimg.cc/gnmcqtVr/bookmark.png" 
                              alt="Saved Items" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <h3 className="text-[10px] font-bold uppercase tracking-tight">Saved Items</h3>
                        </button>
                      </div>
                  ) : (
                    <div className="space-y-8">
                      {/* Only show "Back to Options" if we are at the root of a sub-tab */}
                      {((deenSubTab === 'prayer' && prayerSubTab === 'menu') || 
                        (deenSubTab === 'hadith') || 
                        (deenSubTab === 'quran') ||
                        (deenSubTab === 'names') ||
                        (deenSubTab === 'saved') ||
                        (deenSubTab === 'zakat') ||
                        (deenSubTab === 'dua_deen') ||
                        (deenSubTab === 'kalima') ||
                        (deenSubTab === 'pillars') ||
                        (deenSubTab === 'festivals') ||
                        (deenSubTab === 'ramadan' && selectedRamadanGuide === null) ||
                        (deenSubTab === 'hajj' && selectedHajjGuide === null) ||
                        (deenSubTab === 'qibla') ||
                        (deenSubTab === 'calendar')) && (
                        <button 
                          onClick={() => {
                            setDeenSubTab('grid');
                            setPrayerSubTab('menu');
                            setSelectedSalahDua(null);
                            setSelectedEssentialSurah(null);
                            setSelectedHajjGuide(null);
                          }}
                          className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-medium transition-colors text-sm mb-4"
                        >
                          <ChevronLeft size={20} />
                          Back to Options
                        </button>
                      )}

                      {deenSubTab === 'quran' && (
                        <div id="surah-list" className="space-y-6">
                          {/* Daily Reminder */}
                          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center mb-6">
                            <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2">Daily Reminder</h4>
                            <p className="text-slate-700 font-medium italic">"The best of you are those who learn the Quran and teach it"</p>
                            <p className="text-[10px] text-slate-400 mt-2">— Prophet Muhammad (PBUH)</p>
                          </div>

                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div>
                              <h3 className="text-2xl font-black text-slate-900">The Holy Quran</h3>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">114 Chapters (Surahs)</p>
                            </div>
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                              <input
                                type="text"
                                placeholder="Search Surah..."
                                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none w-full md:w-80 shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {filteredSurahs.map((surah) => (
                              <motion.div
                                key={surah.id}
                                whileHover={{ y: -4 }}
                                onClick={() => handleSurahClick(surah)}
                                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-200 hover:shadow-lg transition-all cursor-pointer flex items-center justify-between group"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="relative w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-black text-slate-400 group-hover:bg-emerald-50 group-hover:border-emerald-100 group-hover:text-emerald-600 transition-colors">
                                    <span className="group-hover:hidden">{surah.id}</span>
                                    <Play size={16} className="hidden group-hover:block" fill="currentColor" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-slate-800">{surah.name_simple}</h4>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{surah.translated_name.name}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <p className="text-xl font-arabic text-emerald-700">{surah.name_arabic}</p>
                                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">{surah.verses_count} Verses</p>
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <button 
                                      onClick={(e) => toggleSurahBookmark(e, surah.id)}
                                      className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                                        bookmarkedSurahs.includes(surah.id) ? "bg-amber-50 text-amber-600" : "bg-slate-50 text-slate-300 hover:text-amber-600 hover:bg-amber-50"
                                      )}
                                    >
                                      <Bookmark size={14} fill={bookmarkedSurahs.includes(surah.id) ? "currentColor" : "none"} />
                                    </button>
                                    <button 
                                      onClick={(e) => handleListPlay(e, surah)}
                                      className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                                        listPlayingId === surah.id ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400 hover:bg-emerald-100 hover:text-emerald-600"
                                      )}
                                    >
                                      {listAudioLoading === surah.id ? (
                                        <Loader2 size={14} className="animate-spin" />
                                      ) : listPlayingId === surah.id && isPlaying ? (
                                        <Pause size={14} fill="currentColor" />
                                      ) : (
                                        <Play size={14} fill="currentColor" className="ml-0.5" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {deenSubTab === 'zakat' && <ZakatCalculator />}
                      {deenSubTab === 'names' && <NamesOfAllah />}
                      {deenSubTab === 'hadith' && (
                        <HadithSection />
                      )}



                      {deenSubTab === 'prayer' && (
                        <div className="space-y-6">
                          <h3 className="text-2xl font-black text-slate-900">Prayer learning</h3>
                          
                          {prayerSubTab === 'menu' ? (
                            <div className="grid grid-cols-1 gap-4">
                              <button 
                                onClick={() => setPrayerSubTab('wudu')}
                                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-emerald-500 transition-all"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm overflow-hidden border border-slate-100">
                                    <img 
                                      src="https://i.postimg.cc/xcKsMf3J/wudhu-1.png" 
                                      alt="Wudu" 
                                      className="w-full h-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                  <div className="text-left">
                                    <h4 className="font-bold text-slate-900">Wudu (Ablution)</h4>
                                    <p className="text-xs text-slate-500">Purification before prayer</p>
                                  </div>
                                </div>
                                <ChevronDown className="-rotate-90 text-slate-300 group-hover:text-emerald-500 transition-colors" size={20} />
                              </button>

                              <button 
                                onClick={() => setPrayerSubTab('salah')}
                                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-emerald-500 transition-all"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm overflow-hidden border border-slate-100">
                                    <img 
                                      src="https://i.postimg.cc/Hjb0PSc8/prayer.png" 
                                      alt="Dua's for Salah" 
                                      className="w-full h-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                  <div className="text-left">
                                    <h4 className="font-bold text-slate-900">Dua's for Salah</h4>
                                    <p className="text-xs text-slate-500">The five daily prayers</p>
                                  </div>
                                </div>
                                <ChevronDown className="-rotate-90 text-slate-300 group-hover:text-emerald-500 transition-colors" size={20} />
                              </button>

                              <button 
                                onClick={() => setPrayerSubTab('surah')}
                                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-emerald-500 transition-all"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm overflow-hidden border border-slate-100">
                                    <img 
                                      src="https://i.postimg.cc/gnnhbNnm/quran-3.png" 
                                      alt="Essential Surah" 
                                      className="w-full h-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                  <div className="text-left">
                                    <h4 className="font-bold text-slate-900">Essential Surah</h4>
                                    <p className="text-xs text-slate-500">Surahs used in prayer</p>
                                  </div>
                                </div>
                                <ChevronDown className="-rotate-90 text-slate-300 group-hover:text-emerald-500 transition-colors" size={20} />
                              </button>

                              <button 
                                onClick={() => setPrayerSubTab('steps')}
                                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-emerald-500 transition-all"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm overflow-hidden border border-slate-100">
                                    <img 
                                      src="https://i.postimg.cc/xX9SbFHG/shalat.png" 
                                      alt="Prayer steps" 
                                      className="w-full h-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                  <div className="text-left">
                                    <h4 className="font-bold text-slate-900">Prayer Steps</h4>
                                    <p className="text-xs text-slate-500">Complete steps of Salah</p>
                                  </div>
                                </div>
                                <ChevronDown className="-rotate-90 text-slate-300 group-hover:text-emerald-500 transition-colors" size={20} />
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-8">
                              {/* Only show "Back to Prayer Menu" if we are not viewing a specific Salah Dua or Essential Surah */}
                              {((prayerSubTab !== 'salah' || !selectedSalahDua) && (prayerSubTab !== 'surah' || selectedEssentialSurah === null)) && (
                                <button 
                                  onClick={() => {
                                    setPrayerSubTab('menu');
                                    setSelectedSalahDua(null);
                                    setSelectedEssentialSurah(null);
                                  }}
                                  className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-medium transition-colors text-sm"
                                >
                                  <ChevronLeft size={20} />
                                  Back to Prayer Menu
                                </button>
                              )}

                              {prayerSubTab === 'wudu' && (
                                <div className="space-y-6">
                                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                                    <h4 className="text-2xl font-bold text-slate-900 mb-4">Wudu (Ablution)</h4>
                                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                      Wudu (Ablution) is a ritual purification in Islam that Muslims perform before acts of worship like Salah (prayer). It involves washing specific parts of the body in a prescribed way.
                                    </p>
                                    
                                    <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 mb-8">
                                      <div className="flex items-start gap-3">
                                        <Quote className="text-emerald-500 flex-shrink-0" size={20} />
                                        <div>
                                          <p className="text-sm text-emerald-800 italic leading-relaxed">
                                            "Cleanliness is half of faith."
                                          </p>
                                          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-2">— Sahih Muslim</p>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="mb-8">
                                      <h5 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <span>🙏</span> Why Wudu is Important
                                      </h5>
                                      <ul className="space-y-3">
                                        {[
                                          "It is required for prayer (Salah). Without Wudu (ablution), your Salah (prayer) is not valid in Islam.",
                                          "It brings spiritual purity and physical cleanliness.",
                                          "The Prophet Muhammad emphasized its importance and reward.",
                                          "On the Day of Judgment, body parts washed in Wudu will shine (Hadith of Muhammad)."
                                        ].map((point, i) => (
                                          <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                            {point}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>

                                    <div className="mb-8 p-6 bg-slate-900 rounded-3xl text-center">
                                      <h5 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-4">Wudu's Dua</h5>
                                      <p className="text-xl font-arabic text-white leading-loose mb-4">
                                        أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ. اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ
                                      </p>
                                      <div className="space-y-3 text-left">
                                        <div>
                                          <h6 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Transliteration</h6>
                                          <p className="text-xs text-slate-300 italic">Ashhadu an la ilaha illallahu wahdahu la sharika lahu wa ashhadu anna Muhammadan 'abduhu wa Rasuluhu. Allahummaj'alni minat-tawwabina waj'alni minal-mutatahhirin.</p>
                                        </div>
                                        <div>
                                          <h6 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Translation</h6>
                                          <p className="text-xs text-slate-400">I bear witness that there is no god but Allah, alone, without partner, and I bear witness that Muhammad is His servant and His Messenger. O Allah, make me among those who repent and make me among those who purify themselves.</p>
                                        </div>
                                      </div>
                                    </div>

                                    <h5 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                      <span>🌿</span> Steps of Wudu
                                    </h5>
                                    <div className="space-y-3">
                                      {[
                                        { text: "Make intention (Niyyah) – in your heart to perform Wudu.", icons: ["https://i.postimg.cc/d7zQbjk9/step1.png"] },
                                        { text: "Say “Bismillah” (In the name of Allah).", icons: [] },
                                        { text: "Wash hands – up to the wrists, 3 times.", icons: ["https://i.postimg.cc/QBK1gVkQ/step3.png"] },
                                        { text: "Rinse mouth – 3 times.", icons: ["https://i.postimg.cc/hfSZBJmF/salah-11.png"] },
                                        { text: "Clean nose – sniff water and blow it out, 3 times.", icons: ["https://i.postimg.cc/Ffk3b1g1/step5.png"] },
                                        { text: "Wash face – from forehead to chin and ear to ear, 3 times.", icons: ["https://i.postimg.cc/RNMpB3tz/salah-10.png"] },
                                        { text: "Wash arms – right then left, up to elbows, 3 times each.", icons: ["https://i.postimg.cc/DW4LQmdX/step7.png"] },
                                        { text: "Wipe head (Masah) – once with wet hands.", icons: ["https://i.postimg.cc/kVRKNDFt/step8a.png", "https://i.postimg.cc/Z9vpP0Fq/step8b.png"] },
                                        { text: "Clean ears – inside and outside, once.", icons: ["https://i.postimg.cc/WDqgmt6q/step9.png"] },
                                        { text: "Wash feet – right then left, up to ankles, 3 times each.", icons: ["https://i.postimg.cc/gwL8yrqj/step10.png"] }
                                      ].map((step, i) => (
                                        <div key={i} className="flex flex-col gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                          <div className="flex items-start gap-4">
                                            <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400 flex-shrink-0 mt-0.5">
                                              {i + 1}
                                            </div>
                                            <p className="text-sm text-slate-700 leading-relaxed">{step.text}</p>
                                          </div>
                                          {step.icons.length > 0 && (
                                            <div className="flex flex-wrap gap-2 ml-10">
                                              {step.icons.map((icon, idx) => (
                                                <div key={idx} className="w-24 h-24 bg-white rounded-xl border border-slate-100 p-1 shadow-sm overflow-hidden">
                                                  <img 
                                                    src={icon} 
                                                    alt={`Step ${i + 1} icon ${idx + 1}`} 
                                                    className="w-full h-full object-contain"
                                                    referrerPolicy="no-referrer"
                                                  />
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                                    <h5 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                      <span>✨</span> Important Points
                                    </h5>
                                    <ul className="space-y-4">
                                      {[
                                        "Follow the order (sequence) properly.",
                                        "Do not waste water.",
                                        "Make sure water reaches every part."
                                      ].map((point, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                                          <CheckCircle2 className="text-emerald-500 flex-shrink-0" size={18} />
                                          {point}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                                    <h5 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                      <span>❌</span> What Breaks Wudu?
                                    </h5>
                                    <ul className="space-y-4">
                                      {[
                                        "Using the toilet (urine, stool, gas)",
                                        "Deep sleep",
                                        "Loss of consciousness",
                                        "Bleeding (according to some scholars)",
                                        "Touching private parts (varies by interpretation)"
                                      ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                                          <X className="text-red-500 flex-shrink-0" size={18} />
                                          {item}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  <div className="bg-emerald-700 p-8 rounded-3xl text-white shadow-lg relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />
                                    <div className="relative z-10 text-center">
                                      <Quote className="text-emerald-400/30 mx-auto mb-4" size={32} />
                                      <p className="text-sm font-medium italic leading-relaxed mb-4">
                                        “Allah does not accept the prayer of one who has broken his ablution until he performs Wudu.”
                                      </p>
                                      <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest">— Sahih al-Bukhari – Hadith No. 135</p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {prayerSubTab === 'salah' && (
                                <div className="space-y-6">
                                  {/* Daily Reminder */}
                                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                                    <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2">Daily Reminder</h4>
                                    <p className="text-slate-700 font-medium italic">"Dua is worship."</p>
                                    <p className="text-[10px] text-slate-400 mt-2">— The Prophet Muhammad (PBUH)</p>
                                  </div>

                                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                                    <h4 className="text-2xl font-bold text-slate-900 mb-6">Dua's for Salah</h4>
                                    
                                    {!selectedSalahDua ? (
                                      <div className="space-y-8">
                                        <div>
                                          <h5 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Essential Duas</h5>
                                          <div className="grid grid-cols-1 gap-3">
                                            {SALAH_DUAS.map((dua) => (
                                              <button 
                                                key={dua.id}
                                                onClick={() => setSelectedSalahDua(dua.id)}
                                                className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
                                              >
                                                <span className="text-sm font-bold text-slate-700 group-hover:text-emerald-700">{dua.title}</span>
                                                <ChevronRight size={18} className="text-slate-300 group-hover:text-emerald-500" />
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="space-y-6">
                                        <button 
                                          onClick={() => setSelectedSalahDua(null)}
                                          className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors text-sm font-medium mb-4"
                                        >
                                          <ChevronLeft size={18} />
                                          Back to Salah Overview
                                        </button>

                                        {SALAH_DUAS.find(d => d.id === selectedSalahDua) && (
                                          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <h5 className="text-xl font-bold text-slate-900">{SALAH_DUAS.find(d => d.id === selectedSalahDua)?.title}</h5>
                                            
                                            <div className="p-6 bg-slate-900 rounded-3xl text-center">
                                              <p className="text-2xl font-arabic text-emerald-400 leading-loose mb-4">
                                                {SALAH_DUAS.find(d => d.id === selectedSalahDua)?.arabic}
                                              </p>
                                            </div>

                                            <div className="space-y-4">
                                              <div>
                                                <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Transliteration</h6>
                                                <p className="text-sm text-slate-700 leading-relaxed italic">
                                                  {SALAH_DUAS.find(d => d.id === selectedSalahDua)?.transliteration}
                                                </p>
                                              </div>

                                              <div>
                                                <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Translation</h6>
                                                <p className="text-sm text-slate-600 leading-relaxed">
                                                  {SALAH_DUAS.find(d => d.id === selectedSalahDua)?.translation}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                                {prayerSubTab === 'surah' && (
                                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                                    {selectedEssentialSurah === null ? (
                                      <>
                                        <h4 className="text-xl font-bold text-slate-900 mb-6">Essential Surahs</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                          {ESSENTIAL_SURAHS.map((surah, j) => (
                                            <button
                                              key={j}
                                              onClick={() => setSelectedEssentialSurah(j)}
                                              className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
                                            >
                                              <h5 className="font-bold text-slate-700 group-hover:text-emerald-700">{surah.name}</h5>
                                            </button>
                                          ))}
                                        </div>
                                      </>
                                    ) : (
                                      <div className="space-y-6">
                                        <button 
                                          onClick={() => setSelectedEssentialSurah(null)}
                                          className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors text-sm font-medium mb-4"
                                        >
                                          <ChevronLeft size={18} />
                                          Back to Surah List
                                        </button>
                                        
                                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                                          <h5 className="font-bold text-emerald-700 text-lg border-b border-emerald-100 pb-2">
                                            {ESSENTIAL_SURAHS[selectedEssentialSurah].name}
                                          </h5>
                                          
                                          <div className="bg-white p-4 rounded-xl border border-slate-200">
                                            <p className="text-2xl font-arabic text-slate-900 leading-loose text-right" dir="rtl">
                                              {ESSENTIAL_SURAHS[selectedEssentialSurah].arabic}
                                            </p>
                                          </div>

                                          <div className="space-y-1">
                                            <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pronunciation</h6>
                                            <p className="text-sm text-slate-600 leading-relaxed italic">
                                              {ESSENTIAL_SURAHS[selectedEssentialSurah].pronunciation}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {prayerSubTab === 'steps' && (
                                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                                    <h4 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                      <span>🕌</span> Complete Steps of Salah (Prayer)
                                    </h4>
                                    
                                    <div className="space-y-8">
                                      {/* Before Starting */}
                                      <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                                        <h5 className="font-bold text-emerald-800 mb-3 flex items-center gap-2">
                                          <span>🔹</span> Before Starting
                                        </h5>
                                        <ul className="space-y-2">
                                          <li className="flex items-start gap-2 text-sm text-emerald-700">
                                            <span className="text-emerald-500 font-bold">✔️</span> Be in Wudu (ablution)
                                          </li>
                                          <li className="flex items-start gap-2 text-sm text-emerald-700">
                                            <span className="text-emerald-500 font-bold">✔️</span> Face the Qiblah (direction of Kaaba)
                                          </li>
                                          <li className="flex items-start gap-2 text-sm text-emerald-700">
                                            <span className="text-emerald-500 font-bold">✔️</span> Make intention (Niyyah) in your heart
                                          </li>
                                        </ul>
                                      </div>

                                      {/* Steps */}
                                      <div className="space-y-4">
                                        {[
                                          { step: "Step 1: Takbir (Start Prayer)", content: "Raise both hands and say:", highlight: "Allahu Akbar (الله أكبر)", icons: ["https://i.postimg.cc/Q9cFdycr/takbir.png"] },
                                          { step: "Step 2: Qiyam (Standing)", content: "Fold hands (right over left)\nRecite:\n• Sana (Subhanaka Allahumma...)\n• Ta’awwuz (A‘وذ بالله...)\n• Bismillah\n• Surah Al-Fatiha\n• Another Surah (e.g., Surah Al-Ikhlas)", icons: ["https://i.postimg.cc/xX9SbFHG/shalat.png"] },
                                          { step: "Step 3: Ruku (Bowing)", content: "Say Allahu Akbar and bow\nHands on knees, back straight\nRecite:", highlight: "Subhana Rabbiyal ‘Azim (3 times)", icons: ["https://i.postimg.cc/NLbSL7Bj/ruku.png"] },
                                          { step: "Step 4: Qawmah (Standing After Ruku)", content: "Stand up and say:", highlight: "Sami‘allahu liman hamidah\nRabbana lakal hamd", icons: ["https://i.postimg.cc/jwJvMtPD/salat.png"] },
                                          { step: "Step 5: Sajdah (Prostration)", content: "Say Allahu Akbar and go into سجدة\nForehead, nose, hands, knees, toes on ground\nRecite:", highlight: "Subhana Rabbiyal A‘la (3 times)", icons: ["https://i.postimg.cc/rzPYGZrB/sujud.png"] },
                                          { step: "Step 6: Jalsa (Sitting Between Two Sajdahs)", content: "Sit and say:", highlight: "Rabbighfir li", icons: ["https://i.postimg.cc/8JcW4SJn/salat-3.png"] },
                                          { step: "Step 7: Second Sajdah", content: "Go into سجدة again\nRecite:", highlight: "Subhana Rabbiyal A‘la (3 times)", icons: ["https://i.postimg.cc/rzPYGZrB/sujud.png"] },
                                          { step: "🔁 Step 8: Next Rak‘ah", content: "Stand up and repeat steps (Fatiha + Surah, Ruku, Sajdah)", icons: ["https://i.postimg.cc/xX9SbFHG/shalat.png"] },
                                          { step: "Step 9: Tashahhud (Sitting)", content: "After 2 Rak‘ah:\nSit and recite:", highlight: "Attahiyyatu...", icons: ["https://i.postimg.cc/8JcW4SJn/salat-3.png"] },
                                          { step: "Step 10: Final Sitting", content: "In last Rak‘ah:\nRecite:\n• Tashahhud\n• Durood Sharif\n• Dua Masura", icons: [] },
                                          { step: "Step 11: Salam (End Prayer)", content: "Turn head right:", highlight: "Assalamu Alaikum wa Rahmatullah", content2: "Turn head left:", highlight2: "Assalamu Alaikum wa Rahmatullah", icons: ["https://i.postimg.cc/V5fwvNyZ/salam-right.png", "https://i.postimg.cc/Z0bmnqk7/salam-left.png"] },
                                          { step: "Step 12: Dua After Salam", content: "It is recommended to offer dua after salah, especially after fardh salah", icons: ["https://i.postimg.cc/jDZg8R3J/dua.png", "https://i.postimg.cc/9DJ8xcgw/dua-hands.png", "https://i.postimg.cc/v43qPG2V/dua-3.png"] },
                                          { step: "Note", content: "A note for the third and fourth rakah prayers (as in Zuhr, Asr, Maghrib, and Insha) the process is the repeated as per usual. The only difference is in the third and fourth rakat Surah Fatiha is always read silently. After saying Ameen it’s not necessary to recite any other Surah or verse and go straight into ruku and sajdah to complete the rakat." }
                                        ].map((item, idx) => (
                                          <div key={idx} className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                            <h5 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                              {!item.step.startsWith('🔁') && <span className="text-emerald-500">🔹</span>}
                                              {item.step}
                                            </h5>
                                            <div className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                                              {item.content}
                                              {item.highlight && (
                                                <div className="mt-2 p-3 bg-white rounded-xl border border-slate-200 font-bold text-emerald-700 text-center">
                                                  {item.highlight}
                                                </div>
                                              )}
                                              {item.content2 && <div className="mt-3">{item.content2}</div>}
                                              {item.highlight2 && (
                                                <div className="mt-2 p-3 bg-white rounded-xl border border-slate-200 font-bold text-emerald-700 text-center">
                                                  {item.highlight2}
                                                </div>
                                              )}
                                            </div>
                                            {item.icons && item.icons.length > 0 && (
                                              <div className="flex flex-wrap gap-2 mt-4 ml-6">
                                                {item.icons.map((icon, iIdx) => (
                                                  <div key={iIdx} className="w-24 h-24 bg-white rounded-xl border border-slate-100 p-1 shadow-sm overflow-hidden">
                                                    <img 
                                                      src={icon} 
                                                      alt={`${item.step} icon ${iIdx + 1}`} 
                                                      className="w-full h-full object-contain"
                                                      referrerPolicy="no-referrer"
                                                    />
                                                  </div>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </div>

                                      {/* Important Tips */}
                                      <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
                                        <h5 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                                          <span>⚠️</span> Important Tips
                                        </h5>
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                          {["Pray with focus (khushu')", "Don’t rush", "Maintain proper posture", "Follow correct sequence"].map((tip, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-amber-700">
                                              <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                              {tip}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                )}
                            </div>
                          )}
                        </div>
                      )}

                      {deenSubTab === 'ramadan' && (
                        <div className="space-y-6">
                          {selectedRamadanGuide === null ? (
                            <>
                              <div className="bg-emerald-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                                <div className="relative z-10">
                                  <h3 className="text-3xl font-black mb-4">Ramadan Mubarak</h3>
                                  <div className="space-y-4 max-w-2xl">
                                    <p className="text-emerald-50 text-sm leading-relaxed italic">
                                      "Ramadan is the month on which the Quran was revealed as a guide for humanity with clear proofs of guidance and the standard ˹to distinguish between right and wrong˺. So whoever is present this month, let them fast. But whoever is ill or on a journey, then ˹let them fast˺ an equal number of days ˹after Ramaḍân˺. Allah intends ease for you, not hardship, so that you may complete the prescribed period and proclaim the greatness of Allah for guiding you, and perhaps you will be grateful."
                                    </p>
                                    <p className="text-emerald-200 text-xs font-bold uppercase tracking-widest">
                                      — Surah Al-Baqara 2:185
                                    </p>
                                  </div>
                                </div>
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                  <img src="https://i.postimg.cc/Mc1w5B6x/ramadan.png" alt="" className="w-32 h-32 object-contain" />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                  <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center text-lg">🥣</span>
                                    Dua at Sahur
                                  </h4>
                                  <p className="text-xl font-arabic text-emerald-700 leading-loose mb-3 text-center">
                                    وَبِصَوْمِ غَدٍ نَّوَيْتُ مِنْ شَهْرِ رَمَضَانَ
                                  </p>
                                  <div className="space-y-2">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Transliteration</p>
                                    <p className="text-sm text-slate-700 font-medium text-center">Wa bisawmi ghadin nawaytu min shahri Ramadan.</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mt-2">Meaning</p>
                                    <p className="text-xs text-slate-500 italic text-center">“I intend to keep the fast for tomorrow in Ramadan.”</p>
                                  </div>
                                </div>

                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                  <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center text-lg">🌅</span>
                                    Iftar Dua
                                  </h4>
                                  <p className="text-xl font-arabic text-emerald-700 leading-loose mb-3 text-center">
                                    اللَّهُمَّ لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ
                                  </p>
                                  <div className="space-y-2">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Transliteration</p>
                                    <p className="text-sm text-slate-700 font-medium text-center">Allahumma inni laka sumtu wa ala rizq-ika-aftartu</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mt-2">Meaning</p>
                                    <p className="text-xs text-slate-500 italic text-center">"O Allah! For You I have fasted and upon your provision, I have broken my fast."</p>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                  <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-lg">📚</span>
                                  Ramadan Guide & Rulings
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {[
                                    "Description of fasting, importance, intention, obligations and sunnahs of fasting",
                                    "Reasons for breaking the fast and the dislikes of fasting",
                                    "Things that break the fast, things that don't break the fast",
                                    "Making up for missed fasts and expiating them",
                                    "Introduction and virtues of various types of virtuous fasting",
                                    "Prohibited days for fasting, moon sighting masala",
                                    "Taraweeh prayer details, rules, intentions, prayers and supplications",
                                    "Description of Sahur and Iftar",
                                    "Details of Itikaaf"
                                  ].map((title, index) => (
                                    <div 
                                      key={index}
                                      onClick={() => setSelectedRamadanGuide(index + 1)}
                                      className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-emerald-50 hover:border-emerald-200 transition-all cursor-pointer group"
                                    >
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex items-start gap-3">
                                        <span className="w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-400 group-hover:border-emerald-300 group-hover:text-emerald-600 transition-colors flex-shrink-0">
                                          {index + 1}
                                        </span>
                                        <p className="text-sm font-medium text-slate-700 group-hover:text-emerald-900 transition-colors leading-snug">
                                          {title}
                                        </p>
                                      </div>
                                      <ChevronRight size={16} className="text-slate-300 group-hover:text-emerald-500 transition-colors flex-shrink-0 mt-0.5" />
                                    </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                                <button 
                                  onClick={() => setSelectedRamadanGuide(null)}
                                  className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-bold transition-colors text-xs uppercase tracking-widest"
                                >
                                  <ChevronLeft size={16} />
                                  Back to Guide
                                </button>
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Point {selectedRamadanGuide}</span>
                              </div>
                              <div className="p-8 max-w-2xl mx-auto">
                                {selectedRamadanGuide === 1 && (
                                  <div className="space-y-8">
                                    <section>
                                      <h4 className="text-2xl font-black text-slate-900 mb-4">What is Fasting?</h4>
                                      <p className="text-slate-600 mb-4">Fasting (Sawm) in Ramadan means abstaining from dawn (Fajr) until sunset (Maghrib) from:</p>
                                      <ul className="grid grid-cols-2 gap-3">
                                        {['Food', 'Drink', 'Sexual relations', 'All actions that invalidate the fast'].map((item, i) => (
                                          <li key={i} className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                            {item}
                                          </li>
                                        ))}
                                      </ul>
                                      <p className="mt-4 text-sm text-slate-500 font-medium">While maintaining: Good character & Worship of Allah</p>
                                    </section>

                                    <hr className="border-slate-100" />

                                    <section>
                                      <h4 className="text-xl font-bold text-slate-900 mb-4">Importance of Fasting</h4>
                                      <p className="text-slate-600 mb-4">Fasting is one of the Five Pillars of Islam.</p>
                                      <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                                        <h5 className="font-bold text-emerald-900 mb-3 text-sm uppercase tracking-wider">Benefits & Virtues</h5>
                                        <ul className="space-y-3">
                                          {[
                                            'Teaches self-control and patience',
                                            'Purifies the soul',
                                            'Increases taqwa (God-consciousness)',
                                            'Builds empathy for the poor',
                                            'Multiplies rewards'
                                          ].map((v, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-emerald-800">
                                              <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />
                                              {v}
                                            </li>
                                          ))}
                                        </ul>
                                        <div className="mt-6 pt-4 border-t border-emerald-200/50">
                                          <p className="text-sm font-bold text-emerald-900">Special virtue:</p>
                                          <p className="text-emerald-700 italic">“Fasting is for Me, and I will reward it.”</p>
                                        </div>
                                      </div>
                                    </section>

                                    <hr className="border-slate-100" />

                                    <section>
                                      <h4 className="text-xl font-bold text-slate-900 mb-4">Intention (Niyyah)</h4>
                                      <p className="text-slate-600 mb-4">Intention must be made before Fajr.</p>
                                      <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100">
                                        <p className="text-amber-900 font-medium text-center italic">“I intend to fast tomorrow for the sake of Allah.”</p>
                                        <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest text-center mt-3">Simple intention in heart • No need to say it aloud</p>
                                      </div>
                                    </section>

                                    <hr className="border-slate-100" />

                                    <section>
                                      <h4 className="text-xl font-bold text-slate-900 mb-4">Who must fast? (Obligations)</h4>
                                      <div className="grid grid-cols-2 gap-3">
                                        {['Adult Muslims', 'Sane persons', 'Physically able', 'Not travelling (optional concession)'].map((item, i) => (
                                          <div key={i} className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm flex items-center gap-3">
                                            <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                                              <User size={16} />
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">{item}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </section>

                                    <hr className="border-slate-100" />

                                    <section>
                                      <h4 className="text-xl font-bold text-slate-900 mb-4">Sunnahs of Fasting</h4>
                                      <div className="space-y-3">
                                        {[
                                          'Eating Suhoor (pre-dawn meal)',
                                          'Delaying Suhoor',
                                          'Breaking fast immediately at Maghrib',
                                          'Breaking fast with dates or water',
                                          'Making dua at Iftar',
                                          'Increasing Quran recitation',
                                          'Giving charity',
                                          'Avoiding arguments and sins'
                                        ].map((item, i) => (
                                          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 text-sm text-slate-700">
                                            <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                                            {item}
                                          </div>
                                        ))}
                                      </div>
                                    </section>
                                  </div>
                                )}

                                {selectedRamadanGuide === 2 && (
                                  <div className="space-y-8">
                                    <section>
                                      <h4 className="text-2xl font-black text-slate-900 mb-4">Valid excuses to break fast</h4>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {[
                                          { title: 'Illness', icon: '🤒' },
                                          { title: 'Travelling', icon: '✈️' },
                                          { title: 'Pregnancy', icon: '🤰' },
                                          { title: 'Breastfeeding', icon: '🤱' },
                                          { title: 'Severe hunger/thirst', icon: '🆘' },
                                          { title: 'Old age', icon: '👴' }
                                        ].map((item, i) => (
                                          <div key={i} className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm flex items-center gap-4">
                                            <span className="text-2xl">{item.icon}</span>
                                            <span className="text-sm font-bold text-slate-700">{item.title}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </section>

                                    <hr className="border-slate-100" />

                                    <section>
                                      <h4 className="text-xl font-bold text-slate-900 mb-4">Disliked actions (Makruh)</h4>
                                      <p className="text-sm text-slate-500 mb-6">These do NOT break fast but reduce reward:</p>
                                      <div className="space-y-3">
                                        {[
                                          'Lying or gossiping',
                                          'Arguing or fighting',
                                          'Wasting time excessively',
                                          'Brushing teeth with strong flavored toothpaste',
                                          'Smelling strong fragrances deliberately',
                                          'Watching sinful content'
                                        ].map((item, i) => (
                                          <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-sm text-rose-900">
                                            <AlertCircle size={18} className="text-rose-400 flex-shrink-0" />
                                            <span className="font-medium">{item}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </section>
                                  </div>
                                )}

                                {selectedRamadanGuide === 3 && (
                                  <div className="space-y-8">
                                    <section>
                                      <h4 className="text-2xl font-black text-rose-600 mb-4">Things that BREAK the fast</h4>
                                      <p className="text-sm text-slate-500 mb-4">If done intentionally:</p>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {[
                                          'Eating or drinking',
                                          'Sexual intercourse',
                                          'Masturbation causing ejaculation',
                                          'Vomiting intentionally',
                                          'Menstruation or post-natal bleeding',
                                          'Nutritional injections or IV fluids'
                                        ].map((item, i) => (
                                          <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-sm text-rose-900">
                                            <XCircle size={18} className="text-rose-400 flex-shrink-0" />
                                            <span className="font-bold">{i + 1}. {item}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </section>

                                    <hr className="border-slate-100" />

                                    <section>
                                      <h4 className="text-xl font-bold text-emerald-600 mb-4">Things that DO NOT break the fast</h4>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {[
                                          'Forgetfully eating or drinking',
                                          'Swallowing saliva',
                                          'Showering or swimming',
                                          'Using miswak (tooth stick)',
                                          'Blood test or injection (non-nutritive)',
                                          'Eye drops or ear drops',
                                          'Accidental vomiting',
                                          'Perfume or deodorant'
                                        ].map((item, i) => (
                                          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-sm text-emerald-900">
                                            <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                                            <span className="font-medium">{item}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </section>
                                  </div>
                                )}

                                {selectedRamadanGuide === 4 && (
                                  <div className="space-y-8">
                                    <section>
                                      <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center">
                                          <Calendar size={20} />
                                        </div>
                                        <h4 className="text-2xl font-black text-slate-900">Qadha (Make-up fast)</h4>
                                      </div>
                                      <p className="text-slate-600 mb-4">If fast is missed due to:</p>
                                      <div className="flex flex-wrap gap-2 mb-4">
                                        {['Illness', 'Travel', 'Menstruation'].map((item, i) => (
                                          <span key={i} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-bold border border-slate-200">{item}</span>
                                        ))}
                                      </div>
                                      <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-800 font-bold">
                                        <ArrowRight size={18} />
                                        Must fast later after Ramadan.
                                      </div>
                                    </section>

                                    <hr className="border-slate-100" />

                                    <section>
                                      <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-rose-100 text-rose-700 rounded-xl flex items-center justify-center">
                                          <ShieldAlert size={20} />
                                        </div>
                                        <h4 className="text-2xl font-black text-slate-900">Kaffarah (Expiation)</h4>
                                      </div>
                                      <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100 mb-6">
                                        <p className="text-rose-900 font-medium leading-relaxed">
                                          Required when fast is broken intentionally without valid excuse. 
                                          <span className="block mt-2 text-xs font-bold uppercase tracking-widest text-rose-400">Mainly applies to breaking fast by sexual intercourse.</span>
                                        </p>
                                      </div>
                                      <h5 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider">Kaffarah Options:</h5>
                                      <div className="space-y-3">
                                        <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm flex items-center gap-4">
                                          <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black text-xs">1</div>
                                          <span className="text-sm font-bold text-slate-700">Fast 60 consecutive days</span>
                                        </div>
                                        <div className="flex items-center justify-center py-1">
                                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">OR</span>
                                        </div>
                                        <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm flex items-center gap-4">
                                          <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black text-xs">2</div>
                                          <span className="text-sm font-bold text-slate-700">Feed 60 poor people</span>
                                        </div>
                                      </div>
                                    </section>
                                  </div>
                                )}

                                {selectedRamadanGuide === 5 && (
                                  <div className="space-y-8">
                                    <section>
                                      <h4 className="text-2xl font-black text-slate-900 mb-4">Types of Voluntary (Nafl) Fasting</h4>
                                      <h5 className="font-bold text-emerald-600 mb-4 text-sm uppercase tracking-wider">Highly recommended fasts</h5>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {[
                                          'Mondays & Thursdays',
                                          '13th, 14th, 15th of every Islamic month (White days)',
                                          'Day of Arafah (9 Dhul Hijjah)',
                                          'Day of Ashura (10 Muharram)',
                                          '6 days of Shawwal',
                                          'Fasting of Prophet Dawud (alternate days)'
                                        ].map((item, i) => (
                                          <div key={i} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex items-center gap-3">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                            <span className="text-sm font-bold text-slate-700">{item}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </section>

                                    <hr className="border-slate-100" />

                                    <section>
                                      <h4 className="text-xl font-bold text-slate-900 mb-4">Virtues</h4>
                                      <div className="space-y-4">
                                        {[
                                          { title: 'Erases sins', icon: '✨' },
                                          { title: 'Raises rank in Jannah', icon: '🏔️' },
                                          { title: 'Protects from Hellfire', icon: '🛡️' }
                                        ].map((v, i) => (
                                          <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                                            <span className="text-2xl">{v.icon}</span>
                                            <span className="font-bold text-emerald-900">{v.title}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </section>
                                  </div>
                                )}

                                {selectedRamadanGuide === 6 && (
                                  <div className="space-y-8">
                                    <section>
                                      <h4 className="text-2xl font-black text-rose-600 mb-4">Forbidden fasting days</h4>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {[
                                          'Eid al-Fitr (1 Shawwal)',
                                          'Eid al-Adha (10 Dhul Hijjah)',
                                          '11–13 Dhul Hijjah (Days of Tashreeq)',
                                          'Doubt day before Ramadan (without confirmation)'
                                        ].map((item, i) => (
                                          <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-sm text-rose-900">
                                            <XCircle size={18} className="text-rose-400 flex-shrink-0" />
                                            <span className="font-bold">{item}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </section>

                                    <hr className="border-slate-100" />

                                    <section>
                                      <h4 className="text-xl font-bold text-slate-900 mb-4">Moon sighting rules</h4>
                                      <div className="space-y-6">
                                        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                                          <h5 className="font-bold text-emerald-900 mb-3 text-sm uppercase tracking-wider">Ramadan begins when:</h5>
                                          <ul className="space-y-2">
                                            <li className="flex items-center gap-2 text-sm text-emerald-800">
                                              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                              Crescent moon is sighted OR
                                            </li>
                                            <li className="flex items-center gap-2 text-sm text-emerald-800">
                                              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                              30 days of Sha’ban completed
                                            </li>
                                          </ul>
                                        </div>
                                        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                                          <h5 className="font-bold text-amber-900 mb-3 text-sm uppercase tracking-wider">Ramadan ends when:</h5>
                                          <p className="text-sm text-amber-800">Shawwal moon is sighted.</p>
                                        </div>
                                      </div>
                                    </section>
                                  </div>
                                )}

                                {selectedRamadanGuide === 7 && (
                                  <div className="space-y-8">
                                    <section>
                                      <h4 className="text-2xl font-black text-slate-900 mb-4">What is Taraweeh?</h4>
                                      <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                                        <p className="text-indigo-900 font-medium leading-relaxed">
                                          Special night prayer during Ramadan performed after Isha prayer.
                                        </p>
                                      </div>
                                    </section>

                                    <hr className="border-slate-100" />

                                    <section>
                                      <h4 className="text-xl font-bold text-slate-900 mb-4">Rakats</h4>
                                      <p className="text-sm text-slate-500 mb-4">Common practices (Both are acceptable):</p>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm text-center">
                                          <p className="text-2xl font-black text-slate-900">8</p>
                                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rakats + Witr</p>
                                        </div>
                                        <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm text-center">
                                          <p className="text-2xl font-black text-slate-900">20</p>
                                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rakats + Witr</p>
                                        </div>
                                      </div>
                                    </section>

                                    <hr className="border-slate-100" />

                                    <section>
                                      <h4 className="text-xl font-bold text-slate-900 mb-4">Taraweeh Intention</h4>
                                      <div className="bg-slate-900 p-6 rounded-2xl text-center">
                                        <p className="text-white font-medium italic">“I intend to pray Taraweeh for Allah.”</p>
                                      </div>
                                    </section>

                                    <hr className="border-slate-100" />

                                    <section>
                                      <h4 className="text-xl font-bold text-slate-900 mb-4">Benefits</h4>
                                      <div className="space-y-3">
                                        {[
                                          'Forgiveness of past sins',
                                          'Reward of praying entire night'
                                        ].map((v, i) => (
                                          <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-sm text-emerald-900">
                                            <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
                                            <span className="font-bold">{v}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </section>
                                  </div>
                                )}

                                {selectedRamadanGuide === 8 && (
                                  <div className="space-y-8">
                                    <section>
                                      <h4 className="text-2xl font-black text-slate-900 mb-4">Sahur (Pre-dawn meal)</h4>
                                      <p className="text-slate-600 mb-6">Blessed meal before Fajr.</p>
                                      
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                                        <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100">
                                          <h5 className="font-bold text-amber-900 mb-3 text-xs uppercase tracking-wider">Benefits</h5>
                                          <ul className="space-y-2">
                                            {['Provides strength', 'Sunnah of Prophet'].map((v, i) => (
                                              <li key={i} className="flex items-center gap-2 text-sm text-amber-800">
                                                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                                                {v}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                        <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100">
                                          <h5 className="font-bold text-emerald-900 mb-3 text-xs uppercase tracking-wider">Recommended Foods</h5>
                                          <div className="flex flex-wrap gap-2">
                                            {['Dates', 'Water', 'Fruits', 'Oats / whole grains'].map((v, i) => (
                                              <span key={i} className="px-3 py-1 bg-white rounded-full text-[10px] font-bold text-emerald-700 border border-emerald-200">{v}</span>
                                            ))}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                        <h5 className="font-bold text-slate-900 mb-4 text-center text-sm uppercase tracking-widest">Dua at Sahur</h5>
                                        <p className="text-2xl font-arabic text-emerald-700 leading-loose mb-4 text-center">
                                          وَبِصَوْمِ غَدٍ نَّوَيْتُ مِنْ شَهْرِ رَمَضَانَ
                                        </p>
                                        <div className="space-y-2 text-center">
                                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transliteration</p>
                                          <p className="text-sm text-slate-700 font-medium">Wa bisawmi ghadin nawaytu min shahri Ramadan.</p>
                                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Meaning</p>
                                          <p className="text-xs text-slate-500 italic">“I intend to keep the fast for tomorrow in Ramadan.”</p>
                                        </div>
                                      </div>
                                    </section>

                                    <hr className="border-slate-100" />

                                    <section>
                                      <h4 className="text-2xl font-black text-slate-900 mb-4">Iftar (Breaking fast)</h4>
                                      <p className="text-slate-600 mb-6">Break fast immediately at sunset.</p>
                                      
                                      <div className="bg-rose-50 p-5 rounded-2xl border border-rose-100 mb-8">
                                        <h5 className="font-bold text-rose-900 mb-3 text-xs uppercase tracking-wider">Sunnah Method</h5>
                                        <div className="flex items-center justify-around">
                                          {['Dates', 'Water', 'Maghrib prayer'].map((v, i) => (
                                            <div key={i} className="flex flex-col items-center gap-2">
                                              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-lg shadow-sm">{i === 0 ? '🌴' : i === 1 ? '💧' : '🕌'}</div>
                                              <span className="text-[10px] font-bold text-rose-700 uppercase">{v}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                        <h5 className="font-bold text-slate-900 mb-4 text-center text-sm uppercase tracking-widest">Dua at Iftar</h5>
                                        <p className="text-2xl font-arabic text-emerald-700 leading-loose mb-4 text-center">
                                          اللَّهُمَّ لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ
                                        </p>
                                        <div className="space-y-2 text-center">
                                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transliteration</p>
                                          <p className="text-sm text-slate-700 font-medium">Allahumma inni laka sumtu wa ala rizq-ika-aftartu</p>
                                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Meaning</p>
                                          <p className="text-xs text-slate-500 italic">"O Allah! For You I have fasted and upon your provision, I have broken my fast."</p>
                                        </div>
                                      </div>
                                    </section>
                                  </div>
                                )}

                                {selectedRamadanGuide === 9 && (
                                  <div className="space-y-8">
                                    <section>
                                      <h4 className="text-2xl font-black text-slate-900 mb-4">What is Itikaf?</h4>
                                      <div className="bg-emerald-700 rounded-3xl p-6 text-white shadow-lg">
                                        <p className="font-medium leading-relaxed">
                                          Staying in the mosque during the last 10 days of Ramadan specifically for worship and spiritual seclusion.
                                        </p>
                                      </div>
                                    </section>

                                    <hr className="border-slate-100" />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                      <section>
                                        <h4 className="text-xl font-bold text-slate-900 mb-4">Purpose</h4>
                                        <ul className="space-y-3">
                                          {[
                                            'Seek Laylatul Qadr',
                                            'Disconnect from worldly distractions',
                                            'Increase worship'
                                          ].map((v, i) => (
                                            <li key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 text-sm text-slate-700 border border-slate-100">
                                              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                              {v}
                                            </li>
                                          ))}
                                        </ul>
                                      </section>

                                      <section>
                                        <h4 className="text-xl font-bold text-slate-900 mb-4">Conditions</h4>
                                        <ul className="space-y-3">
                                          {[
                                            'Stay in mosque',
                                            'Leave only for necessities',
                                            'Avoid worldly talk',
                                            'Focus on worship'
                                          ].map((v, i) => (
                                            <li key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 text-sm text-slate-700 border border-slate-100">
                                              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                                              {v}
                                            </li>
                                          ))}
                                        </ul>
                                      </section>
                                    </div>

                                    <hr className="border-slate-100" />

                                    <section>
                                      <h4 className="text-xl font-bold text-slate-900 mb-4">Acts during Itikaf</h4>
                                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {[
                                          { title: 'Quran', icon: '📖' },
                                          { title: 'Dhikr', icon: '📿' },
                                          { title: 'Dua', icon: '🤲' },
                                          { title: 'Night Prayer', icon: '🌙' }
                                        ].map((v, i) => (
                                          <div key={i} className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                                            <span className="text-2xl">{v.icon}</span>
                                            <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">{v.title}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </section>
                                  </div>
                                )}

                                {selectedRamadanGuide > 9 && (
                                  <div className="py-20 text-center space-y-4">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                                      <BookOpen size={32} />
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-900">Coming Soon</h4>
                                    <p className="text-sm text-slate-500 max-w-xs mx-auto">Detailed information for this point is being prepared. Please check back later.</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h4 className="font-bold text-slate-900 mb-4">Virtues of Ramadan</h4>
                            <ul className="space-y-4">
                              {[
                                "The Quran was revealed in this month.",
                                "The gates of Paradise are opened and the gates of Hell are closed.",
                                "Laylatul Qadr (The Night of Power) is in the last ten nights.",
                                "Fasting is one of the five pillars of Islam."
                              ].map((v, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                                  <CheckCircle2 className="text-emerald-500 flex-shrink-0 mt-0.5" size={16} />
                                  {v}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {deenSubTab === 'hajj' && (
                        <div className="space-y-6">
                          {selectedHajjGuide === null ? (
                            <>
                              <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                                <div className="relative z-10">
                                  <h3 className="text-3xl font-black mb-2">Hajj & Umrah</h3>
                                  <p className="text-slate-400 text-sm max-w-md">The sacred journey to the House of Allah. A comprehensive guide for pilgrims.</p>
                                </div>
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                  <img src="https://i.postimg.cc/bGgCqYLP/hajj.png" alt="" className="w-32 h-32 object-contain" />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 gap-4">
                                {HAJJ_GUIDES.map((guide, i) => (
                                  <button 
                                    key={i} 
                                    onClick={() => setSelectedHajjGuide(i)}
                                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-emerald-500 hover:shadow-md transition-all text-left group"
                                  >
                                    <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center font-black group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                      {i + 1}
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors uppercase tracking-tight text-sm">{guide.title}</h4>
                                      <p className="text-xs text-slate-500">{guide.desc}</p>
                                    </div>
                                    <ChevronRight size={18} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                                  </button>
                                ))}
                              </div>
                            </>
                          ) : (
                            <motion.div 
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="space-y-6"
                            >
                              <button 
                                onClick={() => setSelectedHajjGuide(null)}
                                className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold text-[10px] uppercase tracking-widest transition-colors mb-4"
                              >
                                <ChevronLeft size={16} />
                                Back to Topics
                              </button>

                              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                                <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tight">{HAJJ_GUIDES[selectedHajjGuide].title}</h3>
                                {HAJJ_GUIDES[selectedHajjGuide].content}
                              </div>
                            </motion.div>
                          )}
                        </div>
                      )}

                      {deenSubTab === 'qibla' && (
                        <div className="space-y-6 text-center">
                          <h3 className="text-2xl font-black text-slate-900">Qibla Direction</h3>
                          <p className="text-sm text-slate-500 max-w-xs mx-auto">Face the Kaaba in Makkah for your prayers.</p>
                          
                          <div className="relative w-64 h-64 mx-auto mt-8">
                            {/* Simple Compass UI */}
                            <div className="absolute inset-0 rounded-full border-4 border-slate-200 shadow-inner" />
                            <div className="absolute inset-2 rounded-full border border-slate-100" />
                            
                            {/* Compass Marks */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="absolute top-2 font-bold text-slate-400 text-xs">N</span>
                              <span className="absolute bottom-2 font-bold text-slate-400 text-xs">S</span>
                              <span className="absolute left-2 font-bold text-slate-400 text-xs">W</span>
                              <span className="absolute right-2 font-bold text-slate-400 text-xs">E</span>
                            </div>

                            {/* Compass Needle */}
                            <motion.div 
                              animate={{ rotate: 45 }} // Static for demo, would use device orientation in real app
                              className="absolute inset-0 flex items-center justify-center"
                            >
                              <div className="w-1 h-32 bg-slate-300 rounded-full relative">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-emerald-600 rotate-45 -mt-2 rounded-sm shadow-md" />
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-8">
                                  <img src="https://i.postimg.cc/186b1ZLf/qibla.png" alt="Kaaba" className="w-8 h-8 object-contain" />
                                </div>
                              </div>
                            </motion.div>
                            
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-3 h-3 bg-white border-2 border-slate-400 rounded-full shadow-sm" />
                            </div>
                          </div>

                          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 max-w-xs mx-auto mt-8">
                            <p className="text-xs text-emerald-800 font-medium">
                              Note: This is a visual representation. For accurate direction, please use a device with a magnetometer.
                            </p>
                          </div>
                        </div>
                      )}

                      {deenSubTab === 'calendar' && (
                        <div className="space-y-6">
                          <h3 className="text-2xl font-black text-slate-900">Islamic Calendar & Events</h3>
                          
                          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
                            <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2">Current Hijri Date</h4>
                            <p className="text-4xl font-black text-slate-900 mb-2">{hijriDate}</p>
                            <p className="text-sm text-slate-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          </div>

                          {hijriCalendar.length > 0 && (
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h4 className="font-bold text-slate-900">
                                  {hijriCalendar[0]?.hijri.month.en} {hijriCalendar[0]?.hijri.year} AH
                                </h4>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                  {hijriCalendar[0]?.gregorian.month.en} {hijriCalendar[0]?.gregorian.year}
                                </span>
                              </div>
                              <div className="p-6">
                                <div className="grid grid-cols-7 gap-2 mb-4">
                                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                    <div key={d} className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-tighter">{d}</div>
                                  ))}
                                </div>
                                <div className="grid grid-cols-7 gap-2">
                                  {(() => {
                                    const firstDay = hijriCalendar[0]?.gregorian.weekday.en;
                                    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                                    const offset = days.indexOf(firstDay);
                                    return Array.from({ length: offset >= 0 ? offset : 0 }).map((_, i) => (
                                      <div key={`empty-${i}`} />
                                    ));
                                  })()}
                                  {hijriCalendar.map((day, i) => {
                                    const isToday = day.gregorian.date === new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
                                    return (
                                      <div key={i} className={cn(
                                        "relative flex flex-col items-center justify-center p-2 rounded-xl border aspect-square transition-all",
                                        isToday ? "border-emerald-200 bg-emerald-50/30" : "border-slate-50 bg-slate-50/50"
                                      )}>
                                        <span className={cn(
                                          "text-[10px] font-bold",
                                          isToday ? "text-emerald-600" : "text-slate-400"
                                        )}>
                                          {day.gregorian.day}
                                        </span>
                                        <span className={cn(
                                          "text-sm font-black",
                                          isToday ? "text-emerald-700" : "text-slate-800"
                                        )}>
                                          {day.hijri.day}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-3 gap-3">
                            {[
                              "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
                              "Jumada al-Ula", "Jumada al-Akhirah", "Rajab", "Sha'ban",
                              "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
                            ].map((month, i) => {
                              const currentMonthFromApi = hijriCalendar[0]?.hijri.month.en;
                              const isCurrentMonth = currentMonthFromApi && currentMonthFromApi.toLowerCase().includes(month.toLowerCase().replace(/['\s]/g, ''));
                              
                              // Special case for Rabi' al-Awwal / Rabi' al-Thani formatting differences
                              const isMonthMatch = isCurrentMonth || (currentMonthFromApi === month);

                              return (
                                <div 
                                  key={i} 
                                  className={cn(
                                    "bg-white p-3 rounded-xl border flex flex-col items-center gap-2 text-center relative overflow-hidden transition-all",
                                    isMonthMatch 
                                      ? "border-2 border-emerald-600 bg-emerald-50/50 shadow-md transform scale-[1.02] ring-4 ring-emerald-500/10" 
                                      : "border-slate-200"
                                  )}
                                >
                                  <span className={cn(
                                    "w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold transition-colors",
                                    isCurrentMonth ? "bg-emerald-600 text-white" : "bg-slate-50 text-slate-400"
                                  )}>
                                    {i + 1}
                                  </span>
                                  <span className={cn(
                                    "text-[10px] leading-tight transition-all",
                                    isCurrentMonth ? "font-black text-emerald-800" : "font-bold text-slate-800"
                                  )}>
                                    {month}
                                  </span>
                                  {isCurrentMonth && (
                                    <div className="absolute top-0 right-0">
                                      <div className="bg-emerald-500 text-white text-[6px] font-black px-1.5 py-0.5 rounded-bl-lg uppercase">Current</div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          <div className="space-y-4">
                            <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                              <Calendar size={20} className="text-emerald-600" />
                              Upcoming Islamic Events
                            </h4>
                            <div className="grid grid-cols-1 gap-4">
                              {UPCOMING_EVENTS.map((event, i) => (
                                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-6">
                                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex flex-col items-center justify-center flex-shrink-0">
                                    <Calendar size={24} />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-slate-900">{event.name}</h4>
                                    <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest mb-1">{event.date}</p>
                                    <p className="text-sm text-slate-500 leading-relaxed">{event.description}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {deenSubTab === 'dua_deen' && (
                        <div className="space-y-6">
                          <div className="bg-emerald-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                            <div className="relative z-10">
                              <h3 className="text-3xl font-black mb-2">Dua & Supplications</h3>
                              <p className="text-emerald-100 text-sm max-w-md">"Dua is the essence of worship." Connect with Allah through these beautiful supplications.</p>
                            </div>
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                              <img src="https://i.postimg.cc/sGZ6syrV/open-hands.png" alt="" className="w-32 h-32 object-contain" />
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div className="flex items-center justify-between">
                              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <Bookmark className="text-emerald-600" size={24} />
                                {selectedDuaCategory ? selectedDuaCategory : 'Dua Categories'}
                              </h3>
                              {selectedDuaCategory && (
                                <button 
                                  onClick={() => setSelectedDuaCategory(null)}
                                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                                >
                                  <ChevronLeft size={14} />
                                  Back to Categories
                                </button>
                              )}
                            </div>

                            {!selectedDuaCategory ? (
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {DUA_CATEGORIES.map(cat => {
                                  const count = DUAS.filter(d => d.category === cat).length;
                                  return (
                                    <button
                                      key={cat}
                                      onClick={() => setSelectedDuaCategory(cat)}
                                      className="bg-white p-4 rounded-2xl border border-slate-200 text-center hover:border-emerald-500 hover:shadow-md transition-all group"
                                    >
                                      <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                        <Bookmark size={20} />
                                      </div>
                                      <span className="block text-xs font-bold text-slate-800 mb-1">{cat}</span>
                                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{count} Duas</span>
                                    </button>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {DUAS.filter(d => d.category === selectedDuaCategory).map(dua => (
                                  <div key={dua.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all relative group">
                                    <div className="flex items-center justify-between mb-4">
                                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{dua.category}</span>
                                      <button 
                                        onClick={() => toggleDuaBookmark(dua.id)}
                                        className={cn(
                                          "p-2 rounded-lg transition-all",
                                          bookmarkedDuas.includes(dua.id) ? "bg-emerald-50 text-emerald-600" : "text-slate-300 hover:text-emerald-600 hover:bg-emerald-50"
                                        )}
                                      >
                                        <Bookmark size={18} fill={bookmarkedDuas.includes(dua.id) ? "currentColor" : "none"} />
                                      </button>
                                    </div>
                                    <h4 className="font-bold text-slate-900 mb-2">{dua.title}</h4>
                                    <p className="text-right text-lg font-arabic mb-4 leading-relaxed">{dua.arabic}</p>
                                    {dua.transliteration && (
                                      <p className="text-sm font-medium text-emerald-700/80 italic mb-2 leading-relaxed">{dua.transliteration}</p>
                                    )}
                                    <p className="text-xs text-slate-500 leading-relaxed">{dua.translation}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {deenSubTab === 'kalima' && (
                        <div className="space-y-6">
                          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                            <div className="relative z-10">
                              <h3 className="text-3xl font-black mb-2">The Six Kalimas</h3>
                              <p className="text-slate-400 text-sm max-w-md">The fundamental declarations of faith in Islam. Essential for every Muslim to know and understand.</p>
                            </div>
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                              <img src="https://i.postimg.cc/GHnwtgSJ/ornament.png" alt="" className="w-32 h-32 object-contain" />
                            </div>
                          </div>

                          <div className="space-y-4">
                            {KALIMAS.map((kalima) => (
                              <div key={kalima.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                  <h4 className="font-black text-slate-900">{kalima.title}</h4>
                                  <span className="w-8 h-8 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center text-xs font-bold">{kalima.id}</span>
                                </div>
                                <p className="text-2xl font-arabic text-right leading-loose text-slate-900 py-2">{kalima.arabic}</p>
                                <div className="space-y-2">
                                  <p className="text-xs font-medium text-emerald-600 italic">{kalima.transliteration}</p>
                                  <p className="text-sm text-slate-600 leading-relaxed">{kalima.translation}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {deenSubTab === 'pillars' && (
                        <div className="space-y-6">
                          {selectedPillar === null ? (
                            <>
                              <div className="bg-emerald-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                                <div className="relative z-10">
                                  <h3 className="text-3xl font-black mb-2">Pillars of Islam</h3>
                                  <p className="text-emerald-100 text-sm max-w-md">The five basic acts in Islam, considered mandatory by believers and are the foundation of Muslim life.</p>
                                </div>
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                  <img src="https://i.postimg.cc/rRtnMckw/window.png" alt="" className="w-32 h-32 object-contain" />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 gap-4">
                                {PILLAR_GUIDES.map((pillar, i) => (
                                  <button
                                    key={i}
                                    onClick={() => setSelectedPillar(i)}
                                    className="group relative bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-500 transition-all duration-300 text-left overflow-hidden flex gap-6"
                                  >
                                    <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center font-black text-2xl group-hover:bg-emerald-100 transition-colors shrink-0">
                                      {i + 1}
                                    </div>
                                    <div className="relative z-10 flex-1">
                                      <h4 className="font-black text-slate-900 text-lg mb-1 group-hover:text-emerald-600 transition-colors flex items-center gap-2">
                                        {pillar.title}
                                        <span className="text-lg opacity-40">{pillar.icon}</span>
                                      </h4>
                                      <p className="text-sm text-slate-500 font-medium leading-relaxed">{pillar.desc}</p>
                                      <div className="mt-4 inline-flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                                        Learn More <ChevronRight size={14} />
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </>
                          ) : (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="space-y-8"
                            >
                              <div className="flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md py-4 z-20 border-b border-slate-100">
                                <button 
                                  onClick={() => setSelectedPillar(null)}
                                  className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors font-black text-[10px] uppercase tracking-widest"
                                >
                                  <ChevronLeft size={16} />
                                  Back to Pillars
                                </button>
                                <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Pillar Details</div>
                              </div>

                              <div>
                                {PILLAR_GUIDES[selectedPillar].content}
                              </div>

                              <button 
                                onClick={() => {
                                  setSelectedPillar(null);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="w-full py-4 bg-slate-100 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-200 transition-colors"
                              >
                                Back to Top
                              </button>
                            </motion.div>
                          )}
                        </div>
                      )}

                      {deenSubTab === 'festivals' && (
                        <div className="space-y-6">
                          {selectedFestival === null ? (
                            <>
                              <div className="bg-amber-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                                <div className="relative z-10">
                                  <h3 className="text-3xl font-black mb-2">Islamic Festivals</h3>
                                  <p className="text-amber-100 text-sm max-w-md">Key religious observances and celebrations in the Islamic calendar that bring the community together.</p>
                                </div>
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                  <img src="https://i.postimg.cc/LgZC2Rp4/eid-al-fitr.png" alt="" className="w-32 h-32 object-contain" />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 gap-4">
                                {FESTIVAL_GUIDES.map((festival, i) => (
                                  <button
                                    key={i}
                                    onClick={() => setSelectedFestival(i)}
                                    className="group relative bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-amber-500 transition-all duration-300 text-left overflow-hidden"
                                  >
                                    <div className="absolute top-0 right-0 p-4 text-4xl opacity-20 group-hover:opacity-40 transition-opacity">
                                      {festival.icon}
                                    </div>
                                    <div className="relative z-10">
                                      <h4 className="font-black text-slate-900 text-lg mb-1 group-hover:text-amber-600 transition-colors">{festival.title}</h4>
                                      <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-[80%]">{festival.desc}</p>
                                      <div className="mt-4 inline-flex items-center gap-2 text-[10px] font-black text-amber-600 uppercase tracking-widest">
                                        View Details <ChevronRight size={14} />
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </>
                          ) : (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="space-y-8"
                            >
                              <div className="flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md py-4 z-20 border-b border-slate-100">
                                <button 
                                  onClick={() => setSelectedFestival(null)}
                                  className="flex items-center gap-2 text-slate-500 hover:text-amber-600 transition-colors font-black text-[10px] uppercase tracking-widest"
                                >
                                  <ChevronLeft size={16} />
                                  Back to Festivals
                                </button>
                                <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Festival Details</div>
                              </div>

                              <div>
                                {FESTIVAL_GUIDES[selectedFestival].content}
                              </div>

                              <button 
                                onClick={() => {
                                  setSelectedFestival(null);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="w-full py-4 bg-slate-100 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-200 transition-colors"
                              >
                                Back to Top
                              </button>
                            </motion.div>
                          )}
                        </div>
                      )}

                      {deenSubTab === 'saved' && (
                        <SavedItemsView 
                          bookmarkedSurahs={bookmarkedSurahs}
                          surahs={surahs}
                          setActiveTab={setActiveTab}
                          setDeenSubTab={setDeenSubTab}
                          handleSurahClick={handleSurahClick}
                          toggleSurahBookmark={toggleSurahBookmark}
                          bookmarkedDuas={bookmarkedDuas}
                          DUAS={DUAS}
                          toggleDuaBookmark={toggleDuaBookmark}
                        />
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="max-w-4xl mx-auto"
                >
                  <button 
                    onClick={() => setSelectedSurah(null)}
                    className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-medium transition-colors text-sm mb-6"
                  >
                    <ChevronLeft size={20} />
                    Back to Deen
                  </button>
                  {/* Surah Detail Content (same as before) */}
                  <div className="bg-emerald-700 rounded-3xl p-8 text-white shadow-xl mb-8 relative overflow-hidden">
                    <div className="relative z-10 text-center">
                      <h2 className="text-3xl font-bold mb-1">{selectedSurah.name_simple}</h2>
                      <p className="text-emerald-100/80 text-sm mb-6">{selectedSurah.translated_name.name}</p>
                      <div className="text-5xl font-arabic mb-8">{selectedSurah.name_arabic}</div>
                      {audio && (
                        <div className="flex flex-col items-center gap-4 w-full max-w-xs mx-auto">
                          <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={audioCurrentTime}
                            onChange={handleSeek}
                            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                          />
                          <div className="flex items-center gap-6">
                            <button 
                              onClick={() => {
                                if (audioRef.current) {
                                  audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
                                }
                              }}
                              className="w-10 h-10 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
                              title="Skip back 10s"
                            >
                              <RefreshCw size={20} className="-scale-x-100" />
                            </button>
                            <button onClick={togglePlay} className="w-16 h-16 bg-white text-emerald-700 rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all">
                              {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                            </button>
                            <button 
                              onClick={() => {
                                if (audioRef.current) {
                                  audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
                                }
                              }}
                              className="w-10 h-10 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
                              title="Skip forward 10s"
                            >
                              <RefreshCw size={20} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex p-1 bg-slate-200 rounded-xl mb-8 w-fit mx-auto">
                    {['verses', 'info', 'tafsir'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setSurahTab(t as any)}
                        className={cn(
                          "px-6 py-2 rounded-lg text-sm font-bold transition-all capitalize",
                          surahTab === t ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    {detailLoading ? (
                      <div className="py-12 text-center"><Loader2 className="animate-spin mx-auto text-emerald-600" /></div>
                    ) : surahTab === 'verses' ? (
                      surahDetail?.ayahs.map((ayah: any) => (
                        <div key={ayah.number} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                          <div className="flex justify-between mb-4">
                            <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-[10px] font-bold">{ayah.numberInSurah}</span>
                          </div>
                          <p className="text-right text-2xl font-arabic leading-loose mb-4">{ayah.arabicText}</p>
                          <p className="text-slate-600 text-sm leading-relaxed">{ayah.text}</p>
                        </div>
                      ))
                    ) : surahTab === 'info' ? (
                      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm prose prose-emerald max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: surahInfo?.text || '' }} />
                      </div>
                    ) : (
                      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                        {tafsir.map((t, i) => <div key={i} dangerouslySetInnerHTML={{ __html: t.text }} className="text-sm text-slate-600 leading-relaxed" />)}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === 'amal' && (
            <motion.div
              key="amal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Tab Switcher */}
              <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <button
                  onClick={() => setAmalSubTab('quran')}
                  className={cn(
                    "flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2",
                    amalSubTab === 'quran' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" : "text-slate-500 hover:bg-slate-50"
                  )}
                >
                  <BookOpen size={16} />
                  Quran
                </button>
                <button
                  onClick={() => setAmalSubTab('dua')}
                  className={cn(
                    "flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2",
                    amalSubTab === 'dua' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" : "text-slate-500 hover:bg-slate-50"
                  )}
                >
                  <Bookmark size={16} />
                  Daily Dua
                </button>
              </div>

              <AnimatePresence mode="wait">
                {amalSubTab === 'quran' && (
                  <motion.div
                    key="quran-tab"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Daily Reminder */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                      <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2">Daily Reminder</h4>
                      <p className="text-slate-700 font-medium italic">"The best of you are those who learn the Quran and teach it"</p>
                      <p className="text-[10px] text-slate-400 mt-2">— Prophet Muhammad (PBUH)</p>
                    </div>

                    {/* Quran Khatam Player */}
                    <div className="bg-emerald-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-6">
                          <Headphones size={20} className="text-emerald-300" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-200">Quran Khatam Player</span>
                        </div>
                        
                        {surahs.length > 0 ? (
                          <div className="flex flex-col gap-6">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                              <div className="text-center md:text-left">
                                <h3 className="text-3xl font-bold mb-1">{surahs[khatamSurahIndex].name_simple}</h3>
                                <p className="text-emerald-100/80 text-sm">Surah {khatamSurahIndex + 1} of 114</p>
                              </div>
                              <div className="text-5xl font-arabic opacity-80">{surahs[khatamSurahIndex].name_arabic}</div>
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-emerald-200">
                                <span>{formatTime(isKhatamMode ? audioCurrentTime : khatamTime)}</span>
                                <span>{formatTime(isKhatamMode ? duration : 0)}</span>
                              </div>
                              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-white rounded-full transition-all duration-300"
                                  style={{ width: `${((isKhatamMode ? audioCurrentTime : khatamTime) / (isKhatamMode ? duration || 1 : 1)) * 100}%` }}
                                />
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-4">
                              <button 
                                onClick={handleKhatamPlay}
                                className="w-full sm:w-auto bg-white text-emerald-700 px-8 py-3 rounded-2xl font-bold text-sm shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
                                disabled={listAudioLoading === surahs[khatamSurahIndex].id}
                              >
                                {listAudioLoading === surahs[khatamSurahIndex].id ? (
                                  <Loader2 size={20} className="animate-spin" />
                                ) : (
                                  isKhatamMode && isPlaying ? <Pause size={20} /> : <Play size={20} />
                                )}
                                {isKhatamMode && isPlaying ? 'Pause' : khatamTime > 0 ? 'Continue from where I left' : 'Start Journey'}
                              </button>
                              
                              {!isKhatamMode && khatamTime > 0 && (
                                <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest">
                                  Last left at Surah {khatamSurahIndex + 1}
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center py-12">
                            <Loader2 className="animate-spin" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 text-center space-y-2 max-w-sm mx-auto">
                      <p className="text-emerald-800 font-medium text-sm leading-relaxed">"Continue your Quran journey with ease.</p>
                      <p className="text-slate-500 text-xs italic leading-relaxed">Resume from where you last paused and stay consistent.</p>
                      <p className="text-emerald-900 font-bold text-sm leading-relaxed">Complete your Khatam with peace and dedication."</p>
                    </div>
                  </motion.div>
                )}

                {amalSubTab === 'dua' && (
                  <motion.div
                    key="dua-tab"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Daily Reminder */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                      <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2">Daily Reminder</h4>
                      <p className="text-slate-700 font-medium italic">"Dua is the essence of worship."</p>
                      <p className="text-[10px] text-slate-400 mt-1">— Prophet Muhammad (PBUH) (Tirmidhi)</p>
                      <p className="text-xs text-slate-500 mt-3 font-medium">Make your heart speak to its Creator (Allah).</p>
                    </div>

                    {/* Dua Section */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                          <Bookmark className="text-emerald-600" size={24} />
                          {selectedDuaCategory ? selectedDuaCategory : 'Daily Duas'}
                        </h3>
                        {selectedDuaCategory && (
                          <button 
                            onClick={() => setSelectedDuaCategory(null)}
                            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                          >
                            <ChevronLeft size={14} />
                            Back to Categories
                          </button>
                        )}
                      </div>

                      {!selectedDuaCategory ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {DUA_CATEGORIES.map(cat => {
                            const count = DUAS.filter(d => d.category === cat).length;
                            return (
                              <button
                                key={cat}
                                onClick={() => setSelectedDuaCategory(cat)}
                                className="bg-white p-4 rounded-2xl border border-slate-200 text-center hover:border-emerald-500 hover:shadow-md transition-all group"
                              >
                                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                  <Bookmark size={20} />
                                </div>
                                <span className="block text-xs font-bold text-slate-800 mb-1">{cat}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{count} Duas</span>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {DUAS.filter(d => d.category === selectedDuaCategory).map(dua => (
                            <div key={dua.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all relative group">
                              <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{dua.category}</span>
                                <button 
                                  onClick={() => toggleDuaBookmark(dua.id)}
                                  className={cn(
                                    "p-2 rounded-lg transition-all",
                                    bookmarkedDuas.includes(dua.id) ? "bg-emerald-50 text-emerald-600" : "text-slate-300 hover:text-emerald-600 hover:bg-emerald-50"
                                  )}
                                >
                                  <Bookmark size={18} fill={bookmarkedDuas.includes(dua.id) ? "currentColor" : "none"} />
                                </button>
                              </div>
                              <h4 className="font-bold text-slate-900 mb-2">{dua.title}</h4>
                              <p className="text-right text-lg font-arabic mb-4 leading-relaxed">{dua.arabic}</p>
                              {dua.transliteration && (
                                <p className="text-sm font-medium text-emerald-700/80 italic mb-2 leading-relaxed">{dua.transliteration}</p>
                              )}
                              <p className="text-xs text-slate-500 leading-relaxed">{dua.translation}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <SavedItemsView 
                bookmarkedSurahs={bookmarkedSurahs}
                surahs={surahs}
                setActiveTab={setActiveTab}
                setDeenSubTab={setDeenSubTab}
                handleSurahClick={handleSurahClick}
                toggleSurahBookmark={toggleSurahBookmark}
                bookmarkedDuas={bookmarkedDuas}
                DUAS={DUAS}
                toggleDuaBookmark={toggleDuaBookmark}
                isCollapsible={true}
                isExpanded={isDashboardSavedItemsExpanded}
                onToggle={() => setIsDashboardSavedItemsExpanded(!isDashboardSavedItemsExpanded)}
              />

              <SalahDashboard 
                salahHistory={salahHistory} 
                selectedDate={selectedDashboardDate}
                onDateChange={setSelectedDashboardDate}
              />
              <TasbihDashboard stats={tasbihStats} />

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">Progress History</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Last 15 Days</p>
                </div>
                <div className="p-6">
                  {dashboardHistory.length === 0 ? (
                    <div className="py-12 text-center">
                      <BarChart3 size={48} className="text-slate-100 mx-auto mb-4" />
                      <p className="text-slate-400 text-sm">Keep using the app to see your trends.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {dashboardHistory.map((history) => (
                        <div key={history.date} className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">
                              {history.date === new Date().toDateString() ? 'Today' : history.date}
                            </span>
                            <span className="text-xs font-black text-emerald-600">{history.completedRakats}/{history.totalRakats} Rakats</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 rounded-full transition-all"
                              style={{ width: `${(history.completedRakats / (history.totalRakats || 1)) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <StreakCalendar visitedDates={visitedDates} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-sepia-50/80 backdrop-blur-lg border-t border-sepia-200 px-6 py-3 z-40">
        <div className="flex items-center justify-between max-w-sm mx-auto">
          {[
            { id: 'home', icon: HomeNavIcon, label: 'Home' },
            { id: 'deen', icon: DeenNavIcon, label: 'Deen' },
            { id: 'amal', icon: DailyAmalIcon, label: 'Daily Amal' },
            { id: 'dashboard', icon: DashboardNavIcon, label: 'Dashboard' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'deen') {
                  setDeenSubTab('grid');
                  setSelectedRamadanGuide(null);
                  setSelectedHajjGuide(null);
                  setPrayerSubTab('menu');
                  setSelectedSalahDua(null);
                  setSelectedEssentialSurah(null);
                  setSelectedSurah(null);
                }
                setActiveTab(tab.id as any);
              }}
              className={cn(
                "flex flex-col items-center gap-1 transition-all min-w-[64px] md:min-w-[80px] p-1.5 rounded-xl border-2",
                activeTab === tab.id ? "text-sepia-900 border-emerald-500 bg-sepia-100/50" : "text-sepia-900/40 border-transparent hover:text-sepia-900"
              )}
            >
              <tab.icon size={24} className={cn(activeTab === tab.id && "scale-110")} />
              <span className="text-[9px] md:text-[10px] font-bold whitespace-nowrap">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-6">
            <a href="#" className="text-slate-400 hover:text-emerald-600 transition-colors text-xs font-medium">Privacy Policy</a>
            <a href="#" className="text-slate-400 hover:text-emerald-600 transition-colors text-xs font-medium">Terms of Service</a>
            <a href="mailto:hasanalbannashishir@gmail.com" className="text-slate-400 hover:text-emerald-600 transition-colors text-xs font-medium">Contact Us</a>
          </div>
        </div>
      </footer>

      {/* Global Audio Element */}
      <audio 
        ref={audioRef} 
        src={audio?.audio_url} 
        onTimeUpdate={() => {
          const currentTime = audioRef.current?.currentTime || 0;
          setAudioCurrentTime(currentTime);
          if (isKhatamMode && listPlayingId === surahs[khatamSurahIndex]?.id) {
            setKhatamTime(currentTime);
            localStorage.setItem('khatam_time', currentTime.toString());
          }
        }}
        onLoadedMetadata={() => {
          setDuration(audioRef.current?.duration || 0);
          if (isKhatamMode && audioRef.current && khatamTime > 0) {
            // Use a small delay to ensure the browser has loaded enough to seek
            setTimeout(() => {
              if (audioRef.current && isKhatamMode) {
                audioRef.current.currentTime = khatamTime;
              }
            }, 50);
          }
        }}
        onEnded={async () => {
          if (isKhatamMode && khatamSurahIndex < 113) {
            const nextIndex = khatamSurahIndex + 1;
            setKhatamSurahIndex(nextIndex);
            setKhatamTime(0);
            localStorage.setItem('khatam_surah_index', nextIndex.toString());
            localStorage.setItem('khatam_time', '0');
            
            // Play next surah
            try {
              const nextSurah = surahs[nextIndex];
              const audioData = await quranService.getSurahAudio(nextSurah.id);
              setAudio(audioData);
              setListPlayingId(nextSurah.id);
            } catch (error) {
              console.error("Error playing next Khatam surah:", error);
              setIsPlaying(false);
            }
          } else {
            setIsPlaying(false);
            setListPlayingId(null);
            setAudioCurrentTime(0);
            if (isKhatamMode && khatamSurahIndex === 113) {
              // Finished Khatam!
              setIsKhatamMode(false);
              setKhatamSurahIndex(0);
              setKhatamTime(0);
              localStorage.setItem('khatam_surah_index', '0');
              localStorage.setItem('khatam_time', '0');
            }
          }
        }}
        className="hidden"
      />

      {/* Global Mini Player */}
      <AnimatePresence>
        {listPlayingId && !selectedSurah && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className={cn(
              "fixed left-4 right-4 z-50 transition-all duration-300",
              "bottom-20 md:bottom-6 md:right-6 md:left-auto md:w-[400px]"
            )}
          >
            <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
              {/* Progress Bar at the top of mini player */}
              <div className="h-1 bg-slate-100 w-full overflow-hidden">
                <motion.div 
                  className="h-full bg-emerald-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${(audioCurrentTime / duration) * 100}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              
              <div className="p-3 md:p-4 flex items-center justify-between gap-2 md:gap-4">
                <div className="flex items-center gap-2 md:gap-3 overflow-hidden min-w-0">
                  <div className={cn(
                    "w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all",
                    isPlaying ? "bg-emerald-600 text-white animate-pulse" : "bg-slate-100 text-slate-400"
                  )}>
                    <Music size={20} className="md:hidden" />
                    <Music size={24} className="hidden md:block" />
                  </div>
                  <div className="overflow-hidden min-w-0">
                    <p className="text-[8px] md:text-[10px] text-emerald-600 font-black uppercase tracking-widest truncate">Now Playing</p>
                    <h4 className="font-bold text-slate-900 truncate text-xs md:text-sm">
                      {surahs.find(s => s.id === listPlayingId)?.name_simple || "Quran Recitation"}
                    </h4>
                    <p className="text-[8px] md:text-[10px] text-slate-400 font-bold">
                      {formatTime(audioCurrentTime)} / {formatTime(duration)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                  <button 
                    onClick={() => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
                      }
                    }}
                    className="w-8 h-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg flex items-center justify-center transition-all"
                    title="Skip back 10s"
                  >
                    <RefreshCw size={14} className="-scale-x-100" />
                  </button>
                  <button 
                    onClick={togglePlay}
                    className="w-10 h-10 md:w-12 md:h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-200 hover:scale-105 active:scale-95 transition-all"
                  >
                    {isPlaying ? (
                      <Pause size={20} className="md:hidden" fill="currentColor" />
                    ) : (
                      <Play size={20} className="md:hidden ml-0.5" fill="currentColor" />
                    )}
                    {isPlaying ? (
                      <Pause size={24} className="hidden md:block" fill="currentColor" />
                    ) : (
                      <Play size={24} className="hidden md:block ml-1" fill="currentColor" />
                    )}
                  </button>
                  <button 
                    onClick={() => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
                      }
                    }}
                    className="w-8 h-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg flex items-center justify-center transition-all"
                    title="Skip forward 10s"
                  >
                    <RefreshCw size={14} />
                  </button>
                  <div className="w-px h-6 md:h-8 bg-slate-100 mx-0.5 md:mx-1" />
                  <button 
                    onClick={() => {
                      if (audioRef.current) audioRef.current.pause();
                      setIsPlaying(false);
                      setListPlayingId(null);
                      setIsKhatamMode(false);
                    }}
                    className="w-8 h-8 md:w-10 md:h-10 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl flex items-center justify-center transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Hidden range input for seeking in mini player */}
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={audioCurrentTime}
                onChange={handleSeek}
                className="absolute inset-x-0 top-0 h-1 opacity-0 cursor-pointer z-10"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
