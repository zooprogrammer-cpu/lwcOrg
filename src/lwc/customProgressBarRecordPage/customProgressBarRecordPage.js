import { LightningElement, track, api, wire } from 'lwc';
import { getFieldValue, getRecord } from "lightning/uiRecordApi";
import STATUS_FIELD from '@salesforce/schema/Project__c.Status__c';

export default class CustomProgressBarRecordPage extends LightningElement {
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
    let currentStepFound = false;
    this.statusOptions = this.statusOptions.map(option => {
      let optionClass = 'slds-path__item slds-is-incomplete';
      if (option.value === this.currentStep) {
        optionClass = 'slds-path__item slds-is-current slds-is-active';
        currentStepFound = true;
      } else if (!currentStepFound) {
        optionClass = 'slds-path__item slds-is-complete';
      }

      return {
        ...option,
        class: optionClass,
        ariaSelected: option.value === this.currentStep ? 'true' : 'false'
      };
    });
  }
}