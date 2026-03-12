import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Data imsakiyah 30 hari Ramadhan 1447 H (perkiraan Jakarta)
const imsakiyahData = [
  { hari: 1, tanggal: "1 Mar", imsak: "04:14", subuh: "04:24", terbit: "05:40", dzuhur: "11:55", ashar: "15:15", maghrib: "17:50", isya: "19:01" },
  { hari: 2, tanggal: "2 Mar", imsak: "04:14", subuh: "04:24", terbit: "05:40", dzuhur: "11:55", ashar: "15:15", maghrib: "17:50", isya: "19:01" },
  { hari: 3, tanggal: "3 Mar", imsak: "04:15", subuh: "04:25", terbit: "05:40", dzuhur: "11:55", ashar: "15:14", maghrib: "17:49", isya: "19:00" },
  { hari: 4, tanggal: "4 Mar", imsak: "04:15", subuh: "04:25", terbit: "05:40", dzuhur: "11:55", ashar: "15:14", maghrib: "17:49", isya: "19:00" },
  { hari: 5, tanggal: "5 Mar", imsak: "04:15", subuh: "04:25", terbit: "05:41", dzuhur: "11:55", ashar: "15:14", maghrib: "17:49", isya: "19:00" },
  { hari: 6, tanggal: "6 Mar", imsak: "04:16", subuh: "04:26", terbit: "05:41", dzuhur: "11:55", ashar: "15:13", maghrib: "17:48", isya: "18:59" },
  { hari: 7, tanggal: "7 Mar", imsak: "04:16", subuh: "04:26", terbit: "05:41", dzuhur: "11:55", ashar: "15:13", maghrib: "17:48", isya: "18:59" },
  { hari: 8, tanggal: "8 Mar", imsak: "04:16", subuh: "04:26", terbit: "05:41", dzuhur: "11:54", ashar: "15:13", maghrib: "17:48", isya: "18:58" },
  { hari: 9, tanggal: "9 Mar", imsak: "04:17", subuh: "04:27", terbit: "05:41", dzuhur: "11:54", ashar: "15:12", maghrib: "17:47", isya: "18:58" },
  { hari: 10, tanggal: "10 Mar", imsak: "04:17", subuh: "04:27", terbit: "05:41", dzuhur: "11:54", ashar: "15:12", maghrib: "17:47", isya: "18:57" },
  { hari: 11, tanggal: "11 Mar", imsak: "04:17", subuh: "04:27", terbit: "05:42", dzuhur: "11:54", ashar: "15:12", maghrib: "17:46", isya: "18:57" },
  { hari: 12, tanggal: "12 Mar", imsak: "04:18", subuh: "04:28", terbit: "05:42", dzuhur: "11:54", ashar: "15:11", maghrib: "17:46", isya: "18:56" },
  { hari: 13, tanggal: "13 Mar", imsak: "04:18", subuh: "04:28", terbit: "05:42", dzuhur: "11:53", ashar: "15:11", maghrib: "17:45", isya: "18:56" },
  { hari: 14, tanggal: "14 Mar", imsak: "04:18", subuh: "04:28", terbit: "05:42", dzuhur: "11:53", ashar: "15:10", maghrib: "17:45", isya: "18:55" },
  { hari: 15, tanggal: "15 Mar", imsak: "04:19", subuh: "04:29", terbit: "05:42", dzuhur: "11:53", ashar: "15:10", maghrib: "17:44", isya: "18:55" },
  { hari: 16, tanggal: "16 Mar", imsak: "04:19", subuh: "04:29", terbit: "05:43", dzuhur: "11:53", ashar: "15:10", maghrib: "17:44", isya: "18:54" },
  { hari: 17, tanggal: "17 Mar", imsak: "04:19", subuh: "04:29", terbit: "05:43", dzuhur: "11:52", ashar: "15:09", maghrib: "17:43", isya: "18:54" },
  { hari: 18, tanggal: "18 Mar", imsak: "04:20", subuh: "04:30", terbit: "05:43", dzuhur: "11:52", ashar: "15:09", maghrib: "17:43", isya: "18:53" },
  { hari: 19, tanggal: "19 Mar", imsak: "04:20", subuh: "04:30", terbit: "05:43", dzuhur: "11:52", ashar: "15:08", maghrib: "17:42", isya: "18:53" },
  { hari: 20, tanggal: "20 Mar", imsak: "04:20", subuh: "04:30", terbit: "05:43", dzuhur: "11:52", ashar: "15:08", maghrib: "17:42", isya: "18:52" },
  { hari: 21, tanggal: "21 Mar", imsak: "04:21", subuh: "04:31", terbit: "05:44", dzuhur: "11:51", ashar: "15:07", maghrib: "17:41", isya: "18:52" },
  { hari: 22, tanggal: "22 Mar", imsak: "04:21", subuh: "04:31", terbit: "05:44", dzuhur: "11:51", ashar: "15:07", maghrib: "17:41", isya: "18:51" },
  { hari: 23, tanggal: "23 Mar", imsak: "04:21", subuh: "04:31", terbit: "05:44", dzuhur: "11:51", ashar: "15:06", maghrib: "17:40", isya: "18:51" },
  { hari: 24, tanggal: "24 Mar", imsak: "04:22", subuh: "04:32", terbit: "05:44", dzuhur: "11:50", ashar: "15:06", maghrib: "17:39", isya: "18:50" },
  { hari: 25, tanggal: "25 Mar", imsak: "04:22", subuh: "04:32", terbit: "05:44", dzuhur: "11:50", ashar: "15:05", maghrib: "17:39", isya: "18:50" },
  { hari: 26, tanggal: "26 Mar", imsak: "04:22", subuh: "04:32", terbit: "05:45", dzuhur: "11:50", ashar: "15:05", maghrib: "17:38", isya: "18:49" },
  { hari: 27, tanggal: "27 Mar", imsak: "04:23", subuh: "04:33", terbit: "05:45", dzuhur: "11:49", ashar: "15:04", maghrib: "17:38", isya: "18:49" },
  { hari: 28, tanggal: "28 Mar", imsak: "04:23", subuh: "04:33", terbit: "05:45", dzuhur: "11:49", ashar: "15:04", maghrib: "17:37", isya: "18:48" },
  { hari: 29, tanggal: "29 Mar", imsak: "04:23", subuh: "04:33", terbit: "05:45", dzuhur: "11:49", ashar: "15:03", maghrib: "17:37", isya: "18:48" },
  { hari: 30, tanggal: "30 Mar", imsak: "04:24", subuh: "04:34", terbit: "05:45", dzuhur: "11:48", ashar: "15:03", maghrib: "17:36", isya: "18:47" },
];

const ITEMS_PER_PAGE = 10;

const ImsakiyahSection = () => {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(imsakiyahData.length / ITEMS_PER_PAGE);
  const currentData = imsakiyahData.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  return (
    <section id="imsakiyah" className="py-16 md:py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-2xl md:text-4xl font-bold gradient-gold-text mb-3">
            Jadwal Imsakiyah 30 Hari
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Ramadhan 1447 H — Wilayah Jakarta (perkiraan)
          </p>
        </motion.div>

        {/* Scrollable table */}
        <motion.div
          className="overflow-x-auto rounded-xl border border-border"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="gradient-gold text-primary-foreground">
                <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">Hari</th>
                <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">Tanggal</th>
                <th className="px-3 py-3 text-center font-semibold whitespace-nowrap">Imsak</th>
                <th className="px-3 py-3 text-center font-semibold whitespace-nowrap">Subuh</th>
                <th className="px-3 py-3 text-center font-semibold whitespace-nowrap">Terbit</th>
                <th className="px-3 py-3 text-center font-semibold whitespace-nowrap">Dzuhur</th>
                <th className="px-3 py-3 text-center font-semibold whitespace-nowrap">Ashar</th>
                <th className="px-3 py-3 text-center font-semibold whitespace-nowrap">Maghrib</th>
                <th className="px-3 py-3 text-center font-semibold whitespace-nowrap">Isya</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((row, i) => (
                <tr
                  key={row.hari}
                  className={`border-t border-border transition-colors hover:bg-secondary/50 ${i % 2 === 0 ? "bg-card" : "bg-muted/30"}`}
                >
                  <td className="px-3 py-2.5 font-semibold text-gold">{row.hari}</td>
                  <td className="px-3 py-2.5 text-foreground whitespace-nowrap">{row.tanggal}</td>
                  <td className="px-3 py-2.5 text-center text-foreground font-medium">{row.imsak}</td>
                  <td className="px-3 py-2.5 text-center text-foreground">{row.subuh}</td>
                  <td className="px-3 py-2.5 text-center text-muted-foreground">{row.terbit}</td>
                  <td className="px-3 py-2.5 text-center text-foreground">{row.dzuhur}</td>
                  <td className="px-3 py-2.5 text-center text-foreground">{row.ashar}</td>
                  <td className="px-3 py-2.5 text-center text-gold font-semibold">{row.maghrib}</td>
                  <td className="px-3 py-2.5 text-center text-foreground">{row.isya}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-foreground disabled:opacity-30 hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                page === i
                  ? "gradient-gold text-primary-foreground"
                  : "border border-border text-muted-foreground hover:bg-secondary"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page === totalPages - 1}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-foreground disabled:opacity-30 hover:bg-secondary transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <p className="text-center text-muted-foreground text-xs mt-4">
          * Jadwal bersifat perkiraan. Silakan cek jadwal resmi Kemenag RI.
        </p>
      </div>
    </section>
  );
};

export default ImsakiyahSection;
