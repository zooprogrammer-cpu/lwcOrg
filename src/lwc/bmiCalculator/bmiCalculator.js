/**
 * Created by ashba on 10/8/2024.
 */

import {LightningElement} from 'lwc';

export default class BmiCalculator extends LightningElement {
    handleWeightChange(event) {
        this.weight = event.target.value;
        console.log('Weight:', this.weight);
    }

    handleHeightChange(event) {
        this.height = event.target.value;
        console.log('Height:', this.height);
    }

}