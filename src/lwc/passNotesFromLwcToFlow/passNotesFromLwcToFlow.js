/**
 * Created by ashbas on 4/7/25.
 */

import {LightningElement, api} from 'lwc';
import {FlowAttributeChangeEvent} from "lightning/flowSupport";

export default class PassNotesFromLwcToFlow extends LightningElement {
  notes;
  _selectedNotesToFlow;

  @api set selectedNotesToFlow(value) {
    if (value) {
      this._selectedNotesToFlow = value;
    }
  }

  get selectedNotesToFlow() {
    return this._selectedNotesToFlow;
  }


  //
  connectedCallback() {
    this.notes = 'DFGC';
  }


  handleTransferToFlow() {

    this.transferText = `Hello from LWC ${this.notes}`;
    console.log('transferText:', this.transferText);
    const attributeChangeEvent = new FlowAttributeChangeEvent(
        'selectedNotesToFlow',
        this.transferText
    );

    this.dispatchEvent(attributeChangeEvent);
  }

}