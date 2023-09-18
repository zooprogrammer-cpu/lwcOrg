import { LightningElement } from 'lwc';
import hasViewAllData from '@salesforce/userPermission/ViewAllData'
import myCustomPermission from '@salesforce/customPermission/show_details'

export default class checkPermission extends LightningElement {
    get hasViewAllDataAvail(){
        return hasViewAllData
    }

    get hasCustomPermission(){
        return myCustomPermission
    }
}