"use client";

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
    <motion.div
      className="bg-zinc-900 rounded-xl shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-4 md:p-6">
        <h2 className="text-xl font-semibold text-emerald-400 mb-4">Configure Simulation</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-zinc-300 mb-2">
              Number of Processes (1-10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={processCount}
              onChange={(e) => setProcessCount(parseInt(e.target.value))}
              className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="mt-2 text-right text-emerald-400 font-mono">{processCount}</div>
          </div>
          
          <div>
            <label className="block text-zinc-300 mb-2">
              Scheduling Algorithm
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-medium text-zinc-400 text-sm">DVFS Variants</h3>
                <div className="space-y-2">
                  <AlgorithmOption id="ondemand" value="ondemand" name="Ondemand Governor" current={algorithmType} onChange={setAlgorithmType} />
                  <AlgorithmOption id="conservative" value="conservative" name="Conservative Governor" current={algorithmType} onChange={setAlgorithmType} />
                  <AlgorithmOption id="userspace" value="userspace" name="Userspace Governor" current={algorithmType} onChange={setAlgorithmType} />
                </div>
                
                <h3 className="font-medium text-zinc-400 text-sm mt-4">DPM Algorithms</h3>
                <div className="space-y-2">
                  <AlgorithmOption id="dpm" value="dpm" name="Dynamic Power Management" current={algorithmType} onChange={setAlgorithmType} />
                  <AlgorithmOption id="timeout" value="timeout" name="Timeout-based Sleep" current={algorithmType} onChange={setAlgorithmType} />
                  <AlgorithmOption id="history" value="history" name="History-based Sleep" current={algorithmType} onChange={setAlgorithmType} />
                  <AlgorithmOption id="tickless" value="tickless" name="Tickless Kernel" current={algorithmType} onChange={setAlgorithmType} />
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium text-zinc-400 text-sm">EAS Algorithms</h3>
                <div className="space-y-2">
                  <AlgorithmOption id="eas" value="eas" name="Energy-Aware Scheduling" current={algorithmType} onChange={setAlgorithmType} />
                  <AlgorithmOption id="biglittle" value="biglittle" name="big.LITTLE Architecture" current={algorithmType} onChange={setAlgorithmType} />
                </div>
                
                <h3 className="font-medium text-zinc-400 text-sm mt-4">ML-based Scheduling</h3>
                <div className="space-y-2">
                  <AlgorithmOption id="ml" value="ml" name="Machine Learning" current={algorithmType} onChange={setAlgorithmType} />
                  <AlgorithmOption id="rl" value="rl" name="Reinforcement Learning" current={algorithmType} onChange={setAlgorithmType} />
                </div>
                
                <h3 className="font-medium text-zinc-400 text-sm mt-4">Real-time Scheduling</h3>
                <div className="space-y-2">
                  <AlgorithmOption id="edf" value="edf" name="Earliest Deadline First" current={algorithmType} onChange={setAlgorithmType} />
                  <AlgorithmOption id="rms" value="rms" name="Rate Monotonic" current={algorithmType} onChange={setAlgorithmType} />
                </div>
                
                <h3 className="font-medium text-zinc-400 text-sm mt-4">Other Algorithms</h3>
                <div className="space-y-2">
                  <AlgorithmOption id="race" value="race" name="Race-to-Idle" current={algorithmType} onChange={setAlgorithmType} />
                  <AlgorithmOption id="eerr" value="eerr" name="Energy-Efficient Round Robin" current={algorithmType} onChange={setAlgorithmType} />
                  <AlgorithmOption id="mlfq" value="mlfq" name="Multi-level Feedback Queue" current={algorithmType} onChange={setAlgorithmType} />
                </div>
              </div>
            </div>
          </div>
          
          <motion.button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-lg font-medium shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Start Simulation
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}

function AlgorithmOption({ id, value, name, current, onChange }) {
  return (
    <div className="flex items-center">
      <input
        type="radio"
        id={id}
        name="algorithm"
        value={value}
        checked={current === value}
        onChange={() => onChange(value)}
        className="w-4 h-4 text-emerald-500 bg-zinc-700 border-zinc-600 focus:ring-emerald-500 focus:ring-2"
      />
      <label htmlFor={id} className="ml-2 text-sm text-zinc-300">
        {name}
      </label>
    </div>
  );
} 