/**
 *
 */

import {LightningElement, api} from 'lwc';
import {FlowNavigationBackEvent, FlowNavigationNextEvent} from "lightning/flowSupport";

export default class LwcForFlow extends LightningElement {
  @api availableActions = []; // Gives us the ability to know what actions are available in the flow

  handleNext() {
    // If we are already in the last screen, we don't want to do anything
    if(this.availableActions.find((action)=> action === "NEXT")) {
      const navigateNextEvent = new FlowNavigationNextEvent();
      this.dispatchEvent(navigateNextEvent);
    }
  }

  handleBack() {
    // If we are already in the first screen, we don't want to do anything
    if (this.availableActions.find((action)=> action === "BACK")) {
      const navigateBackEvent = new FlowNavigationBackEvent();
      this.dispatchEvent(navigateBackEvent);
    }

  }

}