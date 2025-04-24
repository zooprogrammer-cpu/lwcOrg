/**
 * Created by ashbas on 4/9/25.
 */

import {LightningElement, track, wire} from 'lwc';
import getContacts from "@salesforce/apex/DataTableSortingController.getContacts";
import {ShowToastEvent} from "lightning/platformShowToastEvent";

const columns = [ { label: 'FirstName', fieldName: 'FirstName', sortable: "true"},
  { label: 'LastName', fieldName: 'LastName', sortable: "true"},
  { label: 'Phone', fieldName: 'Phone', type: 'phone', sortable: "true"},
  { label: 'Email', fieldName: 'Email', type: 'email', sortable: "true" },];

export default class DataTableWithDisabledRows extends LightningElement {
  data;
  columns = columns;
  selectedRows;

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

  handleRowSelect(event) {
    const selectedRowsTemp = event.detail.selectedRows.filter(row => {
      if (row.FirstName === 'Josh') {
        this.dispatchEvent(
            new ShowToastEvent({
              title: 'Info',
              message: 'Row selection is not allowed',
              variant: 'info'
            })
        );
        return false; // Exclude rows with FirstName 'Josh'
      }
      return true;
    });

    // Update the selectedRows property with the filtered rows
    this.selectedRows = selectedRowsTemp.map(row => row.Id);
  }

}