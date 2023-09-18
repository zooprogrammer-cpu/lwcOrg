import { api, LightningElement } from 'lwc';
import LightningModal from 'lightning/modal';
export default class Winter23Modal extends LightningModal {
    @api headerText;
    @api content;
    
    // Return a custom value when the modal is closed with the Close button.
    // If no value is returned in the close method, then undefined is returned(Same as closing with the X button).
    handleOkay() {
        // this.disableClose = true; // use this to disable close
        this.close('okay');
    }

    handleCancel(){
        this.close('Not okay. Closing!'); // this gets sent to result in the parent component
    }
}