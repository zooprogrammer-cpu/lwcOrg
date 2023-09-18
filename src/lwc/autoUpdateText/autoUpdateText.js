import { LightningElement } from 'lwc';

export default class AutoUpdateText extends LightningElement {
    text = ''; 
    handleChange(event){
        this.text=event.target.value;
    }


}