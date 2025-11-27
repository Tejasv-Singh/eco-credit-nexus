export interface BusinessData {
  name: string;
  description: string;
  revenues: number[];
}

export interface AgentLog {
  id: string;
  agentName: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'thinking';
  message: string;
  timestamp: number;
  details?: Record<string, any>;
}

export interface SimulationResult {
  riskScore: number;
  sdgScore: number;
  finalScore: number;
  isApproved: boolean;
  interestRate: string;
}

export enum AgentStatus {
  IDLE = 'IDLE',
  WORKING = 'WORKING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface AgentState {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  output?: any;
}