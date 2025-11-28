import { BusinessData, SimulationResult, AgentLog } from '../types';

// Helper to simulate processing delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class BaseAgent {
  name: string;
  role: string;

  constructor(name: string, role: string) {
    this.name = name;
    this.role = role;
  }

  protected createLog(message: string, type: AgentLog['type'] = 'info', details?: any): AgentLog {
    return {
      id: Math.random().toString(36).substr(2, 9),
      agentName: this.name,
      type,
      message,
      timestamp: Date.now(),
      details
    };
  }
}

export class DataIngestionAgent extends BaseAgent {
  constructor() {
    super('Agent A (DataIngestion)', 'Data Pre-processing');
  }

  async process(rawData: Partial<BusinessData>): Promise<{ data: BusinessData; logs: AgentLog[] }> {
    const logs: AgentLog[] = [];
    logs.push(this.createLog('Initializing data ingestion protocol...', 'thinking'));
    
    await delay(800);

    if (!rawData.name || !rawData.description || !rawData.revenues || rawData.revenues.length === 0) {
      logs.push(this.createLog('Validation Failed: Missing required fields.', 'error'));
      throw new Error("Missing data");
    }

    logs.push(this.createLog(`Ingested data for entity: ${rawData.name}`, 'info'));
    logs.push(this.createLog(`Parsed ${rawData.revenues.length} months of revenue history.`, 'info', { revenues: rawData.revenues }));
    logs.push(this.createLog('Data validation successful. Passing to analysis agents.', 'success'));

    return {
      data: rawData as BusinessData,
      logs
    };
  }
}

export class SDGAuditorAgent extends BaseAgent {
  constructor() {
    super('Agent B (SDGAuditor)', 'Sustainability Impact Analysis');
  }

  async analyze(description: string): Promise<{ score: number; logs: AgentLog[]; matches: string[] }> {
    const logs: AgentLog[] = [];
    logs.push(this.createLog('Scanning business description for UN SDG alignment...', 'thinking'));
    
    await delay(1200);

    const keywords = ['solar', 'recycling', 'organic', 'sustainable', 'green', 'carbon', 'waste', 'renewable', 'fair trade', 'ethical', 'biodegradable', 'clean energy', 'compost', 'local'];
    const lowerDesc = description.toLowerCase();
    
    const foundKeywords = keywords.filter(k => lowerDesc.includes(k));
    const rawScore = foundKeywords.length * 5; // 5 points per keyword
    const finalScore = Math.min(20, rawScore); // Cap at 20

    logs.push(this.createLog(`Identified ${foundKeywords.length} SDG-related keywords.`, 'info', { keywords: foundKeywords }));
    
    if (foundKeywords.length > 0) {
        logs.push(this.createLog(`Calculated SDG Impact Score: ${finalScore}/20`, 'success'));
    } else {
        logs.push(this.createLog(`No specific SDG keywords found. Score defaulted to base level.`, 'warning'));
    }

    return { score: finalScore, logs, matches: foundKeywords };
  }
}

export class RiskActuaryAgent extends BaseAgent {
  constructor() {
    super('Agent C (RiskActuary)', 'Financial Volatility Analysis');
  }

  async analyze(revenues: number[]): Promise<{ score: number; logs: AgentLog[]; metrics: any }> {
    const logs: AgentLog[] = [];
    logs.push(this.createLog('Calculating volatility metrics on revenue stream...', 'thinking'));
    
    await delay(1500);

    const n = revenues.length;
    const mean = revenues.reduce((a, b) => a + b, 0) / n;
    
    if (mean === 0) {
        logs.push(this.createLog('Revenue mean is zero. Automatic high risk.', 'error'));
        return { score: 0, logs, metrics: { mean: 0 } };
    }

    const variance = revenues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);
    const cv = stdDev / mean; // Coefficient of Variation
    
    // Formula: 100 - (CV * 100). Lower CV is better.
    // If CV is 0 (perfect stability), Score 100.
    // If CV is 1 (Standard deviation equals mean - highly volatile), Score 0.
    let stabilityScore = Math.round(100 - (cv * 100));
    stabilityScore = Math.max(0, Math.min(100, stabilityScore));

    logs.push(this.createLog(`Statistical Analysis Complete.`, 'info', {
        mean: mean.toFixed(2),
        stdDev: stdDev.toFixed(2),
        coefficientOfVariation: cv.toFixed(3)
    }));
    
    logs.push(this.createLog(`Computed Stability Score: ${stabilityScore}/100`, 'success'));

    return { 
        score: stabilityScore, 
        logs,
        metrics: { mean, stdDev, cv }
    };
  }
}

export class NexusGuardianAgent extends BaseAgent {
  constructor() {
    super('Agent D (NexusGuardian)', 'Final Credit Decision');
  }

  async decide(riskScore: number, sdgScore: number): Promise<{ result: SimulationResult; logs: AgentLog[] }> {
    const logs: AgentLog[] = [];
    logs.push(this.createLog('Aggregating sub-agent reports...', 'thinking'));
    await delay(1000);

    // Formula: Final_Score = (0.7 * Risk_Score) + (1.5 * SDG_Score)
    const weightedRisk = 0.7 * riskScore;
    const weightedSDG = 1.5 * sdgScore;
    const finalScore = weightedRisk + weightedSDG;
    
    logs.push(this.createLog(`Applying Weighted Logic Matrix:`, 'info', {
        riskComponent: `0.7 * ${riskScore} = ${weightedRisk.toFixed(1)}`,
        sdgComponent: `1.5 * ${sdgScore} = ${weightedSDG.toFixed(1)}`
    }));

    const isApproved = finalScore > 60;
    const interestRate = isApproved ? "4.5% (Green Preferred)" : "N/A";

    logs.push(this.createLog(`Final Calculated Score: ${finalScore.toFixed(1)}`, 'success'));
    
    if (isApproved) {
        logs.push(this.createLog(`DECISION: APPROVED. Eligible for Eco-Credit program.`, 'success'));
    } else {
        logs.push(this.createLog(`DECISION: REJECTED. Score below threshold (60).`, 'warning'));
    }

    return {
      result: {
        riskScore,
        sdgScore,
        finalScore,
        isApproved,
        interestRate
      },
      logs
    };
  }
}