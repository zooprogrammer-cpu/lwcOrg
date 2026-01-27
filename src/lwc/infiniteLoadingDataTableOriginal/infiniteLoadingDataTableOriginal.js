/**
 * Created by ashbas on 6/22/25.
 */


import {LightningElement, track} from 'lwc';
import fetchAccounts from '@salesforce/apex/AccountListController.fetchAccounts';

const COLUMNS = [
  { label: 'Name', fieldName: 'Name' },
  { label: 'Industry', fieldName: 'Industry' },
  { label: 'Account Number', fieldName: 'AccountNumber' }
];

export default class InfiniteLoadingDataTableOriginal extends LightningElement {

  accountRecords = [];
  error;
  columns = COLUMNS;
  recordSize = 0;
  isLoadingBool = true;
  infiniteLoadingBool = true;
  @track isLoading = false;

  connectedCallback() {

    console.log( 'Inside connected callback' );
    this.onLoadMore();

  }

  async onLoadMore(event) {
    console.log('recordSize is ', this.recordSize);
    this.isLoading = true;
    try {
      const result = await fetchAccounts({ intOffset: this.recordSize });
      if (result.length > 0) {
        this.accountRecords = [...this.accountRecords, ...result];
        // this.recordSize += result.length;
      } else if (event && event.target) {
        // No more data, disable infinite loading
        event.target.enableInfiniteLoading = false;
      }

    }
    catch(error) {
      this.error = JSON.stringify(error);

    }

    this.recordSize = this.recordSize + 5;
    //
    // fetchAccounts( { intOffSet : this.recordSize } )
    //     .then( result => {
    //
    //       console.log(
    //           'result is ',
    //           JSON.stringify( result )
    //       );

    //       if ( result.length > 0 ) {
    //         if ( this.recordSize > 0 ) {
    //           this.accountRecords = [ ...this.accountRecords, ...result ];
    //           console.log(
    //               'No of Account Records is ',
    //               this.accountRecords.length
    //           );
    //
    //         } else {
    //
    //           this.accountRecords = result;
    //
    //         }
    //
    //         console.log(
    //             'accountRecords are ',
    //             JSON.stringify( this.accountRecords )
    //         );
    //
    //       } else {
    //
    //         this.infiniteLoadingBool = false;
    //
    //       }
    //       this.isLoadingBool = false;
    //
    //     })
    //     .catch( error => {
    //
    //       console.log(
    //           'error is ',
    //           JSON.stringify( error )
    //       );
    //       this.error = JSON.stringify( error );
    //
    //     });
    // this.recordSize = this.recordSize + 5;

  }

  onRowSelection( event ) {

    const selectedRows = event.detail.selectedRows;
    console.log(
        'selectedRows are ',
        JSON.stringify( selectedRows )
    );

  }

}