/**
 * Created by ashbas on 9/26/24.
 */

import { LightningElement, api, track } from 'lwc';
import { subscribe, unsubscribe, onError, setDebugFlag, isEmpEnabled } from 'lightning/empApi';
// import { ShowToastEvent } from "lightning/platformShowToastEvent";
import ToastContainer from 'lightning/toastContainer';
import Toast from 'lightning/toast';
import userId from '@salesforce/user/Id';
export default class NewLeadEmpApiNotification extends LightningElement {
    //
    // @track message ='';
    // recordUrl;
    // @api recordId;
    // channelName = '/event/newLeadEmpApiEvent__e';
    // currentUserId = userId;


    // connectedCallback() {
    //     const toastContainer = ToastContainer.instance();
    //     toastContainer.maxShown = 3;
    //     toastContainer.toastPosition = 'top-right';
    //
    //
    //     const toastCallback = (response) => {
    //         console.log('response data:', JSON.parse(JSON.stringify(response)));
    //         console.log('message received: ', response.data.payload.message__c);
    //         console.log('leadRecordId: ', response.data.payload.leadRecordId__c);
    //         console.log('ownerId: ', response.data.payload.ownerId__c);
    //         console.log('currentUserId: ', this.currentUserId);
    //         console.log('recordUrl: ', response.data.payload.recordUrl__c);
    //         this.message = response.data.payload.message__c;
    //         this.recordUrl = response.data.payload.recordUrl__c;
    //         console.log('self.message: ', this.message);
    //         if (this.message && this.currentUserId === response.data.payload.ownerId__c) {
    //             this.showNewToast( this.message, this.recordUrl );
    //         }
    //     }
    //
    //     this.registerErrorListener();
    //
    //     // Invoke subscribe method of empApi. Pass reference to messageCallback
    //     subscribe(this.channelName, -1, toastCallback).then((response) => {
    //         // Response contains the subscription information on subscribe call
    //         console.log(
    //             'Subscription request sent to: ',
    //             JSON.stringify(response.channel)
    //         );
    //         this.subscription = response;
    //     });
    //     onError(error => {
    //         console.log('Error in Platform Event Toast');
    //         console.log(error);
    //     });
    //
    // }

    // registerErrorListener() {
    //     // Invoke onError empApi method
    //     onError((error) => {
    //         console.log('Received error from server: ', JSON.stringify(error));
    //         // Error contains the server-side error
    //     });
    // }

    // showNewToast(toastMessage, recordUrl) {
    //     Toast.show({
    //         label : toastMessage,
    //         message : 'Click {0} to open the Inquiry ',
    //         messageLinks: [{
    //             url: recordUrl,
    //             label: 'here'
    //         },
    //         ],
    //         mode: 'sticky',
    //         variant: 'success',
    //         onclose: ()=>{
    //             console.log('###Toast Close');
    //         }
    //     }, this);
    // }

    // showToast(title,message,variant){
    //     const evt = new ShowToastEvent({
    //         title: title,
    //         message: message,
    //         variant: variant,
    //         mode: "sticky"
    //     })
    //     this.dispatchEvent(evt)
    // }

    //
    // disconnectedCallback() {
    //     unsubscribe(this.subscription, response => {
    //         console.log('Un-Subscribed from Platform Event Toast');
    //         console.log(response);
    //     });
    // }

}