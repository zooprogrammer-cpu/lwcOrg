import { LightningElement, api, wire } from 'lwc';
import getContacts from '@salesforce/apex/AccountController.getContacts';
const CONTACT_COLUMNS = [
    {
        fieldName: "Name",
        label: "Name"
    },
    {
        fieldName: "Email",
        label: "Email",
        type: "email"
    },
    {
        fieldName: "Phone",
        label: "Phone",
        type: "phone"
    }
]
export default class DynamicInteractionListOfContacts extends LightningElement {
    @api recordId;
    @api accountName;

    columnsList = CONTACT_COLUMNS;

    @wire(getContacts, { accountId: "$recordId" })
    wiredContacts;


}