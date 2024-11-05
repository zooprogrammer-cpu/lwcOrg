/**
 * Created by ashbas on 10/21/24.
 */

import {LightningElement, api, wire, track} from 'lwc';
import {ShowToastEvent} from "lightning/platformShowToastEvent";
import getQuoteLineItems from "@salesforce/apex/QuoteLineController.getQuoteLineItems";


export default class QuoteLineCreator extends LightningElement {
  @api recordId;
  quoteLineItems;
  columns = [
    {label: 'Product Name', fieldName: 'Product2Name'},
    {label: 'Quantity', fieldName: 'Quantity', type: 'number'},
    {type: 'button', typeAttributes: { label: 'Remove', name: 'remove'}}
  ];

  @wire(getQuoteLineItems, {quoteId: '$recordId'})
  wiredQuoteLineItems({data, error}) {
    if (data) {
      console.log('this.data: ' , data);
      this.quoteLineItems = data;
    } else if (error) {
      this.showToast('Error', 'Error loading quote line items', 'error');
    }
  }

  showToast(title, message, variant) {
    const event = new ShowToastEvent({title, message, variant});
    this.dispatchEvent(event);
  }

}