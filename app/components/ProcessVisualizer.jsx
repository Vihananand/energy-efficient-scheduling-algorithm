"use client";

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ProcessVisualizer({ processes, algorithm, isRunning }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [completedProcesses, setCompletedProcesses] = useState([]);
  const [energyUsed, setEnergyUsed] = useState(0);
  const [progressColors, setProgressColors] = useState([]);
  
  // Reset everything when we get new processes
  useEffect(() => {
    setCurrentTime(0);
    setCompletedProcesses([]);
    setEnergyUsed(0);
  }, [processes]);
  
  useEffect(() => {
    const colors = processes.map(() => {
      const hue = Math.floor(Math.random() * 360);
      return `hsl(${hue}, 80%, 65%)`;
    });
    setProgressColors(colors);
  }, [processes]);
  
  // Simulation running effect
  useEffect(() => {
    if (!isRunning || processes.length === 0) return;
    
    let intervalId;
    let localTime = currentTime;
    let localEnergyUsed = energyUsed;
    
    const runSimulation = () => {
      intervalId = setInterval(() => {
        localTime += 1;
        
        // Check if any processes are completed at this time
        const newlyCompleted = processes.filter(p => 
          !completedProcesses.includes(p.id) && 
          localTime >= p.startTime + p.burstTime
        );
        
        if (newlyCompleted.length > 0) {
          setCompletedProcesses(prev => [...prev, ...newlyCompleted.map(p => p.id)]);
          
          // Calculate energy used
          const energyForNewlyCompleted = newlyCompleted.reduce((total, p) => {
            return total + calculateEnergyUsage(p, algorithm);
          }, 0);
          
          localEnergyUsed += energyForNewlyCompleted;
          setEnergyUsed(localEnergyUsed);
        }
        
        setCurrentTime(localTime);
        
        // Stop simulation when all processes are completed
        if (completedProcesses.length + newlyCompleted.length === processes.length) {
          clearInterval(intervalId);
        }
      }, 1000);
    };
    
    runSimulation();
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, processes, completedProcesses, currentTime, algorithm, energyUsed]);
  
  // Calculate energy usage based on algorithm and process
  const calculateEnergyUsage = (process, algorithm) => {
    // If the process already has energy usage calculated by the algorithm, use that
    if (process.energyUsage !== undefined && process.energyUsage > 0) {
      return process.energyUsage;
    }
    
    const { burstTime, priority } = process;
    
    // Different algorithms have different energy profiles
    switch(algorithm) {
      case 'edf':
        return burstTime * 0.7; // Lower energy usage due to deadline-based optimization
      case 'race':
        return burstTime * 0.9; // Slightly more energy efficient
      case 'dvfs':
        return burstTime * (0.5 + (priority / 10)); // Energy usage based on process priority
      case 'eerr':
        return burstTime * 0.8; // Round robin with energy efficiency
      case 'ondemand':
        return burstTime * (process.cpuUtilization > 70 ? 1.2 : 0.8); // High power when needed
      case 'conservative':
        return burstTime * 0.85; // Consistent moderate power usage
      case 'userspace':
        return burstTime * (process.isIOBound ? 0.7 : 0.9); // Application controlled
      case 'dpm':
        return burstTime * 0.65; // Sleep states save power
      case 'timeout':
        return burstTime * 0.75; // Basic sleep with some overhead
      case 'history':
        return burstTime * 0.7; // Better sleep predictions
      case 'tickless':
        return burstTime * 0.6; // Deep sleep states
      case 'eas':
        return burstTime * (process.isIOBound ? 0.6 : 0.85); // Task-specific core selection
      case 'biglittle':
        return burstTime * (priority > 7 ? 1.1 : 0.5); // Different core types
      case 'ml':
        return burstTime * 0.65; // ML optimized power settings
      case 'rl':
        return burstTime * 0.62; // Self-improving power settings
      case 'rms':
        return burstTime * 0.75; // Rate monotonic with energy extensions
      case 'mlfq':
        return burstTime * 0.8; // Multi-level queue
      default:
        return burstTime * 1.0; // Standard energy usage
    }
  };
  
  // Get a color based on process priority (higher priority = more intense)
  const getProcessColor = (priority) => {
    const colors = [
      'bg-emerald-400', // Low priority (most energy efficient)
      'bg-emerald-500',
      'bg-blue-500',
      'bg-blue-600',
      'bg-indigo-500',
      'bg-indigo-600',
      'bg-purple-500',
      'bg-purple-600',
      'bg-fuchsia-500',
      'bg-fuchsia-600', // High priority (least energy efficient)
    ];
    
    return colors[Math.min(priority, colors.length - 1)];
  };
  
  // Get algorithm-specific process details
  const getAlgorithmSpecificDetails = (process) => {
    switch(algorithm) {
      case 'edf':
        return process.edfData ? (
          <div className="text-sm mt-1">
            <span className="text-emerald-400">Deadline:</span> {process.edfData.deadline} | 
            <span className="text-emerald-400"> Laxity:</span> {process.edfData.laxity}
          </div>
        ) : null;
      
      case 'dvfs':
      case 'ondemand':
      case 'conservative':
      case 'userspace':
        return process.dvfsData ? (
          <div className="text-sm mt-1">
            <span className="text-emerald-400">Frequency:</span> {process.dvfsData.frequency} MHz | 
            <span className="text-emerald-400"> Voltage:</span> {process.dvfsData.voltage}V
          </div>
        ) : null;
      
      case 'dpm':
      case 'timeout':
      case 'history':
      case 'tickless':
        return process.dpmData ? (
          <div className="text-sm mt-1">
            <span className="text-emerald-400">Sleep State:</span> {process.dpmData.sleepState} | 
            <span className="text-emerald-400"> Wake Count:</span> {process.dpmData.wakeCount}
          </div>
        ) : null;
      
      case 'eas':
      case 'biglittle':
        return process.easData ? (
          <div className="text-sm mt-1">
            <span className="text-emerald-400">Core Type:</span> {process.easData.coreType} | 
            <span className="text-emerald-400"> Energy Impact:</span> {process.easData.energyImpact.toFixed(2)}
          </div>
        ) : null;
      
      case 'ml':
      case 'rl':
        return process.mlData ? (
          <div className="text-sm mt-1">
            <span className="text-emerald-400">Confidence:</span> {(process.mlData.confidence * 100).toFixed(1)}% | 
            <span className="text-emerald-400"> Power State:</span> {process.mlData.powerState}
          </div>
        ) : null;
      
      case 'mlfq':
        return process.mlfqData ? (
          <div className="text-sm mt-1">
            <span className="text-emerald-400">Initial Queue:</span> {process.mlfqData.initialQueue} | 
            <span className="text-emerald-400"> Turnaround:</span> {process.mlfqData.turnaroundTime}
          </div>
        ) : null;
        
      case 'rms':
        return process.rmsData ? (
          <div className="text-sm mt-1">
            <span className="text-emerald-400">Period:</span> {process.rmsData.period} | 
            <span className="text-emerald-400"> Utilization:</span> {process.rmsData.utilization.toFixed(2)}
          </div>
        ) : null;
      
      default:
        return null;
    }
  };

  if (processes.length === 0) {
    return (
      <div className="bg-zinc-900 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-emerald-400 mb-4">Process Visualization</h2>
        <div className="py-8 text-center text-zinc-500">
          No processes to display. Configure the simulation first.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-emerald-400 mb-4">Process Visualization</h2>
      
      {isRunning ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500 border-opacity-50"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {processes.map((process, index) => {
            // Calculate execution progress percentage
            const progressPercent = process.status === 'completed' ? 100 : 
                process.executed ? Math.min(100, (process.executed / process.burstTime) * 100) : 0;
            
            return (
              <div key={process.id} className="bg-zinc-800 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <div className="font-medium">Process {process.id}</div>
                  <div className="text-zinc-400">
                    {process.status === 'completed' ? (
                      <span className="text-emerald-400">Completed</span>
                    ) : (
                      <span>Waiting</span>
                    )}
                  </div>
                </div>
                
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Burst Time: {process.burstTime}s</span>
                    <span>Priority: {process.priority}</span>
                  </div>
                  
                  <div className="w-full bg-zinc-700 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full transition-all duration-300" 
                      style={{ 
                        width: `${progressPercent}%`,
                        backgroundColor: progressColors[index] || 'rgb(52, 211, 153)'
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-zinc-400">Start Time:</span> {process.startTime || 0}s
                  </div>
                  <div>
                    <span className="text-zinc-400">Arrival Time:</span> {process.arrivalTime || 0}s
                  </div>
                  <div>
                    <span className="text-zinc-400">Energy Usage:</span> {process.energyUsage ? process.energyUsage.toFixed(2) : '0.00'} units
                  </div>
                  <div>
                    <span className="text-zinc-400">Deadline:</span> {process.deadline || 'N/A'}
                  </div>
                </div>
                
                {getAlgorithmSpecificDetails(process)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 