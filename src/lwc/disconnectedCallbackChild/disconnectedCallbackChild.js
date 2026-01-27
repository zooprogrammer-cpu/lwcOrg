/**
 * Created by ashbas on 8/29/25.
 */

import {LightningElement} from 'lwc';

export default class DisconnectedCallbackChild extends LightningElement {
  disconnectedCallback() {
    console.log('Disconnected callback in child');
  }
}