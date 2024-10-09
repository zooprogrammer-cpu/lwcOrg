import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class LightningToastExample extends NavigationMixin(LightningElement) {

    showToastWithLink() {
        const event = new ShowToastEvent({
            title: 'Success!',
            message: 'Record {0} created! See it {1}!',
            messageData: [
                'Salesforce',
                {
                    url: 'http://www.salesforce.com/',
                    label: 'here',
                },
            ],
        });
        this.dispatchEvent(event);
    }

    handleButtonClick() {
        const event = new ShowToastEvent({
            title: 'Success!',
            message: 'Record {0} created! See it {1}!',
            messageData: [
                'Salesforce',
                {
                    url: 'http://www.salesforce.com/',
                    label: 'here',
                },
            ],
        });
        this.dispatchEvent(event);
    }

    handleRecordClick() {
        this[NavigationMixin.GenerateUrl]({
            type: 'standard__recordPage',
            attributes: {
                recordId: '003xx000000001eAAA',
                actionName: 'view',
            },
        }).then((url) => {
            const event = new ShowToastEvent({
                title: 'Success!',
                message: 'Record {0} created! See it {1}!',
                messageData: [
                    'Salesforce',
                    {
                        url,
                        label: 'here',
                    },
                ],
            });
            this.dispatchEvent(event);
        });
    }
}