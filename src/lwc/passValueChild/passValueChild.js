import { LightningElement,api, track } from 'lwc';

export default class PassValueChild extends LightningElement {
    @api sendValue
    
    // async init(){
    //     newValue = this.sendValue

    // }
    
    connectedCallback(){
        console.log(`Running passValueChild`, this.sendValue)
        let newValue = this.sendValue
        console.log(`The child has been updated with`,newValue)
    }

 

    

}