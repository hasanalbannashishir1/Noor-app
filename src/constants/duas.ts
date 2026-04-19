import { Dua } from '../types';

export const DUAS: Dua[] = [
  { 
    id: 'as_1', 
    category: 'After Salah', 
    title: 'Astaghfirullah (3 times)', 
    arabic: 'أَسْتَغْفِرُ اللّٰهَ', 
    transliteration: 'Astaghfirullah (×3)',
    translation: 'I seek forgiveness from Allah.' 
  },
  { 
    id: 'as_2', 
    category: 'After Salah', 
    title: 'Allahumma Antas-Salam', 
    arabic: 'اللّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالإِكْرَامِ', 
    transliteration: 'Allahumma antas-salam wa minkas-salam, tabarakta ya dhal-jalali wal-ikram.',
    translation: 'O Allah, You are Peace and from You is peace. Blessed are You, Owner of Majesty and Honor.' 
  },
  { 
    id: 'as_3', 
    category: 'After Salah', 
    title: 'Tasbeeh Fatimah (33–33–34)', 
    arabic: 'سُبْحَانَ اللَّهِ ×33 | الْحَمْدُ لِلَّهِ ×33 | اللَّهُ أَكْبَرُ ×34', 
    transliteration: 'SubhanAllah ×33 | Alhamdulillah ×33 | Allahu Akbar ×34',
    translation: 'SubhanAllah → Glory be to Allah | Alhamdulillah → All praise is for Allah | Allahu Akbar → Allah is the Greatest' 
  },
  { 
    id: 'as_4', 
    category: 'After Salah', 
    title: 'Allahumma a’inni dua', 
    arabic: 'اللّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ', 
    transliteration: 'Allahumma a’inni ‘ala dhikrika wa shukrika wa husni ‘ibadatika.',
    translation: 'O Allah, help me remember You, thank You, and worship You in the best way.' 
  },
  // Daily Life
  {
    id: 'dl_1',
    category: 'Daily Life',
    title: 'Waking Up',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration: 'Alhamdu lillahil-ladhi ahyana ba‘da ma amatana wa ilayhin-nushur',
    translation: 'All praise is for Allah who gave us life after causing us to die (sleep), and to Him is the resurrection.'
  },
  {
    id: 'dl_2',
    category: 'Daily Life',
    title: 'Before Sleeping',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: 'Bismika Allahumma amutu wa ahya',
    translation: 'In Your name O Allah, I die and I live.'
  },
  {
    id: 'dl_3',
    category: 'Daily Life',
    title: 'Entering Toilet',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
    transliteration: 'Allahumma inni a‘udhu bika minal-khubthi wal-khaba’ith',
    translation: 'O Allah, I seek refuge in You from male and female devils.'
  },
  {
    id: 'dl_4',
    category: 'Daily Life',
    title: 'Leaving Toilet',
    arabic: 'غُفْرَانَكَ',
    transliteration: 'Ghufranak',
    translation: 'I seek Your forgiveness.'
  },
  {
    id: 'dl_5',
    category: 'Daily Life',
    title: 'Wearing Clothes',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَذَا وَرَزَقَنِيهِ',
    transliteration: 'Alhamdu lillahil-ladhi kasani hadha wa razaqanihi',
    translation: 'All praise is for Allah who clothed me with this and provided it for me.'
  },
  {
    id: 'dl_6',
    category: 'Daily Life',
    title: 'Before Eating',
    arabic: 'بِسْمِ اللَّهِ',
    transliteration: 'Bismillah',
    translation: 'In the name of Allah. (If forgotten: Bismillahi awwalahu wa akhirahu - In the name of Allah, at the beginning and the end.)'
  },
  {
    id: 'dl_7',
    category: 'Daily Life',
    title: 'After Eating',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي',
    transliteration: 'Alhamdu lillahil-ladhi at‘amani hadha wa razaqanihi min ghayri hawlin minni',
    translation: 'All praise is for Allah who fed me and provided this without any power from me.'
  },
  {
    id: 'dl_8',
    category: 'Daily Life',
    title: 'Entering Home',
    arabic: 'بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا',
    transliteration: 'Bismillahi walajna wa bismillahi kharajna wa ‘ala rabbina tawakkalna',
    translation: 'In the name of Allah we enter and leave, and upon our Lord we rely.'
  },
  {
    id: 'dl_9',
    category: 'Daily Life',
    title: 'Leaving Home',
    arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'Bismillah tawakkaltu ‘alallah la hawla wa la quwwata illa billah',
    translation: 'In the name of Allah, I trust in Allah. There is no power nor strength except with Allah.'
  },
  {
    id: 'dl_10',
    category: 'Daily Life',
    title: 'Travel Dua',
    arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
    transliteration: 'Subhanalladhi sakhkhara lana hadha wa ma kunna lahu muqrinin wa inna ila rabbina lamunqalibun',
    translation: 'Glory to Him who has subjected this to us, and we could not have done it; surely we will return to our Lord.'
  },
  {
    id: 'dl_11',
    category: 'Daily Life',
    title: 'Sneezing',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    translation: 'All praise is for Allah. (Sneezer). Response: Yarhamukallah. Reply back: Yahdikumullah wa yuslih balakum.'
  },
  {
    id: 'dl_12',
    category: 'Daily Life',
    title: 'When Angry',
    arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
    transliteration: 'A‘udhu billahi minash-shaytanir-rajim',
    translation: 'I seek refuge in Allah from the accursed devil.'
  },
  {
    id: 'dl_13',
    category: 'Daily Life',
    title: 'For Need / Stress',
    arabic: 'حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ',
    transliteration: 'Hasbiyallahu la ilaha illa Huwa, ‘alayhi tawakkaltu',
    translation: 'Allah is sufficient for me. There is no god but Him. I rely upon Him.'
  },
  // Personal
  {
    id: 'p_1',
    category: 'Personal',
    title: 'Dua for Forgiveness',
    arabic: 'اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ، دِقَّهُ وَجِلَّهُ، أَوَّلَهُ وَآخِرَهُ، عَلَانِيَتَهُ وَسِرَّهُ',
    transliteration: 'Allahummaghfir li dhanbi kullahu, diqqahu wa jillahu, awwalahu wa akhirahu, alaniyatahu wa sirrahu',
    translation: 'O Allah, forgive all my sins — small and big, first and last, public and private.'
  },
  {
    id: 'p_2',
    category: 'Personal',
    title: 'Guidance & Righteousness',
    arabic: 'اللَّهُمَّ اهْدِنِي وَسَدِّدْنِي',
    transliteration: 'Allahumma ihdini wa saddidni',
    translation: 'O Allah, guide me and keep me steadfast.'
  },
  {
    id: 'p_3',
    category: 'Personal',
    title: 'Dua for Jannah',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ',
    transliteration: 'Allahumma inni as’alukal-jannah',
    translation: 'O Allah, I ask You for Paradise.'
  },
  {
    id: 'p_4',
    category: 'Personal',
    title: 'Protection from Hellfire',
    arabic: 'اللَّهُمَّ أَجِرْنِي مِنَ النَّارِ',
    transliteration: 'Allahumma ajirni minan-nar',
    translation: 'O Allah, protect me from the Hellfire.'
  },
  {
    id: 'p_5',
    category: 'Personal',
    title: 'Best Dua (World + Hereafter)',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    transliteration: 'Rabbana atina fid-dunya hasanah wa fil-akhirati hasanah wa qina ‘adhaban-nar',
    translation: 'Our Lord, give us good in this world and the Hereafter and save us from the fire.'
  },
  {
    id: 'p_6',
    category: 'Personal',
    title: 'Dua for Rizq (Sustenance)',
    arabic: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',
    transliteration: 'Allahummakfini bihalalika ‘an haramika wa aghnini bifadlika ‘amman siwak',
    translation: 'O Allah, make halal sufficient for me instead of haram and enrich me by Your grace.'
  },
  {
    id: 'p_7',
    category: 'Personal',
    title: 'Dua for Knowledge',
    arabic: 'رَبِّ زِدْنِي عِلْمًا',
    transliteration: 'Rabbi zidni ‘ilma',
    translation: 'My Lord, increase me in knowledge.'
  },
  {
    id: 'p_8',
    category: 'Personal',
    title: 'Dua for Ease in Life',
    arabic: 'اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا',
    transliteration: 'Allahumma la sahla illa ma ja‘altahu sahla',
    translation: 'O Allah, nothing is easy except what You make easy.'
  },
  {
    id: 'p_9',
    category: 'Personal',
    title: 'Dua for Barakah',
    arabic: 'اللَّهُمَّ بَارِكْ لِي فِيمَا رَزَقْتَنِي',
    transliteration: 'Allahumma barik li fima razaqtani',
    translation: 'O Allah, bless what You have provided me.'
  },
  {
    id: 'p_10',
    category: 'Personal',
    title: 'Protection from Evil',
    arabic: 'اَعُوْذُ بِكَلِمَاتِ اللهِ التَّامَّةِ مِنْ كُلِّ شَيْطَانٍ وَّهَامَّةٍ وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ',
    transliteration: "A'uzu bikalimaa tillaa hit taa mmati min kulli shaitwa new wa haa mmatin wa min kulli 'ainin lammah",
    translation: 'I seek refuge from all devils, vermin and evil spirits through the complete Kalimas of Allah. (Bukhari 3371)'
  },
  {
    id: 'ist_1',
    category: 'Istighfar',
    title: 'Sayyidul Istighfar',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration: 'Allahumma anta rabbi la-ilaha illa anta khalaqtani wa ana abduka wa ana ala ahdika wa wadika mastatatu auzubika min sharri ma sanatu abu-u laka binimatika alaiya wa abu-u laka bidhanbi faghfirli fainnahu la yaghfirud-dhunuba illa ant',
    translation: 'The most superior way of asking for forgiveness. (Sahih Bukhari 5867)'
  },
  {
    id: 'ist_2',
    category: 'Istighfar',
    title: 'Majlis Kaffarah',
    arabic: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ',
    transliteration: 'Subhanallahi wa bihamdihi subhanakallahumma wa bihamdika ashadu alla ilaha illa anta astaghfiruka wa atubu ilaik',
    translation: 'Dua at the end of a gathering to expiate sins. (Sunan Tirmidhi 3433)'
  },
  {
    id: 'ist_3',
    category: 'Istighfar',
    title: 'Simple Istighfar',
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    transliteration: 'Astaghfirullah',
    translation: 'I seek forgiveness from Allah. (Sahih Muslim)'
  },
  {
    id: 'ist_4',
    category: 'Istighfar',
    title: 'La Hawla wala Quwwata',
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'La hawla wa la quwwata illa billah',
    translation: "There is no power nor might except with Allah. A treasure from the treasures of Paradise. (Sahih Bukhari 5967)"
  },
  { id: 'f_1', category: 'Family', title: 'For Parents', arabic: 'رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا', translation: 'My Lord, have mercy upon them as they brought me up [when I was] small' },
  {
    id: 'f_2',
    category: 'Family',
    title: 'Dua for Forgiveness',
    arabic: 'اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ، دِقَّهُ وَجِلَّهُ، أَوَّلَهُ وَآخِرَهُ، عَلَانِيَتَهُ وَسِرَّهُ',
    transliteration: 'Allahummaghfir li dhanbi kullahu, diqqahu wa jillahu, awwalahu wa akhirahu, alaniyatahu wa sirrahu',
    translation: 'O Allah, forgive all my sins — small and big, first and last, public and private.'
  },
  {
    id: 'f_3',
    category: 'Family',
    title: 'Guidance & Righteousness',
    arabic: 'اللَّهُمَّ اهْدِنِي وَسَدِّدْنِي',
    transliteration: 'Allahumma ihdini wa saddidni',
    translation: 'O Allah, guide me and keep me steadfast.'
  },
  {
    id: 'f_4',
    category: 'Family',
    title: 'Dua for Jannah',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ',
    transliteration: 'Allahumma inni as’alukal-jannah',
    translation: 'O Allah, I ask You for Paradise.'
  },
  {
    id: 'f_5',
    category: 'Family',
    title: 'Protection from Hellfire',
    arabic: 'اللَّهُمَّ أَجِرْنِي مِنَ النَّارِ',
    transliteration: 'Allahumma ajirni minan-nar',
    translation: 'O Allah, protect me from the Hellfire.'
  },
  {
    id: 'f_6',
    category: 'Family',
    title: 'Best Dua (World + Hereafter)',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    transliteration: 'Rabbana atina fid-dunya hasanah wa fil-akhirati hasanah wa qina ‘adhaban-nar',
    translation: 'Our Lord, give us good in this world and the Hereafter and save us from the fire.'
  },
  {
    id: 'f_7',
    category: 'Family',
    title: 'Dua for Rizq (Sustenance)',
    arabic: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',
    transliteration: 'Allahummakfini bihalalika ‘an haramika wa aghnini bifadlika ‘amman siwak',
    translation: 'O Allah, make halal sufficient for me instead of haram and enrich me by Your grace.'
  },
  {
    id: 'f_8',
    category: 'Family',
    title: 'Dua for Ease in Life',
    arabic: 'اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا',
    transliteration: 'Allahumma la sahla illa ma ja‘altahu sahla',
    translation: 'O Allah, nothing is easy except what You make easy.'
  },
  {
    id: 'f_9',
    category: 'Family',
    title: 'Dua for Barakah',
    arabic: 'اللَّهُمَّ بَارِكْ لِي فِيمَا رَزَقْتَنِي',
    transliteration: 'Allahumma barik li fima razaqtani',
    translation: 'O Allah, bless what You have provided me.'
  },
  {
    id: 'f_10',
    category: 'Family',
    title: 'For Deceased Family Members',
    arabic: 'اللَّهُمَّ اغْفِرْ لَهُمْ وَارْحَمْهُمْ وَاجْعَلِ الْجَنَّةَ مَأْوَاهُمْ',
    transliteration: 'Allahummaghfir lahum warhamhum waj‘alil-jannata ma’wahum',
    translation: 'O Allah, forgive them, have mercy on them and make Jannah their home.'
  },
  {
    id: 'rb_1',
    category: 'Rabbana Dua',
    title: 'Acceptance of Deeds',
    arabic: 'رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ',
    transliteration: 'Rabbana taqabbal minna innaka antas Sameeaul Aleem',
    translation: 'Our Lord! Accept (this service) from us: For Thou art the All-Hearing, the All-knowing. (Surah Al-Baqarah - 2:127)'
  },
  {
    id: 'rb_2',
    category: 'Rabbana Dua',
    title: 'Submission to Allah',
    arabic: 'رَبَّنَا وَاجْعَلْنَا مُسْلِمَيْنِ لَكَ وَمِن ذُرِّيَّتِنَا أُمَّةً مُّسْلِمَةً لَّكَ وَأَرِنَا مَنَاسِكَنَا وَتُبْ عَلَيْنَا ۖ إِنَّكَ أَنتَ التَّوَّابُ الرَّحِيمُ',
    transliteration: "Rabbana waj'alna muslimayni laka wa min dhurriyyatina ummatan muslimatan laka wa arina manasikana wa tub 'alayna innaka antat Tawwabur Rahim",
    translation: 'Our Lord! Make us submissive unto Thee and of our seed a nation submissive unto Thee, and show us our ways of worship, and relent toward us. Lo! Thou, only Thou, art the Relenting, the Merciful. (Surah Al-Baqarah - 2:128)'
  },
  {
    id: 'rb_3',
    category: 'Rabbana Dua',
    title: 'Good in Both Worlds',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    transliteration: 'Rabbana atina fid-dunya hasanah wa fil-akhirati hasanah wa qina ‘adhaban-nar',
    translation: 'Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire. (Surah Al-Baqarah - 2:201)'
  },
  {
    id: 'rb_4',
    category: 'Rabbana Dua',
    title: 'Patience & Victory',
    arabic: 'رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
    transliteration: 'Rabbana afrigh ‘alayna sabraw-wa thabbit aqdamana wansurna ‘alal qawmil kafirin',
    translation: 'Our Lord, bestow on us endurance and make our foothold sure and give us help against the disbelieving people. (Surah Al-Baqarah - 2:250)'
  },
  {
    id: 'rb_5',
    category: 'Rabbana Dua',
    title: 'Forgiveness and Mercy',
    arabic: 'رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ',
    transliteration: 'Rabbana thalamna anfusana wa-in lam taghfir lana watarhamna lanakunanna minal khasirin',
    translation: 'Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers. (Surah Al-A‘raf - 7:23)'
  },
  {
    id: 'rb_6',
    category: 'Rabbana Dua',
    title: 'Do Not Burden Us',
    arabic: 'رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا',
    transliteration: "Rabbana la tu'akhidhna in-nasina aw akhta'na. Rabbana wala tahmil 'alayna isran kama hamaltahu 'alal-ladhina min qablina",
    translation: 'Our Lord! Condemn us not if we forget, or miss the mark! Our Lord! Lay not on us such a burden as Thou didst lay on those before us! (Surah Al-Baqarah - 2:286)'
  },
  {
    id: 'rb_7',
    category: 'Rabbana Dua',
    title: 'Ease Our Burden',
    arabic: 'رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنتَ مَوْلَانَا فَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
    transliteration: "Rabbana wala tuhammilna ma la taqata lana bih wa'fu 'anna waghfirlana warhamna anta mawlana fansurna 'alal-qawmil kafirin",
    translation: 'Our Lord! Impose not on us that which we have not the strength to bear! Pardon us, absolve us and have mercy on us, Thou, our Protector, and give us victory over the disbelieving folk. (Surah Al-Baqarah - 2:286)'
  },
  {
    id: 'rb_8',
    category: 'Rabbana Dua',
    title: 'Steadfastness',
    arabic: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً ۚ إِنَّكَ أَنتَ الْوَهَّابُ',
    transliteration: "Rabbana la tuzigh qulubana ba'da idh hadaytana wa hab lana mil-ladunka rahmah innaka antal Wahhab",
    translation: 'Our Lord! Cause not our hearts to stray after Thou hast guided us, and bestow upon us mercy from Thy presence. Lo! Thou, only Thou, art the Bestower. (Surah Ali ‘Imran - 3:8)'
  },
  {
    id: 'rb_9',
    category: 'Rabbana Dua',
    title: 'Glory in Creation',
    arabic: 'رَبَّنَا مَا خَلَقْتَ هَٰذَا بَاطِلًا سُبْحَانَكَ فَقِنَا عَذَابَ النَّارِ',
    transliteration: "Rabbana ma khalaqta hadha batila subhanaka faqina 'adhaban nar",
    translation: 'Our Lord! Thou createdst not this in vain. Glory be to Thee! Preserve us from the doom of Fire. (Surah Ali ‘Imran - 3:191)'
  },
  {
    id: 'rb_10',
    category: 'Rabbana Dua',
    title: 'Prayer and Offspring',
    arabic: 'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي ۚ رَبَّنَا وَتَقَبَّلْ دُعَاءِ',
    transliteration: "Rabbij'alni muqimas salati wa min dhurriyyati Rabbana wa taqabbal du'a",
    translation: 'My Lord! Make me to establish proper worship, and some of my posterity (also); our Lord! and accept my prayer. (Surah Ibrahim - 14:40)'
  },
  {
    id: 'pu_1',
    category: 'Purity',
    title: 'Before Entering Toilet',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
    transliteration: "Bismillahi Allahumma inni a'uzubiqa minal khubusi wal khabais",
    translation: 'In the name of Allah, O Allah! I seek refuge in you from harmful male and female demons. [Sahih Bukhari - 5883, Tirmidhi - 605]'
  },
  {
    id: 'pu_2',
    category: 'Purity',
    title: 'After Leaving Toilet',
    arabic: 'غُفْرَانَكَ اَ لْحَمْدُ لِلّٰهِ الَّذِيْ اَذْهَبَ عَنِّيْ الْاَذٰى وَعَافَانِيْ',
    transliteration: "Gufraanaka Alhamdu Lillaa Hillazi Azhaba 'Annil Azaa Wa 'aa Fa Ni",
    translation: 'O Allah! I apologize to you. All praises are due to Almighty Allah who has removed from me the painful things and kept me healthy. [Sunan Ibn Majah - 301, Abu Dawud - 30, Tirmidhi - 07]'
  },
  {
    id: 'ill_1',
    category: 'Illnesses',
    title: 'Protection from Evil Diseases',
    arabic: 'اَللَّهُمَّ اِنِّىْ اَعُوْذُ بِكَ مِنَ الْبَرَصِ وَ الْجُنُوْنِ وَ الْجُذَامِ وَمِنْ سَىِّءِ الْاَسْقَامِ',
    transliteration: "Allahumma inni auzubiqa minal barsi wal jununi wal juzami wa min shayyi il askbam",
    translation: 'O Allah! I seek refuge in You from leprosy, madness, and all evil diseases. [Abu Dawud-1554]'
  },
  {
    id: 'ill_2',
    category: 'Illnesses',
    title: 'Relief from Difficult Disease',
    arabic: 'رَبِّ اَنِّى مَسَّنِىَ الضُّرُّ وَاَنْتَ اَرْحَمُ الرّحِمِيْنَ',
    transliteration: "Rabbi Anni Massaniadburru wa Anta Arhamur Rahimin",
    translation: 'I am afflicted, Thou art the Most Merciful. [Surah Al-Anbiya - 83]'
  },
  {
    id: 'ill_3',
    category: 'Illnesses',
    title: 'For Physical Pain',
    arabic: 'أَعُوذُ بِاللَّهِ وَقُدْرَتِهِ مِنْ شَرِّ مَا أَجِدُ وَأُحَاذِرُ',
    transliteration: "Auzubillahi wa Qudratihi min sharri ma-azidu wa uha-jiru",
    translation: 'I seek refuge in Allah and His power from the evil of what I feel and fear. (Place hand on area, say Bismillah x3, then this Dua x7)'
  },
  {
    id: 'ill_4',
    category: 'Illnesses',
    title: 'Visiting the Sick (1)',
    arabic: 'لاَ بَأْسَ طَهُورٌ إِنْ شَاءَ اللَّهُ',
    transliteration: "La Ba'sa Tahuroon In-Sha-Allah",
    translation: 'There is no reason to panic. (You will be cured) InshAllah this disease is purifying.'
  },
  {
    id: 'ill_5',
    category: 'Illnesses',
    title: 'Visiting the Sick (2)',
    arabic: 'أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ',
    transliteration: "As Alullahal 'Azeem Rabbal 'Arshil 'Azeem Ain Yash Fiyaq",
    translation: 'I pray to Almighty Allah, the Lord of the Throne, for your well-being. (Recite 7 times)'
  },
  {
    id: 'ill_6',
    category: 'Illnesses',
    title: 'Health, Vision & Hearing',
    arabic: 'اللّٰهُمَّ عَافَنِيْ فِيْ بَدَنِيْ، اللّٰهُمَّ عَافِنِيْ فِيْ سَمْعِيْ، اللّٰهُمَّ عَافِنِيْ فِيْ بَصَرِيْ، لَا إِلٰهَ إِلَّا أَنْتَ، اللّٰهُمَّ إِنِّيْ أَعُوْذُ بِكَ مِنَ الْكُفْرِ، وَالْفَقْرِ، اللّٰهُمَّ إِنِّيْ أَعُوْذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلٰهَ إِلَّا أَنْتَ',
    transliteration: "Allahumma Afini Fi Badani, Allahumma Afini Fi Samayi, Allahumma Afini Fi Basari, La Ilaha Illa Anta, Allahumma Inni Aujubika Minal Kufri, Wal Fakhri, Allahumma Inni Aujubika Min Azabil Kabri, La Ilaha Illa Anta",
    translation: 'O Allah! You grant me physical health and safety. Grant safety to my hearing and eyes. I seek refuge in you from disbelief, poverty and punishment of the grave. [Abu Dawud, Musnad Ahmad]'
  },
  {
    id: 'gn_1',
    category: 'Good News and Bad News',
    title: 'Congratulate for a Child',
    arabic: 'بَارَكَ اللَّهُ لَكَ فِي الْمَوْهُوبِ لَكَ، وَشَكَرْتَ الْوَاهِبَ، وَبَلَغَ أَشُدَّهُ، وَرُزِقْتَ بِرَّهُ',
    transliteration: 'Ba-rakalla-hu laka fil mauhubi lak, wa shakartal wa-hiba, wa balaga ashuddahu, wa Ruziqta birrahu',
    translation: 'May Allah bless you with what He has given you, give thanks to the bestower of children, may the child reach maturity and benefit from it. (Kitabul Azkar 853)'
  },
  {
    id: 'gn_2',
    category: 'Good News and Bad News',
    title: 'On Hearing Bad News',
    arabic: 'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ',
    transliteration: 'Inna Lillahi wa Inna Ilaihi Rajiun',
    translation: 'We belong to Allah and to Him we surely return. (Surah Baqarah 2:156, Sahih Muslim 918)'
  },
];

export const DUA_CATEGORIES = [
  'After Salah', 'Daily Life', 'Personal', 'Family', 'Rabbana Dua', 'Purity', 'Illnesses', 'Good News and Bad News', 'Istighfar'
];
