import { LightningElement } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class ToastNotification extends LightningElement {
    toastHandler(){
        this.showToast("Success","{0} Account Created {1}","success")
    }

    toastHandlerError(){
       this.showToast("Error", "Cannot compute", "error")
    }

    toastHandlerWarn(){
        this.showToast("Warn", "Danger Will Robinson", "warning")
     }

     toastHandlerInfo(){
        this.showToast("Failed to receive taxes.", "Here is your information", "info")
     }

    showToast(title,message,variant){
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            messageData:[
                'Google',{
                    url:'https://www.google.com',
                    label:'Click here'
                }
            ],
            mode:'pester'

            
        })
        this.dispatchEvent(evt)
    }
}