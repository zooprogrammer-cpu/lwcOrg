/**
 * Created by aayushbasnyat on 10/26/23.
 */

import {LightningElement} from 'lwc';
import LightningModal from "lightning/modal";

export default class FlowContainerModal extends LightningModal {
    isPartner = true;


    handleOkay() {
        // this.disableClose = true; // use this to disable close
        this.close('okay');
    }

    handleCancel(){
        this.close('Not okay. Closing!'); // this gets sent to result in the parent component
    }

}