export const presentSaveLoopModal = (loop, onSave) => ({
  type: "PRESENT_SAVE_LOOP_MODAL",
  payload: { loop, onSave }
});

export const dismissSaveLoopModal = () => ({
  type: "DISMISS_SAVE_LOOP_MODAL"
});
