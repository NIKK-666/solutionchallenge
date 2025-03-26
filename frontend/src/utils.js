import { playerState } from "./state/stateManagers.js";
import { healthBar } from "./uiComponents/healthbar.js";

export function playAnimIfNotPlaying(gameObj, animName) {
  if (gameObj.curAnim() !== animName) {
    gameObj.play(animName);
  }
}

export function areAnyOfTheseKeysDown(k, keys) {
  return keys.some((key) => k.isKeyDown(key)); // More optimized check
}

export function colorizeBackground(k, r, g, b) {
  k.add([k.rect(k.canvas.width, k.canvas.height), k.color(r, g, b), k.fixed()]);
}

export function drawTiles(k, map, layer, tileheight, tilewidth) {
  let nbOfDrawnTiles = 0;
  const tilePos = k.vec2(0, 0);
  
  for (const tile of layer.data) {
    if (nbOfDrawnTiles % layer.width === 0 && nbOfDrawnTiles !== 0) {
      tilePos.y += tileheight;
      tilePos.x = 0;
    }

    if (tile !== 0) {
      map.add([
        k.sprite("assets", { frame: tile - 1 }),
        k.pos(tilePos),
        k.offscreen(),
      ]);
    }

    tilePos.x += tilewidth;
    nbOfDrawnTiles++;
  }
}

export function drawBoundaries(k, map, layer) {
  for (const object of layer.objects) {
    map.add(
      generateColliderBoxComponents(
        k,
        object.width,
        object.height,
        k.vec2(object.x, object.y),
        object.name || "wall"
      )
    );
  }
}

export async function fetchMapData(mapPath) {
  try {
    const response = await fetch(mapPath);
    if (!response.ok) throw new Error(`Failed to load map: ${mapPath}`);
    return await response.json();
  } catch (error) {
    console.error("Error loading map data:", error);
    return null; // Prevents crashing
  }
}

export function generateColliderBoxComponents(k, width, height, pos, tag) {
  return [
    k.rect(width, height),
    k.pos(pos.x, pos.y + 16),
    k.area(),
    k.body({ isStatic: true }),
    k.opacity(0),
    k.offscreen(),
    tag,
  ];
}

export async function blinkEffect(k, entity) {
  await k.tween(entity.opacity, 0, 0.1, (val) => (entity.opacity = val), k.easings.linear);
  await k.tween(entity.opacity, 1, 0.1, (val) => (entity.opacity = val), k.easings.linear);
}

export function onAttacked(k, entity) {
  entity.onCollide("swordHitBox", async () => {
    if (entity.isAttacking) return;
    if (entity.hp() <= 0) {
      k.destroy(entity);
      return;
    }
    await blinkEffect(k, entity);
    entity.hurt(1);
  });
}

export function onCollideWithPlayer(k, entity) {
  entity.onCollide("player", async (player) => {
    if (player.isAttacking) return;

    const newHealth = Math.max(0, playerState.getHealth() - entity.attackPower);
    playerState.setHealth(newHealth);
    
    k.destroyAll("healthContainer");
    healthBar(k, player);

    if (newHealth > 0) {
      await blinkEffect(k, player);
    }
  });
}
export async function showPrompt(k, question) {
  return new Promise((resolve) => {
    // Create a dialog box
    const box = k.add([
      k.rect(400, 100),
      k.pos(400, 300),
      k.color(255, 255, 255), // ✅ White background
      k.outline(2, k.rgb(0, 0, 0)), // ✅ Add a black border for visibility
      k.fixed(),
      "promptBox",
    ]);

    box.add([
      k.text(question, { size: 24 }),
      k.pos(20, 20),
      k.color(0, 0, 0), // ✅ Ensure black textt
    ]);

    const yesButton = box.add([
      k.text("YES", { size: 20 }),
      k.pos(50, 60),
      k.area(),
      k.color(0, 0, 0), // ✅ Black text
      "yesButton",
    ]);

    const noButton = box.add([
      k.text("NO", { size: 20 }),
      k.pos(250, 60),
      k.area(),
      k.color(0, 0, 0), // ✅ Black text
      "noButton",
    ]);

    // Remove previous click events before adding new ones
    k.onClick("yesButton", () => {
      k.destroy(box);
      resolve("yes");
    });

    k.onClick("noButton", () => {
      k.destroy(box);
      resolve("no");
    });
  });
}

