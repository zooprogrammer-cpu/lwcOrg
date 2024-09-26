/**
 * Created by ashbas on 9/26/24.
 */

import { LightningElement, api, track } from 'lwc';
import { subscribe, unsubscribe, onError, setDebugFlag, isEmpEnabled } from 'lightning/empApi';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import userId from '@salesforce/user/Id';
export default class NewLeadEmpApiNotification extends LightningElement {

    @track message ='';
    @track toastMessage;
    @api recordId;
    channelName = '/event/newLeadEmpApiEvent__e';
    currentUserId = userId;


    connectedCallback() {
        const self = this;
        const toastCallback = function (response){
            console.log('response data:', JSON.parse(JSON.stringify(response)));
            console.log('message received: ', response.data.payload.message__c);
            console.log('leadRecordId: ', response.data.payload.leadRecordId__c);
            console.log('ownerId: ', response.data.payload.ownerId__c);
            self.message = response.data.payload.message__c;
            console.log('self.message: ', self.message);
            if (self.message){
                self.showToast("Success",self.message,"success")
            }
        }

        this.registerErrorListener();

        // Invoke subscribe method of empApi. Pass reference to messageCallback
        subscribe(this.channelName, -1, toastCallback).then((response) => {
            // Response contains the subscription information on subscribe call
            console.log(
                'Subscription request sent to: ',
                JSON.stringify(response.channel)
            );
            this.subscription = response;
        });
        onError(error => {
            console.log('Error in Platform Event Toast');
            console.log(error);
        });

    }

    registerErrorListener() {
        // Invoke onError empApi method
        onError((error) => {
            console.log('Received error from server: ', JSON.stringify(error));
            // Error contains the server-side error
        });
    }

    showToast(title,message,variant){
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: "sticky"
        })
        this.dispatchEvent(evt)
    }

    disconnectedCallback() {
        unsubscribe(this.subscription, response => {
            console.log('Un-Subscribed from Platform Event Toast');
            console.log(response);
        });
    }




}
