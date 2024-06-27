/**
 *
 */

import {api, LightningElement} from 'lwc';

export default class DisplayColoredText extends LightningElement {
  @api color = 'black'; //getting from flow
  @api text = 'Hello world!'; //getting from flow

  get colorStyle() {
    return `color:${this.color}`;
  }


}