/**
 * Created by ashbas on 6/21/25.
 */

import {LightningElement, track} from 'lwc';
import fetchAccounts from '@salesforce/apex/AccountListController.fetchAccounts';

const COLUMNS = [
  {label: 'Name', fieldName: 'Name'},
  {label: 'Industry' ,fieldName: 'Industry'},
  {label: 'Account Number', fieldName: 'AccountNumber'}
]

export default class InfiniteScrollingDataTable extends LightningElement {

  accountRecords = [];
  error;
  columns = COLUMNS;
  recordSize = 0;
  infiniteLoadingBool = true;
  @track isLoading = false;


  async connectedCallback() {
    console.log('Inside connected callback');
    await this.onLoadMore();
  }

  async onLoadMore(event) {
    this.isLoading = true;
    try {
      const result = await fetchAccounts({ intOffset: this.recordSize });
      if (result.length > 0) {
        this.accountRecords = [...this.accountRecords, ...result];
        this.recordSize += result.length;
      } else if (event && event.target) {
        // No more data, disable infinite loading
        event.target.enableInfiniteLoading = false;
      }
    } catch (error) {
      this.error = JSON.stringify(error);
    }
    this.isLoading = false;
    if (event && event.target) event.target.isLoading = false;
  }

  handleRowSelect(event) {
    const selectedRows = event.detail.selectedRows;
    console.log('selectedRows are: ', JSON.stringify(selectedRows))
  }
}