import { LightningElement,track,api } from 'lwc';

export default class PassValue extends LightningElement {

    get FilterByOptions(){
        return [
            {label:"All", value:'All'},
            {label:"Id", value:'Id'},
            {label:'Name', value:'Name'},
            {label:'Title', value:'Title'},
            {label:'Email', value:'Email'}
        ]
    }

    // handleChange(event) {
    //     const select = event.detail.value;
    // }

    // handleExportAction(event) {
    //     const select = event.detail.value;
    // }

    @track value = 'new';
    handleChange(event) {
            // Get the string of the "value" attribute on the selected option
            const selectedOption = event.detail.value;
            alert(`Option selected with value: ${selectedOption}`);
            this.value = event.detail.value;
            console.log(`value is:`, this.value)
        }

}