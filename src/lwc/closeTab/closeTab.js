/**
 *
 */

import {LightningElement, wire, api} from 'lwc';
import {IsConsoleNavigation, closeTab, getFocusedTabInfo} from "lightning/platformWorkspaceApi";

export default class CloseTab extends LightningElement {
  @wire(IsConsoleNavigation)
  isConsoleNavigation

  closeHandler() {
    if(this.isConsoleNavigation) {
      getFocusedTabInfo().then(tabInfo=>{
        console.log("tabInfo:", tabInfo);
        closeTab(tabInfo.tabId)
      }).error(error=>{
        console.error(error);
      })
    }
  }

  async closeHandlerAsync() {
    try {
      if ( this.isConsoleNavigation) {
        const {tabId} = await getFocusedTabInfo(); //destructure to get tabId directly
        await closeTab(tabId);
      }
    }
    catch (error) {
      console.log(error)
    }
  }
}