/**
 *
 */

import {LightningElement} from 'lwc';

export default class LightningRecordPickerStatic extends LightningElement {
    selectedRecordId ='';

    matchingInfo = {
        primaryField: {fieldPath:"Name"},
        additionalFields: [{fieldPath: "Title"}]
    };

    displayInfo = {
        additionalFields: ["Title"]

    }

    // Can add filter so that only Accounts with Game shows up on results
    filter = {
        criteria: [
            {
                fieldPath: "Account.Name",
                operator: "like",
                value: "Game%"
            }
        ]
    };

    // By default, only name is being matched. So customizing above to match text or text formula field such as Title
    handleChange(event) {
        console.log('event', event);
        this.selectedRecordId =event.detail.recordId;
        console.log("---this.selectedRecordId : ", this.selectedRecordId );
    }
}