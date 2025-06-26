import type { InventoryConsumable } from "../types";
import { ConsumableType, SimulationComponentId } from "../types";
import { state } from "./store";
import { sendToast } from "./index";



export function applyConsumableEffect(item: InventoryConsumable) {
  switch (item.id) {
    case ConsumableType.VIEW_BOT: {
      const viewerComp = state.components.find(c => c.id === SimulationComponentId.VIEWER);
      
      if (viewerComp) viewerComp.owned += 10;
      sendToast("View Bot used! +10 Viewers", "success");
      return true;
    }
    case ConsumableType.SPONSORED_STREAM: {
      // No cost to use, just reward
      const reward = 400;
      state.money += reward;
      sendToast("Sponsored Stream complete! +$400", "success");
      return true;
    }
    case ConsumableType.QUESTIONABLE_TWEET: {
      const viewerComp = state.components.find(c => c.id === SimulationComponentId.VIEWER);
      const followerComp = state.components.find(c => c.id === SimulationComponentId.FOLLOWER);
      if (viewerComp) viewerComp.owned += 20;
      if (followerComp) {
        followerComp.owned = Math.max(0, followerComp.owned - 10);
      }
      sendToast("Questionable Tweet: +20 Viewers, -10 Followers", "warning");
      return true;
    }
    case ConsumableType.PLATFORM_GROYPER: {
      const subComp = state.components.find(c => c.id === SimulationComponentId.SUBSCRIBER);
      const followerComp = state.components.find(c => c.id === SimulationComponentId.FOLLOWER);
      if (subComp) subComp.owned += 5;
      if (followerComp) {
        followerComp.owned = Math.max(0, followerComp.owned - 5);
      }
      sendToast("Platform Groyper: +5 Subscribers, -5 Followers", "warning");
      return true;
    }
    default:
      sendToast("Unknown consumable used.", "info");
      return false;
  }
}
