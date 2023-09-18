import { LightningElement,api } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';
import STAGENAME_FIELD from '@salesforce/schema/Opportunity.StageName'
import ID_FIELD from '@salesforce/schema/Opportunity.Id'
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class ClosedAction extends LightningElement {
    @api recordId 
    @api invoke(){ 
        const fields ={} //empty object
        fields[ID_FIELD.fieldApiName] = this.recordId //pass the recordId to ID field
        fields[STAGENAME_FIELD.fieldApiName] ='Closed' //pass stage as Closed to Stage
        const recordInput = {fields:fields} //we have to pass these fields to recordInput
        updateRecord(recordInput) //call updateRecord methods to update the field. recordInput returns a promise.
            .then(()=>{
                //when record gets updated succesfully, show toast
                this.showToast("Success!","Opportunity closed succesfully ","success")
            }).catch(error=>{
                // error handling
                this.showToast("Error!",error.message,"error")

            })
        }

        showToast(title, message, variant){
            this.dispatchEvent(new ShowToastEvent({
                title, message, variant
            }))
        }
    
}