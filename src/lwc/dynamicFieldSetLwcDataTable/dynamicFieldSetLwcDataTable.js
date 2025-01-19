/**
 * Created by ashbas on 1/14/25.
 */

import {LightningElement, api, wire} from 'lwc';
import fetchFieldSet from '@salesforce/apex/DynamicFieldSetController.fetchFieldSet';

export default class DynamicFieldSetLwcDataTable extends LightningElement {
  @api objectApiName = '';
  @api fieldSetName = '';
  @api searchField = '';
  @api customLimit;
  @api title;

  columns = [];
  data = [];

  connectedCallback() {
    this.refreshData();
  }

  refreshData() {
    fetchFieldSet({objectApiName: this.objectApiName, fieldSetName: this.fieldSetName, customLimit: this.customLimit})
        .then(result => {
          // Set the column headers
          this.columns = Object.keys(result[0]).map(fieldName => {
            return {label: fieldName, fieldName: fieldName};
          });
          // Setting the table data
          this.data = result;
        })
        .catch(error => {
          console.error(error);
        });
  }

  handleSearch(event) {
    //Retrieve the search term entered by the user
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm.length > 0) {
      // Filter the data based on the search term
      this.data = this.data.filter(row => {
        const value = String(row[this.searchField]).toLowerCase();
        return value.includes(searchTerm);
      });
    } else {
      // Refresh the data when the search term is empty
      this.refreshData();
    }
  }
}