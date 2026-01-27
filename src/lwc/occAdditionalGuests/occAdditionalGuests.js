/**
 * Created by ashbas on 5/20/25.
 */

import {LightningElement, track} from 'lwc';

export default class OccAdditionalGuests extends LightningElement {

  @track additionalGuests = []

  connectedCallback() {
    let firstGuest = 'Homer Simpson'
    this.additionalGuests.push(firstGuest);
    let secondGuest = 'Marge Simpson';
    this.additionalGuests.push(secondGuest);
  }

  handleClickAddGuest() {

  }


}