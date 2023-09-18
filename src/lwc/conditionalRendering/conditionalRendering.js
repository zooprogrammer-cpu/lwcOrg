import { LightningElement } from 'lwc';

export default class ConditionalRendering extends LightningElement {
    isVisible = false;
    typedText =null;
    handleClick(){
        console.log(`Button clicked`)
        //this.isVisible = true;
        this.isVisible =!this.isVisible;
    }

    changeHandler(event){
        this.typedText = event.target.value
    }

    get checkText(){
        return this.typedText==='Hello' // this expression returns true if 'Hello' is typed
    }
}