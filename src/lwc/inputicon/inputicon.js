import { LightningElement } from 'lwc';
import { loadStyle } from 'lightning/platformResourceLoader';
import input from '@salesforce/resourceUrl/input'
export default class InputIcon extends LightningElement {
    showpassword = false

    get passwordIcon(){
        return this.showpassword ? 'utility:hide':'utility:preview'
    }
    get passwordType(){
        return this.showpassword ? 'text':'password'
      }

    connectedCallback(){
        loadStyle(this, input).then(()=>{
            console.log("styles loaded successfully")
        }).catch(error=>{
            console.error(error)
        })
    }
    passwordHandler(){
        this.showpassword = !this.showpassword
      }
}