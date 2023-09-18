import { LightningElement } from 'lwc';

export default class HelloConditionalRendering extends LightningElement {
    inputText = null;
    get checkText(){
        return this.inputText === 'Ash'
    }
    changeHandler(event){
        this.inputText = event.target.value
    }
}