/**
 * Created by ashbas on 1/13/25.
 */

import {LightningElement, wire} from 'lwc';
import {CurrentPageReference} from "lightning/navigation";

export default class FlowInLwc extends LightningElement {
  firstName;
  lastName;
  isShowFlow = false;
  currentPageReference;
  recordId;

  @wire(CurrentPageReference)
  setCurrentPageReference(currentPageReference) {
    this.currentPageReference = currentPageReference;
    this.recordId = this.currentPageReference.attributes.recordId;
  }



  flowVariables = []; // need to pass variables in an array

  showFlowHandler() {
    this.firstName = this.template.querySelector('lightning-input[data-name="firstName"]').value;
    this.lastName = this.template.querySelector('lightning-input[data-name="lastName"]').value;
    this.flowVariables  = [
      {
        name : "recordId",
        type : "String",
        value: this.recordId
      },
      {
        name : "firstName",
        type : "String",
        value: this.firstName
      },
      {
        name : "lastName",
        type : "String",
        value: this.lastName
      }
    ]
    this.isShowFlow = true;
  }
}