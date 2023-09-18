import { LightningElement,api } from 'lwc';

export default class P2cSliderComponent extends LightningElement {
    val=20 //sends this value to the child html slider
    changeHandler(event){
        this.val=event.target.value
    }
    //make public method
    @api resetSlider(){
        this.val = 50 
    }
}