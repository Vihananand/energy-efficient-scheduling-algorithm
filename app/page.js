"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import ProcessForm from './components/ProcessForm';
import ProcessVisualizer from './components/ProcessVisualizer';
import AlgorithmMetrics from './components/AlgorithmMetrics';
import { 
  energyAwareEDF,
  raceToIdle,
  dvfsScheduling,
  energyEfficientRR,
  ondemandGovernor,
  conservativeGovernor,
  userspaceGovernor,
  dynamicPowerManagement,
  timeoutBasedSleep,
  historyBasedSleep,
  ticklessKernel,
  energyAwareScheduler,
  bigLittleOptimization,
  mlBasedScheduler,
  reinforcementLearningScheduler,
  rateMonotonicScheduling,
  multilevelFeedbackQueue
} from './utils/schedulingAlgorithms';

export default function Home() {
  const [processes, setProcesses] = useState([]);
  const [algorithm, setAlgorithm] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [metrics, setMetrics] = useState({ energyUsed: 0, completionTime: 0 });

  const handleFormSubmit = (count, algo) => {
    setAlgorithm(algo);
    
    const newProcesses = Array.from({ length: count }, (_, i) => {
      const burstTime = Math.floor(Math.random() * 10) + 1;
      
      const baseProcess = {
        id: i + 1,
        burstTime,
        executed: 0,
        status: 'waiting',
        energyUsage: 0,
        arrivalTime: Math.floor(Math.random() * 5),
        priority: Math.floor(Math.random() * 10)
      };
      
      switch(algo) {
        case 'edf':
          return {
            ...baseProcess,
            edfData: {
              deadline: Math.floor(Math.random() * 15) + burstTime,
              laxity: Math.floor(Math.random() * 5)
            }
          };
        
        case 'dvfs':
        case 'ondemand':
        case 'conservative':
        case 'userspace':
          return {
            ...baseProcess,
            dvfsData: {
              frequency: (Math.floor(Math.random() * 20) + 10) * 100,
              voltage: (Math.random() * 0.6 + 0.8).toFixed(1)
            }
          };
        
        case 'dpm':
        case 'timeout':
        case 'history':
        case 'tickless':
          return {
            ...baseProcess,
            dpmData: {
              sleepState: ['C0', 'C1', 'C2', 'C3'][Math.floor(Math.random() * 4)],
              wakeCount: Math.floor(Math.random() * 5)
            }
          };
        
        case 'eas':
        case 'biglittle':
          return {
            ...baseProcess,
            easData: {
              coreType: Math.random() > 0.5 ? 'big' : 'LITTLE',
              energyImpact: Math.random() * 5
            }
          };
        
        case 'ml':
        case 'rl':
          return {
            ...baseProcess,
            mlData: {
              confidence: Math.random(),
              powerState: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)]
            }
          };
          
        case 'mlfq':
          return {
            ...baseProcess,
            initialQueue: Math.floor(Math.random() * 3),
            mlfqData: {
              initialQueue: Math.floor(Math.random() * 3),
              turnaroundTime: Math.floor(Math.random() * 10) + burstTime
            }
          };
        
        case 'rms':
          return {
            ...baseProcess,
            rmsData: {
              period: Math.floor(Math.random() * 10) + burstTime,
              utilization: Math.random() * 0.5 + 0.1
            }
          };
        
        default:
          return baseProcess;
      }
    });
    
    setProcesses(newProcesses);
    setMetrics({ energyUsed: 0, completionTime: 0 });
  };
  
  const runSimulation = async () => {
    if (processes.length === 0 || isRunning) return;
    
    setIsRunning(true);
    
    // Map algorithm ID to the actual function
    const algorithmFunctions = {
      'edf': energyAwareEDF,
      'race': raceToIdle,
      'dvfs': dvfsScheduling,
      'eerr': energyEfficientRR,
      'ondemand': ondemandGovernor, 
      'conservative': conservativeGovernor,
      'userspace': userspaceGovernor,
      'dpm': dynamicPowerManagement,
      'timeout': timeoutBasedSleep,
      'history': historyBasedSleep,
      'tickless': ticklessKernel,
      'eas': energyAwareScheduler,
      'biglittle': bigLittleOptimization,
      'ml': mlBasedScheduler,
      'rl': reinforcementLearningScheduler,
      'rms': rateMonotonicScheduling,
      'mlfq': multilevelFeedbackQueue
    };
    
    const algorithmFunction = algorithmFunctions[algorithm] || energyAwareEDF;
    
    try {
      // Process the copy of the processes array
      const simulationProcesses = [...processes].map(p => ({
        ...p,
        executed: 0,
        status: 'waiting'
      }));
      
      // Run the simulation
      const result = await algorithmFunction(simulationProcesses);
      
      if (result && typeof result === 'object') {
        const { updatedProcesses, energyUsed, completionTime } = result;
        
        // Mark all processes as executed and completed
        const completedProcesses = updatedProcesses.map(p => ({
          ...p,
          executed: p.burstTime,
          status: 'completed'
        }));
        
        setProcesses(completedProcesses);
        setMetrics({ 
          energyUsed: energyUsed || 0, 
          completionTime: completionTime || 0 
        });
      }
    } catch (error) {
      console.error("Simulation error:", error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-black text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <motion.h1
          className="text-3xl font-bold text-center mb-8 text-emerald-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Energy-Efficient CPU Scheduling Simulator
        </motion.h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {processes.length === 0 ? (
            <div className="col-span-full">
              <ProcessForm onSubmit={handleFormSubmit} />
            </div>
          ) : (
            <>
              <div className="lg:col-span-1">
                <div className="bg-zinc-900 rounded-xl p-6 shadow-lg">
                  <h2 className="text-xl font-semibold text-emerald-400 mb-4">Scheduling Controls</h2>
                  
                  {!isRunning && (
                    <button
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white font-medium mb-4 transition-colors"
                      onClick={runSimulation}
                      disabled={isRunning}
                    >
                      Run Simulation
                    </button>
                  )}
                  
                  <button
                    className="w-full py-3 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-white font-medium transition-colors"
                    onClick={() => {
                      setProcesses([]);
                      setAlgorithm('');
                      setIsRunning(false);
                    }}
                  >
                    Reset
                  </button>
                  
                  <div className="mt-6">
                    <h3 className="font-medium text-zinc-300 mb-2">Algorithm</h3>
                    <div className="bg-zinc-800 px-4 py-2 rounded-lg text-emerald-400">
                      {algorithm}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="font-medium text-zinc-300 mb-2">Processes</h3>
                    <div className="bg-zinc-800 px-4 py-2 rounded-lg text-emerald-400">
                      {processes.length}
                    </div>
                  </div>
                  
                  {metrics.energyUsed > 0 && (
                    <div className="mt-6 bg-zinc-800 p-4 rounded-lg">
                      <h3 className="font-medium text-zinc-300 mb-3">Simulation Results</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-zinc-500">Energy Used</div>
                          <div className="text-emerald-400 font-mono">{metrics.energyUsed.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-zinc-500">Completion Time</div>
                          <div className="text-emerald-400 font-mono">{metrics.completionTime}s</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <ProcessVisualizer 
                  processes={processes} 
                  algorithm={algorithm} 
                  isRunning={isRunning}
                />
              </div>
            </>
          )}
        </div>
      </main>
      
      <footer className="w-full py-4 border-t border-zinc-800">
        <div className="container mx-auto px-4 text-center text-zinc-500 text-sm">
          Energy-Efficient CPU Scheduling Simulator
        </div>
      </footer>
    </div>
  );
}
