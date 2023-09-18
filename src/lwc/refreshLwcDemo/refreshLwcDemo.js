import { LightningElement,wire } from 'lwc';
import getContactList from '@salesforce/apex/refreshContactController.getContactList';
import { updateRecord } from 'lightning/uiRecordApi';
import{ShowToastEvent} from 'lightning/platformShowToastEvent';
import {refreshApex} from '@salesforce/apex'; 
const columns = [
    { label: 'First Name', fieldName: 'FirstName',editable: true },
    { label: 'Last Name', fieldName: 'LastName', editable: true },
    { label: 'Email', fieldName: 'Email', type: 'email' }
];
export default class RefreshLwcDemo extends LightningElement {
    columns = columns;
    contacts=[];
    draftValues=[];
    @wire(getContactList)
    contact; 
    // get isContactAvailable(){
    //     console.log(JSON.stringify(this.contact))
    //     return this.contact && this.contact.data && this.contact.data.length>0? 'Yes':'No'

    // }
    // listViewHandler({data, error}){
    //     if(data){
    //         console.log(data)
    //         this.contacts = data.records.records.map(item=>{
    //             return {
    //                 "Id": this.getValue(item, 'Id'),
    //                 "Name": this.getValue(item, 'Name'),
    //                 "Title": this.getValue(item, 'Title'),
    //                 "Phone": this.getValue(item, 'Phone'),
    //                 "Email": this.getValue(item, 'Email')
    //             }
    //         })
    //     }
    //     if(error){
    //         console.error(error)
    //     }
    // }  
    
    // getValue(data, field){
    //     return data.fields[field].value
    // }

    handleSave(event){
        console.log('These are the draft values:',JSON.stringify(event.detail.draftValues))
        const recordInputs=event.detail.draftValues
        
        console.log('Thes are the recordInputs:',recordInputs)

        updateRecord(recordInputs)
        this.draftValues=[]
        return refreshApex(this.contact)

        // const promises = recordInputs.map(recordInput=>updateRecord(recordInput))
        // Promise.all(promises).then(()=>{
        //     console.log('COntact updated Successfully')
        //     this.draftValues=[]
        //     return refreshApex(this.contact)
        // }).catch(error=>{
        //     console.error("Error updating the record", error)
        // })
        
    }
}