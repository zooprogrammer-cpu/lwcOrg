import { LightningElement } from 'lwc';
import ToastContainer from 'lightning/toastContainer';
import Toast from 'lightning/toast';

export default class ToastMessageContainer extends LightningElement {
    connectedCallback() {
        const toastContainer = ToastContainer.instance();
        toastContainer.maxShown = 3;
        toastContainer.toastPosition = 'top-right';
    }

    showError() {
        Toast.show({
            label : 'Sample Toast Title at {0}',
            labelLinks : [
                {
                    url: 'https://www.google.com',
                    label:  'Google'
                }
            ],
            message : 'Visit us at {0}. Follow the {1} for new updates ',
            messageLinks: [{
                url: 'https://www.youtube.com',
                label: 'YouTube'
            },
                {
                    url: 'https://www.notion.com',
                    label: 'Blog'
                }
            ],
            mode: 'sticky',
            variant: 'error',
            onclose: ()=>{
                console.log('###Toast Close');
            }
        }, this);
    }

showWarning() {
    const evt = new ShowToastEvent({
        title: 'Salesforce Toast',
        message: 'Salesforce LWC Stack Example',
        variant: 'warning'
    });
    this.dispatchEvent(evt);
}
showSuccess() {
    const evt = new ShowToastEvent({
        title: 'Salesforce Toast',
        message: 'Salesforce LWC Stack Example',
        variant: 'success'
    });
    this.dispatchEvent(evt);
}
showInfo() {
    const evt = new ShowToastEvent({
        title: 'Salesforce Toast',
        message: 'Salesforce LWC Stack Example',
        variant: 'info'
    });
    this.dispatchEvent(evt);
}
}