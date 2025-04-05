import { motion } from 'framer-motion';

export default function AlgorithmMetrics({ algorithm, energyUsed, completionTime }) {
  const algorithmInfo = {
    edf: {
      name: 'Energy-aware Earliest Deadline First',
      description: 'Schedules tasks based on deadlines while optimizing energy usage by adjusting CPU speed.',
      pros: ['Ensures deadline guarantees', 'Balances performance and energy', 'Adjusts dynamically to workload'],
      cons: ['More complex implementation', 'May sacrifice some performance for energy savings']
    },
    race: {
      name: 'Race-to-Idle',
      description: 'Runs tasks at maximum speed to finish quickly, then enters low-power idle state.',
      pros: ['Simple to implement', 'Maximizes idle time', 'Effective for bursty workloads'],
      cons: ['High peak power consumption', 'Not optimal for all workload types', 'May waste energy on less critical tasks']
    },
    dvfs: {
      name: 'Dynamic Voltage and Frequency Scaling',
      description: 'Dynamically adjusts CPU voltage and frequency based on workload needs.',
      pros: ['Fine-grained energy control', 'Adaptable to different workloads', 'Proven energy savings'],
      cons: ['Overhead from frequency switching', 'Hardware dependent', 'Complex to optimize']
    },
    eerr: {
      name: 'Energy-Efficient Round Robin',
      description: 'Modified round robin that groups similar tasks to minimize frequency switching.',
      pros: ['Fair CPU distribution', 'Reduced switching overhead', 'Good for mixed workloads'],
      cons: ['Not optimal for deadline-critical tasks', 'May delay high-priority tasks']
    },
    
    ondemand: {
      name: 'Ondemand Governor',
      description: 'Rapidly increases frequency when load is high, gradually decreases when load is low.',
      pros: ['Responsive to workload changes', 'Good for interactive systems', 'Fast reaction to high loads'],
      cons: ['Can be too aggressive with frequency changes', 'May cause power spikes', 'Lacks predictive capabilities']
    },
    conservative: {
      name: 'Conservative Governor',
      description: 'Gradually changes frequency with smoother transitions based on workload.',
      pros: ['Stable frequency transitions', 'Avoids power spikes', 'Good for steady workloads'],
      cons: ['Slower to respond to high loads', 'May underperform with bursty workloads', 'Less efficient for interactive tasks']
    },
    userspace: {
      name: 'Userspace Governor',
      description: 'Allows user processes to manually control frequency based on their needs.',
      pros: ['Application-specific optimization', 'Flexible control', 'Can be tuned for specific workloads'],
      cons: ['Requires application awareness', 'Can be misused by malicious processes', 'Overhead from context switching']
    },
    
    dpm: {
      name: 'Dynamic Power Management',
      description: 'Puts CPU cores into sleep states when idle to save power.',
      pros: ['Significant energy savings during idle periods', 'Works well with any workload pattern', 'Complementary to DVFS'],
      cons: ['Wake-up latency', 'Transition energy overhead', 'Complex power state management']
    },
    timeout: {
      name: 'Timeout-based Sleep',
      description: 'Uses fixed timeout thresholds to decide when to enter sleep states.',
      pros: ['Simple implementation', 'Predictable behavior', 'Low overhead'],
      cons: ['Not adaptive to workload patterns', 'Fixed thresholds may be suboptimal', 'Missed opportunities for short idle periods']
    },
    history: {
      name: 'History-based Sleep',
      description: 'Predicts idle periods based on historical patterns to optimize sleep decisions.',
      pros: ['Adapts to workload patterns', 'More efficient idle detection', 'Reduces wrong sleep decisions'],
      cons: ['More complex implementation', 'Initial learning period', 'May struggle with irregular workloads']
    },
    tickless: {
      name: 'Tickless Kernel',
      description: 'Removes periodic timer interrupts to allow deeper sleep states for longer periods.',
      pros: ['Deeper sleep states possible', 'Eliminates unnecessary wakeups', 'Better for battery life'],
      cons: ['Potential timer accuracy loss', 'Not all hardware supports all sleep states', 'Complex kernel modifications']
    },
    
    eas: {
      name: 'Energy-Aware Scheduler',
      description: 'Combines task needs with CPU energy models to select optimal cores.',
      pros: ['Task-specific core selection', 'Balances load across cores', 'Modern approach used in mobile CPUs'],
      cons: ['Complex implementation', 'Requires detailed CPU energy models', 'Additional overhead for core selection']
    },
    biglittle: {
      name: 'big.LITTLE Optimization',
      description: 'Specialized for heterogeneous architectures with different CPU core types.',
      pros: ['Excellent for mobile devices', 'Phase-aware execution', 'Hardware-specific optimization'],
      cons: ['Limited to heterogeneous architectures', 'Overhead from core migrations', 'Complex implementation']
    },
    
    ml: {
      name: 'Machine Learning-Based Scheduler',
      description: 'Uses ML models to predict optimal CPU settings for different workloads.',
      pros: ['Learns from past behavior', 'Highly adaptive to workload patterns', 'Can discover non-obvious optimizations'],
      cons: ['Training overhead', 'Black-box decision making', 'Requires significant data collection']
    },
    rl: {
      name: 'Reinforcement Learning Scheduler',
      description: 'Dynamically learns and adapts scheduling decisions based on feedback.',
      pros: ['Self-improving over time', 'Adapts to changing conditions', 'No need for labeled training data'],
      cons: ['Initial exploration phase', 'Complex to implement correctly', 'Resource overhead for learning']
    },
    
    rms: {
      name: 'Rate Monotonic Scheduling',
      description: 'Prioritizes tasks with shorter periods, with energy-aware extensions.',
      pros: ['Provably optimal for periodic tasks', 'Predictable behavior', 'Well-studied algorithm'],
      cons: ['Less efficient for mixed workloads', 'Not inherently energy-aware', 'Works best for periodic tasks']
    },
    mlfq: {
      name: 'Multi-Level Feedback Queue',
      description: 'Uses multiple priority queues with energy considerations for different task types.',
      pros: ['Balances throughput and response time', 'Adapts to task behavior', 'Favors interactive tasks'],
      cons: ['Complex queue management', 'Potential for starvation', 'Tuning required for energy efficiency']
    }
  };

  const currentAlgo = algorithmInfo[algorithm] || algorithmInfo.edf;
  
  const efficiencyScore = energyUsed > 0 && completionTime > 0 
    ? (energyUsed / completionTime).toFixed(2)
    : 'N/A';

  const getStarRating = (algo) => {
    const ratings = {
      edf: 4.5,
      race: 3.5,
      dvfs: 5.0,
      eerr: 4.0,
      
      ondemand: 4.7,
      conservative: 4.2,
      userspace: 3.8,
      
      dpm: 4.6,
      timeout: 3.5,
      history: 4.3,
      tickless: 4.8,
      
      eas: 4.9,
      biglittle: 5.0,
      
      ml: 4.5,
      rl: 4.7,
      
      rms: 3.8,
      mlfq: 4.0
    };
    return ratings[algo] || 3.0;
  };
  
  const getAlgorithmCategory = (algo) => {
    if (['edf', 'rms'].includes(algo)) return 'Real-Time Scheduling';
    if (['dvfs', 'ondemand', 'conservative', 'userspace'].includes(algo)) return 'DVFS';
    if (['dpm', 'timeout', 'history', 'tickless'].includes(algo)) return 'Dynamic Power Management';
    if (['eas', 'biglittle'].includes(algo)) return 'Energy-Aware Scheduling';
    if (['ml', 'rl'].includes(algo)) return 'Machine Learning';
    if (['mlfq'].includes(algo)) return 'Multi-Level Feedback Queue';
    if (['race', 'eerr'].includes(algo)) return 'Other Energy-Efficient Algorithms';
    return 'CPU Scheduling';
  };
  
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        
        {hasHalfStar && (
          <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="halfStar" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
                <stop offset="50%" stopColor="currentColor" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <path fill="url(#halfStar)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
        
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <svg key={`empty-${i}`} className="h-5 w-5 text-zinc-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      className="w-full bg-zinc-900 rounded-xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-4 text-emerald-400">Algorithm Analysis</h2>
      
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-1">
          <div className="text-xs uppercase tracking-wide text-emerald-500 mb-1">
            {getAlgorithmCategory(algorithm)}
          </div>
          <h3 className="font-medium text-lg mb-2">{currentAlgo.name}</h3>
          <p className="text-zinc-400 text-sm mb-4">{currentAlgo.description}</p>
          
          <div className="flex gap-4 mb-6">
            <div>
              <div className="text-zinc-500 text-xs mb-1">EFFICIENCY SCORE</div>
              <div className="text-2xl font-mono font-semibold">
                {efficiencyScore}
                <span className="text-zinc-500 text-sm ml-1">W/s</span>
              </div>
            </div>
            
            <div>
              <div className="text-zinc-500 text-xs mb-1">ENERGY RATING</div>
              <div className="mt-1">
                {renderStars(getStarRating(algorithm))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-emerald-400 text-sm font-medium mb-2">Advantages</h4>
              <ul className="text-zinc-300 text-sm space-y-1">
                {currentAlgo.pros.map((pro, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">✓</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-amber-400 text-sm font-medium mb-2">Limitations</h4>
              <ul className="text-zinc-300 text-sm space-y-1">
                {currentAlgo.cons.map((con, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-amber-400 mt-1">!</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="w-full sm:w-64 flex flex-col gap-4">
          <div className="bg-zinc-800 p-4 rounded-lg">
            <div className="text-zinc-500 text-xs mb-1">ENERGY CONSUMPTION</div>
            <div className="text-2xl font-mono font-semibold text-emerald-400">
              {energyUsed > 0 ? energyUsed.toFixed(2) : 'N/A'}
              <span className="text-zinc-500 text-sm ml-1">units</span>
            </div>
          </div>
          
          <div className="bg-zinc-800 p-4 rounded-lg">
            <div className="text-zinc-500 text-xs mb-1">COMPLETION TIME</div>
            <div className="text-2xl font-mono font-semibold text-blue-400">
              {completionTime > 0 ? completionTime : 'N/A'}
              <span className="text-zinc-500 text-sm ml-1">seconds</span>
            </div>
          </div>
          
          <div className="bg-zinc-800 p-4 rounded-lg">
            <div className="text-zinc-500 text-xs mb-1">RELATIVE EFFICIENCY</div>
            <div className="mt-2">
              <div className="w-full bg-zinc-700 h-3 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300"
                  initial={{ width: 0 }}
                  animate={{ width: getRelativeEfficiencyWidth(algorithm) }}
                  transition={{ duration: 1, delay: 0.8 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function getRelativeEfficiencyWidth(algorithm) {
  const efficiencyMap = {
    biglittle: '98%',
    eas: '96%',
    dvfs: '95%',
    tickless: '94%',
    rl: '93%',
    ondemand: '92%',
    ml: '90%',
    dpm: '89%',
    edf: '85%',
    history: '82%',
    conservative: '80%',
    eerr: '75%',
    userspace: '73%',
    mlfq: '70%',
    rms: '68%',
    timeout: '65%',
    race: '60%'
  };
  
  return efficiencyMap[algorithm] || '75%';
} 