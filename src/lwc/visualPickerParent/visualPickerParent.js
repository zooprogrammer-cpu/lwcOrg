import {LightningElement} from 'lwc';

export default class VisualPickerParent extends LightningElement {
    showModal;
    showList() {
        this.showModal = true
    }

}