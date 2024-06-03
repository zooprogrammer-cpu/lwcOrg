/**
 *
 */

import {LightningElement, wire} from 'lwc';
import {getFocusedTabInfo, IsConsoleNavigation, setTabHighlighted} from "lightning/platformWorkspaceApi";

export default class HighlightTab extends LightningElement {
  @wire(IsConsoleNavigation)
  isConsoleApp

  async successHandler() {
    if (this.isConsoleApp) {
      const {tabId} = await getFocusedTabInfo();
      await setTabHighlighted(tabId, true, {
        state: 'success',
        pulse: true
      })
    }
  }

  async warningHandler() {
    if (this.isConsoleApp) {
      const {tabId} = await getFocusedTabInfo();
      await setTabHighlighted(tabId, true, {
        state: 'warning',
        pulse: true
      })
    }
  }

  async errorHandler() {
    if (this.isConsoleApp) {
      const {tabId} = await getFocusedTabInfo();
      await setTabHighlighted(tabId, true, {
        state: 'error',
        pulse: true
      })
    }
  }
}