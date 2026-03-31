import { useAppStore } from '../store';
import { motion } from 'motion/react';

export default function Marquee() {
  const { language } = useAppStore();
  const text = language === 'AZ' ? 'Siz seçin biz amerikdan çatdıraq' : 'You choose, we deliver from America';

  return (
    <div className="bg-green-600 text-white py-2 overflow-hidden relative flex items-center">
      <div className="absolute left-0 w-8 h-full bg-gradient-to-r from-green-600 to-transparent z-10" />
      <div className="absolute right-0 w-8 h-full bg-gradient-to-l from-green-600 to-transparent z-10" />
      <motion.div
        className="whitespace-nowrap font-medium tracking-wide flex gap-8"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, ease: 'linear', duration: 15 }}
      >
        <span>{text}</span>
        <span>•</span>
        <span>{text}</span>
        <span>•</span>
        <span>{text}</span>
        <span>•</span>
        <span>{text}</span>
        <span>•</span>
        <span>{text}</span>
        <span>•</span>
        <span>{text}</span>
      </motion.div>
    </div>
  );
}
