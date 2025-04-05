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
    dpm: `export function dynamicPowerManagement(processes) {
  const scheduledProcesses = [...processes];
  
  scheduledProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  let currentTime = 0;
  let totalEnergyUsed = 0;
  let idlePeriods = 0;
  
  scheduledProcesses.forEach(process => {
    process.startTime = Math.max(currentTime, process.arrivalTime);
    
    // Calculate idle time before process
    const idleTime = process.startTime - currentTime;
    if (idleTime > 0) {
      idlePeriods++;
    }
    
    // Calculate energy usage based on process characteristics
    // Lower energy for processes after idle periods
    const powerStateMultiplier = idlePeriods > 2 ? 0.8 : 1.0;
    process.energyUsage = process.burstTime * powerStateMultiplier;
    totalEnergyUsed += process.energyUsage;
    
    // Apply power management strategies
    process.dpmData = {
      sleepState: idleTime > 5 ? 'Deep' : (idleTime > 2 ? 'Light' : 'Active'),
      wakeCount: idlePeriods
    };
    
    process.deadline = process.arrivalTime + process.burstTime + 6;
    currentTime = process.startTime + process.burstTime;
    
    // Mark as executed
    process.executed = process.burstTime;
    process.status = 'completed';
  });
  
  return {
    updatedProcesses: scheduledProcesses,
    energyUsed: totalEnergyUsed,
    completionTime: currentTime
  };
}`,
    timeout: `export function timeoutBasedSleep(processes) {
  const scheduledProcesses = [...processes];
  
  scheduledProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  let currentTime = 0;
  let totalEnergyUsed = 0;
  const timeoutThreshold = 3; // Time units before entering sleep
  
  scheduledProcesses.forEach(process => {
    process.startTime = Math.max(currentTime, process.arrivalTime);
    
    // Calculate idle time before process
    const idleTime = process.startTime - currentTime;
    
    // Apply timeout-based sleep strategy
    let sleepState = 'None';
    let energyFactor = 1.0;
    
    if (idleTime >= timeoutThreshold) {
      sleepState = 'Deep';
      energyFactor = 0.7;
    } else if (idleTime > 0) {
      sleepState = 'Light';
      energyFactor = 0.85;
    }
    
    process.energyUsage = process.burstTime * energyFactor;
    totalEnergyUsed += process.energyUsage;
    
    process.dpmData = {
      sleepState: sleepState,
      wakeCount: sleepState !== 'None' ? 1 : 0
    };
    
    process.deadline = process.arrivalTime + process.burstTime + 5;
    currentTime = process.startTime + process.burstTime;
    
    // Mark as executed
    process.executed = process.burstTime;
    process.status = 'completed';
  });
  
  return {
    updatedProcesses: scheduledProcesses,
    energyUsed: totalEnergyUsed,
    completionTime: currentTime
  };
}`,
    history: `export function historyBasedSleep(processes) {
  const scheduledProcesses = [...processes];
  
  scheduledProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  let currentTime = 0;
  let totalEnergyUsed = 0;
  let idleHistory = []; // Tracks recent idle periods
  
  scheduledProcesses.forEach(process => {
    process.startTime = Math.max(currentTime, process.arrivalTime);
    
    // Calculate idle time before process
    const idleTime = process.startTime - currentTime;
    if (idleTime > 0) {
      idleHistory.push(idleTime);
      if (idleHistory.length > 3) idleHistory.shift();
    }
    
    // Calculate average idle time based on history
    const avgIdleTime = idleHistory.length > 0 
      ? idleHistory.reduce((sum, time) => sum + time, 0) / idleHistory.length 
      : 0;
    
    // Predict sleep state based on history
    let sleepState = 'None';
    let energyFactor = 1.0;
    let wakeCount = 0;
    
    if (avgIdleTime > 5) {
      sleepState = 'Deep';
      energyFactor = 0.65;
      wakeCount = 1;
    } else if (avgIdleTime > 2) {
      sleepState = 'Light';
      energyFactor = 0.8;
      wakeCount = 1;
    }
    
    process.energyUsage = process.burstTime * energyFactor;
    totalEnergyUsed += process.energyUsage;
    
    process.dpmData = {
      sleepState: sleepState,
      wakeCount: wakeCount
    };
    
    process.deadline = process.arrivalTime + process.burstTime + 6;
    currentTime = process.startTime + process.burstTime;
    
    // Mark as executed
    process.executed = process.burstTime;
    process.status = 'completed';
  });
  
  return {
    updatedProcesses: scheduledProcesses,
    energyUsed: totalEnergyUsed,
    completionTime: currentTime
  };
}`,
    tickless: `export function ticklessKernel(processes) {
  const scheduledProcesses = [...processes];
  
  scheduledProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  let currentTime = 0;
  let totalEnergyUsed = 0;
  let tickSavings = 0;
  
  scheduledProcesses.forEach(process => {
    process.startTime = Math.max(currentTime, process.arrivalTime);
    
    // Calculate idle time before process
    const idleTime = process.startTime - currentTime;
    
    // In tickless kernel, longer idle periods save more energy
    if (idleTime > 0) {
      // Each tick we avoid saves energy
      tickSavings += Math.floor(idleTime);
    }
    
    // Apply tickless kernel strategy - processes can use deeper sleep states
    let sleepState = 'None';
    let energyFactor = 1.0;
    
    if (idleTime > 8) {
      sleepState = 'DeepIdle';
      energyFactor = 0.6;
    } else if (idleTime > 4) {
      sleepState = 'PowerDown';
      energyFactor = 0.7;
    } else if (idleTime > 0) {
      sleepState = 'LightSleep';
      energyFactor = 0.85;
    }
    
    // Apply deeper sleep benefit for all processes in tickless system
    const ticklessBonus = 1.0 - (Math.min(tickSavings, 10) * 0.01);
    
    process.energyUsage = process.burstTime * energyFactor * ticklessBonus;
    totalEnergyUsed += process.energyUsage;
    
    process.dpmData = {
      sleepState: sleepState,
      wakeCount: sleepState !== 'None' ? 1 : 0
    };
    
    process.deadline = process.arrivalTime + process.burstTime + 4;
    currentTime = process.startTime + process.burstTime;
    
    // Mark as executed
    process.executed = process.burstTime;
    process.status = 'completed';
  });
  
  return {
    updatedProcesses: scheduledProcesses,
    energyUsed: totalEnergyUsed,
    completionTime: currentTime
  };
}`,
    eas: `export function energyAwareScheduler(processes) {
  const scheduledProcesses = [...processes];
  
  scheduledProcesses.sort((a, b) => a.priority - b.priority);
  
  let currentTime = 0;
  let totalEnergyUsed = 0;
  
  scheduledProcesses.forEach(process => {
    process.startTime = Math.max(currentTime, process.arrivalTime);
    
    // EAS assigns tasks based on energy models
    // Calculate energy impact based on process characteristics
    let coreType = 'medium';
    let energyImpact = 1.0;
    
    if (process.cpuUtilization > 80 || process.priority > 7) {
      coreType = 'performance';
      energyImpact = 1.5;
    } else if (process.cpuUtilization < 40 && process.priority < 4) {
      coreType = 'efficiency';
      energyImpact = 0.6;
    }
    
    // Calculate energy usage based on assigned core
    const energyFactor = coreType === 'performance' ? 1.2 :
                         coreType === 'efficiency' ? 0.7 : 1.0;
    
    process.energyUsage = process.burstTime * energyFactor;
    totalEnergyUsed += process.energyUsage;
    
    process.easData = {
      coreType: coreType,
      energyImpact: energyImpact
    };
    
    process.deadline = process.arrivalTime + process.burstTime + 5;
    currentTime = process.startTime + process.burstTime;
    
    // Mark as executed
    process.executed = process.burstTime;
    process.status = 'completed';
  });
  
  return {
    updatedProcesses: scheduledProcesses,
    energyUsed: totalEnergyUsed,
    completionTime: currentTime
  };
}`,
    biglittle: `export function bigLittleOptimization(processes) {
  const scheduledProcesses = [...processes];
  
  // Sort by a combination of priority and CPU utilization
  scheduledProcesses.sort((a, b) => {
    const aScore = (a.priority * 0.6) + (a.cpuUtilization * 0.4);
    const bScore = (b.priority * 0.6) + (b.cpuUtilization * 0.4);
    return bScore - aScore;
  });
  
  let currentTime = 0;
  let totalEnergyUsed = 0;
  
  // Define big and LITTLE core characteristics
  const cores = {
    big: { powerFactor: 1.8, speedFactor: 2.0, count: 4 },
    LITTLE: { powerFactor: 0.5, speedFactor: 0.8, count: 4 }
  };
  
  let bigCoresInUse = 0;
  let littleCoresInUse = 0;
  
  scheduledProcesses.forEach(process => {
    process.startTime = Math.max(currentTime, process.arrivalTime);
    
    // Decide core type based on process characteristics
    let assignedCore;
    let energyImpact;
    
    if ((process.cpuUtilization > 70 || process.priority > 7) && bigCoresInUse < cores.big.count) {
      assignedCore = 'big';
      bigCoresInUse++;
      energyImpact = 1.6;
    } else {
      assignedCore = 'LITTLE';
      littleCoresInUse++;
      energyImpact = 0.5;
    }
    
    // Calculate energy and time based on core type
    const powerFactor = cores[assignedCore].powerFactor;
    const speedFactor = cores[assignedCore].speedFactor;
    
    const originalBurstTime = process.burstTime;
    process.burstTime = Math.max(Math.ceil(originalBurstTime / speedFactor), 1);
    
    process.energyUsage = originalBurstTime * powerFactor;
    totalEnergyUsed += process.energyUsage;
    
    process.easData = {
      coreType: assignedCore,
      energyImpact: energyImpact
    };
    
    process.deadline = process.arrivalTime + process.burstTime + 
                      (assignedCore === 'LITTLE' ? 8 : 4);
    
    currentTime = process.startTime + process.burstTime;
    
    // Mark as executed
    process.executed = process.burstTime;
    process.status = 'completed';
  });
  
  return {
    updatedProcesses: scheduledProcesses,
    energyUsed: totalEnergyUsed,
    completionTime: currentTime
  };
}`,
    ml: `export function mlBasedScheduler(processes) {
  const scheduledProcesses = [...processes];
  
  scheduledProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  let currentTime = 0;
  let totalEnergyUsed = 0;
  
  // Simulate ML model predictions
  const predictPowerState = (process) => {
    const features = [
      process.burstTime / 10, // Normalized burst time
      process.priority / 10,  // Normalized priority
      process.cpuUtilization / 100, // Normalized utilization
      process.isIOBound ? 1 : 0,
      process.behaviorPattern / 5 // Normalized behavior pattern
    ];
    
    // Simplified ML prediction logic
    const sum = features.reduce((acc, val) => acc + val, 0);
    const avg = sum / features.length;
    
    if (avg > 0.7) return { state: 'High', factor: 1.3, confidence: 0.8 + (Math.random() * 0.2) };
    if (avg < 0.3) return { state: 'Low', factor: 0.6, confidence: 0.7 + (Math.random() * 0.3) };
    return { state: 'Medium', factor: 0.9, confidence: 0.6 + (Math.random() * 0.4) };
  };
  
  scheduledProcesses.forEach(process => {
    process.startTime = Math.max(currentTime, process.arrivalTime);
    
    // Get ML prediction for this process
    const prediction = predictPowerState(process);
    
    // Apply ML prediction to scheduling decision
    const energyFactor = prediction.factor;
    
    process.energyUsage = process.burstTime * energyFactor;
    totalEnergyUsed += process.energyUsage;
    
    process.mlData = {
      confidence: prediction.confidence,
      powerState: prediction.state
    };
    
    process.deadline = process.arrivalTime + process.burstTime + 5;
    currentTime = process.startTime + process.burstTime;
    
    // Mark as executed
    process.executed = process.burstTime;
    process.status = 'completed';
  });
  
  return {
    updatedProcesses: scheduledProcesses,
    energyUsed: totalEnergyUsed,
    completionTime: currentTime
  };
}`,
    rl: `export function reinforcementLearningScheduler(processes) {
  const scheduledProcesses = [...processes];
  
  scheduledProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  let currentTime = 0;
  let totalEnergyUsed = 0;
  
  // Simulate RL agent's Q-table
  const qTable = {
    'high_priority': { 'performance': 0.9, 'balanced': 0.5, 'efficiency': 0.1 },
    'medium_priority': { 'performance': 0.3, 'balanced': 0.8, 'efficiency': 0.4 },
    'low_priority': { 'performance': 0.1, 'balanced': 0.4, 'efficiency': 0.9 }
  };
  
  // RL decision making function
  const chooseAction = (process) => {
    let state;
    if (process.priority >= 7) state = 'high_priority';
    else if (process.priority >= 3) state = 'medium_priority';
    else state = 'low_priority';
    
    // Choose action with highest Q-value
    const actions = qTable[state];
    let bestAction = 'balanced';
    let bestValue = actions['balanced'];
    
    for (const [action, value] of Object.entries(actions)) {
      if (value > bestValue) {
        bestValue = value;
        bestAction = action;
      }
    }
    
    // Add exploration factor for realistic RL behavior
    if (Math.random() < 0.1) {
      const possibleActions = ['performance', 'balanced', 'efficiency'];
      bestAction = possibleActions[Math.floor(Math.random() * possibleActions.length)];
    }
    
    return { action: bestAction, confidence: actions[bestAction] };
  };
  
  scheduledProcesses.forEach(process => {
    process.startTime = Math.max(currentTime, process.arrivalTime);
    
    // Get RL decision for this process
    const decision = chooseAction(process);
    
    // Apply RL decision to energy and timing
    let energyFactor, powerState;
    
    switch (decision.action) {
      case 'performance':
        energyFactor = 1.4;
        powerState = 'High';
        break;
      case 'efficiency':
        energyFactor = 0.7;
        powerState = 'Low';
        break;
      default: // balanced
        energyFactor = 1.0;
        powerState = 'Medium';
    }
    
    process.energyUsage = process.burstTime * energyFactor;
    totalEnergyUsed += process.energyUsage;
    
    process.mlData = {
      confidence: decision.confidence,
      powerState: powerState
    };
    
    process.deadline = process.arrivalTime + process.burstTime + 6;
    currentTime = process.startTime + process.burstTime;
    
    // Mark as executed
    process.executed = process.burstTime;
    process.status = 'completed';
  });
  
  return {
    updatedProcesses: scheduledProcesses,
    energyUsed: totalEnergyUsed,
    completionTime: currentTime
  };
}`,
    rms: `export function rateMonotonicScheduling(processes) {
  const scheduledProcesses = [...processes];
  
  // In RMS, processes with shorter periods get higher priority
  // We'll use a combination of priority and burst time as "period"
  scheduledProcesses.forEach(process => {
    process.period = Math.max(process.burstTime + (10 - process.priority), process.burstTime);
    process.utilization = process.burstTime / process.period;
  });
  
  // Sort by period (rate monotonic principle)
  scheduledProcesses.sort((a, b) => a.period - b.period);
  
  let currentTime = 0;
  let totalEnergyUsed = 0;
  
  // Check schedulability using RMS utilization bound
  const n = scheduledProcesses.length;
  const utilizationBound = n * (Math.pow(2, 1/n) - 1);
  const totalUtilization = scheduledProcesses.reduce((sum, proc) => sum + proc.utilization, 0);
  const isSchedulable = totalUtilization <= utilizationBound;
  
  // Energy-aware RMS uses dynamic voltage scaling when there is slack
  scheduledProcesses.forEach(process => {
    process.startTime = Math.max(currentTime, process.arrivalTime);
    
    // If the task set is schedulable, we can use energy-saving techniques
    let energyFactor;
    if (isSchedulable) {
      // Scale energy usage based on utilization and slack
      const slack = utilizationBound - totalUtilization;
      energyFactor = 1.0 - Math.min(slack * 0.5, 0.4);
    } else {
      // Run at full power if schedulability is at risk
      energyFactor = 1.0;
    }
    
    process.energyUsage = process.burstTime * energyFactor;
    totalEnergyUsed += process.energyUsage;
    
    process.deadline = process.arrivalTime + process.period;
    
    process.rmsData = {
      period: process.period,
      utilization: process.utilization
    };
    
    currentTime = process.startTime + process.burstTime;
    
    // Mark as executed
    process.executed = process.burstTime;
    process.status = 'completed';
  });
  
  return {
    updatedProcesses: scheduledProcesses,
    energyUsed: totalEnergyUsed,
    completionTime: currentTime
  };
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