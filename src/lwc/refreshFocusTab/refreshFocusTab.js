import {LightningElement, wire} from 'lwc';
import {IsConsoleNavigation, refreshTab, getFocusedTabInfo} from "lightning/platformWorkspaceApi";

export default class RefreshFocusTab extends LightningElement {
  @wire(IsConsoleNavigation)
  isConsoleApp

  async refreshFocusedTab(){
    if(this.isConsoleApp) {
      const {tabId} = await getFocusedTabInfo();
      //by default, refreshTab refreshes all tabs and subtabs
      //so can explicit mention to refresh sub tabs
      await refreshTab(tabId, {
        includeAllSubTabs: true
      });
    }
  }
}