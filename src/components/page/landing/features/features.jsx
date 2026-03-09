import { motion } from "framer-motion";

const features = [
  {
    title: "High Commissions",
    desc: "Earn competitive commissions on every successful referral.",
  },
  {
    title: "Global Reach",
    desc: "Work with merchants and partners across the world.",
  },
  {
    title: "Dedicated Support",
    desc: "Get priority support and partner-only resources.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-32 bg-black">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-white mb-12"
        >
          Features
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8"
            >
              <h3 className="text-xl font-semibold text-white mb-3">
                {item.title}
              </h3>
              <p className="text-white/60">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;