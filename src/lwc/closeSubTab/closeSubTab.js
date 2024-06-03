/**
 *
 */

import {LightningElement, wire} from 'lwc';
import {IsConsoleNavigation, getFocusedTabInfo, closeTab} from "lightning/platformWorkspaceApi";

export default class CloseSubTab extends LightningElement {
  @wire(IsConsoleNavigation)
  isConsoleNavigation

  async closeAllSubTabsHandler() {
    if(this.isConsoleNavigation) {
      const tabInfo = await getFocusedTabInfo();
      if(tabInfo.subtabs) {
        tabInfo.subtabs.forEach(async tab=>{
          await closeTab(tab.tabId)
        })
      }
    }
  }

  async closeAllOppSubTabs() {
    if(this.isConsoleNavigation) {
      const tabInfo = await getFocusedTabInfo();
      if(tabInfo.subtabs) {
        tabInfo.subtabs.forEach(async tab=>{
          if (tab.iconAlt === "Opportunity")
            await closeTab(tab.tabId)
        })
      }
    }
  }
}