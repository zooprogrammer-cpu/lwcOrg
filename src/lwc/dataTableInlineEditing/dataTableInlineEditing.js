import { LightningElement, wire } from 'lwc';
import getContactList from '@salesforce/apex/ContactController.getContactList';
import { updateRecord } from "lightning/uiRecordApi";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

//Define columns for the data table. Together with that we need to pass the attribute
//editable - true in order make the column editable
const COLUMNS = [
  { label: 'First Name', fieldName: 'FirstName', editable: true},
  { label: 'Last Name', fieldName: 'LastName', editable: true },
  { label: 'Email', fieldName: 'Email', editable: true },
];

export default class DataTableInlineEditing extends LightningElement {
  columns = COLUMNS;

  data = [];
  //Storing draft values for inline editing
  draftValues = [];
  wiredContacts;

  //Fetches the contact detail using Apex wire service
  @wire(getContactList)
  contacts(result){
    this.wiredContacts = result;  // For refresh apex
    const {data, error} = result;
    if(data){
      this.data = data;
    }else if(error){
      console.error(error);
    }
  }

  // Handles the save event triggered by inline editing
  handleSave(event) {
    // Extract the draft values from the onsave event
    this.draftValues = event.detail.draftValues;
    //console.log(JSON.stringify(this.draftValues));

    // Convert draft values into record input objects
    const recordInputs = this.draftValues.slice().map(draft => {
      const fields = { ...draft };
      //console.log(JSON.stringify(fields));
      return { fields };
    });
    //console.log(JSON.stringify(recordInputs));

    try {
      // Perform update operations for all draft records updateRecord uiRecordApi
      const updatePromises = recordInputs.map(recordInput => updateRecord(recordInput));
      Promise.all(updatePromises).then(() => {
        //display success toast message
        this.dispatchEvent(
            new ShowToastEvent({
              title: 'Updated',
              message: 'Records Updated Successfully',
              variant: 'success'
            })
        );

        // Clear draft values after successful update
        this.draftValues = [];

        // Refresh the data table after clicking Save
        return refreshApex(this.wiredContacts);
      }).catch(error => {
        // Handle errors during update
        this.dispatchEvent(
            new ShowToastEvent({
              title: 'Error',
              message: 'An Error '+error,
              variant: 'error'
            })
        );
      });
    }catch(error){
      console.error(error);
    }
  }
}