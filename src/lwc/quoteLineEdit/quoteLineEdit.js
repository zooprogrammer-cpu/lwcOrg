/**
 * Created by ashbas on 10/23/24.
 */

import {LightningElement, api, track, wire} from 'lwc';
import {refreshApex} from "@salesforce/apex";
import {RefreshEvent} from "lightning/refresh";
import getQuoteLineItems from "@salesforce/apex/QuoteLineController.getQuoteLineItems";

export default class QuoteLineEdit extends LightningElement {
  @api parentQuoteLineId;
  @api recordId;
  @track isLoading = false;
  wiredResult;
  @api quoteLineGroupingFromParent;
  currentQuoteLine;
  @track allFieldTypes;
  isShowFlow = true;

  @wire(getQuoteLineItems, {quoteId: '$recordId'})
  async handleList(wiredResult) {
    this.wiredResult = wiredResult;
  }

  connectedCallback() {
    this.currentQuoteLine = this.quoteLineGroupingFromParent.qlRecordId;
    console.log('this.currentQuoteLine::', this.currentQuoteLine);

  }

  handleStatusChange(event) {
    if (event.detail.status === "FINISHED") {
      console.log('Flow Interview Finished');
      console.log('Output Variables: ', JSON.stringify(event.detail));
      this.fetchUpdatedQuoteLineItems();
    }
  }

  get inputVariables() {
    return [
      {
        name : "recordId",
        type : "String",
        value: this.recordId
      },
      {
        name : "currentQuoteLineId",
        type : "String",
        value: this.currentQuoteLine
      }
    ]
  }

  get flowName() {
    return "Quote_Line_Generator_with_Screen_Flow";
  }

  fetchUpdatedQuoteLineItems() {
    console.log('Refreshing Apex data...');
    refreshApex(this.wiredResult)
        .then(()=>{
          console.log('Apex data refreshed successfully');
        })
        .catch(error=>{
          console.log('Error refreshing Apex class', error);
        })

    this.dispatchEvent(new RefreshEvent());
  }

  closeHandler(){
    const myEvent = new CustomEvent('close')
    this.dispatchEvent(myEvent)
  }

}