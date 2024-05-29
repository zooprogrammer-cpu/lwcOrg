import { LightningElement, api, wire, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getAccountList from "@salesforce/apex/AccountController.getAccList";

export default class VisualPicker extends LightningElement {
    @track loaded;
    @api selectedAccounts = [];
    @api selectedAccsString;
    message;
    accounts;
    @api showModal;

    // @api show() {
    //     this.showModal = true;
    // }
    @wire(getAccountList)
    wiredAccounts({ error, data }) {
        if (data) {
            this.accounts = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.accounts = undefined;
        }
    }

    handleCheck(event) {
        console.log("###Current Target : " + event.currentTarget.name);
    }

    closeModal() {
        this.showModal = false;
    }
}