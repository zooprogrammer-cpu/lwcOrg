import { LightningElement, track, api, wire } from 'lwc';
import { getFieldValue, getRecord } from "lightning/uiRecordApi";
import STATUS_FIELD from '@salesforce/schema/Project__c.Status__c';

export default class CustomProgressBar extends LightningElement {
  @api recordId;
  @track statusOptions = [
    { label: 'New', value: 'New' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'On Hold', value: 'On Hold' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Failed', value: 'Failed' }
  ];

  @track selectedStatus = '';
  @track currentStep = '';

  @wire(getRecord, {
    recordId: '$recordId',
    fields: [STATUS_FIELD]
  })
  wiredRecord({ error, data }) {
    if (data) {
      this.selectedStatus = getFieldValue(data, STATUS_FIELD);
      this.currentStep = this.selectedStatus;
      this.updateStatusOptions();
    } else if (error) {
      console.error(error);
    }
  }

  updateStatusOptions() {
    this.statusOptions = this.statusOptions.map(option => {
      return {
        ...option,
        class: option.value === this.currentStep ? 'slds-path__item slds-is-current slds-is-active' : 'slds-path__item slds-is-incomplete',
        ariaSelected: option.value === this.currentStep ? 'true' : 'false'
      };
    });
  }
}