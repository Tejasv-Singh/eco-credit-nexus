import React, { useEffect, useRef } from 'react';
import { AgentLog } from '../types';

interface TerminalLogProps {
  logs: AgentLog[];
}

const TerminalLog: React.FC<TerminalLogProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-slate-950 border border-slate-700 rounded-lg shadow-2xl flex flex-col h-[500px] overflow-hidden font-mono text-sm">
      <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="text-slate-400 text-xs ml-4">nexus_sys_log.txt</span>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar">
        {logs.length === 0 && (
            <div className="text-slate-500 italic text-center mt-20">System IDLE. Waiting for data ingestion...</div>
        )}
        {logs.map((log) => {
            const date = new Date(log.timestamp);
            const timeStr = date.toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second:"2-digit" });
            const ms = date.getMilliseconds().toString().padStart(3, '0');
            
            return (
                <div key={log.id} className="flex gap-3 animate-fade-in">
                    <span className="text-slate-500 shrink-0">
                        [{timeStr}.{ms}]
                    </span>
                    <div className="flex flex-col">
                        <span className={`font-bold ${
                            log.agentName.includes('A') ? 'text-blue-400' :
                            log.agentName.includes('B') ? 'text-emerald-400' :
                            log.agentName.includes('C') ? 'text-amber-400' :
                            'text-purple-400'
                        }`}>
                            {log.agentName}:
                        </span>
                        <span className={`${
                            log.type === 'error' ? 'text-red-400' :
                            log.type === 'success' ? 'text-green-300' :
                            log.type === 'warning' ? 'text-yellow-300' :
                            log.type === 'thinking' ? 'text-cyan-200 italic' :
                            'text-slate-300'
                        }`}>
                            {log.message}
                        </span>
                        {log.details && (
                            <pre className="mt-1 text-xs text-slate-500 bg-slate-900/50 p-2 rounded border-l-2 border-slate-700">
                                {JSON.stringify(log.details, null, 2)}
                            </pre>
                        )}
                    </div>
                </div>
            );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default TerminalLog;