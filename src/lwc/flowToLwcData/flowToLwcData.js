/**
 * Created by ashbas on 2/26/25.
 */

import {api, LightningElement} from 'lwc';

export default class FlowToLwcData extends LightningElement {
  @api color = 'black'; //getting from flow
  @api text = 'Hello world!'; //getting from flow
  @api arrivalDate

  get colorStyle() {
    return `color:${this.color}`;
  }
}