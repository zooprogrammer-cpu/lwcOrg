/**
 * Created by ashbas on 2/20/25.
 */

import { LightningElement, wire, api, track } from 'lwc';
import getRecentActivities from '@salesforce/apex/ActivityTimelineController.getRecentActivities';

export default class ActivityTimeline extends LightningElement {
  @api recordId;
  @track activities;


  @wire(getRecentActivities, { recordId: '$recordId' })
  wiredActivities({error, data}) {
    if(data) {
      console.log(JSON.stringify(data));
      this.activities = data;
    } else if (error) {
      console.error(error);
    }
  }

}