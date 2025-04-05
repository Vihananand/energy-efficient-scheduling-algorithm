"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-zinc-800 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <motion.div
              className="text-2xl font-bold text-emerald-500 flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span>EnergySim</span>
            </motion.div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <NavLinks />
          </div>
          
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <motion.div 
            className="md:hidden mt-4 py-4 border-t border-zinc-800"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <NavLinks mobile={true} onClick={() => setIsMenuOpen(false)} />
          </motion.div>
        )}
      </div>
    </header>
  );
}

function NavLinks({ mobile = false, onClick }) {
  const linkClasses = mobile 
    ? "block py-2 text-zinc-300 hover:text-emerald-400 transition-colors" 
    : "text-zinc-300 hover:text-emerald-400 transition-colors";
  
  return (
    <>
      <Link href="/" className={linkClasses} onClick={onClick}>
        Home
      </Link>
      <Link href="/code" className={linkClasses} onClick={onClick}>
        Code Examples
      </Link>
      <a 
        href="https://github.com/yourusername/energy-scheduler-sim" 
        target="_blank" 
        rel="noopener noreferrer" 
        className={linkClasses}
        onClick={onClick}
      >
        GitHub
      </a>
    </>
  );
} 