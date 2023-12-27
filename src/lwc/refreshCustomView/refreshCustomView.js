import {LightningElement, api} from 'lwc';
import getAccountRating from '@salesforce/apex/RefreshController.getAccountRating';
import {registerRefreshHandler, unregisterRefreshHandler} from "lightning/refresh";
export default class RefreshCustomView extends LightningElement {
  ratingValue;
  refreshHandlerId;
  @api recordId;
  connectedCallback() {
    // registerRefreshHandler takes two parameters -
    // contextElement -reference of current element(this),
    // providerMethod - callback method(refreshHandler) who listens to the refresh event
    // returns an Id that is a unique identifier of this handler
    // since there could be multiple refresh handlers in multiple components
    this.refreshHandlerId = registerRefreshHandler(this, this.refreshHandler);
    this.fetchRating();
  }
  // whenever there is a refresh, this method gets called -
  refreshHandler() {
    console.log('Something has changed');
    // Returns a promise, if a change was successful, return true, else false
    return new Promise(resolve=>{
        this.fetchRating();   //if any change happens, call the fetchRating method
        resolve(true); //refresh is successful
    })
  }

  fetchRating() {
    getAccountRating({"accountId" : this.recordId}).then(response=>{
      console.log('getAccountRating response: ', response);
      this.ratingValue = response[0].Rating;
      console.log('rating:', response[0].Rating);
    }).catch(error=>{
      console.error('getAccountRating error: ', error);
    })
  }

  disconnectedCallback() {
    unregisterRefreshHandler(this.refreshHandlerId);
  }

}