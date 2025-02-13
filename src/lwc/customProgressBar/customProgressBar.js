import {LightningElement, track, api, wire} from 'lwc';
import {getFieldValue, getRecord} from "lightning/uiRecordApi";
import STATUS_FIELD from '@salesforce/schema/Project__c.Status__c';

export default class CustomProgressBar extends LightningElement {
  @api recordId;
  @track statusOptions = [
    { label: 'New', value: 'New'},
    { label: 'In Progress', value: 'In Progress'},
    { label: 'On Hold', value: 'On Hold'},
    { label: 'Completed', value: 'Completed'},
    { label: 'Failed', value: 'Failed'}
  ];

  @track selectedStatus = '';
  @track currentStep = '';
  @track status = '';

  @wire(getRecord, {
    recordId: '$recordId',
    fields: [STATUS_FIELD]})
  wiredRecord({ error, data }) {
    if (data) {
      this.status = getFieldValue(data, STATUS_FIELD);
      this.currentStep = this.status; // Example usage
    } else if (error) {
      console.error(error);
    }
  }
}