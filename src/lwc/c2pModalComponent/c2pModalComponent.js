import { LightningElement } from 'lwc';

export default class C2pModalComponent extends LightningElement {

    closeHandler(){ 
        const myEvent = new CustomEvent('close',{
            bubbles:true,
            detail:{
                msg:"Modal closed succesfully"
            } 
        })
        this.dispatchEvent(myEvent)
    }

    footerHandler(){
        console.log("Footer Event Called")
    }
}