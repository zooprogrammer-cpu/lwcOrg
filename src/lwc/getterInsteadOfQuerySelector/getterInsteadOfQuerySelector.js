import { LightningElement } from 'lwc';

export default class GetterInsteadOfQuerySelector extends LightningElement {
    handleInputChange(evt){
        this.template.querySelector('div').style.backgroundColor = `#${evt.target.value}`;   
    }

    //////
    bgColor = '';

    hadleChange(evt) {
        this.bgColor = evt.target.value;
    }

    get divStyle() {
        return `width: 100px; height: 100px; background-color: #${this.bgColor};`
    }

}