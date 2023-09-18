import { LightningElement } from 'lwc';
import ToastContainer from 'lightning/toastContainer';
import Toast from 'lightning/toast';

export default class ToastMessageContainer extends LightningElement {
    connectedCallback() {
        const toastContainer = ToastContainer.instance();
        toastContainer.maxShown = 4;
        toastContainer.toastPosition = 'top-right';
    }
    showError() {
        Toast.show(
            {
                label: 'Sample Toast Title at {0}',
                labelLinks: [
                    {
                        url: 'https://www.trailhead.com',
                        label: 'Trailhead'
                    }
                ],
                message:
                    'If you want to learn, {0}. Can also go here {1} for new updates.',
                messageLinks: [
                    {
                        url: 'https://www.youtube.com/',
                        label: 'YouTube'
                    },
                    {
                        url: 'https://www.google.com',
                        label: 'Google, Inc.'
                    }
                ],
                mode: 'sticky',
                variant: 'error',
                onclose: () => {
                    console.log('###Toast Close');
                }
            },
            this
        );
    }
    showWarning() {
        //Show Warning Toast
    }
    showSuccess() {
        //Show Success Toast

    }
    showInfo() {
        //Show Info Toast
    }
}