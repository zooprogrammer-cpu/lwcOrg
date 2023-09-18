import { LightningElement, wire, track } from 'lwc';
import getDiscount from '@salesforce/apex/CustomMetadataService.getDiscount';
export default class CustomMetadataLwc extends LightningElement {
    
    selectedInstallemnts = '';
    discount; 

    @wire(getDiscount, {supportTier:'$selectedInstallemnts'})
    filteredDiscountResult({data,error}){
        if (data){
            console.log(data);
            this.discount = data; 
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
        
    }

}