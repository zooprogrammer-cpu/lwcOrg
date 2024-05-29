import {LightningElement, track , api} from 'lwc';
import { refreshApex } from '@salesforce/apex';
import updateRecord from '@salesforce/apex/ContactController.updateContact';

export default class ChildRefreshComponent extends LightningElement {
  disableSave;
  @api recordId;
  @api newEmail = '';

  handleEmailChange(event) {
    this.disableSave = true;
    this.newEmail = event.target.value;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (emailRegex.test(this.newEmail)) {
      this.disableSave = false;
    }
  }


  async handleSave() {
    await updateRecord ({ recordId: this.recordId });
    await this.refreshData();

  }

  @api
  refreshData() {
    return refreshApex(this.wiredResult);
  }

}