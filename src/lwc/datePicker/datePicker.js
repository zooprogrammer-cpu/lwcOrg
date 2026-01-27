/**
 * Created by ashbas on 6/29/25.
 */

import { LightningElement, track } from 'lwc';

export default class DatePicker extends LightningElement {
  @track selectedDate;

  handleDateChange(event) {
    this.selectedDate = event.target.value;
    console.log('this.selectedDate:' , this.selectedDate);
    this.dispatchEvent(new CustomEvent('datechange', {
      detail: { date: this.selectedDate }
    }));
  }

  handleUpdateDate() {
    this.selectedDate = '2025-01-01';
  }
}