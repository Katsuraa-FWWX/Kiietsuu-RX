import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const doaHarian = [
  {
    hari: "Hari 1",
    judul: "Doa Niat Puasa",
    arab: "نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هَذِهِ السَّنَةِ لِلَّهِ تَعَالَى",
    latin: "Nawaitu shauma ghadin 'an adaa'i fardhi syahri ramadhaana haadzihis sanati lillaahi ta'aalaa.",
    arti: "Saya niat berpuasa esok hari untuk menunaikan fardhu di bulan Ramadhan tahun ini karena Allah Ta'ala.",
  },
  {
    hari: "Hari 2",
    judul: "Doa Berbuka Puasa",
    arab: "اَللَّهُمَّ لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ",
    latin: "Allaahumma laka shumtu wa bika aamantu wa 'alaa rizqika afthartu.",
    arti: "Ya Allah, untuk-Mu aku berpuasa, kepada-Mu aku beriman, dan dengan rezeki-Mu aku berbuka.",
  },
  {
    hari: "Hari 3",
    judul: "Doa Setelah Sholat Tarawih",
    arab: "اَللَّهُمَّ اجْعَلْنَا مِنَ الصَّائِمِيْنَ وَالقَائِمِيْنَ وَالذَّاكِرِيْنَ اللهَ كَثِيْرًا",
    latin: "Allaahummaj'alnaa minash-shaa'imiina wal-qaa'imiina wadz-dzaakirinallaaha katsiiraa.",
    arti: "Ya Allah, jadikanlah kami termasuk orang-orang yang berpuasa, yang mendirikan sholat, dan yang banyak berdzikir kepada-Mu.",
  },
  {
    hari: "Hari 4",
    judul: "Doa Mohon Ampunan",
    arab: "رَبَّنَا ظَلَمْنَآ أَنْفُسَنَا وَإِنْ لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُوْنَنَّ مِنَ الْخَاسِرِيْنَ",
    latin: "Rabbanaa zhalamnaa anfusanaa wa il lam taghfir lanaa wa tarhamnaa lanakuunanna minal khaasiriin.",
    arti: "Ya Tuhan kami, kami telah menganiaya diri kami sendiri. Jika Engkau tidak mengampuni kami dan memberi rahmat, niscaya kami termasuk orang-orang yang merugi.",
  },
  {
    hari: "Hari 5",
    judul: "Doa Malam Lailatul Qadr",
    arab: "اَللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
    latin: "Allaahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'annii.",
    arti: "Ya Allah, sesungguhnya Engkau Maha Pemaaf, Engkau menyukai maaf, maka maafkanlah aku.",
  },
  {
    hari: "Hari 6",
    judul: "Doa Memohon Kebaikan",
    arab: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    latin: "Rabbanaa aatinaa fid-dunyaa hasanatan wa fil aakhirati hasanatan wa qinaa 'adzaaban-naar.",
    arti: "Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab api neraka.",
  },
  {
    hari: "Hari 7",
    judul: "Doa Mohon Keteguhan Iman",
    arab: "رَبَّنَا لَا تُزِغْ قُلُوْبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَّدُنْكَ رَحْمَةً",
    latin: "Rabbanaa laa tuzigh quluubanaa ba'da idz hadaitanaa wa hab lanaa min ladunka rahmah.",
    arti: "Ya Tuhan kami, janganlah Engkau condongkan hati kami setelah Engkau beri petunjuk, dan karuniakanlah rahmat dari sisi-Mu.",
  },
  {
    hari: "Hari 8",
    judul: "Doa Kesabaran",
    arab: "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِيْنَ",
    latin: "Rabbanaa afrigh 'alainaa shabran wa tsabbit aqdaamanaa wanshurnaa 'alal qaumil kaafiriin.",
    arti: "Ya Tuhan kami, limpahkanlah kesabaran kepada kami, teguhkanlah langkah kami, dan tolonglah kami.",
  },
  {
    hari: "Hari 9",
    judul: "Doa Perlindungan",
    arab: "اَللَّهُمَّ إِنِّي أَعُوْذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ وَمِنْ عَذَابِ الْقَبْرِ",
    latin: "Allaahumma innii a'uudzu bika min 'adzaabi jahannam wa min 'adzaabil qabr.",
    arti: "Ya Allah, aku berlindung kepada-Mu dari azab Jahannam dan dari azab kubur.",
  },
  {
    hari: "Hari 10",
    judul: "Doa Keberkahan",
    arab: "اَللَّهُمَّ بَارِكْ لَنَا فِيْ رَمَضَانَ",
    latin: "Allaahumma baarik lanaa fii Ramadhaan.",
    arti: "Ya Allah, berkahilah kami di bulan Ramadhan.",
  },
];

const DoaHarianSection = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const prev = () => {
    if (current > 0) goTo(current - 1);
  };

  const next = () => {
    if (current < doaHarian.length - 1) goTo(current + 1);
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
  };

  const doa = doaHarian[current];

  return (
    <section className="py-16 md:py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-2xl md:text-4xl font-bold gradient-gold-text mb-3">
            Kumpulan Doa Harian
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Geser untuk melihat doa-doa pilihan selama Ramadhan
          </p>
        </motion.div>

        {/* Card carousel */}
        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-border bg-card min-h-[320px] md:min-h-[300px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="p-6 md:p-10"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-medium gradient-gold text-primary-foreground px-3 py-1 rounded-full">
                    {doa.hari}
                  </span>
                  <span className="text-sm font-semibold text-foreground">{doa.judul}</span>
                </div>

                <p className="font-arabic text-xl md:text-2xl text-gold leading-loose text-right mb-4" dir="rtl">
                  {doa.arab}
                </p>

                <p className="text-foreground/70 text-sm italic mb-3">{doa.latin}</p>

                <div className="w-12 h-px bg-primary/30 mb-3" />

                <p className="text-muted-foreground text-sm leading-relaxed">"{doa.arti}"</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prev}
            disabled={current === 0}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center disabled:opacity-20 hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-foreground" />
          </button>
          <button
            onClick={next}
            disabled={current === doaHarian.length - 1}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center disabled:opacity-20 hover:bg-secondary transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-foreground" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-5">
          {doaHarian.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all ${
                i === current
                  ? "w-6 h-2 gradient-gold"
                  : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DoaHarianSection;
