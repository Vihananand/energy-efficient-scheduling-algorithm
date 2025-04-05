import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ProcessForm({ onSubmit }) {
  const [processCount, setProcessCount] = useState(5);
  const [algorithmType, setAlgorithmType] = useState('edf');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(processCount, algorithmType);
  };
  
  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="w-full bg-zinc-900 rounded-xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <label className="block mb-2 text-sm font-medium text-zinc-300">
            Number of Processes
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={processCount}
            onChange={(e) => setProcessCount(parseInt(e.target.value))}
            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="mt-1 text-sm text-zinc-400 text-center">
            {processCount} {processCount === 1 ? 'process' : 'processes'}
          </div>
        </div>
        
        <div className="flex-1">
          <label className="block mb-2 text-sm font-medium text-zinc-300">
            Scheduling Algorithm
          </label>
          <select
            value={algorithmType}
            onChange={(e) => setAlgorithmType(e.target.value)}
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <optgroup label="Real-Time Scheduling">
              <option value="edf">Energy-aware Earliest Deadline First</option>
              <option value="rms">Rate Monotonic Scheduling</option>
            </optgroup>
            
            <optgroup label="DVFS">
              <option value="dvfs">Dynamic Voltage and Frequency Scaling</option>
              <option value="ondemand">Ondemand Governor</option>
              <option value="conservative">Conservative Governor</option>
              <option value="userspace">Userspace Governor</option>
            </optgroup>
            
            <optgroup label="Dynamic Power Management">
              <option value="dpm">Dynamic Power Management</option>
              <option value="timeout">Timeout-based Sleep</option>
              <option value="history">History-based Sleep</option>
              <option value="tickless">Tickless Kernel</option>
            </optgroup>
            
            <optgroup label="Energy-Aware Scheduling">
              <option value="eas">Energy-Aware Scheduler</option>
              <option value="biglittle">big.LITTLE Optimization</option>
            </optgroup>
            
            <optgroup label="Machine Learning">
              <option value="ml">Machine Learning-Based Scheduler</option>
              <option value="rl">Reinforcement Learning Scheduler</option>
            </optgroup>
            
            <optgroup label="Other Energy-Efficient Algorithms">
              <option value="race">Race-to-Idle</option>
              <option value="eerr">Energy-Efficient Round Robin</option>
              <option value="mlfq">Multi-Level Feedback Queue</option>
            </optgroup>
          </select>
        </div>
      </div>
      
      <div className="mt-6 flex justify-center">
        <motion.button
          type="submit"
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Initialize Simulation
        </motion.button>
      </div>
    </motion.form>
  );
} 