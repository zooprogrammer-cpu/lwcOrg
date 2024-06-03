/**
 *
 */

import {LightningElement, wire} from 'lwc';
import {IsConsoleNavigation, getFocusedTabInfo, disableTabClose} from "lightning/platformWorkspaceApi";

export default class DisableTab extends LightningElement {

  @wire(IsConsoleNavigation)
  isConsoleApp

  async disableHandler(event) {
    if (this.isConsoleApp) {
      const {tabId} = await getFocusedTabInfo();
      // event.detail.checked will be true
      console.log('event:', event);
      await disableTabClose(tabId, event.detail.checked);
    }
  }
}