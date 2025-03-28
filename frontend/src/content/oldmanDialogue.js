const english = [
  [
    "It's dangerous to go alone!",
    "Take this sword, press space to use it.",
    "Please save my son! He's captured in a dungeon towards the west.",
    "I will reward you handsomely!",
  ],
  [
    "You forgot how to use your sword?",
    "Press the space key to attack.",
    "Please now go save my son before it's too late!",
  ],
  ["Please save my son!"],
  ["As a reward for saving my son, you can keep the sword I gave you."],
  ["(AI MODE) Ask me anything."],
];

const french = [
  [
    "C'est dangereux de s'aventurer seul!",
    "Prends cette épée, presses la touche espace pour l'utiliser.",
    "S'il te plaît, sauves mon fils! Il est capturé au donjon situé à l'ouest.",
    "Je te récompenserai généreusement!",
  ],
  [
    "Tu as oublié comment utiliser ton épée?",
    "Presses la touche espace pour attaquer.",
    "S'il te plaît, sauves mon fils avant que ça soit trop tard!",
  ],
  ["S'il te plaît, sauves mon fils!"],
  ["Comme récompense pour avoir sauvé mon fils...", "Tu peux garder l'épée."],
];

const oldmanLines = { english, french };

// ✅ AI Response Function (Fetches from Gemini API)
async function getAIResponse(userInput) {
  const apiKey = ""; // Replace with your actual API key
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userInput }] }],
        generationConfig: {
          temperature: 0.7,
          top_p: 0.95,
          top_k: 64,
          maxOutputTokens: 200, // ✅ Adjusted for practical response length
        },
      }),
    });

    const data = await response.json();
    console.log("API Response:", data); // ✅ Debugging

    if (
      data &&
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content.parts[0].text
    ) {
      return data.candidates[0].content.parts[0].text; // ✅ Return AI response
    } else {
      return "I don't know what to say.";
    }
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "I cannot respond right now. Try again later.";
  }
}

export { oldmanLines, getAIResponse };
