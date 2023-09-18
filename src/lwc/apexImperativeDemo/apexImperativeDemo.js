import { LightningElement } from 'lwc';
import getAccountList from '@salesforce/apex/AccountController.getAccountList'
export default class ApexImperativeDemo extends LightningElement {
    accounts
    handleClick(){
        getAccountList().then(result=>{
            console.log(result)
            this.accounts = result
        }).catch(error=>{
            console.error(error)
        })
    }
    // Test
}