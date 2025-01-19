/**
 * Created by ashbas on 1/13/25.
 */

import {LightningElement} from 'lwc';

export default class FlowInLwc extends LightningElement {
  firstName;
  lastName;
  isShowFlow = false;

  flowVariables = []; // need to pass variables in an array

  showFlowHandler() {
    this.firstName = this.template.querySelector('lightning-input[data-name="firstName"]').value;
    this.lastName = this.template.querySelector('lightning-input[data-name="lastName"]').value;
    this.flowVariables  = [
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