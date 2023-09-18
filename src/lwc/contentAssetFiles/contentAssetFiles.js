import { LightningElement } from 'lwc';
import PAYMENTMETHODS_FILE from '@salesforce/contentAssetUrl/Payment_methodspdf'
export default class ContentAssetFiles extends LightningElement {
    file = PAYMENTMETHODS_FILE
}