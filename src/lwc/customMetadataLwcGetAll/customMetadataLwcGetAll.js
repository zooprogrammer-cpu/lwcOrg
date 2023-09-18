import { LightningElement, wire, track } from 'lwc';
import getDiscount from '@salesforce/apex/CustomMetadataService.getDiscount';
import getAllMetadata from '@salesforce/apex/CustomMetadataService.getAllMetadata';
import {metadataResults} from 'c/customMetadataHelper';

export default class CustomMetadataLwcGetAll extends LightningElement {
    
    selectedInstallemnts = '';
    discount; 
    discountList
    dataFormatted

    @wire(getAllMetadata)
    allData({data,error}){
        if (data){
            console.log(data);
            this.dataFormatted =  JSON.parse(JSON.stringify(data));
        }
        if(error){
            console.error(error)
        }
    }
    

    get options() {
        return [
            { label: 'Gold', value: 'Gold' },
            { label: 'Silver', value: 'Silver' },
            { label: 'Bronze', value: 'Bronze' },
        ];
    }

    handleChange(event) {
        this.selectedInstallemnts = event.detail.value;
        // this.discount = this.dataFormatted[this.selectedInstallemnts].Default_Discount__c;
        this.discount = metadataResults(this.selectedInstallemnts, this.dataFormatted); 
    
   
    }

    

}