import { LightningElement,api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation'
export default class NavigateToLwc extends NavigationMixin(LightningElement) {
    @api recordId
    navigateToLwc(){ 

        var definition ={
            componentDef:'c:navigationLwcTarget',
            attributes:{
                recordId:this.recordId
            }
                }
        this[NavigationMixin.Navigate]({
            type:'standard__webPage',
            attributes: {
                url:'/one/one.app#'+btoa(JSON.stringify(definition))
            }
        })
    }
}