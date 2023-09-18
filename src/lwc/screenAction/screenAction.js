import { LightningElement, api } from 'lwc';

export default class ScreenAction extends LightningElement {
    @api invoke() {
        console.log('Hello, world!');
      }
}