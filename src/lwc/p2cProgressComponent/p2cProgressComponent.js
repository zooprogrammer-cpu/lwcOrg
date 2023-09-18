import { LightningElement,api } from 'lwc';

export default class P2cProgressComponent extends LightningElement {
    @api progressValue //grabs the progress input value from parent
    @api myName
    
}