import { LightningElement, api, wire, track } from 'lwc';
import getAccountList from '@salesforce/apex/AccountController.getAccountList';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';

const ACCOUNT_COLUMNS = [
    { fieldName: "Name", label: "Name" },
    { fieldName: "Type", label: "Type" }
];

export default class DynamicInteractionListOfAccounts extends LightningElement {
    @api apiName;
    @api listViewApiName;

    columnsList = ACCOUNT_COLUMNS;

    // @wire(getAccountList)
    // wiredAccounts;

    @wire(getAccounts) accounts;

    handleRowSelection(event) {
        const itemSelected = new CustomEvent("itemselected", {
            detail: {
                recordId: event.detail.selectedRows[0].Id,
                accountName: event.detail.selectedRows[0].Name
            }
        });
        this.dispatchEvent(itemSelected);
    }


}