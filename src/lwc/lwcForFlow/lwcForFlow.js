/**
 *
 */

import {LightningElement, api} from 'lwc';
import {FlowNavigationBackEvent, FlowNavigationNextEvent} from "lightning/flowSupport";

export default class LwcForFlow extends LightningElement {
  @api availableActions = [];

  handleNext() {
    if(this.availableActions.find((action)=> action === "NEXT")) {
      const navigateNextEvent = new FlowNavigationNextEvent();
      this.dispatchEvent(navigateNextEvent);
    }
  }

  handleBack() {
    const navigateBackEvent = new FlowNavigationBackEvent();
    this.dispatchEvent(navigateBackEvent);
  }


}