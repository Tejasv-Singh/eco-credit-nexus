# Eco-Credit Nexus

## Overview
Eco-Credit Nexus is an autonomous Multi-Agent System designed to approve loans for rural small businesses by combining Financial Risk metrics with UN Sustainable Development Goals (SDG) impact.

## Architecture
The system consists of 4 intelligent agents:
1. **Agent A (DataIngestion):** Pre-processes raw business data.
2. **Agent B (SDGAuditor):** Analyzes business descriptions for sustainability keywords (Solar, Recycling, etc.).
3. **Agent C (RiskActuary):** Calculates financial stability based on revenue volatility.
4. **Agent D (NexusGuardian):** Makes the final credit decision based on a weighted score of Risk and SDG impact.

## Logic
The final decision is calculated using the following formula:
`Final_Score = (0.7 * Risk_Score) + (1.5 * SDG_Score)`

## Tech Stack
- React
- TypeScript
- Tailwind CSS
- Google Gemini API (for synthetic data generation)
