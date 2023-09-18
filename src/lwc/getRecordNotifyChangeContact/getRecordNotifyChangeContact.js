import { LightningElement, wire, api } from 'lwc';
import getContactList from '@salesforce/apex/ContactController.getContactList';
import updateContacts from '@salesforce/apex/ContactController.updateContacts';
import {refreshApex} from '@salesforce/apex';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import {getRecordNotifyChange} from 'lightning/uiRecordApi';

const COLS = [
    {label: "First Name", fieldName: "FirstName", editable: true},
    {label: "Last Name", fieldName: "LastName", editable: true},
    {label: "Title", fieldName: "title"},
    {label: "Phone", fieldName: "phone"},
    {label: "Email", fieldName: "email"}
];

export default class GetRecordNotifyChange extends LightningElement {
    @api recordId
}