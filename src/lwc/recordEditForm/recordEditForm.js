import { LightningElement,api } from 'lwc';
import CONTACT_OBJECT from '@salesforce/schema/Contact'
import NAME_FIELD from '@salesforce/schema/Contact.Name'
import TITLE_FIELD from '@salesforce/schema/Contact.Title'
import PHONE_FIELD from '@salesforce/schema/Contact.Phone'
import EMAIL_FIELD from '@salesforce/schema/Contact.Email'
import ACCOUNT_FIELD from '@salesforce/schema/Contact.AccountId'
import {ShowToastEvent} from 'lightning/platformShowToastEvent';


export default class RecordEditForm extends LightningElement {
    objectName = CONTACT_OBJECT
    fields ={
        accountField:ACCOUNT_FIELD,
        nameField: NAME_FIELD,
        titleField: TITLE_FIELD,
        phoneField: PHONE_FIELD,
        emailField: EMAIL_FIELD
    }
    successHandler(event){
        console.log(event.detail.id)
        const toastEvent = new ShowToastEvent({
            title: "Contact created",
            message:"Record ID:"+ event.detail.id,
            variant:"success"
        })
        this.dispatchEvent(toastEvent)
    }

    handleReset(){
        const inputFields = this.template.querySelectorAll('lightning-input-field')
        if(inputFields){
            Array.from(inputFields).forEach(fields=>{
                fields.reset()
            })
        }
    }
}