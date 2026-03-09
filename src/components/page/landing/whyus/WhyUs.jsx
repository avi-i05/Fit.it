import { motion } from "framer-motion";

const WhyUs = () => {
  return (
    <section id="why-us" className="py-32 bg-black">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-white mb-6"
        >
          Why Choose Us?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white/65 text-lg"
        >
          We’re not just another partner program. We focus on long-term growth,
          transparency, and real value for our partners. Our platform is built
          to scale with you.
        </motion.p>
      </div>
    </section>
  );
};

export default WhyUs;