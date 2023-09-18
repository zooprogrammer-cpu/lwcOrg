import { LightningElement, track } from 'lwc';
import getAccounts from '@salesforce/apex/comboboxClass.getAccounts';

export default class ComboboxLwc extends LightningElement {
    @track value = '';
    @track value2 = '';
    @track optionsArray = [];
    @track optionsArray2 = [];


    get options() {
        // return [
        //     { label: 'New', value: 'new value' },
        //     { label: 'Salesforce', value: 'Sf Value' }
        // ];
        return this.optionsArray;
    }

    get options2() {
        // return [
        //     { label: 'New', value: 'new value' },
        //     { label: 'Salesforce', value: 'Sf Value' }
        // ];
        return this.optionsArray2;
    }

    connectedCallback() {
        getAccounts()
            .then(result => {
                let arr = [];
                for (let i = 0; i < result.length; i++) {
                    arr.push({ label: result[i].Name, value: result[i].Id })
                }
                this.optionsArray = arr
            })
        getAccounts()
            .then(res => {
                let arr2 = [];
                for (let j = 0; j < res.length; j++) {
                    arr2.push({ label: res[j].Name, value: res[j].Id })
                }
                this.optionsArray2 = arr2
            })
    }

    handleChanged(event) {
        console.log(`handleChanged:`, event.detail.value);
        this.value = event.detail.value
        this.value2 = this.value
    }

    handleChanged2(event) {
        console.log(`handleChanged2:`, event.detail.value);
        this.value = event.detail.value
        this.value2 = this.value
    }



}