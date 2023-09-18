import { LightningElement } from 'lwc';
import getData from "@salesforce/apex/AccountControllerAsyncAwait.getAccountData";

const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Industry', fieldName: 'Industry' }
];

export default class AsyncAwaitLwc extends LightningElement {
    data = [];
    columns = columns;

    // if the table needs to be populated on load
    // async connectedCallback(){
    //     const accounts = await getData();
    //     this.data = accounts;
    //     this.numberOfAccounts(); 

    // }
    // if the table needs to populate on click of a button 
    async handleClick() {
        try {
            const accounts = await getData();
            this.data = accounts;
            this.numberOfAccounts();
        }
        catch (error) {
            console.error(error);
        }
    }

    numberOfAccounts() {
        let numAccounts = this.data.length;
        console.log('numAccounts: ', numAccounts);
    }
}