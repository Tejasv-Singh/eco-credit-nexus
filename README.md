# Eco-Credit Nexus
### Autonomous Multi-Agent Loan Approval System

Eco-Credit Nexus is a sophisticated simulator designed to demonstrate the power of **Multi-Agent Systems (MAS)** in financial decision-making. It automates the loan approval process for sustainable businesses by balancing financial risk with environmental impact (SDGs).

<div align="center">
<img width="1200" height="475" alt="Eco-Credit Nexus Dashboard" src="" />
</div>

## 🚀 About The Project

Traditional loan approval systems often overlook the long-term value of sustainable practices. Eco-Credit Nexus bridges this gap by employing a team of specialized AI agents that collaborate to evaluate loan applications holistically.

The system simulates a real-time workflow where agents process data, analyze risks, audit sustainability claims, and make a final consensus-based decision.

## 🤖 The Agent Team

The system is powered by four distinct autonomous agents:

1.  **Data Ingestion Agent (Preprocessing)**:
    -   Ingests raw business data (name, description, revenue history).
    -   Validates and structures the data for downstream agents.

2.  **SDG Auditor Agent (Keyword Analysis)**:
    -   Analyzes the business description for alignment with Sustainable Development Goals (SDGs).
    -   Scans for keywords related to renewable energy, waste reduction, fair trade, etc.
    -   Assigns a sustainability score (0-20).

3.  **Risk Actuary Agent (Volatility Calc)**:
    -   Evaluates financial stability based on historical revenue data.
    -   Calculates revenue volatility and financial health.
    -   Assigns a risk score (0-100).

4.  **Nexus Guardian Agent (Final Decision)**:
    -   Synthesizes the outputs from the SDG Auditor and Risk Actuary.
    -   Weighs financial risk against sustainability impact.
    -   Determines the final loan approval status and calculates a custom interest rate.

## ✨ Key Features

-   **Multi-Agent Architecture**: Visualizes the interaction and hand-offs between specialized AI agents.
-   **Real-time Simulation**: Watch the decision-making process unfold step-by-step in the terminal log.
-   **Generative AI Integration**: Uses **Google Gemini** to generate realistic, diverse synthetic business profiles for testing.
-   **Dynamic Visualization**: Interactive dashboard showing agent status, scores, and final decisions.

## 🛠️ Tech Stack

-   **Frontend**: React, Vite, TypeScript
-   **Styling**: Tailwind CSS
-   **AI Integration**: Google GenAI SDK (Gemini)
-   **Icons**: Heroicons

## 📦 Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd eco-credit-nexus
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root directory and add your Gemini API key:
    ```env
    GEMINI_API_KEY=your_api_key_here
    ```

4.  **Run the application:**
    ```bash
    npm run dev
    ```

## 🏗️ Build for Production

To build the application for production, run:

```bash
npm run build
```
