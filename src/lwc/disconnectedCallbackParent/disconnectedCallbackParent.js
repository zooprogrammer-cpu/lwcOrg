/**
 * Created by ashbas on 8/29/25.
 */

import {LightningElement} from 'lwc';

export default class DisconnectedCallbackParent extends LightningElement {
  show = true;
  handleShowHide() {
    this.show = !this.show;
  }

}