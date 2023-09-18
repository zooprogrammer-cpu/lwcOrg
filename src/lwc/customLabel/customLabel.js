import { LightningElement } from 'lwc';
import DESCRIPTION_ONE from '@salesforce/label/c.descriptionOne'
import DESCRIPTION_TWO from '@salesforce/label/c.descriptionTwo'

export default class CustomLabel extends LightningElement {
   // descriptionOne = DESCRIPTION_ONE
   // descriptionTwo = DESCRIPTION_TWO
    LABELS= {
        descriptionOne:DESCRIPTION_ONE,
        descriptionTwo:DESCRIPTION_TWO
    }
}