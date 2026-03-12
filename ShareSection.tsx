import { motion } from "framer-motion";
import { Share2, MessageCircle, Facebook, Twitter, Copy, Check } from "lucide-react";
import { useState } from "react";

const ucapan = "Ramadhan Mubarak! 🌙✨ Selamat menjalankan ibadah puasa Ramadhan 1447 H. Semoga bulan suci ini membawa keberkahan, ampunan, dan kebahagiaan bagi kita semua. Taqabbalallahu minna wa minkum.";

const ShareSection = () => {
  const [copied, setCopied] = useState(false);
  const encodedText = encodeURIComponent(ucapan);
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";
  const encodedUrl = encodeURIComponent(pageUrl);

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      colorClass: "hover:border-emerald-light",
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      colorClass: "hover:border-primary/50",
    },
    {
      name: "Twitter / X",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      colorClass: "hover:border-primary/50",
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ucapan);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = ucapan;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="py-16 md:py-24 px-6 bg-secondary/30">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Share2 className="w-8 h-8 text-gold mx-auto mb-4" />
          <h2 className="font-display text-2xl md:text-4xl font-bold gradient-gold-text mb-3">
            Bagikan Ucapan Ramadhan
          </h2>
          <p className="text-muted-foreground text-sm md:text-base mb-8">
            Sebarkan kebaikan dengan berbagi ucapan kepada keluarga & sahabat
          </p>
        </motion.div>

        {/* Preview card */}
        <motion.div
          className="bg-card border border-border rounded-2xl p-6 mb-8 text-left"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-foreground/90 text-sm md:text-base leading-relaxed">{ucapan}</p>
        </motion.div>

        {/* Share buttons */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {shareLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card text-foreground text-sm font-medium transition-all hover:scale-105 ${link.colorClass}`}
            >
              <link.icon className="w-4 h-4 text-gold" />
              {link.name}
            </a>
          ))}

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card text-foreground text-sm font-medium transition-all hover:scale-105 hover:border-primary/50"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-gold" />
                Tersalin!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-gold" />
                Salin Teks
              </>
            )}
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default ShareSection;
