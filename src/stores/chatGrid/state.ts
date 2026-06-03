import { DEFAULT_LAYOUT, type Layout } from "../../constants";
import { normalizeValues } from "../../utils/values";

export function createInitialChatGridState() {
  return {
    currentLayout: DEFAULT_LAYOUT as Layout,
    values: normalizeValues([]),
    status: "",
    controlsHidden: false,
    helpOpen: false,
    editMode: false,
    draggedIndex: null as number | null,
    draftValues: normalizeValues([]),
  };
}
