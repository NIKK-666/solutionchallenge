export default function oldManGlobalStateManager() {
  let instance = null;

  function createInstance() {
    let nbTalkedOldMan = 0;
    let hasAskedAI = false; // Track AI conversation

    return {
      setNbTalkedOldMan(value) {
        nbTalkedOldMan = value;
      },
      getNbTalkedOldMan: () => nbTalkedOldMan,

      setHasAskedAI(value) {
        hasAskedAI = value;
      },
      getHasAskedAI: () => hasAskedAI,
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
