import { LightningElement } from 'lwc';

export default class P2cParentComponent extends LightningElement {

    //progress bar component
    percentage = 10 //default percentage indicator value is 10 
    name = 'Ash'
    changeHandler(event){
        this.percentage = event.target.value

    }

    //slider component
    handleClick(){
        this.template.querySelector("c-p2c-slider-component").resetSlider()
    }
}