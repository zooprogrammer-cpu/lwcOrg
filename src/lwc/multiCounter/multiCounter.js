/**
 * Created by ashbas on 6/29/26.
 */

import {LightningElement} from 'lwc';
import counterManager from 'c/smCounter';

export default class MultiCounter extends LightningElement {
  // Create one shared instance with initial value 100
  counter = counterManager(100);
}