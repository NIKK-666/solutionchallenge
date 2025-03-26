import { gameState } from "../state/stateManagers.js";
import { getAIResponse } from "../content/oldmanDialogue.js"; // ✅ Correct import

async function displayLine(textContainer, line) {
  textContainer.text = "";
  for (const char of line) {
    await new Promise((resolve) =>
      setTimeout(() => {
        textContainer.text += char;
        resolve();
      }, 10)
    );
  }
}

export async function dialog(k, pos, content = ["Hello traveler!"], isAI = false) {
  gameState.setFreezePlayer(true);

  // ✅ Improved Dialog Box Style
  const dialogBox = k.add([
    k.rect(800, 250, { radius: 10 }),
    k.pos(pos),
    k.color(255, 255, 255), // White background
    k.outline(3, k.rgb(0, 0, 0)), // Black border
    k.fixed(),
  ]);

  // ✅ Text container with black color
  const textContainer = dialogBox.add([
    k.text("", {
      font: "gameboy",
      width: 700,
      lineSpacing: 15,
      size: gameState.getFontSize(),
    }),
    k.color(0, 0, 0), // Ensure black text
    k.pos(20, 40),
    k.fixed(),
  ]);

  let index = 0;
  let lineFinishedDisplayed = true;

  if (!isAI) {
    await displayLine(textContainer, content[index] || "...");
  }

  const dialogKey = k.onKeyPress("space", async () => {
    if (!lineFinishedDisplayed) return;

    index++;
    if (!content[index] && !isAI) {
      k.destroy(dialogBox);
      dialogKey.cancel();
      gameState.setFreezePlayer(false);
      return;
    }

    textContainer.text = "";
    lineFinishedDisplayed = false;

    if (isAI || content[index] === "(AI MODE) Ask me anything.") {
      // ✅ Create input box for AI question
      const inputBox = document.createElement("div");
      inputBox.style.cssText = `
        position: absolute;
        top: 70%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 10px;
        background: white;
        border: 2px solid black;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        align-items: center;
      `;

      inputBox.innerHTML = `
        <label for="ai-input" style="color: black; font-size: 16px; margin-bottom: 5px;">
          Ask the Old Man:
        </label>
        <input type="text" id="ai-input" placeholder="Type your question..." 
          style="width: 300px; padding: 5px; border: 1px solid black; border-radius: 5px;">
      `;

      document.body.appendChild(inputBox);
      const inputField = document.getElementById("ai-input");
      inputField.focus();

      inputField.addEventListener("keydown", async (event) => {
        if (event.key === "Enter") {
          const userInput = inputField.value.trim();
          if (!userInput) return;

          inputField.disabled = true;
          inputBox.remove();

          // ✅ Fetch AI response and display it
          textContainer.text = "Thinking...";
          const aiResponse = await getAIResponse(userInput);
          textContainer.text = "";
          await displayLine(textContainer, aiResponse);
        }
      });
    } else {
      await displayLine(textContainer, content[index] || "...");
    }

    lineFinishedDisplayed = true;
  });
}
