import heroBg from "../../../../assets/hero.jpg";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">

      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      <div className="absolute inset-0 bg-black/75" />

      <div className="relative container mx-auto px-6 py-32">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-20">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl backdrop-blur-xl bg-black/45 rounded-2xl border border-white/10 p-10"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 bg-white/10 text-white/80 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
            >
              Partner Program — Now Open
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white"
            >
              Grow Your Business with Our{" "}
              <span className="text-white/80">E-Commerce</span> Partner Program
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-lg text-white/65 mb-10"
            >
              Join a thriving network of agencies, developers, and consultants.
              Earn commissions, access exclusive resources, and help merchants
              scale globally.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href="#join"
                className="inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-3.5 rounded-xl font-semibold hover:bg-white/90 transition-all shadow-lg"
              >
                Apply Now <ArrowRight size={18} />
              </a>

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-white/80 px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all"
              >
                Learn More
              </a>
            </motion.div>
          </motion.div>

          {/* RIGHT LOGO */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 0.8, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hidden lg:flex flex-1 items-center justify-center"
          >
            <img
              src="/lg.png"
              alt="Fit.it Logo"
              className="w-[300px]"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;