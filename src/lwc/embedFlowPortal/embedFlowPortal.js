import {LightningElement, api, wire} from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import accountType from '@salesforce/schema/Account.Type';
import accountName from '@salesforce/schema/Account.Name';

export default class EmbedFlowPortal extends LightningElement {
    @api recordId;
    accountName;
    isPartner = false;
    isCustomer = false;

    @wire(getRecord, { recordId: '$recordId', fields: [accountName, accountType] })
    account({ error, data }) {
        if (error) {
            this.error = error;
        } else if (data) {
            this.accountName = data.fields.Name.value;
            if(data.fields.Type.value === 'Technology Partner') {
                this.isPartner = true;
                this.isCustomer = false;
            }
            else if(data.fields.Type.value === 'Customer - Direct') {
                this.isCustomer = true;
                this.isPartner = false;
            }
        }
    }

    get inputVariables() {
        return [
            {
                name: 'accountName',
                type: 'String',
                value: this.accountName
            }
        ];
    }

    handleStatusChange(event) {
        if(event.detail.status === 'FINISHED') {
            //Action after a flow has finished
        }
    }


}