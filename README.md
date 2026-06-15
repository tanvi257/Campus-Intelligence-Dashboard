# Unified Campus Intelligence Dashboard

A modern, highly responsive, glassmorphic web dashboard that centralizes campus information portals using independent **Model Context Protocol (MCP)** microservices. Instead of replicating database stores, this architecture uses real-time JSON-RPC communication over standard I/O (stdio) to query live campus data sources dynamically based on natural language queries or interactive UI widgets.

---

## 🌟 Features

* **AI Campus Assistant Drawer**: A chatbot powered by Gemini (`gemini-1.5-flash`) that parses student queries and dynamically executes function calling across connected MCP servers.
* **4 Independent MCP Servers (Microservices)**:
  * **Library Server**: Query book listings, check real-time copies availability, and issue instant student checkouts.
  * **Cafeteria Server**: Fetch food menus, check chef recommendations, and retrieve live queue lengths and estimated wait times (computed dynamically based on the current hour).
  * **Events Server**: Display tech fests, club workshops, cultural events, and issue instant RSVP ticket codes.
  * **Academics Server**: Lookup course syllabi, instructor credits, exam hall venues, and academic calendars.
* **Unified UI Widgets**: The visual widgets query the **exact same** MCP servers via a unified backend widget proxy, ensuring live data consistency between the visual dashboard and the AI assistant.
* **Live MCP Monitoring Terminal**: A sidebar status indicator and terminal-style logs in the chat panel showing which microservice was called, the arguments passed, and raw JSON returns, highlighting the Model Context Protocol in action.
* **API Key Drawer Configuration**: Safe client-side API key configuration, saving the key in browser localStorage without exposing it to public server storage.

---

## 🏗️ Architecture Flow

```mermaid
graph TD
  User([Student UI Dashboard]) -->|User Chat Prompt| NextAPIChat[/api/chat Route]
  User -->|Widget Filter / Click| NextAPIWidget[/api/widget-query Route]
  
  subgraph NextJS Backend [Next.js Server API Layer]
    NextAPIChat --> GeminiService[Gemini Orchestrator]
    GeminiService -->|Tool Routing| McpManager[MCP Client Manager]
    NextAPIWidget -->|Direct Tool Call| McpManager
  end
  
  subgraph MCP Microservices [Independent Subprocesses - Node.js stdio]
    McpManager <-->|JSON-RPC Stdio Handshake & Calls| LibServer[Library MCP Server]
    McpManager <-->|JSON-RPC Stdio Handshake & Calls| CafeServer[Cafeteria MCP Server]
    McpManager <-->|JSON-RPC Stdio Handshake & Calls| EventServer[Events MCP Server]
    McpManager <-->|JSON-RPC Stdio Handshake & Calls| AcadServer[Academics MCP Server]
  end
  
  LibServer <-->|In-Memory Store| LibDB[(Library Catalog)]
  CafeServer <-->|In-Memory Store| CafeDB[(Cafeteria Catalog)]
  EventServer <-->|In-Memory Store| EventDB[(Events Roster)]
  AcadServer <-->|In-Memory Store| AcadDB[(Academics Portal)]
```

---

## 🛠️ Tech Stack

* **Frontend Framework**: Next.js (App Router)
* **Styling**: Vanilla CSS Modules (Glassmorphic dark design system)
* **Microservice Layer**: Node.js child process subprocesses executing the MCP JSON-RPC protocol
* **AI Orchestration**: Google Gemini API via the `@google/generative-ai` SDK (running multi-turn tool loops)

---

## 🚀 Setup & Execution

### Prerequisites
* **Node.js**: `v18.0.0` or higher (verified on Node `v24.14.0`)
* **npm**: `v9.0.0` or higher

### Installation
1. Clone or extract the repository code.
2. Open terminal in the project directory:
   ```bash
   cd campus_intelligence_dashboard
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

### Running Locally
1. Start the Next.js development server:
   ```bash
   npm run dev
   ```
2. The server will start on `http://localhost:3000`.
3. Open your browser and navigate to `http://localhost:3000`.

### Configuring the AI Key
1. Upon loading the page, the **AI Assistant Settings** drawer will automatically open.
2. Paste your **Gemini API Key** into the text input.
   > *Note: If you do not have a key, you can get one from the Google AI Studio.*
3. Click **Save and Connect**.
4. The dashboard will verify the key, connect to the underlying MCP servers, and light up the **MCP Active: 4 Microservices** green indicator in the header.

---

## 📝 Demo Sample Queries

Type these in the AI Assistant to watch tool-routing execute in the terminal log:
* *"Is Introduction to Algorithms available in the library?"*
* *"What is for lunch today and is the cafeteria crowded right now?"*
* *"Register me for the Annual Hackathon, my name is John Doe and student ID is 241088."*
* *"What is the syllabus and schedule for course CS-301?"*
* *"Show me the exam schedule and room details for Linear Algebra."*
