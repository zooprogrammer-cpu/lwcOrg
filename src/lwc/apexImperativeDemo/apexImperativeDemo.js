import { LightningElement } from 'lwc';
import getAccountList from '@salesforce/apex/AccountController.getAccountList';
import { reduceErrors } from 'c/ldsUtils';
export default class ApexImperativeDemo extends LightningElement {
    accounts
    async handleClick(){
        try {
            const result = await getAccountList();
            console.log(result);
            this.accounts = result;

        }
        catch (error) {
            console.error(`error:`, error);
            reduceErrors(error);

        }

    }
    // Test
}