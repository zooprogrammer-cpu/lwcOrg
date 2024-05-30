/**
 *
 */

import {LightningElement, wire, api} from 'lwc';
import {getFieldValue, getRecord, notifyRecordUpdateAvailable} from "lightning/uiRecordApi";
import updateContact from '@salesforce/apex/ContactController.updateContact';
const FIRST_NAME = 'Contact.FirstName';
const LAST_NAME = 'Contact.LastName';
const contactFields = [FIRST_NAME, LAST_NAME];
export default class NotifyLds extends LightningElement {
    @api recordId;
    showSpinner;
    firstName;

    //Wire a record
    @wire(getRecord, {recordId: '$recordId', fields: contactFields})
    loadContact({error,data}) {
        if(error) {
            console.log('Error getting data:', error);
        }
        else if (data) {
            console.log('Contacts data:', data);
            this.firstName = getFieldValue(data,FIRST_NAME)
        }
    }

    async handleClick() {
        //Do something before the record is updated
        this.showSpinner = true;
        console.log('this.recordId', this.recordId);
        //Update the record via Apex
        await updateContact({recordId: this.recordId});
        //Notify LDS that you've changed the record outside its mechanisms
        //Await the Promise object returned by notifyRecordUpdateAvailable()
        await notifyRecordUpdateAvailable([{recordId: this.recordId}]);
        this.showSpinner = false;

    }


}