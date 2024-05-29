/**
 * Created by Ash on 10/31/23.
 */

import {api, LightningElement, track} from 'lwc';
import getContactListFromAccount from '@salesforce/apex/ContactController.getContactListFromAccount';

export default class ParentRefreshComponent extends LightningElement {
  // @track data;
  // @api recordId;
  // getContactResult;
  // contacts;
  // connectedCallback() {
  //   this.fetchData();
  // }
  //
  // async fetchData() {
  //   console.log('in fetch data', this.recordId);
  //   this.getContactResult = await getContactListFromAccount({ recordId: ''});
  //   console.log('getContactResult', this.getContactResult);
  //   this.contacts = [...this.getContactResult];
  // }
  //
  // handleSuccess() {
  //   this.fetchData();
  //   this.template.querySelector('c-child-refresh-component').refreshData();
  // }

  contacts;
  error;

  async handleLoad() {
    try {
      this.contacts = await getContactListFromAccount();
      this.error = undefined;
    } catch (error) {
      this.contacts = undefined;
      this.error = error;
    }
  }
}