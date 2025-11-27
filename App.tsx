import React, { useState, useCallback } from 'react';
import { 
  DataIngestionAgent, 
  SDGAuditorAgent, 
  RiskActuaryAgent, 
  NexusGuardianAgent 
} from './services/ecoAgents';
import { AgentLog, AgentStatus, BusinessData, SimulationResult } from './types';
import TerminalLog from './components/TerminalLog';
import AgentCard from './components/AgentCard';
import { GoogleGenAI } from "@google/genai";

// Icons
const DataIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>;
const LeafIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const ShieldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;

const DEFAULT_DESC = "We are a small family farm growing organic coffee in the highlands. We use solar drying methods and recycle all organic waste into compost for the next harvest.";
const DEFAULT_REVENUE = "1200, 1250, 1100, 1300, 1220, 1180";

export default function App() {
  const [businessName, setBusinessName] = useState("Green Bean Co-op");
  const [description, setDescription] = useState(DEFAULT_DESC);
  const [revenueInput, setRevenueInput] = useState(DEFAULT_REVENUE);
  
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  
  // Agent States
  const [agentAStatus, setAgentAStatus] = useState(AgentStatus.IDLE);
  const [agentBStatus, setAgentBStatus] = useState(AgentStatus.IDLE);
  const [agentCStatus, setAgentCStatus] = useState(AgentStatus.IDLE);
  const [agentDStatus, setAgentDStatus] = useState(AgentStatus.IDLE);
  
  const [agentBResult, setAgentBResult] = useState<number | undefined>();
  const [agentCResult, setAgentCResult] = useState<number | undefined>();
  const [finalResult, setFinalResult] = useState<SimulationResult | undefined>();

  const resetSimulation = () => {
    setLogs([]);
    setAgentAStatus(AgentStatus.IDLE);
    setAgentBStatus(AgentStatus.IDLE);
    setAgentCStatus(AgentStatus.IDLE);
    setAgentDStatus(AgentStatus.IDLE);
    setAgentBResult(undefined);
    setAgentCResult(undefined);
    setFinalResult(undefined);
  };

  const generateWithGemini = async () => {
    if (!process.env.API_KEY) {
        alert("API Key not found in environment.");
        return;
    }
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const prompt = "Generate a fictional small business profile for a sustainable company seeking a loan. Return JSON with 'name' (string), 'description' (string, max 50 words, mentioning sustainable practices), and 'revenues' (string, comma separated 6 months of revenue numbers).";
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });
        
        if (response.text) {
          const json = JSON.parse(response.text);
          setBusinessName(json.name);
          setDescription(json.description);
          setRevenueInput(json.revenues);
        }
    } catch (e) {
        console.error("Gemini Generation Error", e);
        alert("Failed to generate data with Gemini. Check console.");
    }
  };

  const runSimulation = useCallback(async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    resetSimulation();

    // 1. Initialize Agents
    const agentA = new DataIngestionAgent();
    const agentB = new SDGAuditorAgent();
    const agentC = new RiskActuaryAgent();
    const agentD = new NexusGuardianAgent();

    const addLogs = (newLogs: AgentLog[]) => {
        setLogs(prev => [...prev, ...newLogs]);
    };

    try {
        // --- Agent A: Ingestion ---
        setAgentAStatus(AgentStatus.WORKING);
        const revenues = revenueInput.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
        
        const rawData: Partial<BusinessData> = {
            name: businessName,
            description: description,
            revenues: revenues
        };

        const resultA = await agentA.process(rawData);
        addLogs(resultA.logs);
        setAgentAStatus(AgentStatus.COMPLETED);

        // --- Parallel Execution: Agent B & C ---
        setAgentBStatus(AgentStatus.WORKING);
        setAgentCStatus(AgentStatus.WORKING);

        const [resultB, resultC] = await Promise.all([
            agentB.analyze(resultA.data.description),
            agentC.analyze(resultA.data.revenues)
        ]);

        addLogs(resultB.logs);
        setAgentBResult(resultB.score);
        setAgentBStatus(AgentStatus.COMPLETED);

        addLogs(resultC.logs);
        setAgentCResult(resultC.score);
        setAgentCStatus(AgentStatus.COMPLETED);

        // --- Agent D: Decision ---
        setAgentDStatus(AgentStatus.WORKING);
        const resultD = await agentD.decide(resultC.score, resultB.score);
        
        addLogs(resultD.logs);
        setFinalResult(resultD.result);
        setAgentDStatus(AgentStatus.COMPLETED);

    } catch (error: any) {
        setLogs(prev => [...prev, {
            id: 'err',
            agentName: 'SYSTEM',
            type: 'error',
            message: `Simulation Halted: ${error.message}`,
            timestamp: Date.now()
        }]);
        setAgentAStatus(AgentStatus.ERROR);
    } finally {
        setIsSimulating(false);
    }
  }, [businessName, description, revenueInput, isSimulating]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Header */}
        <div className="lg:col-span-12 flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Eco-Credit Nexus
            </h1>
            <p className="text-slate-400">Autonomous Multi-Agent Loan Approval System</p>
          </div>
          <div className="flex gap-2">
            <button 
                onClick={generateWithGemini}
                className="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-slate-300 transition-colors"
            >
                ✨ Generate Sample Data
            </button>
          </div>
        </div>

        {/* Left Column: Inputs & Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
              <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
              Application Data
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase text-slate-500 font-bold mb-1">Business Name</label>
                <input 
                  type="text" 
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-slate-500 font-bold mb-1">Business Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Describe your business and sustainable practices..."
                />
                <p className="text-xs text-slate-500 mt-1">Agent B will analyze this for SDG keywords.</p>
              </div>

              <div>
                <label className="block text-xs uppercase text-slate-500 font-bold mb-1">Monthly Revenue (Last 6 Months)</label>
                <input 
                  type="text" 
                  value={revenueInput}
                  onChange={(e) => setRevenueInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                  placeholder="e.g. 1000, 1200, 1100..."
                />
                 <p className="text-xs text-slate-500 mt-1">Agent C checks volatility. Format: comma separated numbers.</p>
              </div>

              <button 
                onClick={runSimulation}
                disabled={isSimulating}
                className={`w-full py-4 mt-4 rounded-xl font-bold text-lg tracking-wide shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                    isSimulating 
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white'
                }`}
              >
                {isSimulating ? 'AGENTS PROCESSING...' : 'INITIATE ANALYSIS'}
              </button>
            </div>
          </div>

          {/* Result Card */}
          {finalResult && (
            <div className={`p-6 rounded-2xl border-2 shadow-2xl animate-scale-in ${
                finalResult.isApproved ? 'bg-green-900/20 border-green-500' : 'bg-red-900/20 border-red-500'
            }`}>
                <h3 className="text-center text-sm font-bold uppercase tracking-widest mb-2 text-slate-400">Final Decision</h3>
                <div className={`text-4xl font-black text-center mb-4 ${
                    finalResult.isApproved ? 'text-green-400' : 'text-red-400'
                }`}>
                    {finalResult.isApproved ? 'APPROVED' : 'REJECTED'}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-slate-900/50 p-3 rounded-lg">
                        <div className="text-xs text-slate-500">Total Score</div>
                        <div className="text-xl font-mono font-bold">{finalResult.finalScore.toFixed(1)}</div>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded-lg">
                        <div className="text-xs text-slate-500">Interest Rate</div>
                        <div className="text-xl font-mono font-bold text-emerald-400">{finalResult.interestRate}</div>
                    </div>
                </div>
            </div>
          )}
        </div>

        {/* Right Column: Agent Visualization & Terminal */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
            {/* Agent Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <AgentCard 
                    name="Data Ingestion" 
                    role="Preprocessing" 
                    status={agentAStatus}
                    icon={<DataIcon />}
                />
                <AgentCard 
                    name="SDG Auditor" 
                    role="Keyword Analysis" 
                    status={agentBStatus}
                    resultValue={agentBResult !== undefined ? `${agentBResult}/20` : undefined}
                    icon={<LeafIcon />}
                />
                <AgentCard 
                    name="Risk Actuary" 
                    role="Volatility Calc" 
                    status={agentCStatus}
                    resultValue={agentCResult !== undefined ? `${agentCResult}/100` : undefined}
                    icon={<ChartIcon />}
                />
                <AgentCard 
                    name="Nexus Guardian" 
                    role="Final Decision" 
                    status={agentDStatus}
                    resultValue={finalResult ? finalResult.finalScore.toFixed(1) : undefined}
                    icon={<ShieldIcon />}
                />
            </div>

            {/* Terminal */}
            <div className="flex-1">
                <TerminalLog logs={logs} />
            </div>
        </div>

      </div>
    </div>
  );
}