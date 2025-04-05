'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';

export default function CodePage() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('edf');
  
  const algorithms = [
    { id: 'edf', name: 'Energy-aware Earliest Deadline First' },
    { id: 'race', name: 'Race-to-Idle' },
    { id: 'dvfs', name: 'Dynamic Voltage and Frequency Scaling' },
    { id: 'eerr', name: 'Energy-Efficient Round Robin' },
    { id: 'ondemand', name: 'Ondemand Governor' },
    { id: 'conservative', name: 'Conservative Governor' },
    { id: 'userspace', name: 'Userspace Governor' },
    { id: 'dpm', name: 'Dynamic Power Management' },
    { id: 'timeout', name: 'Timeout-based Sleep' },
    { id: 'history', name: 'History-based Sleep' },
    { id: 'tickless', name: 'Tickless Kernel' },
    { id: 'eas', name: 'Energy-Aware Scheduler' },
    { id: 'biglittle', name: 'big.LITTLE Optimization' },
    { id: 'ml', name: 'Machine Learning-Based Scheduler' },
    { id: 'rl', name: 'Reinforcement Learning Scheduler' },
    { id: 'rms', name: 'Rate Monotonic Scheduling' },
    { id: 'mlfq', name: 'Multi-Level Feedback Queue' },
  ];
  
  const algorithmCode = {
    edf: `export function energyAwareEDF(processes) {
  const scheduledProcesses = [...processes];
  
  scheduledProcesses.forEach(process => {
    process.deadline = process.arrivalTime + process.burstTime + Math.floor(process.burstTime * 0.5);
  });
  
  scheduledProcesses.sort((a, b) => a.deadline - b.deadline);
  
  let currentTime = 0;
  
  scheduledProcesses.forEach(process => {
    process.startTime = Math.max(currentTime, process.arrivalTime);
    currentTime = process.startTime + process.burstTime;
    
    const slack = process.deadline - (process.startTime + process.burstTime);
    process.energyUsage = process.burstTime * (1 - (Math.min(slack, process.burstTime) / (process.burstTime * 2)));
  });
  
  return scheduledProcesses;
}`,
    race: `export function raceToIdle(processes) {
  const scheduledProcesses = [...processes];
  
  scheduledProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  let currentTime = 0;
  
  scheduledProcesses.forEach(process => {
    process.startTime = Math.max(currentTime, process.arrivalTime);
    const speedupFactor = 0.8;
    const adjustedBurstTime = Math.max(Math.floor(process.burstTime * speedupFactor), 1);
    
    process.energyUsage = process.burstTime * 1.2;
    const originalBurstTime = process.burstTime;
    process.burstTime = adjustedBurstTime;
    process.deadline = process.arrivalTime + originalBurstTime + 5;
    
    currentTime = process.startTime + process.burstTime;
  });
  
  return scheduledProcesses;
}`,
    dvfs: `export function dvfsScheduling(processes) {
  const scheduledProcesses = [...processes];
  
  scheduledProcesses.sort((a, b) => b.priority - a.priority);
  
  let currentTime = 0;
  
  scheduledProcesses.forEach(process => {
    process.startTime = Math.max(currentTime, process.arrivalTime);
    
    const speedFactor = 0.7 + (process.priority / 10) * 0.6;
    const energyFactor = 0.5 + (process.priority / 10) * 1.0;
    
    const originalBurstTime = process.burstTime;
    process.burstTime = Math.max(Math.ceil(originalBurstTime / speedFactor), 1);
    
    process.energyUsage = originalBurstTime * energyFactor;
    
    process.deadline = process.arrivalTime + originalBurstTime + (10 - process.priority);
    
    currentTime = process.startTime + process.burstTime;
  });
  
  return scheduledProcesses;
}`,
    eerr: `export function energyEfficientRR(processes) {
  const scheduledProcesses = [...processes];
  
  scheduledProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  const priorityGroups = {};
  
  scheduledProcesses.forEach(process => {
    const priorityLevel = Math.floor(process.priority / 3.4);
    if (!priorityGroups[priorityLevel]) {
      priorityGroups[priorityLevel] = [];
    }
    priorityGroups[priorityLevel].push(process);
  });
  
  let currentTime = 0;
  let resultProcesses = [];
  
  Object.keys(priorityGroups)
    .sort((a, b) => b - a)
    .forEach(priorityLevel => {
      const processes = priorityGroups[priorityLevel];
      
      processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
      
      processes.forEach(process => {
        process.startTime = Math.max(currentTime, process.arrivalTime);
        
        const energyEfficiencyFactor = 1 - (priorityLevel * 0.1);
        process.energyUsage = process.burstTime * energyEfficiencyFactor;
        
        process.deadline = process.arrivalTime + process.burstTime + 8;
        
        currentTime = process.startTime + process.burstTime;
        
        resultProcesses.push(process);
      });
    });
  
  return resultProcesses;
}`,
    ondemand: `export function ondemandGovernor(processes) {
  const scheduledProcesses = [...processes];
  
  scheduledProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  let currentTime = 0;
  
  scheduledProcesses.forEach(process => {
    process.startTime = Math.max(currentTime, process.arrivalTime);
    
    const utilizationThreshold = 70;
    
    let speedFactor, energyFactor;
    
    if (process.cpuUtilization > utilizationThreshold) {
      speedFactor = 1.4; 
      energyFactor = 1.8; 
    } else {
      speedFactor = 0.7 + (process.cpuUtilization / 100) * 0.7; 
      energyFactor = 0.5 + (process.cpuUtilization / 100) * 1.3;
    }
    
    const originalBurstTime = process.burstTime;
    process.burstTime = Math.max(Math.ceil(originalBurstTime / speedFactor), 1);
    process.energyUsage = originalBurstTime * energyFactor;
    
    process.deadline = process.arrivalTime + originalBurstTime + 5;
    
    currentTime = process.startTime + process.burstTime;
  });
  
  return scheduledProcesses;
}`,
    conservative: `export function conservativeGovernor(processes) {
  const scheduledProcesses = [...processes];
  
  scheduledProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  let currentTime = 0;
  let previousUtilization = 50;
  
  scheduledProcesses.forEach(process => {
    process.startTime = Math.max(currentTime, process.arrivalTime);
    
    let targetSpeedFactor = 0.7 + (process.cpuUtilization / 100) * 0.7; 
    const previousSpeedFactor = 0.7 + (previousUtilization / 100) * 0.7;
    const speedFactor = (previousSpeedFactor + targetSpeedFactor) / 2;
    
    const targetEnergyFactor = 0.5 + (process.cpuUtilization / 100) * 1.0;
    const previousEnergyFactor = 0.5 + (previousUtilization / 100) * 1.0;
    const energyFactor = (previousEnergyFactor + targetEnergyFactor) / 2;
    
    const originalBurstTime = process.burstTime;
    process.burstTime = Math.max(Math.ceil(originalBurstTime / speedFactor), 1);
    process.energyUsage = originalBurstTime * energyFactor;
    
    process.deadline = process.arrivalTime + originalBurstTime + 7;
    
    previousUtilization = process.cpuUtilization;
  
    currentTime = process.startTime + process.burstTime;
  });
  
  return scheduledProcesses;
}`,
    userspace: `export function userspaceGovernor(processes) {
  const scheduledProcesses = [...processes];
  
  scheduledProcesses.sort((a, b) => b.priority - a.priority);
  
  let currentTime = 0;
  
  scheduledProcesses.forEach(process => {
    process.startTime = Math.max(currentTime, process.arrivalTime);
    
    const requestedFrequencyFactor = process.isIOBound 
      ? 0.7
      : 0.8 + (process.priority / 10) * 0.6;
    
    const energyFactor = requestedFrequencyFactor * 1.1;
    
    const originalBurstTime = process.burstTime;
    process.burstTime = Math.max(Math.ceil(originalBurstTime / requestedFrequencyFactor), 1);
    process.energyUsage = originalBurstTime * energyFactor;
    
    process.deadline = process.arrivalTime + originalBurstTime + 5;
    
    currentTime = process.startTime + process.burstTime;
  });
  
  return scheduledProcesses;
}`,
    mlfq: `export function multilevelFeedbackQueue(processes) {
  const scheduledProcesses = [...processes];
  
  const queues = [
    { level: 0, quantum: 2, processes: [], energyFactor: 1.0 }, 
    { level: 1, quantum: 4, processes: [], energyFactor: 0.85 }, 
    { level: 2, quantum: 8, processes: [], energyFactor: 0.7 }  
  ];
  
  scheduledProcesses.forEach(process => {
    const queueLevel = Math.min(Math.floor(process.priority / 3.5), 2);
    queues[queueLevel].processes.push(process);
    
    process.initialQueue = queueLevel;
    
    process.boostProbability = process.isIOBound ? 0.7 : 0.2;
  });
  
  queues.forEach(queue => {
    queue.processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
  });
  
  let currentTime = 0;
  const processedOrder = [];
  const readyQueue = [];
  
  scheduledProcesses.forEach(process => {
    if (process.arrivalTime === 0) {
      readyQueue.push({ ...process, currentQueue: process.initialQueue, remainingBurst: process.burstTime });
    }
  });
  
  while (readyQueue.length > 0) {
    readyQueue.sort((a, b) => a.currentQueue - b.currentQueue);
    
    const currentProcess = readyQueue.shift();
    const queue = queues[currentProcess.currentQueue];
    
    const executeTime = Math.min(currentProcess.remainingBurst, queue.quantum);
    currentProcess.remainingBurst -= executeTime;
    currentTime += executeTime;
    
    scheduledProcesses.forEach(process => {
      if (!readyQueue.some(p => p.id === process.id) && 
          !processedOrder.some(p => p.id === process.id) &&
          process.arrivalTime <= currentTime &&
          process.id !== currentProcess.id) {
        readyQueue.push({
          ...process,
          currentQueue: process.initialQueue,
          remainingBurst: process.burstTime
        });
      }
    });
    
    if (currentProcess.remainingBurst <= 0) {
      processedOrder.push({
        ...currentProcess,
        completionTime: currentTime,
        startTime: currentProcess.arrivalTime,
        turnaroundTime: currentTime - currentProcess.arrivalTime,
        energyUsage: currentProcess.burstTime * queues[currentProcess.initialQueue].energyFactor
      });
    } else {
      if (Math.random() < currentProcess.boostProbability && currentProcess.isIOBound) {
        currentProcess.currentQueue = Math.max(0, currentProcess.currentQueue - 1);
      } else {
        currentProcess.currentQueue = Math.min(queues.length - 1, currentProcess.currentQueue + 1);
      }
      
      readyQueue.push(currentProcess);
    }
  }
  
  for (const process of scheduledProcesses) {
    const scheduledProcess = processedOrder.find(p => p.id === process.id);
    if (scheduledProcess) {
      process.startTime = scheduledProcess.startTime;
      process.energyUsage = scheduledProcess.energyUsage;
      process.turnaroundTime = scheduledProcess.turnaroundTime;
      process.deadline = process.arrivalTime + process.burstTime + 5;
      process.mlfqData = {
        initialQueue: process.initialQueue,
        turnaroundTime: scheduledProcess.turnaroundTime
      };
    }
  }
  
  scheduledProcesses.sort((a, b) => a.startTime - b.startTime);
  
  return scheduledProcesses;
}`,
    // Additional algorithms abbreviated for space
    dpm: `export function dynamicPowerManagement(processes) {
  // Implementation details...
}`,
    timeout: `export function timeoutBasedSleep(processes) {
  // Implementation details...
}`,
    history: `export function historyBasedSleep(processes) {
  // Implementation details...
}`,
    tickless: `export function ticklessKernel(processes) {
  // Implementation details...
}`,
    eas: `export function energyAwareScheduler(processes) {
  // Implementation details...
}`,
    biglittle: `export function bigLittleOptimization(processes) {
  // Implementation details...
}`,
    ml: `export function mlBasedScheduler(processes) {
  // Implementation details...
}`,
    rl: `export function reinforcementLearningScheduler(processes) {
  // Implementation details...
}`,
    rms: `export function rateMonotonicScheduling(processes) {
  // Implementation details...
}`
  };
  
  // Descriptions for each algorithm
  const algorithmDescriptions = {
    edf: "Prioritizes processes with earlier deadlines and adjusts energy usage based on slack time. More slack means lower energy consumption.",
    race: "Executes processes at maximum speed to finish quickly and enter low-power idle state earlier, trading higher active power for longer idle periods.",
    dvfs: "Dynamically adjusts processor voltage and frequency based on workload demands to optimize energy efficiency.",
    eerr: "Modified round robin algorithm that groups similar tasks to reduce frequency switching overhead.",
    ondemand: "DVFS governor that rapidly increases frequency when load is high and gradually decreases it when load is low.",
    conservative: "DVFS governor that changes frequency more gradually with smoother transitions between states.",
    userspace: "DVFS governor that allows processes to request specific frequencies based on their needs.",
    dpm: "Places CPU cores into sleep states during idle periods to save power.",
    timeout: "Uses fixed timeout thresholds to determine when to enter sleep states.",
    history: "Predicts future idle periods based on historical patterns to optimize sleep decisions.",
    tickless: "Removes periodic timer interrupts to allow deeper sleep states for longer periods.",
    eas: "Combines task characteristics with CPU energy models to place tasks on optimal cores.",
    biglittle: "Specialized for heterogeneous architectures with different CPU core types (big.LITTLE).",
    ml: "Uses machine learning models to predict optimal CPU settings for different workloads.",
    rl: "Uses reinforcement learning to adapt scheduling decisions based on feedback.",
    rms: "Prioritizes tasks with shorter periods with energy-aware extensions.",
    mlfq: "Uses multiple priority queues with energy considerations for different task types."
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-center text-emerald-400 mb-2">
            Algorithm Code Library
          </h1>
          <p className="text-center text-zinc-400 max-w-2xl mx-auto">
            Explore the implementation of various energy-efficient CPU scheduling algorithms used in this simulator
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <motion.div 
            className="lg:col-span-1 bg-zinc-900 p-4 rounded-xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold mb-4 text-emerald-400">Algorithms</h2>
            <div className="space-y-1 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin">
              {algorithms.map(algo => (
                <button
                  key={algo.id}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors text-sm ${
                    selectedAlgorithm === algo.id 
                      ? 'bg-emerald-900/30 text-emerald-400' 
                      : 'hover:bg-zinc-800 text-zinc-300'
                  }`}
                  onClick={() => setSelectedAlgorithm(algo.id)}
                >
                  {algo.name}
                </button>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            className="lg:col-span-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
              <div className="border-b border-zinc-800 px-6 py-4">
                <h3 className="text-xl font-semibold text-emerald-400">
                  {algorithms.find(a => a.id === selectedAlgorithm)?.name}
                </h3>
                <p className="text-zinc-400 mt-2 text-sm">
                  {algorithmDescriptions[selectedAlgorithm]}
                </p>
              </div>
              
              <div className="p-4">
                <pre className="bg-zinc-950 p-4 rounded-lg overflow-x-auto font-mono text-sm text-zinc-300 max-h-[60vh] overflow-y-auto">
                  <code>{algorithmCode[selectedAlgorithm]}</code>
                </pre>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <footer className="border-t border-zinc-800 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-zinc-500 text-sm">
          Energy-Efficient CPU Scheduling Algorithm Simulator
        </div>
      </footer>
    </div>
  );
} 