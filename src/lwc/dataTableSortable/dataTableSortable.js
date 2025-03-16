import {LightningElement, wire, track} from 'lwc';
import getContacts from '@salesforce/apex/DataTableSortingController.getContacts';

// datatable columns with row actions. Set sortable = true
const columns = [ { label: 'FirstName', fieldName: 'FirstName', sortable: "true"},
  { label: 'LastName', fieldName: 'LastName', sortable: "true"},
  { label: 'Phone', fieldName: 'Phone', type: 'phone', sortable: "true"},
  { label: 'Email', fieldName: 'Email', type: 'email', sortable: "true" },];

export default class DataTableSortable extends LightningElement {
  @track data;
  @track columns = columns;
  @track sortBy;
  @track sortDirection;

  @wire(getContacts)
  contacts(result) {
    if (result.data) {
      this.data = result.data;
      this.error = undefined;
    } else if (result.error) {
      this.error = result.error;
      this.data = undefined;
    }
  }

  doSorting(event) {
    this.sortBy = event.detail.fieldName;
    this.sortDirection = event.detail.sortDirection;
    this.sortData(this.sortBy, this.sortDirection);
  }

  sortData(fieldname, direction) {
    let parseData = JSON.parse(JSON.stringify(this.data));
    // Return the value stored in the field
    let keyValue = (a) => {
      return a[fieldname];
    };
    // cheking reverse direction
    let isReverse = direction === 'asc' ? 1: -1;
    // sorting data
    parseData.sort((x, y) => {
      x = keyValue(x) ? keyValue(x) : ''; // handling null values
      y = keyValue(y) ? keyValue(y) : '';
      // sorting values based on direction
      return isReverse * ((x > y) - (y > x));
    });
    this.data = parseData;
  }
}