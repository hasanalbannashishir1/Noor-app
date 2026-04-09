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
  Languages,
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
  Bot,
  Sparkles,
  BarChart3,
  Calculator,
  Download,
  Heart,
  Bookmark,
  Send,
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
  MessageSquare,
  Mail,
  Video,
  Book
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { quranService } from './services/quranService';
import { hadithService, HadithBook } from './services/hadithService';
import { 
  Surah, 
  Recitation, 
  Tafsir, 
  SurahInfo, 
  PrayerRequirement, 
  RakatDetail,
  Bookmark as BookmarkType,
  Hadith,
  Dua,
  DashboardStats
} from './types';
import { cn } from './lib/utils';
import ReactMarkdown from 'react-markdown';

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

const DOCUMENTARIES = [
  { title: "The Message (1976)", description: "The story of the birth of Islam.", link: "https://www.youtube.com/results?search_query=the+message+full+movie+islam" },
  { title: "Omar Series", description: "Historical drama about the second Caliph of Islam.", link: "https://www.youtube.com/results?search_query=omar+series+english+subtitles" },
  { title: "The Sultan and the Saint", description: "The story of St. Francis of Assisi and the Sultan of Egypt.", link: "https://www.youtube.com/results?search_query=the+sultan+and+the+saint+documentary" }
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

const TasbihCounter = () => {
  const [count, setCount] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const phrases = [
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
              src="https://i.postimg.cc/Dm2BqdH2/beads.png" 
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
    { ar: 'ٱلْمُمِيتُ', en: 'Al-Mumit', tr: 'The Bringer of Death' },
    { ar: 'ٱلْحَيُّ', en: 'Al-Hayy', tr: 'The Ever-Living' },
    { ar: 'ٱلْقَيُّومُ', en: 'Al-Qayyum', tr: 'The Self-Subsisting' },
    { ar: 'ٱلْوَاجِدُ', en: 'Al-Wajid', tr: 'The Finder' },
    { ar: 'ٱلْمَاجِدُ', en: 'Al-Majid', tr: 'The Noble' },
    { ar: 'ٱلْوَاحِدُ', en: 'Al-Wahid', tr: 'The Unique' },
    { ar: 'ٱلْأَحَدُ', en: 'Al-Ahad', tr: 'The One' },
    { ar: 'ٱلصَّمَدُ', en: 'As-Samad', tr: 'The Eternal' },
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

const HadithSection = ({ selectedBook, setSelectedBook }: { selectedBook: string | null, setSelectedBook: (id: string | null) => void }) => {
  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [bookmarkedHadiths, setBookmarkedHadiths] = useState<Hadith[]>(() => {
    const saved = localStorage.getItem('bookmarked_hadiths');
    return saved ? JSON.parse(saved) : [];
  });
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [books, setBooks] = useState<HadithBook[]>(hadithService.getBooks());

  useEffect(() => {
    const loadBooks = async () => {
      const dynamicBooks = await hadithService.fetchBooks();
      if (dynamicBooks.length > 0) {
        setBooks(dynamicBooks);
      }
    };
    loadBooks();
  }, []);

  useEffect(() => {
    if (selectedBook && !showBookmarks) {
      fetchHadiths();
    }
  }, [selectedBook, page, showBookmarks]);

  const fetchHadiths = async () => {
    if (!selectedBook) return;
    setLoading(true);
    setError(null);
    try {
      const data = await hadithService.getHadiths(selectedBook, page);
      setHadiths(data);
    } catch (error) {
      console.error('Error fetching hadiths:', error);
      setError('Failed to load hadiths. This might be due to a network issue or API limit. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = (hadith: Hadith) => {
    setBookmarkedHadiths(prev => {
      const isBookmarked = prev.some(h => h.id === hadith.id);
      let next;
      if (isBookmarked) {
        next = prev.filter(h => h.id !== hadith.id);
      } else {
        next = [...prev, hadith];
      }
      localStorage.setItem('bookmarked_hadiths', JSON.stringify(next));
      return next;
    });
  };

  const isBookmarked = (id: number) => bookmarkedHadiths.some(h => h.id === id);

  const getSunnahLink = (hadith: Hadith) => {
    const slug = hadith.bookSlug.toLowerCase();
    let sunnahSlug = slug;
    if (slug.includes('bukhari')) sunnahSlug = 'bukhari';
    else if (slug.includes('muslim')) sunnahSlug = 'muslim';
    else if (slug.includes('nasai')) sunnahSlug = 'nasai';
    else if (slug.includes('dawud')) sunnahSlug = 'abudawud';
    else if (slug.includes('tirmidhi')) sunnahSlug = 'tirmidhi';
    else if (slug.includes('majah')) sunnahSlug = 'ibnmajah';
    else if (slug.includes('malik')) sunnahSlug = 'malik';
    
    return `https://sunnah.com/${sunnahSlug}:${hadith.hadithNumber}`;
  };

  return (
    <div className="space-y-6">
      {/* Daily Reminder */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
        <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-2">Daily Reminder</h4>
        <p className="text-slate-700 font-medium italic">"I have left among you two things; you will never go astray as long as you hold fast to them; the book of Allah and my Sunnah."</p>
        <p className="text-[10px] text-slate-400 mt-2">— Prophet Muhammad (PBUH) (Al-Muwatta, Imam Malik)</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center">
            <ScrollText size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Hadith Collections</h3>
            <p className="text-xs text-slate-500">Authentic sayings of the Prophet (PBUH)</p>
          </div>
        </div>
        <button 
          onClick={() => setShowBookmarks(!showBookmarks)}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
            showBookmarks ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-500"
          )}
        >
          <Bookmark size={14} fill={showBookmarks ? "currentColor" : "none"} />
          {showBookmarks ? "Show Collections" : "My Bookmarks"}
        </button>
      </div>

      {!showBookmarks ? (
        <>
          {!selectedBook ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {books.map(book => (
                <button
                  key={book.id}
                  onClick={() => setSelectedBook(book.id)}
                  className="bg-white p-6 rounded-2xl border border-slate-200 text-left hover:border-indigo-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                      <BookOpen size={16} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{book.totalHadiths} Hadiths</span>
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">{book.name}</h4>
                  <p className="text-xs text-slate-500">Explore authentic narrations from this collection.</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setSelectedBook(null)}
                  className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition-colors text-sm"
                >
                  <ChevronLeft size={20} />
                  Back to Collections
                </button>
                <div className="flex items-center gap-2">
                  <button 
                    disabled={page === 1}
                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                    className="p-2 bg-white border border-slate-200 rounded-lg disabled:opacity-50 hover:border-indigo-500 transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-xs font-bold text-slate-600">Page {page}</span>
                  <button 
                    onClick={() => setPage(prev => prev + 1)}
                    className="p-2 bg-white border border-slate-200 rounded-lg hover:border-indigo-500 transition-colors"
                  >
                    <ChevronLeft size={16} className="rotate-180" />
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="py-12 text-center"><Loader2 className="animate-spin mx-auto text-indigo-600" /></div>
              ) : error ? (
                <div className="py-12 text-center bg-red-50 rounded-2xl border border-red-100">
                  <Info className="text-red-500 mx-auto mb-4" size={32} />
                  <p className="text-red-600 text-sm font-medium mb-4">{error}</p>
                  <button 
                    onClick={fetchHadiths}
                    className="px-6 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {hadiths.length === 0 ? (
                    <div className="py-12 text-center bg-white rounded-2xl border border-slate-200">
                      <ScrollText size={48} className="text-slate-100 mx-auto mb-4" />
                      <p className="text-slate-400 text-sm">No hadiths found in this collection.</p>
                    </div>
                  ) : (
                    hadiths.map(hadith => (
                      <div key={hadith.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Hadith #{hadith.hadithNumber}</span>
                          <a 
                            href={getSunnahLink(hadith)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest flex items-center gap-1 transition-colors"
                          >
                            <ExternalLink size={10} />
                            Sunnah.com
                          </a>
                        </div>
                        <button 
                          onClick={() => toggleBookmark(hadith)}
                          className={cn(
                            "p-2 rounded-lg transition-all",
                            isBookmarked(hadith.id) ? "bg-indigo-50 text-indigo-600" : "text-slate-300 hover:text-indigo-600"
                          )}
                        >
                          <Bookmark size={18} fill={isBookmarked(hadith.id) ? "currentColor" : "none"} />
                        </button>
                      </div>
                      <p className="text-right text-xl font-arabic leading-loose">{hadith.hadithArabic}</p>
                      <div className="pt-4 border-t border-slate-50">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Narrated by {hadith.englishNarrator}</p>
                        <p className="text-sm text-slate-600 leading-relaxed">{hadith.hadithEnglish}</p>
                      </div>
                    </div>
                  )))}
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="space-y-4">
          {bookmarkedHadiths.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-2xl border border-slate-200">
              <Bookmark size={48} className="text-slate-100 mx-auto mb-4" />
              <p className="text-slate-400 text-sm">No bookmarked hadiths yet.</p>
            </div>
          ) : (
            bookmarkedHadiths.map(hadith => (
              <div key={hadith.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{hadith.bookSlug.replace('-', ' ')} - #{hadith.hadithNumber}</span>
                  <button 
                    onClick={() => toggleBookmark(hadith)}
                    className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"
                  >
                    <Bookmark size={18} fill="currentColor" />
                  </button>
                </div>
                <p className="text-right text-xl font-arabic leading-loose">{hadith.hadithArabic}</p>
                <div className="pt-4 border-t border-slate-50">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Narrated by {hadith.englishNarrator}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{hadith.hadithEnglish}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'deen' | 'ai' | 'amal' | 'dashboard'>('home');
  const [deenSubTab, setDeenSubTab] = useState<'grid' | 'quran' | 'zakat' | 'names' | 'hadith' | 'events' | 'prayer' | 'documentary'>('grid');
  const [prayerSubTab, setPrayerSubTab] = useState<'menu' | 'wudu' | 'salah' | 'surah' | 'steps'>('menu');
  const [amalSubTab, setAmalSubTab] = useState<'quran' | 'hadith' | 'dua'>('quran');
  const [selectedSalahDua, setSelectedSalahDua] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [selectedEssentialSurah, setSelectedEssentialSurah] = useState<number | null>(null);
  
  // Clock and Calendars
  const [timeString, setTimeString] = useState<string>(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
  const [hijriDate, setHijriDate] = useState<string>('');

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

  // Salah Tracker States
  const [salahProgress, setSalahProgress] = useState<string[]>(() => {
    const saved = localStorage.getItem('salah_progress');
    if (saved) {
      const { date, completed } = JSON.parse(saved);
      if (date === new Date().toDateString()) {
        return completed;
      }
    }
    return [];
  });
  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  const [currentPrayer, setCurrentPrayer] = useState<string | null>(null);
  const [showAllSalah, setShowAllSalah] = useState(false);
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

  // AI Assistant
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Daily Amal
  const [randomSurah, setRandomSurah] = useState<Surah | null>(null);
  const [randomHadith, setRandomHadith] = useState<Hadith | null>(null);
  const [amalBookmarks, setAmalBookmarks] = useState<BookmarkType[]>([]);

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

  const [bookmarkedSurahs, setBookmarkedSurahs] = useState<number[]>(() => {
    const saved = localStorage.getItem('bookmarked_surahs');
    return saved ? JSON.parse(saved) : [];
  });

  // Streak System
  const [streakCount, setStreakCount] = useState<number>(() => {
    const saved = localStorage.getItem('user_streak_count');
    return saved ? parseInt(saved) : 0;
  });

  useEffect(() => {
    const updateStreak = () => {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const lastVisit = localStorage.getItem('last_visit_date');
      
      if (!lastVisit) {
        setStreakCount(1);
        localStorage.setItem('user_streak_count', '1');
        localStorage.setItem('last_visit_date', today);
      } else if (lastVisit !== today) {
        const lastDate = new Date(lastVisit);
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
      const filtered = prev.filter(h => h.date !== stats.date);
      return [stats, ...filtered].slice(0, 7);
    });
  }, [salahProgress, surahsListenedCount]);

  useEffect(() => {
    const fetchHijri = async () => {
      try {
        const response = await fetch(`https://api.aladhan.com/v1/gToH?date=${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}`);
        const data = await response.json();
        if (data.data) {
          setHijriDate(`${data.data.hijri.day} ${data.data.hijri.month.en} ${data.data.hijri.year} AH`);
        }
      } catch (err) {
        console.error("Hijri fetch error:", err);
      }
    };
    fetchHijri();
  }, []);

  const handleAiChat = async () => {
    if (!aiInput.trim()) return;
    const userMsg = aiInput;
    setAiInput('');
    setAiMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsAiLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: aiMessages,
          userMsg: userMsg,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get AI response");
      }

      const data = await response.json();
      setAiMessages(prev => [...prev, { role: 'model', text: data.text }]);
    } catch (err) {
      console.error("AI Error:", err);
      setAiMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const DUAS: Dua[] = [
    { id: '1', category: 'After Salah', title: 'Ayatul Kursi', arabic: 'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...', translation: 'Allah! There is no god but He, the Living, the Self-subsisting...' },
    { id: '2', category: 'Daily Life', title: 'Before Eating', arabic: 'بِسْمِ اللَّهِ', translation: 'In the name of Allah' },
    { id: '3', category: 'Personal', title: 'For Forgiveness', arabic: 'رَبِّ اغْفِرْ لِي', translation: 'My Lord, forgive me' },
    { id: '4', category: 'Knowledge', title: 'Increase Knowledge', arabic: 'رَّبِّ زِدْنِي عِلْمًا', translation: 'My Lord, increase me in knowledge' },
    { id: '5', category: 'Family', title: 'For Parents', arabic: 'رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا', translation: 'My Lord, have mercy upon them as they brought me up [when I was] small' },
    { id: '6', category: 'Rabbana Dua', title: 'Good in both worlds', arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', translation: 'Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire' },
  ];

  const DUA_CATEGORIES = [
    'After Salah', 'Daily Life', 'Personal', 'Knowledge', 'Family', 'Special', 
    'Rabbana Dua', 'Allahumma', 'Morning and Evening', 'Purity', 'Illness', 'Good News - Bad News'
  ];

  const fetchRandomAmal = async () => {
    if (surahs.length > 0) {
      const randomS = surahs[Math.floor(Math.random() * surahs.length)];
      setRandomSurah(randomS);
    }
    setRandomHadith({
      id: 1,
      hadithNumber: "5027",
      englishNarrator: "Uthman bin Affan",
      hadithArabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
      hadithEnglish: "The best among you are those who learn the Quran and teach it.",
      bookSlug: "sahih-bukhari",
      status: "Sahih"
    });
  };

  useEffect(() => {
    if (activeTab === 'amal') {
      fetchRandomAmal();
    }
  }, [activeTab, surahs]);

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
    setCurrentPrayer(detected);
  };

  useEffect(() => {
    localStorage.setItem('salah_progress', JSON.stringify({
      date: new Date().toDateString(),
      completed: salahProgress
    }));
  }, [salahProgress]);

  const toggleSalahProgress = (id: string) => {
    const isCompleting = !salahProgress.includes(id);
    setSalahProgress(prev => 
      isCompleting ? [...prev, id] : prev.filter(p => p !== id)
    );
    
    if (isCompleting) {
      const rakat = SALAH_REQUIREMENTS.flatMap(p => p.rakats).find(r => r.id === id);
      const prayer = SALAH_REQUIREMENTS.find(p => p.rakats.some(r => r.id === id));
      if (rakat && prayer) {
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

  const getPrayerStats = (prayerName: string) => {
    const prayer = SALAH_REQUIREMENTS.find(p => p.name === prayerName);
    if (!prayer) return { total: 0, completed: 0, isMissed: false };

    const total = prayer.rakats.reduce((acc, r) => acc + r.count, 0);
    const completedRakats = prayer.rakats.filter(r => salahProgress.includes(r.id));
    const completed = completedRakats.reduce((acc, r) => acc + r.count, 0);

    let isMissed = false;
    if (prayerTimes) {
      const now = new Date();
      const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
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

  const getDailyStats = () => {
    let total = 0;
    let completed = 0;

    SALAH_REQUIREMENTS.forEach(prayer => {
      total += prayer.rakats.reduce((acc, r) => acc + r.count, 0);
      completed += prayer.rakats
        .filter(r => salahProgress.includes(r.id))
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
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
        if (selectedSurah) {
          setListPlayingId(selectedSurah.id);
          setSurahsListenedCount(prev => prev + 1);
          logActivity('quran', `Started listening to Surah ${selectedSurah.name_simple}`);
        }
      }
      setIsPlaying(!isPlaying);
    }
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
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current.play();
          setIsPlaying(true);
        }
      }
      return;
    }

    setListAudioLoading(surah.id);
    try {
      const audioData = await quranService.getSurahAudio(surah.id);
      setAudio(audioData);
      setListPlayingId(surah.id);
      setIsPlaying(true);
      setSurahsListenedCount(prev => prev + 1);
      logActivity('quran', `Started listening to Surah ${surah.name_simple}`);
      
      // We need to wait for the audio source to update
      if (audioRef.current) {
        audioRef.current.src = audioData.audio_url;
        audioRef.current.load(); // Force load the new source
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Auto-play was prevented:", error);
            // If auto-play was prevented, we still want to show the play button
            setIsPlaying(false);
          });
        }
      }
    } catch (error) {
      console.error('Error playing list audio:', error);
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-100 overflow-hidden border border-slate-100">
              <img 
                src="https://i.postimg.cc/QF5tN5XB/quran-1.png" 
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

            <div className="hidden lg:flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
              {[
                { id: 'home', icon: Home, label: 'Home' },
                { id: 'deen', icon: Compass, label: 'Deen' },
                { id: 'ai', icon: MessageSquare, label: 'AI Assistant' },
                { id: 'amal', icon: Sparkles, label: 'Daily Amal' },
                { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                    activeTab === tab.id ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
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
                  className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <User size={40} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Assalamu Alaikum</h2>
                    <p className="text-emerald-600 font-bold mt-1">Welcome to My Noor App</p>
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                <div className="space-y-6">
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowEmail(!showEmail)}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold text-slate-600 hover:bg-slate-50"
                    >
                      <Mail size={20} />
                      Contact
                    </button>
                    
                    <AnimatePresence>
                      {showEmail && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-4 pb-2"
                        >
                          <a 
                            href="mailto:hasanalbannashishir@gmail.com" 
                            className="text-sm text-emerald-600 font-bold break-all hover:underline"
                          >
                            hasanalbannashishir@gmail.com
                          </a>
                        </motion.div>
                      )}
                    </AnimatePresence>
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

      <main className="max-w-7xl mx-auto px-4 py-8 pb-32">
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
                
                <div className="space-y-6">
                  {/* Row 1: Icons */}
                  <div className="grid grid-cols-5 gap-2 sm:gap-4">
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
                        <div key={`icon-${p}`} className="flex justify-center">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all border",
                            isActive 
                              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200 border-emerald-500" 
                              : `${prayerStyles} shadow-sm`
                          )}>
                            {getPrayerIcon(p, isActive)}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Row 2: Names */}
                  <div className="grid grid-cols-5 gap-2 sm:gap-4">
                    {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((p) => (
                      <div key={`name-${p}`} className="text-center">
                        <p className={cn(
                          "text-[10px] font-mono font-black uppercase tracking-widest transition-colors",
                          currentPrayer === p ? "text-emerald-600" : "text-slate-400"
                        )}>
                          {p}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Row 3: Times */}
                  <div className="grid grid-cols-5 gap-2 sm:gap-4">
                    {prayerTimes && ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((p) => (
                      <div key={`time-${p}`} className="text-center">
                        <p className={cn(
                          "text-xs sm:text-sm font-bold whitespace-nowrap transition-colors font-mono",
                          currentPrayer === p ? "text-slate-900" : "text-slate-500"
                        )}>
                          {convertTo12Hour(prayerTimes[p])}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
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
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center shadow-sm overflow-hidden border border-slate-100">
                      <img 
                        src="https://i.postimg.cc/DSj8MFys/praying.png" 
                        alt="Salah Tracker" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    Salah Tracker
                  </h3>
                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <button 
                      onClick={() => setShowAllSalah(!showAllSalah)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 bg-emerald-50 px-4 py-2 rounded-xl transition-all border border-emerald-100 shadow-sm"
                    >
                      {showAllSalah ? 'Show Current' : 'Show All Prayers'}
                      <ChevronDown size={14} className={cn("transition-transform duration-300", showAllSalah && "rotate-180")} />
                    </button>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Daily Progress</p>
                      <p className="text-sm font-black text-emerald-600">{getDailyStats().completed} / {getDailyStats().total} Rakats</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SALAH_REQUIREMENTS.filter(p => showAllSalah || p.name === currentPrayer || (!currentPrayer && p.name === 'Fajr')).map((prayer) => {
                    const stats = getPrayerStats(prayer.name);
                    return (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={prayer.name}
                        className={cn(
                          "bg-white rounded-2xl p-5 border transition-all",
                          currentPrayer === prayer.name ? "border-emerald-200 shadow-md ring-1 ring-emerald-100" : "border-slate-200",
                          stats.isMissed && "border-red-200 bg-red-50/30"
                        )}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <h4 className={cn("font-bold", stats.isMissed ? "text-red-700" : "text-slate-800")}>{prayer.name}</h4>
                            {stats.isMissed && <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[8px] font-bold rounded uppercase">Missed</span>}
                          </div>
                          <p className="text-xs font-bold text-slate-500">{stats.completed}/{stats.total}</p>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {prayer.rakats.map((rakat) => (
                            <button
                              key={rakat.id}
                              onClick={() => toggleSalahProgress(rakat.id)}
                              className={cn(
                                "flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all",
                                salahProgress.includes(rakat.id) ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-100"
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <div className={cn(
                                  "w-4 h-4 rounded flex items-center justify-center",
                                  salahProgress.includes(rakat.id) ? "bg-emerald-600 text-white" : "bg-slate-100"
                                )}>
                                  <Check size={12} />
                                </div>
                                <span className="font-bold">{rakat.count} {rakat.label}</span>
                              </div>
                              <span className={cn("text-[8px] px-1.5 py-0.5 rounded-full border uppercase font-bold", getCategoryColor(rakat.category))}>
                                {rakat.category}
                              </span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <TasbihCounter />

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
                        {/* Al Quran Option */}
                        <button 
                          onClick={() => setDeenSubTab('quran')}
                          className="group bg-white p-3 rounded-xl border border-slate-200 text-slate-900 text-center transition-all hover:border-slate-400 hover:shadow-md"
                        >
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform shadow-sm overflow-hidden border border-slate-100">
                            <img 
                              src="https://i.postimg.cc/LJfX4fHY/quran.png" 
                              alt="Al Quran" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <h3 className="text-[10px] font-bold uppercase tracking-tight">Al-Quran</h3>
                        </button>

                        {/* Prayer Learning Option */}
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

                        {/* 99 Names Option */}
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

                        {/* Zakat Option */}
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

                        {/* Hadith Option */}
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

                        {/* Upcoming Events Option */}
                        <button 
                          onClick={() => setDeenSubTab('events')}
                          className="group bg-white p-3 rounded-xl border border-slate-200 text-slate-900 text-center transition-all hover:border-slate-400 hover:shadow-md"
                        >
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform shadow-sm overflow-hidden border border-slate-100">
                            <img 
                              src="https://i.postimg.cc/bZCsB8ND/calendar.png" 
                              alt="Upcoming Events" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <h3 className="text-[10px] font-bold uppercase tracking-tight leading-tight">Upcoming Islamic Events</h3>
                        </button>

                        {/* Islamic Documentary Option */}
                        <button 
                          onClick={() => setDeenSubTab('documentary')}
                          className="group bg-white p-3 rounded-xl border border-slate-200 text-slate-900 text-center transition-all hover:border-slate-400 hover:shadow-md"
                        >
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform shadow-sm overflow-hidden border border-slate-100">
                            <img 
                              src="https://i.postimg.cc/HVppbK46/documentary.png" 
                              alt="Documentary" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <h3 className="text-[10px] font-bold uppercase tracking-tight">Documentary</h3>
                        </button>
                      </div>
                  ) : (
                    <div className="space-y-8">
                      {/* Only show "Back to Options" if we are at the root of a sub-tab */}
                      {((deenSubTab === 'prayer' && prayerSubTab === 'menu') || 
                        (deenSubTab === 'hadith' && !selectedBook) || 
                        (deenSubTab === 'quran') ||
                        (!['prayer', 'hadith', 'quran'].includes(deenSubTab))) && (
                        <button 
                          onClick={() => {
                            setDeenSubTab('grid');
                            setPrayerSubTab('menu');
                            setSelectedSalahDua(null);
                            setSelectedBook(null);
                            setSelectedEssentialSurah(null);
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
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      {deenSubTab === 'hadith' && <HadithSection selectedBook={selectedBook} setSelectedBook={setSelectedBook} />}

                      {deenSubTab === 'events' && (
                        <div className="space-y-6">
                          <h3 className="text-2xl font-black text-slate-900">Upcoming Islamic Events</h3>
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
                                        { text: "Make intention (Niyyah) – in your heart to perform Wudu.", icons: ["https://i.postimg.cc/Hcbrkhbg/step1.png"] },
                                        { text: "Say “Bismillah” (In the name of Allah).", icons: [] },
                                        { text: "Wash hands – up to the wrists, 3 times.", icons: ["https://i.postimg.cc/QBK1gVkQ/step3.png"] },
                                        { text: "Rinse mouth – 3 times.", icons: ["https://i.postimg.cc/Ffk3b1g1/step4.png"] },
                                        { text: "Clean nose – sniff water and blow it out, 3 times.", icons: ["https://i.postimg.cc/Ffk3b1g1/step5.png"] },
                                        { text: "Wash face – from forehead to chin and ear to ear, 3 times.", icons: ["https://i.postimg.cc/CZnkCdH8/step6.png"] },
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
                                          { step: "Step 1: Takbir (Start Prayer)", content: "Raise both hands and say:", highlight: "Allahu Akbar (الله أكبر)" },
                                          { step: "Step 2: Qiyam (Standing)", content: "Fold hands (right over left)\nRecite:\n• Sana (Subhanaka Allahumma...)\n• Ta’awwuz (A‘وذ بالله...)\n• Bismillah\n• Surah Al-Fatiha\n• Another Surah (e.g., Surah Al-Ikhlas)" },
                                          { step: "Step 3: Ruku (Bowing)", content: "Say Allahu Akbar and bow\nHands on knees, back straight\nRecite:", highlight: "Subhana Rabbiyal ‘Azim (3 times)" },
                                          { step: "Step 4: Qawmah (Standing After Ruku)", content: "Stand up and say:", highlight: "Sami‘allahu liman hamidah\nRabbana lakal hamd" },
                                          { step: "Step 5: Sajdah (Prostration)", content: "Say Allahu Akbar and go into سجدة\nForehead, nose, hands, knees, toes on ground\nRecite:", highlight: "Subhana Rabbiyal A‘la (3 times)" },
                                          { step: "Step 6: Jalsa (Sitting Between Two Sajdahs)", content: "Sit and say:", highlight: "Rabbighfir li" },
                                          { step: "Step 7: Second Sajdah", content: "Go into سجدة again\nRecite:", highlight: "Subhana Rabbiyal A‘la (3 times)" },
                                          { step: "🔁 Step 8: Next Rak‘ah", content: "Stand up and repeat steps (Fatiha + Surah, Ruku, Sajdah)" },
                                          { step: "Step 9: Tashahhud (Sitting)", content: "After 2 Rak‘ah:\nSit and recite:", highlight: "Attahiyyatu..." },
                                          { step: "Step 10: Final Sitting", content: "In last Rak‘ah:\nRecite:\n• Tashahhud\n• Durood Sharif\n• Dua Masura" },
                                          { step: "Step 11: Salam (End Prayer)", content: "Turn head right:", highlight: "Assalamu Alaikum wa Rahmatullah", content2: "Turn head left:", highlight2: "Assalamu Alaikum wa Rahmatullah" }
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

                      {deenSubTab === 'documentary' && (
                        <div className="space-y-6">
                          <h3 className="text-2xl font-black text-slate-900">Islamic Documentaries</h3>
                          <div className="grid grid-cols-1 gap-4">
                            {DOCUMENTARIES.map((doc, i) => (
                              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group hover:border-emerald-500 transition-all">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                                    <Video size={24} />
                                  </div>
                                  <a 
                                    href={doc.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="p-2 bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                  >
                                    <ExternalLink size={18} />
                                  </a>
                                </div>
                                <h4 className="font-bold text-slate-900 mb-2">{doc.title}</h4>
                                <p className="text-sm text-slate-500 leading-relaxed">{doc.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
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

          {activeTab === 'ai' && (
            <motion.div
              key="ai"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-x-0 top-[73px] bottom-[73px] md:bottom-0 z-30 bg-slate-50"
            >
              <div className="max-w-3xl mx-auto h-full flex flex-col p-4">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-lg flex-1 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center">
                    <Bot size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Islamic AI Assistant</h3>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {aiMessages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                      <Sparkles className="text-emerald-200 mb-4" size={48} />
                      <h4 className="text-lg font-bold text-slate-800 mb-2">As-Salamu Alaykum</h4>
                      <p className="text-sm text-slate-500 max-w-xs">How can I help you today?</p>
                    </div>
                  )}
                  {aiMessages.map((msg, i) => (
                    <div key={i} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                      <div className={cn(
                        "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed",
                        msg.role === 'user' ? "bg-emerald-600 text-white rounded-tr-none" : "bg-slate-100 text-slate-800 rounded-tl-none"
                      )}>
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    </div>
                  ))}
                  {isAiLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none">
                        <Loader2 size={16} className="animate-spin text-emerald-600" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-slate-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type your question..."
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAiChat()}
                    />
                    <button 
                      onClick={handleAiChat}
                      disabled={isAiLoading || !aiInput.trim()}
                      className="bg-emerald-600 text-white p-2.5 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
                  onClick={() => setAmalSubTab('hadith')}
                  className={cn(
                    "flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2",
                    amalSubTab === 'hadith' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" : "text-slate-500 hover:bg-slate-50"
                  )}
                >
                  <ScrollText size={16} />
                  Hadith
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

                    {/* Random Surah Section */}
                    <div className="bg-emerald-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />
                      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left">
                          <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                            <Sparkles size={20} className="text-emerald-300" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-200">Surah of the Moment</span>
                          </div>
                          {randomSurah ? (
                            <>
                              <h3 className="text-3xl font-bold mb-2">{randomSurah.name_simple}</h3>
                              <p className="text-emerald-100/80 mb-6">{randomSurah.translated_name.name}</p>
                              <div className="flex items-center justify-center md:justify-start gap-4">
                                <button 
                                  onClick={(e) => handleListPlay(e, randomSurah)}
                                  className="bg-white text-emerald-700 px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                                  disabled={listAudioLoading === randomSurah.id}
                                >
                                  {listAudioLoading === randomSurah.id ? (
                                    <Loader2 size={18} className="animate-spin" />
                                  ) : (
                                    listPlayingId === randomSurah.id && isPlaying ? <Pause size={18} /> : <Play size={18} />
                                  )}
                                  {listPlayingId === randomSurah.id && isPlaying ? 'Pause' : 'Play'}
                                </button>
                                <button 
                                  onClick={fetchRandomAmal}
                                  className="p-2.5 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                                  title="Next Surah"
                                >
                                  <SkipForward size={20} />
                                </button>
                              </div>
                            </>
                          ) : <Loader2 className="animate-spin" />}
                        </div>
                        <div className="text-6xl font-arabic opacity-80">{randomSurah?.name_arabic}</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {amalSubTab === 'hadith' && (
                  <motion.div
                    key="hadith-tab"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Daily Reminder */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                      <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2">Daily Reminder</h4>
                      <p className="text-slate-700 font-medium italic">"I have left among you two things; you will never go astray as long as you hold fast to them; the book of Allah and my Sunnah."</p>
                      <p className="text-[10px] text-slate-400 mt-2">— Prophet Muhammad (PBUH) (Al-Muwatta, Imam Malik)</p>
                    </div>

                    {/* Hadith Section */}
                    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center">
                      <Heart className="text-red-500 mx-auto mb-4" size={32} />
                      <h3 className="text-lg font-bold text-slate-900 mb-4">Daily Hadith</h3>
                      <p className="text-slate-600 italic leading-relaxed mb-6">"{randomHadith?.hadithEnglish}"</p>
                      <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">— {randomHadith?.bookSlug.replace('-', ' ')}</p>
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
                      <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Bookmark className="text-emerald-600" size={24} />
                        Daily Duas
                      </h3>
                      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {DUA_CATEGORIES.map(cat => (
                          <button
                            key={cat}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold whitespace-nowrap hover:border-emerald-500 hover:text-emerald-600 transition-all"
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {DUAS.map(dua => (
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
                            <p className="text-xs text-slate-500 leading-relaxed">{dua.translation}</p>
                          </div>
                        ))}
                      </div>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-emerald-600 p-8 rounded-3xl text-white shadow-xl shadow-emerald-100">
                  <BarChart3 size={32} className="mb-4 opacity-80" />
                  <h3 className="text-3xl font-black mb-1">{getDailyStats().completed}</h3>
                  <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest">Total Rakats Today</p>
                </div>
                <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-xl shadow-blue-100">
                  <User size={32} className="mb-4 opacity-80" />
                  <h3 className="text-3xl font-black mb-1">{surahsListenedCount}</h3>
                  <p className="text-blue-100 text-xs font-bold uppercase tracking-widest">Surah Listened</p>
                </div>
                <div className="bg-amber-600 p-8 rounded-3xl text-white shadow-xl shadow-amber-100">
                  <History size={32} className="mb-4 opacity-80" />
                  <h3 className="text-3xl font-black mb-1">
                    {(() => {
                      let missed = 0;
                      ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].forEach(p => {
                        if (getPrayerStats(p).isMissed) missed++;
                      });
                      return missed;
                    })()}
                  </h3>
                  <p className="text-amber-100 text-xs font-bold uppercase tracking-widest">Missed Prayers</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">Weekly Progress</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Last 7 Days</p>
                </div>
                <div className="p-6">
                  {dashboardHistory.length <= 1 ? (
                    <div className="py-12 text-center">
                      <BarChart3 size={48} className="text-slate-100 mx-auto mb-4" />
                      <p className="text-slate-400 text-sm">Keep using the app to see your weekly trends.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {dashboardHistory.slice(1).map((history) => (
                        <div key={history.date} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-600">{history.date}</span>
                            <span className="text-xs font-black text-emerald-600">{history.completedRakats}/{history.totalRakats} Rakats</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 rounded-full transition-all"
                              style={{ width: `${(history.completedRakats / history.totalRakats) * 100}%` }}
                            />
                          </div>
                          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
                            <span className="flex items-center gap-1"><Music size={10} /> {history.surahListens} Listens</span>
                            <span className="flex items-center gap-1"><History size={10} /> {history.missedPrayers} Missed</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">Recent Activity</h3>
                  <button 
                    onClick={() => setRecentActivity([])}
                    className="text-red-600 text-xs font-bold hover:underline"
                  >
                    Clear All
                  </button>
                </div>
                <div className="p-6">
                  {recentActivity.length === 0 ? (
                    <div className="py-12 text-center">
                      <History size={48} className="text-slate-100 mx-auto mb-4" />
                      <p className="text-slate-400 text-sm">No activity recorded yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center",
                              activity.type === 'salah' ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                            )}>
                              {activity.type === 'salah' ? <CheckCircle2 size={16} /> : <Music size={16} />}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800">{activity.title}</p>
                              <p className="text-[10px] text-slate-500 font-medium">{activity.type === 'salah' ? 'Salah' : 'Quran'}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Saved Section */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Bookmark className="text-amber-600" size={20} />
                    Saved Items
                  </h3>
                </div>
                <div className="p-6 space-y-8">
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Saved Surahs</h4>
                    {bookmarkedSurahs.length === 0 ? (
                      <p className="text-sm text-slate-400 italic">No saved surahs yet.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {surahs.filter(s => bookmarkedSurahs.includes(s.id)).map(surah => (
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
                        {DUAS.filter(d => bookmarkedDuas.includes(d.id)).map(dua => (
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-200 px-6 py-3 z-40 md:hidden">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'deen', icon: Compass, label: 'Deen' },
            { id: 'ai', icon: MessageSquare, label: 'AI Assistant' },
            { id: 'amal', icon: Sparkles, label: 'Daily Amal' },
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex flex-col items-center gap-1 transition-all min-w-[60px]",
                activeTab === tab.id ? "text-emerald-600" : "text-slate-400"
              )}
            >
              <tab.icon size={24} className={cn(activeTab === tab.id && "scale-110")} />
              <span className="text-[9px] font-bold whitespace-nowrap">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-6">
            <a href="#" className="text-slate-400 hover:text-emerald-600 transition-colors text-xs font-medium">Privacy Policy</a>
            <a href="#" className="text-slate-400 hover:text-emerald-600 transition-colors text-xs font-medium">Terms of Service</a>
            <a href="#" className="text-slate-400 hover:text-emerald-600 transition-colors text-xs font-medium">Contact Us</a>
          </div>
        </div>
      </footer>

      {/* Global Audio Element */}
      <audio 
        ref={audioRef} 
        src={audio?.audio_url} 
        onTimeUpdate={() => setAudioCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => {
          setIsPlaying(false);
          setListPlayingId(null);
          setAudioCurrentTime(0);
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
