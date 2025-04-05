export function generateProcesses(count) {
  const processes = [];
  
  for (let i = 0; i < count; i++) {
    processes.push({
      id: i + 1,
      burstTime: Math.floor(Math.random() * 13) + 3,
      priority: Math.floor(Math.random() * 10),
      arrivalTime: Math.floor(Math.random() * 11),
      startTime: 0,
      deadline: 0,
      energyUsage: 0,
      cpuUtilization: Math.floor(Math.random() * 101),
      isIOBound: Math.random() > 0.7,
      behaviorPattern: Math.floor(Math.random() * 5),
    });
  }
  
  return processes;
}

export function energyAwareEDF(processes) {
  const scheduledProcesses = [...processes];
  
  scheduledProcesses.forEach(process => {
    process.deadline = process.arrivalTime + process.burstTime + Math.floor(process.burstTime * 0.5);
  });
  
  scheduledProcesses.sort((a, b) => a.deadline - b.deadline);
  
  let currentTime = 0;
  let totalEnergyUsed = 0;
  
  scheduledProcesses.forEach(process => {
    process.startTime = Math.max(currentTime, process.arrivalTime);
    currentTime = process.startTime + process.burstTime;
    
    const slack = process.deadline - (process.startTime + process.burstTime);
    process.energyUsage = process.burstTime * (1 - (Math.min(slack, process.burstTime) / (process.burstTime * 2)));
    totalEnergyUsed += process.energyUsage;
    
    // Mark as executed
    process.executed = process.burstTime;
    process.status = 'completed';
  });
  
  return {
    updatedProcesses: scheduledProcesses, 
    energyUsed: totalEnergyUsed,
    completionTime: currentTime
  };
}

export function raceToIdle(processes) {
  const scheduledProcesses = [...processes];
  
  scheduledProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  let currentTime = 0;
  let totalEnergyUsed = 0;
  
  scheduledProcesses.forEach(process => {
    process.startTime = Math.max(currentTime, process.arrivalTime);
    const speedupFactor = 0.8;
    const adjustedBurstTime = Math.max(Math.floor(process.burstTime * speedupFactor), 1);
    
    process.energyUsage = process.burstTime * 1.2;
    totalEnergyUsed += process.energyUsage;
    
    const originalBurstTime = process.burstTime;
    process.burstTime = adjustedBurstTime;
    process.deadline = process.arrivalTime + originalBurstTime + 5;
    
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
}

export function dvfsScheduling(processes) {
  const scheduledProcesses = [...processes];
  
  scheduledProcesses.sort((a, b) => b.priority - a.priority);
  
  let currentTime = 0;
  let totalEnergyUsed = 0;
  
  scheduledProcesses.forEach(process => {
    process.startTime = Math.max(currentTime, process.arrivalTime);
    
    const speedFactor = 0.7 + (process.priority / 10) * 0.6;
    const energyFactor = 0.5 + (process.priority / 10) * 1.0;
    
    const originalBurstTime = process.burstTime;
    process.burstTime = Math.max(Math.ceil(originalBurstTime / speedFactor), 1);
    
    process.energyUsage = originalBurstTime * energyFactor;
    totalEnergyUsed += process.energyUsage;
    
    process.deadline = process.arrivalTime + originalBurstTime + (10 - process.priority);
    
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
}

export function energyEfficientRR(processes) {
  const scheduledProcesses = [...processes];
  
  scheduledProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  const priorityGroups = {};
  let totalEnergyUsed = 0;
  
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
        totalEnergyUsed += process.energyUsage;
        
        process.deadline = process.arrivalTime + process.burstTime + 8;
        
        currentTime = process.startTime + process.burstTime;
        
        // Mark as executed
        process.executed = process.burstTime;
        process.status = 'completed';
        
        resultProcesses.push(process);
      });
    });
  
  return {
    updatedProcesses: resultProcesses,
    energyUsed: totalEnergyUsed,
    completionTime: currentTime
  };
}

export function ondemandGovernor(processes) {
  const scheduledProcesses = [...processes];
  
  scheduledProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  let currentTime = 0;
  let totalEnergyUsed = 0;
  
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
    totalEnergyUsed += process.energyUsage;
    
    process.deadline = process.arrivalTime + originalBurstTime + 5;
    
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
}

export function conservativeGovernor(processes) {
  const scheduledProcesses = [...processes];
  
  scheduledProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  let currentTime = 0;
  let previousUtilization = 50;
  let totalEnergyUsed = 0;
  
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
    totalEnergyUsed += process.energyUsage;
    
    process.deadline = process.arrivalTime + originalBurstTime + 7;
    
    previousUtilization = process.cpuUtilization;
    
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
}

export function userspaceGovernor(processes) {
  const scheduledProcesses = [...processes];
  
  scheduledProcesses.sort((a, b) => b.priority - a.priority);
  
  let currentTime = 0;
  let totalEnergyUsed = 0;
  
  scheduledProcesses.forEach(process => {
    process.startTime = Math.max(currentTime, process.arrivalTime);
    
    const requestedFrequencyFactor = process.isIOBound 
      ? 0.7
      : 0.8 + (process.priority / 10) * 0.6;
    
    const energyFactor = requestedFrequencyFactor * 1.1;
    
    const originalBurstTime = process.burstTime;
    process.burstTime = Math.max(Math.ceil(originalBurstTime / requestedFrequencyFactor), 1);
    process.energyUsage = originalBurstTime * energyFactor;
    totalEnergyUsed += process.energyUsage;
    
    process.deadline = process.arrivalTime + originalBurstTime + 5;
    
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
}

export function dynamicPowerManagement(processes) {
  const scheduledProcesses = [...processes];
  
  scheduledProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  let currentTime = 0;
  let totalIdleTime = 0;
  let totalEnergyUsed = 0;
  
  const timeGroups = {};
  const timeGroupThreshold = 3;
  
  scheduledProcesses.forEach(process => {
    const timeGroup = Math.floor(process.arrivalTime / timeGroupThreshold);
    if (!timeGroups[timeGroup]) {
      timeGroups[timeGroup] = [];
    }
    timeGroups[timeGroup].push(process);
  });
  
  const processedProcesses = [];
  
  Object.keys(timeGroups).sort((a, b) => a - b).forEach(groupKey => {
    const group = timeGroups[groupKey];
    
    const groupStartTime = Math.min(...group.map(p => p.arrivalTime));
    
    if (groupStartTime > currentTime) {
      const idleDuration = groupStartTime - currentTime;
      totalIdleTime += idleDuration;
    }
    
    group.sort((a, b) => a.arrivalTime - b.arrivalTime);
    
    group.forEach(process => {
      process.startTime = Math.max(currentTime, process.arrivalTime);
      
      const idleEnergyReduction = Math.min(totalIdleTime * 0.05, 0.4);
      
      const originalBurstTime = process.burstTime;
      process.energyUsage = originalBurstTime * (1.0 - idleEnergyReduction);
      totalEnergyUsed += process.energyUsage;
      
      process.deadline = process.arrivalTime + originalBurstTime + 5;
      
      currentTime = process.startTime + process.burstTime;
      
      // Mark as executed
      process.executed = process.burstTime;
      process.status = 'completed';
      
      processedProcesses.push(process);
    });
  });
  
  return {
    updatedProcesses: processedProcesses,
    energyUsed: totalEnergyUsed,
    completionTime: currentTime
  };
}

export function timeoutBasedSleep(processes) {
  const scheduledProcesses = [...processes];
  
  scheduledProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  let currentTime = 0;
  const sleepTimeout = 2;
  let totalSleepTime = 0;
  let totalSleepTransitions = 0;
  let totalEnergyUsed = 0;
  
  for (let i = 0; i < scheduledProcesses.length; i++) {
    const process = scheduledProcesses[i];
    const nextProcess = scheduledProcesses[i + 1];
    
    process.startTime = Math.max(currentTime, process.arrivalTime);
    
    const originalBurstTime = process.burstTime;
    process.deadline = process.arrivalTime + originalBurstTime + 5;
    
    currentTime = process.startTime + process.burstTime;
    
    if (nextProcess) {
      const idleTime = nextProcess.arrivalTime - currentTime;
      
      if (idleTime > sleepTimeout) {
        totalSleepTransitions++;
        const transitionOverhead = 0.5;
        const sleepDuration = idleTime - transitionOverhead;
        
        if (sleepDuration > 0) {
          totalSleepTime += sleepDuration;
          currentTime = nextProcess.arrivalTime;
        }
      }
    }
    
    const sleepEnergyReduction = Math.max(0, (totalSleepTime * 0.1) - (totalSleepTransitions * 0.05));
    process.energyUsage = originalBurstTime * (1.0 - Math.min(sleepEnergyReduction, 0.3));
    totalEnergyUsed += process.energyUsage;
    
    // Mark as executed
    process.executed = process.burstTime;
    process.status = 'completed';
  }
  
  return {
    updatedProcesses: scheduledProcesses,
    energyUsed: totalEnergyUsed,
    completionTime: currentTime
  };
}

export function historyBasedSleep(processes) {
  const scheduledProcesses = [...processes];
  
  scheduledProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  let currentTime = 0;
  const idleHistory = [];
  const historySize = 3;
  let totalSleepTime = 0;
  let totalEnergyUsed = 0;
  
  for (let i = 0; i < scheduledProcesses.length; i++) {
    const process = scheduledProcesses[i];
    const nextProcess = scheduledProcesses[i + 1];
    
    process.startTime = Math.max(currentTime, process.arrivalTime);
    
    const originalBurstTime = process.burstTime;
    process.deadline = process.arrivalTime + originalBurstTime + 5;
    
    currentTime = process.startTime + process.burstTime;
    
    if (nextProcess) {
      const idleTime = nextProcess.arrivalTime - currentTime;
      
      idleHistory.push(idleTime);
      if (idleHistory.length > historySize) {
        idleHistory.shift();
      }
      
      const avgIdleTime = idleHistory.reduce((sum, time) => sum + time, 0) / idleHistory.length;
      
      if (idleTime > avgIdleTime && idleTime > 1) {
        const predictedSleepTime = idleTime * 0.8;
        totalSleepTime += predictedSleepTime;
        
        currentTime += predictedSleepTime;
      }
    }
    
    const sleepEnergyReduction = totalSleepTime * 0.08;
    process.energyUsage = originalBurstTime * (1.0 - Math.min(sleepEnergyReduction, 0.35));
    totalEnergyUsed += process.energyUsage;
    
    // Mark as executed
    process.executed = process.burstTime;
    process.status = 'completed';
  }
  
  return {
    updatedProcesses: scheduledProcesses,
    energyUsed: totalEnergyUsed,
    completionTime: currentTime
  };
}

export function ticklessKernel(processes) {
  const scheduledProcesses = [...processes];
  
  scheduledProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  let currentTime = 0;
  let totalDeepSleepTime = 0;
  let totalEnergyUsed = 0;
  
  for (let i = 0; i < scheduledProcesses.length; i++) {
    const process = scheduledProcesses[i];
    const nextProcess = scheduledProcesses[i + 1];
    
    process.startTime = Math.max(currentTime, process.arrivalTime);
    
    const originalBurstTime = process.burstTime;
    process.deadline = process.arrivalTime + originalBurstTime + 5;
    
    currentTime = process.startTime + process.burstTime;
    
    if (nextProcess) {
      const idleTime = nextProcess.arrivalTime - currentTime;
      
      if (idleTime > 0) {
        totalDeepSleepTime += idleTime;
        
        currentTime = nextProcess.arrivalTime;
      }
    }
    
    const deepSleepEnergyReduction = totalDeepSleepTime * 0.12;
    process.energyUsage = originalBurstTime * (1.0 - Math.min(deepSleepEnergyReduction, 0.5));
    totalEnergyUsed += process.energyUsage;
    
    // Mark as executed
    process.executed = process.burstTime;
    process.status = 'completed';
  }
  
  return {
    updatedProcesses: scheduledProcesses,
    energyUsed: totalEnergyUsed,
    completionTime: currentTime
  };
}

export function energyAwareScheduler(processes) {
  const scheduledProcesses = [...processes];
  
  const cpuCores = [
    { id: 1, type: 'little', energyFactor: 0.6, speedFactor: 0.7 },
    { id: 2, type: 'little', energyFactor: 0.6, speedFactor: 0.7 },
    { id: 3, type: 'little', energyFactor: 0.6, speedFactor: 0.7 },
    { id: 4, type: 'little', energyFactor: 0.6, speedFactor: 0.7 },
    { id: 5, type: 'big', energyFactor: 1.2, speedFactor: 1.3 },
    { id: 6, type: 'big', energyFactor: 1.2, speedFactor: 1.3 },
    { id: 7, type: 'big', energyFactor: 1.2, speedFactor: 1.3 },
    { id: 8, type: 'big', energyFactor: 1.2, speedFactor: 1.3 }
  ];
  
  scheduledProcesses.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return a.arrivalTime - b.arrivalTime;
  });
  
  const coreAvailableTimes = cpuCores.map(() => 0);
  
  const processCoreMappings = {};
  let totalEnergyUsed = 0;
  let maxCompletionTime = 0;
  
  scheduledProcesses.forEach(process => {
    let bestCoreIdx;
    
    if (process.priority >= 7 || !process.isIOBound) {
      const bigCores = cpuCores.map((core, idx) => ({ core, idx })).filter(c => c.core.type === 'big');
      bestCoreIdx = bigCores.reduce((best, current) => 
        coreAvailableTimes[current.idx] < coreAvailableTimes[best.idx] ? current : best, bigCores[0]).idx;
    } else {
      const littleCores = cpuCores.map((core, idx) => ({ core, idx })).filter(c => c.core.type === 'little');
      bestCoreIdx = littleCores.reduce((best, current) => 
        coreAvailableTimes[current.idx] < coreAvailableTimes[best.idx] ? current : best, littleCores[0]).idx;
    }
    
    const core = cpuCores[bestCoreIdx];
    processCoreMappings[process.id] = core.id;
    
    process.startTime = Math.max(process.arrivalTime, coreAvailableTimes[bestCoreIdx]);
    
    const originalBurstTime = process.burstTime;
    process.burstTime = Math.max(Math.ceil(originalBurstTime / core.speedFactor), 1);
    
    process.energyUsage = originalBurstTime * core.energyFactor;
    totalEnergyUsed += process.energyUsage;
    
    process.deadline = process.arrivalTime + originalBurstTime + 5;
    
    coreAvailableTimes[bestCoreIdx] = process.startTime + process.burstTime;
    maxCompletionTime = Math.max(maxCompletionTime, coreAvailableTimes[bestCoreIdx]);
    
    process.assignedCore = core.id;
    process.coreType = core.type;
    
    // Mark as executed
    process.executed = process.burstTime;
    process.status = 'completed';
  });
  
  return {
    updatedProcesses: scheduledProcesses,
    energyUsed: totalEnergyUsed,
    completionTime: maxCompletionTime
  };
}

export function bigLittleOptimization(processes) {
  const scheduledProcesses = [...processes];
  
  const clusters = {
    big: {
      cores: 4,
      speedFactor: 1.5,
      energyFactor: 1.4,
      availableTimes: [0, 0, 0, 0]
    },
    little: {
      cores: 4,
      speedFactor: 0.7,
      energyFactor: 0.5,
      availableTimes: [0, 0, 0, 0]
    }
  };
  
  scheduledProcesses.forEach(process => {
    process.computeIntensive = process.priority > 5 || process.cpuUtilization > 70;
    
    process.phases = [
      { duration: 0.2, cluster: 'big' },
      { 
        duration: 0.6, 
        cluster: process.computeIntensive ? 'big' : 'little'
      },
      { duration: 0.2, cluster: 'little' }
    ];
  });
  
  scheduledProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  let totalEnergyUsed = 0;
  let maxCompletionTime = 0;
  
  scheduledProcesses.forEach(process => {
    let currentTime = process.arrivalTime;
    let totalEnergy = 0;
    let totalAdjustedBurstTime = 0;
    
    process.phases.forEach(phase => {
      const phaseDuration = process.burstTime * phase.duration;
      const cluster = clusters[phase.cluster];
      
      const coreIdx = cluster.availableTimes.indexOf(Math.min(...cluster.availableTimes));
      
      const phaseStartTime = Math.max(currentTime, cluster.availableTimes[coreIdx]);
      
      const adjustedPhaseDuration = phaseDuration / cluster.speedFactor;
      
      cluster.availableTimes[coreIdx] = phaseStartTime + adjustedPhaseDuration;
      maxCompletionTime = Math.max(maxCompletionTime, cluster.availableTimes[coreIdx]);
      
      currentTime = phaseStartTime + adjustedPhaseDuration;
      
      totalEnergy += phaseDuration * cluster.energyFactor;
      totalAdjustedBurstTime += adjustedPhaseDuration;
    });
    
    process.startTime = process.arrivalTime;
    process.burstTime = totalAdjustedBurstTime;
    process.energyUsage = totalEnergy;
    totalEnergyUsed += totalEnergy;
    process.deadline = process.arrivalTime + process.burstTime + 5;
    
    // Mark as executed
    process.executed = process.burstTime;
    process.status = 'completed';
  });
  
  return {
    updatedProcesses: scheduledProcesses,
    energyUsed: totalEnergyUsed,
    completionTime: maxCompletionTime
  };
}

export function mlBasedScheduler(processes) {
  const scheduledProcesses = [...processes];
  
  scheduledProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  let currentTime = 0;
  let totalEnergyUsed = 0;
  
  scheduledProcesses.forEach(process => {
    const features = {
      priority: process.priority / 10,
      cpuUtilization: process.cpuUtilization / 100,
      isIOBound: process.isIOBound ? 1 : 0,
      burstTime: Math.min(process.burstTime / 10, 1),
      behaviorPattern: process.behaviorPattern / 4,
    };
    
    const predictedOptimalFrequency = 
      (features.priority * 0.4) + 
      (features.cpuUtilization * 0.3) - 
      (features.isIOBound * 0.2) + 
      (features.burstTime * 0.1) + 
      (features.behaviorPattern * 0.1);
    
    const frequencyFactor = 0.6 + (predictedOptimalFrequency * 0.8);
    
    const predictedEnergyEfficiency = 
      (1 - features.priority) * 0.3 + 
      (features.isIOBound) * 0.3 + 
      (1 - features.cpuUtilization) * 0.4;
    
    const energyFactor = 0.5 + ((1 - predictedEnergyEfficiency) * 1.0);
    
    process.startTime = Math.max(currentTime, process.arrivalTime);
    
    const originalBurstTime = process.burstTime;
    process.burstTime = Math.max(Math.ceil(originalBurstTime / frequencyFactor), 1);
    
    process.energyUsage = originalBurstTime * energyFactor;
    totalEnergyUsed += process.energyUsage;
    
    process.deadline = process.arrivalTime + originalBurstTime + 5;
    
    process.mlPredictions = {
      optimalFrequency: Math.round(frequencyFactor * 100) / 100,
      energyEfficiency: Math.round(predictedEnergyEfficiency * 100) / 100
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
}

export function reinforcementLearningScheduler(processes) {
  const scheduledProcesses = [...processes];
  
  scheduledProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  let currentTime = 0;
  let prevDecisionOutcome = 0.5;
  let totalEnergyUsed = 0;
  
  for (let i = 0; i < scheduledProcesses.length; i++) {
    const process = scheduledProcesses[i];
    
    process.startTime = Math.max(currentTime, process.arrivalTime);
    
    const state = {
      processType: process.isIOBound ? 'io' : 'cpu',
      priority: process.priority,
      utilization: process.cpuUtilization,
      timeOfDay: (process.arrivalTime % 24),
      prevOutcome: prevDecisionOutcome
    };
    
    let frequencyLevel, voltageReduction;
    
    if (state.prevOutcome < 0.3) {
      frequencyLevel = 0.9;
      voltageReduction = 0.1;
    } else if (state.processType === 'io') {
      frequencyLevel = 0.6 + (state.priority / 20);
      voltageReduction = 0.3 - (state.priority / 30);
    } else {
      frequencyLevel = 0.8 + (state.priority / 10);
      voltageReduction = 0.2 - (state.priority / 50);
    }
    
    const originalBurstTime = process.burstTime;
    process.burstTime = Math.max(Math.ceil(originalBurstTime / frequencyLevel), 1);
    
    const voltageEnergyFactor = 1 - voltageReduction*voltageReduction;
    const frequencyEnergyFactor = frequencyLevel;
    const energyFactor = voltageEnergyFactor * frequencyEnergyFactor;
    
    process.energyUsage = originalBurstTime * energyFactor;
    totalEnergyUsed += process.energyUsage;
    
    process.deadline = process.arrivalTime + originalBurstTime + 5;
    
    currentTime = process.startTime + process.burstTime;
    
    const energyEfficiency = 1 - (process.energyUsage / originalBurstTime);
    const speedFactor = originalBurstTime / process.burstTime;
    
    prevDecisionOutcome = (energyEfficiency * 0.7) + (speedFactor * 0.3);
    
    process.rlData = {
      frequencyLevel: Math.round(frequencyLevel * 100) / 100,
      voltageReduction: Math.round(voltageReduction * 100) / 100,
      reward: Math.round(prevDecisionOutcome * 100) / 100
    };
    
    // Mark as executed
    process.executed = process.burstTime;
    process.status = 'completed';
  }
  
  return {
    updatedProcesses: scheduledProcesses,
    energyUsed: totalEnergyUsed,
    completionTime: currentTime
  };
}

export function rateMonotonicScheduling(processes) {
  const scheduledProcesses = [...processes];
  
  scheduledProcesses.forEach(process => {
    const priorityFactor = 1 - (process.priority / 10);
    process.period = Math.max(5, Math.round(process.burstTime * (1 + priorityFactor)));
    
    process.utilization = process.burstTime / process.period;
    
    process.deadline = process.period;
  });
  
  scheduledProcesses.sort((a, b) => a.period - b.period);
  
  const n = scheduledProcesses.length;
  const utilizationBound = n * (Math.pow(2, 1/n) - 1);
  
  const totalUtilization = scheduledProcesses.reduce(
    (sum, process) => sum + process.utilization, 0
  );
  
  let currentTime = 0;
  let totalEnergyUsed = 0;
  
  scheduledProcesses.forEach(process => {
    process.startTime = Math.max(currentTime, process.arrivalTime);
    
    const utilizationRatio = totalUtilization / utilizationBound;
    const energyEfficiencyFactor = utilizationRatio <= 1.0 ?
      0.7 :
      0.9;
    
    process.energyUsage = process.burstTime * energyEfficiencyFactor;
    totalEnergyUsed += process.energyUsage;
    
    currentTime = process.startTime + process.burstTime;
    
    // Mark as executed
    process.executed = process.burstTime;
    process.status = 'completed';
    
    // Add RMS data for visualization
    process.rmsData = {
      period: process.period,
      utilization: process.utilization
    };
  });
  
  return {
    updatedProcesses: scheduledProcesses,
    energyUsed: totalEnergyUsed,
    completionTime: currentTime
  };
}

export function multilevelFeedbackQueue(processes) {
  const scheduledProcesses = [...processes];
  let totalEnergyUsed = 0;
  
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
      
      totalEnergyUsed += process.energyUsage;
    }
  }
  
  scheduledProcesses.sort((a, b) => a.startTime - b.startTime);
  
  return {
    updatedProcesses: scheduledProcesses,
    energyUsed: totalEnergyUsed,
    completionTime: currentTime
  };
}

export function getSchedulingAlgorithm(algorithmType) {
  switch (algorithmType) {
    case 'edf':
      return energyAwareEDF;
    case 'race':
      return raceToIdle;
    case 'dvfs':
      return dvfsScheduling;
    case 'eerr':
      return energyEfficientRR;
    
    case 'ondemand':
      return ondemandGovernor;
    case 'conservative':
      return conservativeGovernor;
    case 'userspace':
      return userspaceGovernor;
    
    case 'dpm':
      return dynamicPowerManagement;
    case 'timeout':
      return timeoutBasedSleep;
    case 'history':
      return historyBasedSleep;
    case 'tickless':
      return ticklessKernel;
      
    case 'eas':
      return energyAwareScheduler;
    case 'biglittle':
      return bigLittleOptimization;
      
    case 'ml':
      return mlBasedScheduler;
    case 'rl':
      return reinforcementLearningScheduler;
    
    case 'rms':
      return rateMonotonicScheduling;
    case 'mlfq':
      return multilevelFeedbackQueue;
      
    default:
      return energyAwareEDF;
  }
}