import { LightningElement,api,wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
//Import Bear Object Fields
import SUPERVISOR_FIELD from '@salesforce/schema/Bear__c.Supervisor__c';
const bearFileds = [SUPERVISOR_FIELD];
export default class BearSupervisor extends LightningElement {
    @api recordId; //Bear Id
    @wire(getRecord, {recordId:'$recordId', fields: bearFileds})
    bear;

    get supervisorId(){
        return getFieldValue(this.bear.data, SUPERVISOR_FIELD);
    }
    
}