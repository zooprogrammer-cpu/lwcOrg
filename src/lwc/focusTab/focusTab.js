/**
 *
 */

import {LightningElement, wire} from 'lwc';
import {IsConsoleNavigation, getFocusedTabInfo, getAllTabInfo, focusTab} from "lightning/platformWorkspaceApi";

export default class FocusTab extends LightningElement {
  @wire(IsConsoleNavigation)
  isConsoleApp

  async focusTabHandler() {
    if (this.isConsoleApp) {
      const allTabs = await getAllTabInfo();
      // console.log("allTabs", allTabs);
      // if (allTabs.length > 1) {
      //   await focusTab(allTabs[1].tabId);
      // }
      const {tabId} = await getFocusedTabInfo();
      const selectedTabIndex = allTabs.findIndex(nextTab=>{
        return nextTab.tabId === tabId
      })
      const nextTabId = allTabs[selectedTabIndex + 1].tabId
      await focusTab(nextTabId);
    }
  }
}