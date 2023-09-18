import { LightningElement } from 'lwc';
import winter23Modal from 'c/winter23Modal';

export default class Winter23ModalLauncher extends LightningElement {
    showModal = true;
    result; 
    async handleShowModal(){
        this.result = await winter23Modal.open({
            // label : 'Modal Header',
            size: 'large',
            description: 'Description of Modal\'s purpose',
            content: 'Passed into content api',
            headerText : 'I am a dynamic header'
        });
        console.log(result);
    }    
}