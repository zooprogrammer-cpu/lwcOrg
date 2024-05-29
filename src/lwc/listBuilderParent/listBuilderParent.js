import {LightningElement} from 'lwc';

export default class ListBuilderParent extends LightningElement {
    showModal;
    showList() {
        this.showModal = true
    }


}