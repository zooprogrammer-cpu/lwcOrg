import { LightningElement,api, track } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import updateEmail from '@salesforce/apex/AccountController.updateEmail';
import { RefreshEvent } from 'lightning/refresh';
export default class QsEmailAddressModal extends LightningElement {
    disableSave;
    @api recordId;
    @api newEmail = '';
    showSpinner;

    handleEmailChange(event) {
        this.disableSave = true;
        this.newEmail = event.target.value;
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (emailRegex.test(this.newEmail)) {
            this.disableSave = false;

        }
    }

    async handleSave() {
        try {
            // Pass the new email address to the updateEmail apex controller
            this.showSpinner = true;
            const result = await updateEmail({conId: this.recordId, newEmail: this.newEmail});
            // Show Toast
            this.dispatchEvent(new ShowToastEvent({
                title: "Success",
                message: "Account and Contacts Updated",
                variant: "success"
            }));
            this.showSpinner = false;
            //Trigger RefreshView APIs -for standard components refresh
            this.dispatchEvent(new RefreshEvent());
            //
        }
        catch(error) {
            console.log('Error Updating Email', error);
        }

    }
}