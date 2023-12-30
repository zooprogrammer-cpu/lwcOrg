import { LightningElement, wire } from 'lwc';
import getContactList from '@salesforce/apex/refreshContactController.getContactList';
import {updateRecord} from "lightning/uiRecordApi";
import {ShowToastEvent} from "lightning/platformShowToastEvent";
import {refreshApex} from "@salesforce/apex";

const columns = [
    {label:'First Name', fieldName:'FirstName', editable:true},
    {label:'Last Name', fieldName:'LastName', editable:true},
    {label:'Email', fieldName:'Email', type:'email'}
]
export default class RefreshLwcDemo extends LightningElement {
    columns = columns;
    draftValues = [];

    // if using a function, need to pass contactResult into refreshApex
    // @wire(getContactList)
    // contact (result) {
    //     contactResult = result;
    //     const {data, value} = result;
    // }

    @wire(getContactList)
    contact
    get isContactAvailable () {
        console.log('contact:', JSON.stringify(this.contact));
        return this.contact && this.contact.data && this.contact.data.length>0? 'Yes' : 'No';
    }

    handleSave(event) {
        console.log('draftValues:', event.detail.draftValues);
        // updateRecord updates record one at a time, so let's make an array
        // slice to make a new copy of the object
        // loop with map that takes each draft value and make a new object with Object.assign
        const recordInputs = event.detail.draftValues.slice().map(draft=>{
            const fields = Object.assign({}, draft)
            return {fields}
        })
        console.log('recordInputs: ', JSON.stringify(recordInputs));
        // call update method
        // since this is asynchronous, we get promise and we store all the promises.
        // it returns an array of promises
        const promises = recordInputs.map(recordInput => updateRecord((recordInput)))
        // when all the promise are resolved, this will run-
        Promise.all(promises).then(result=>{
            this.showToastMsg('Success!', 'Contacts updated', 'success');
            this.draftValues = []; // clearing this otherwise the values show yellow in UI
            return refreshApex(this.contact) // need to pass reference, the first property that holds the data
        }).catch(error=>{
            this.showToastMsg('Error!', error.body.message, 'error');
        })

    }

    showToastMsg(title, message, variant){
        const evt = new ShowToastEvent({
            title,
            message,
            variant
            }
        )
        this.dispatchEvent(evt);
    }
}