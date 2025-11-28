import React from 'react';
import { AgentStatus } from '../types';

interface AgentCardProps {
  name: string;
  role: string;
  status: AgentStatus;
  resultValue?: string | number;
  icon: React.ReactNode;
}

const AgentCard: React.FC<AgentCardProps> = ({ name, role, status, resultValue, icon }) => {
  const isWorking = status === AgentStatus.WORKING;
  const isCompleted = status === AgentStatus.COMPLETED;
  const isError = status === AgentStatus.ERROR;

  return (
    <div className={`
      relative p-5 rounded-xl border transition-all duration-300 overflow-hidden
      ${isWorking ? 'border-blue-500 bg-slate-800 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 
        isCompleted ? 'border-green-500 bg-slate-800' : 
        isError ? 'border-red-500 bg-slate-800' :
        'border-slate-700 bg-slate-800/50 opacity-70'}
    `}>
      {isWorking && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-shimmer"></div>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${isCompleted ? 'bg-green-900/30 text-green-400' : 'bg-slate-700/50 text-slate-400'}`}>
          {icon}
        </div>
        <div className="flex items-center space-x-2">
            {isWorking && <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>}
            <span className={`text-xs font-mono font-bold uppercase tracking-wider ${
                isCompleted ? 'text-green-500' : 
                isWorking ? 'text-blue-400' : 'text-slate-500'
            }`}>
                {status}
            </span>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-200">{name}</h3>
        <p className="text-xs text-slate-400 mb-3">{role}</p>
        
        {resultValue !== undefined && (
          <div className="mt-2 pt-2 border-t border-slate-700/50">
             <span className="text-xs text-slate-500 uppercase">Output</span>
             <div className="text-lg font-mono font-bold text-white">{resultValue}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentCard;