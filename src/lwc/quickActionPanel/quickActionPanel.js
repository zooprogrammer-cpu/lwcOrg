import { LightningElement, api } from 'lwc';

export default class QuickActionPanel extends LightningElement {
    @api invoke() {
        console.log('Hello, world!');
    }
}