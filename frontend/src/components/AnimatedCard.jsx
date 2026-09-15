import { motion } from 'motion/react';

export default function AnimatedCard({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: 'spring', 
        stiffness: 260, 
        damping: 24,
        delay: delay 
      }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`bg-[#121622]/80 backdrop-blur-2xl border border-white/5 rounded-3xl p-6 shadow-2xl ${className}`}
    >
      {children}
    </motion.div>
  );
}