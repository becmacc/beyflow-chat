export async function askChatGPT(prompt) {
  try {
    const response = await fetch("http://127.0.0.1:5001/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, agent: "Omnigen" }),
    });
    const data = await response.json();
    return data.response;
  } catch (e) {
    return "Error contacting Omnigen.";
  }
}

export async function generateImage(prompt) {
  try {
    const response = await fetch("http://127.0.0.1:5001/dalle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await response.json();
    return data.url || null;
  } catch (e) {
    return null;
  }
}
