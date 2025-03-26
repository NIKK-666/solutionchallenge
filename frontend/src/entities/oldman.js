import { playerState, oldManState, gameState } from "../state/stateManagers.js";
import { dialog } from "../uiComponents/dialog.js";
import { playAnimIfNotPlaying } from "../utils.js";
import { oldmanLines, getAIResponse } from "../content/oldmanDialogue.js";

export function generateOldManComponents(k, pos) {
  return [
    k.sprite("assets", {
      anim: "oldman-down",
    }),
    k.area({ shape: new k.Rect(k.vec2(2, 4), 12, 12) }),
    k.body({ isStatic: true }),
    k.pos(pos),
    {},
    "oldman",
  ];
}

export async function startInteraction(k, oldman, player) {
  // Ensure Old Man faces player
  if (player.direction === "left") {
    oldman.flipX = true;
    playAnimIfNotPlaying(oldman, "oldman-side");
  } else if (player.direction === "right") {
    oldman.flipX = false;
    playAnimIfNotPlaying(oldman, "oldman-side");
  } else if (player.direction === "down") {
    playAnimIfNotPlaying(oldman, "oldman-up");
  }

  const responses = oldmanLines[gameState.getLocale()];
  playerState.setIsSwordEquipped(true);

  // AI Chat Option (Prevents Spamming)
  if (!oldManState.getHasAskedAI()) {
    const playerChoice = await k.prompt("Do you want AI dialogue? (yes/no)");

    if (playerChoice.toLowerCase() === "yes") {
      const userInput = await k.prompt("Ask the Old Man anything:");
      const aiResponse = await getAIResponse(userInput);
      await dialog(k, k.vec2(250, 500), [aiResponse]); // Show AI response
      oldManState.setHasAskedAI(true); // Prevent repeated AI questions in the same session
      return;
    }
  }

  // Default Predefined Dialogue Logic
  if (gameState.getIsSonSaved()) {
    await dialog(k, k.vec2(250, 500), responses[3]);
    return;
  }

  let nbTalkedOldMan = oldManState.getNbTalkedOldMan();
  if (nbTalkedOldMan >= responses.length - 1) {
    oldManState.setNbTalkedOldMan(1);
    nbTalkedOldMan = oldManState.getNbTalkedOldMan();
  }

  if (responses[nbTalkedOldMan]) {
    await dialog(k, k.vec2(250, 500), responses[nbTalkedOldMan]);
    oldManState.setNbTalkedOldMan(nbTalkedOldMan + 1);
    return;
  }
}

export function endInteraction(oldman) {
  playAnimIfNotPlaying(oldman, "oldman-down");
}
