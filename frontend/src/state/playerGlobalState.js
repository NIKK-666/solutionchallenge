export default function playerGlobalStateManager() {
  let instance = null;

  function createInstance() {
    let isSwordEquipped = false;
    const maxHealth = 3;
    let health = maxHealth;
    let hasKey = false;
    let hasUsedAI = false; // Track AI interaction
    let inventory = []; // Inventory system

    return {
      setIsSwordEquipped(value) {
        isSwordEquipped = value;
      },
      getIsSwordEquipped: () => isSwordEquipped,

      getMaxHealth: () => maxHealth,
      setHealth(value) {
        health = Math.max(0, Math.min(value, maxHealth)); // Prevent invalid health values
      },
      getHealth: () => health,

      setHasKey(value) {
        hasKey = value;
      },
      getHasKey: () => hasKey,

      setHasUsedAI(value) {
        hasUsedAI = value;
      },
      getHasUsedAI: () => hasUsedAI,

      addItemToInventory(item) {
        if (!inventory.includes(item)) {
          inventory.push(item);
        }
      },
      removeItemFromInventory(item) {
        inventory = inventory.filter(i => i !== item);
      },
      getInventory: () => inventory,
    };
  }

  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }

      return instance;
    },
  };
}
