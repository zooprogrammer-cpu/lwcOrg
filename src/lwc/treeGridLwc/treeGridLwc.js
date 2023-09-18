import { LightningElement,wire } from 'lwc';
import allAccountsWithContact from '@salesforce/apex/AccountContact.allAccountsWithContact';

export default class TreeGridLwc extends LightningElement {
    gridData = []
    @wire (allAccountsWithContact)
    allAccountsWithContactResult({data,error}){
        if(data){
            console.log(data)
            //this.gridData = data
            this.formatGridData(data)
        }
        if(error){
            console.error(error)
        }
    }

    //**Columns */
    gridColumns = [
        {
            label: 'Name',
            fieldName: 'Name',
            type: 'text'
        },
        {
            label: 'Phone',
            fieldName: 'Phone',
            type: 'text'
        },
        {
            label: 'Account Website',
            fieldName: 'Website',
            type: 'url',
            typeAttributes : {
                target: '_blank'
            }
        }

    ]
    
    formatGridData(result){
        this.gridData = result.map(item=>{
            const {Contacts, ...accounts} = item 
            return {...accounts, "_children":Contacts}

        })
        console.log(this.gridData)
    }
}