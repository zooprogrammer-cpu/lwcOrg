/**
 *
 */

import {LightningElement, wire} from 'lwc';
import {getFocusedTabInfo, IsConsoleNavigation, setTabIcon} from "lightning/platformWorkspaceApi";

const ICON_NAME = 'action:goal'
const ICON_ALT_TEXT = 'goal'

export default class SetTabIcon extends LightningElement {
  @wire(IsConsoleNavigation)
  isConsoleTab

  async setTabIconHandler() {
    if (this.isConsoleTab) {
      const {tabId} = await getFocusedTabInfo()
      setTabIcon(tabId, ICON_NAME, {
        iconAlt: ICON_ALT_TEXT
      })
    }
  }
}