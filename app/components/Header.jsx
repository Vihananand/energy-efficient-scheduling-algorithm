import { motion } from "framer-motion";
import Link from "next/link";

export default function Header() {
  return (
    <motion.header 
      className="w-full py-6 border-b border-zinc-800"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <motion.h1 
          className="text-2xl font-bold text-emerald-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Link href="/">Energy-Efficient CPU Scheduler</Link>
        </motion.h1>
        
        <div className="flex items-center gap-6">
          <motion.nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className="text-zinc-300 hover:text-emerald-400 transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/code" 
              className="text-zinc-300 hover:text-emerald-400 transition-colors"
            >
              Algorithm Code
            </Link>
          </motion.nav>
          
          <motion.div
            className="flex items-center gap-2 bg-zinc-800 px-3 py-1.5 rounded-full text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            Energy-Efficient Mode
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
} 