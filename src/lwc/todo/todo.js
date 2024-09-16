/**
 * Created by ashbas on 9/12/24.
 */

import {LightningElement, wire} from 'lwc';
import {refreshApex} from "@salesforce/apex";
import getTodoItems from '@salesforce/apex/TodoController.getTodoItems';
import { enablePopout, updateUtility, EnclosingUtilityId } from 'lightning/platformUtilityBarApi'; // this is for enabling or disabling popup behavior
import { CurrentPageReference } from "lightning/navigation"; // this is to get the recordId

import TODO_OBJECT from '@salesforce/schema/Todo_Item__c';
import NAME_FIELD from '@salesforce/schema/Todo_Item__c.Name';
import DUE_DATE_FIELD from '@salesforce/schema/Todo_Item__c.Due_Date__c';
import RELATED_RECORD_ID_FIELD from '@salesforce/schema/Todo_Item__c.RelatedRecordId__c';

export default class Todo extends LightningElement {
    objectApiName = TODO_OBJECT;
    nameField = NAME_FIELD;
    dueDateField = DUE_DATE_FIELD;
    relatedRecordId = RELATED_RECORD_ID_FIELD;

    wiredResult;
    todoItems;

    recordId = null;

    utilityAttrs = {
        label: 'To-do List',
        highlighted: false
    }

    // this is for disabling the popup functionality
    @wire(EnclosingUtilityId)
    wiredUtilityIdResult(utilityId){
        if (utilityId) {
            this.utilityId = utilityId;
            enablePopout(this.utilityId, false, {
                disabledText: 'disabled'
            });
        }
    }
    //////
    // this is to get the current page recordId
    @wire(CurrentPageReference)
    wireCurrentPageReference(currentPageReference) {
        if (currentPageReference) {
            this.recordId = currentPageReference.attributes.recordId ? currentPageReference.attributes.recordId : null; // if it is undefined return null
        }
    }
    //
    @wire(getTodoItems, {
        relatedRecordId : '$recordId'
    })
    handleList(wiredResult) {
        this.wiredResult = wiredResult;
        if (wiredResult.data) {
            let overDueTaskCount = 0;
            this.todoItems = wiredResult.data.map((item=>{
                let isOverDue = new Date(item.Due_Date__c) < new Date();

                if(isOverDue) {
                    overDueTaskCount ++;
                }
                return {
                    ...item,
                    isOverDue
                };
            }));

            if(overDueTaskCount > 0) {
                this.utilityAttrs.label += '(' + overDueTaskCount + ' overdue)';
                this.utilityAttrs.highlighted = true;
                updateUtility(this.utilityId, this.utilityAttrs);
            }
            else {
                this.utilityAttrs.label = 'To-do list';
                this.utilityAttrs.highlighted = false;
                updateUtility(this.utilityId, this.utilityAttrs);
            }
        }
    }

    handleSuccess() {
        refreshApex(this.wiredResult);
    }


    handleClick(event) {
        const tdRecordId = event.target.dataset.id;
        console.log('Selected To do Record Id: ' + tdRecordId);
    }
}