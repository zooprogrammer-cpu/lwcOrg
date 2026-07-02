/**
 * Created by ashbas on 6/29/26.
 */

import { LightningElement, api } from 'lwc';
import counterManager from "c/smCounter";
import {fromContext} from '@lwc/state';

export default class CounterDisplay extends LightningElement {

  counter = fromContext(counterManager);
}