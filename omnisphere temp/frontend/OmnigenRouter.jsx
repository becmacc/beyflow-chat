import React, { useState } from "react";
import { agents } from "./src/agents";

export default function OmnigenRouter() {
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleQuery = async () => {
    if (!input.trim()) return;

    if (selectedAgent.name === "DALL·E") {
      const res = await fetch("http://127.0.0.1:5000/dalle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      setResponse(`<img src="${data.url}" alt="DALL·E result" style="max-width:100%; border-radius:12px;" />`);
    } else {
      const res = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input, agent: selectedAgent.name }),
      });
      const data = await res.json();
      setResponse(data.response);
    }
  };

  return (
    <div style={{ padding: "50px", color: "#fff", background: "#111", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "2.4rem" }}>🧠 Omnigen Portal</h1>
      
      <select
        style={{ padding: "10px", fontSize: "1rem", marginTop: "10px" }}
        onChange={(e) =>
          setSelectedAgent(agents.find((agent) => agent.name === e.target.value))
        }
      >
        {agents.map((agent) => (
          <option key={agent.name} value={agent.name}>
            {agent.name}
          </option>
        ))}
      </select>

      <div style={{ marginTop: "20px" }}>
        <h2>{selectedAgent.name}</h2>
        <p><strong>Role:</strong> {selectedAgent.role}</p>
        <p>{selectedAgent.description}</p>
      </div>

      <div style={{ marginTop: "30px" }}>
        <input
          type="text"
          placeholder="Ask Omnigen something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ width: "60%", padding: "10px", fontSize: "1rem" }}
        />
        <button onClick={handleQuery} style={{ padding: "10px 20px", marginLeft: "10px" }}>
          Send
        </button>
      </div>

      <div
        style={{ marginTop: "30px", fontSize: "1.1rem" }}
        dangerouslySetInnerHTML={{ __html: response }}
      />
    </div>
  );
}
