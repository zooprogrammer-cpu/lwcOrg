/**
 * Created by ashbas on 10/21/24.
 */

import {LightningElement, api, wire, track} from 'lwc';
import { CloseActionScreenEvent } from 'lightning/actions';
import {ShowToastEvent} from "lightning/platformShowToastEvent";
import fetchQuoteLineDetails from "@salesforce/apex/QuoteLineController.fetchQuoteLineDetails";
import deleteQuoteLineItems from "@salesforce/apex/QuoteLineController.deleteQuoteLineItem";
import getFieldTypes from "@salesforce/apex/QuoteLineController.getFieldTypes";
import getCustomMetadata from "@salesforce/apex/CustomMetadataService.getCustomMetadata";
import {startQuoteLineOrganization} from "c/quoteLineService";
import {customizeObjectKeys} from "c/quoteLineService";
import {RefreshEvent} from "lightning/refresh";
import {refreshApex} from "@salesforce/apex";

export default class QuoteLineAdderEmbeddedFlow extends LightningElement {
  @api recordId;
  @track isLoading = false;
  @track quoteLineGroupingArray = [];
  showModal = false;
  showQuoteLineEditModal = false;
  wiredResult;
  selectedProduct2Id = '';
  selectedParentQuoteLineId;
  disableAddProduct = true;
  itemPrice;
  quoteLineItemObject;
  @track fetchedQuoteLineItemFields;
  @track allFieldTypes;
  fieldLabelMap;
  isShowFlow = false;
  addProductLabel = 'Add Product';

  @wire(fetchQuoteLineDetails, ({objectApiName: 'QuoteLineItem', fieldSetName: 'Dynamic_Field_Set', customLimit: 10, quoteId: '$recordId'}))
  async handleList(wiredResult) {
    this.wiredResult = wiredResult;
    let quoteLines = [];
    this.quoteLineGroupingArray = [];
    if (wiredResult.data) {
      console.log('wiredResult.data: ', wiredResult.data);
      wiredResult.data.forEach((ql)=>{
        // console.log('each quote line: ', ql);
        let customizedQuoteLine = customizeObjectKeys(ql);
        quoteLines.push(customizedQuoteLine);
      })
      // console.log('quoteLines::', JSON.stringify(quoteLines));
      // this.allFieldTypes = await this.getAllFieldTypes(wiredResult.data);
      // console.log('this.allFieldTypes: ', JSON.stringify(this.allFieldTypes));
      // this.fieldLabelMap = await this.getAllFieldLabels(wiredResult.data);
      // console.log('this.fieldLabelMap: ', JSON.stringify(this.fieldLabelMap));
    }
    this.quoteLineGroupingArray = startQuoteLineOrganization(quoteLines);
    console.log('this.quoteLineGroupingArray' ,JSON.stringify(this.quoteLineGroupingArray));
    // console.log('allFieldTypes::', JSON.stringify(this.allFieldTypes));
  }

  showFlowHandler() {
    this.isShowFlow = !this.isShowFlow;
    this.addProductLabel = this.addProductLabel === 'Add Product' ? 'Hide Add Product' : "Add Product";
  }

  handleStatusChange(event) {
    if (event.detail.status === "FINISHED") {
      // console.log('Flow Interview Finished');
      // console.log('Output Variables: ', JSON.stringify(event.detail));
      this.fetchUpdatedQuoteLineItems();
    }
  }

  handleEditFlowStatusChange(event) {
    if (event.detail.status === "FINISHED") {
      // console.log('Flow Interview Finished');
      // console.log('Output Variables: ', JSON.stringify(event.detail));
      this.fetchUpdatedQuoteLineItems();
    }
  }

  get inputVariables() {
    return [
      {
        name : "recordId",
        type : "String",
        value: this.recordId
      }
    ]
  }

  get flowName() {
    return "Quote_Line_Generator_with_Screen_Flow";
  }

  get editFlowName() {
    return "Quote_Line_Generator_with_Screen_Flow";
  }

  showToast(title, message, variant) {
    const event = new ShowToastEvent({title, message, variant});
    this.dispatchEvent(event);
  }

  deleteQuoteLineItem(event) {
    const qlRecordId = event.target.dataset.id;
    // console.log('qlRecordId in deleteQuoteLineItem: ', qlRecordId);
    this.handleDeleteProduct(qlRecordId);
  }

  async handleDeleteProduct(quoteLineItemId) {
    try {
      this.isLoading = true;
      await deleteQuoteLineItems({quoteLineItemId : quoteLineItemId})
      this.showToast('Success', 'Product removed successfully', 'success');
      this.fetchUpdatedQuoteLineItems();
      this.isLoading = false;
    }
    catch (error) {
      this.showToast('Error', 'Error removing product', 'error');
      console.error('Error in removing product', error);
      this.isLoading = false;
    }
  }

  closeHandler() {
    this.showModal = false;
  }

  closeEditHandler() {
    this.showQuoteLineEditModal = false;
  }

  refreshHandler() {
    this.fetchUpdatedQuoteLineItems();
  }

  fetchUpdatedQuoteLineItems() {
    console.log('Refreshing Apex data...');
    refreshApex(this.wiredResult)
        .then(()=>{
          console.log('Apex data refreshed successfully');
        })
        .catch(error=>{
          console.log('Error refreshing Apex class', error);
        })

    this.dispatchEvent(new RefreshEvent());
  }

  handleError(error) {
    let errorMessage = 'An Error Occurred';
    if (error && error.body) {
      if (error.body.fieldErrors && error.body.fieldErrors.Quantity) {
        errorMessage = error.body.fieldErrors.Quantity[0].message;
      } else if (error.body.message) {
        errorMessage = error.body.message;
      }
    }
    this.showToast('Error', errorMessage, 'error');
  }

  async handleClickAddChild(event) {
    const qlRecordId = event.target.dataset.id;
    this.quoteLineItemObject = {
      recordId: this.recordId,
      qlRecordId : qlRecordId,
      quoteLineGroupingArray : this.quoteLineGroupingArray
    }
    this.openChildModal(this.recordId, qlRecordId);
  }

  openChildModal(quoteId, parentQuoteLineId) {
    this.selectedParentQuoteLineId = parentQuoteLineId;
    this.showModal = true;
  }

  async handleEditQuoteLineItem(event) {
    const qlRecordId = event.target.dataset.id;
    this.quoteLineItemObject = {
      recordId: this.recordId,
      qlRecordId : qlRecordId,
      quoteLineGroupingArray : this.quoteLineGroupingArray
    }
    this.openEditModal(this.recordId, qlRecordId);
  }

  openEditModal(quoteId, parentQuoteLineId) {
    this.selectedParentQuoteLineId = parentQuoteLineId;
    this.showQuoteLineEditModal = true;
  }

  // Manipulate which fields to not display on the UI here
  formatFieldsForDisplay(quoteLine) {
    // console.log('quoteLine 😭 ', JSON.stringify(quoteLine));

    const fields = Object.keys(quoteLine)
        .filter(key => key !== 'Product2'
            && key !== 'Id'
            && key !== 'Product2Id'
            && key !== 'children'
            && key !== 'Parent_Quote_Line_Item__c'
            && key !== 'hasParentQuoteLineItem'
            && !key.includes('__r')
            //&& key !== 'Location__c'
        )
        .map(key => {
          let isCurrency = this.getMatchingFieldType(key) === 'CURRENCY';
          // return { label: key, value: quoteLine[key], isCurrency: isCurrency };
          return { label: this.fieldLabelMap[key] || key, value: quoteLine[key], isCurrency: isCurrency };
        });

    if (quoteLine.Product2 && quoteLine.Product2.Name) {
      fields.unshift({ label: 'Product Name', value: quoteLine.Product2.Name, isCurrency: false });
    }
    // if (quoteLine.Location__r) {
    //   fields.push({ label: 'Location', value: quoteLine.Location__r.Name, isCurrency: false });
    // }

    console.log('fields##', JSON.stringify(fields));
    return fields;
  }

  getFirstTwoFields(gFields) {
    let firstTwo = [];

    const firstField = gFields.find(el => el.label === "Product Name");
    firstTwo.push(firstField);

    const secondField = gFields.find(el => el.label === "Quantity");
    firstTwo.push(secondField);

    return firstTwo;
  }

  getRemainingFields(gFields) {
    return gFields.filter(el=> el.label !== "Product Name" && el.label!=="Quantity");
  }

  get preparedQuoteLines() {
    const preparedQLs = this.quoteLineGroupingArray.map(ql => {
      const formattedFieldsForDisplay = this.formatFieldsForDisplay(ql);
      console.log('formattedFieldsForDisplay: ' + JSON.stringify(formattedFieldsForDisplay));

      return {
        ...ql, // Need this to have access to Id
        firstTwoFields: this.getFirstTwoFields(formattedFieldsForDisplay),
        remainingFields : this.getRemainingFields(formattedFieldsForDisplay),
        children: ql.children.map(child => ({
          ...child, // Need this to have access to Id
          firstTwoFields: this.getFirstTwoFields(this.formatFieldsForDisplay(child)),
          remainingFields : this.getRemainingFields(this.formatFieldsForDisplay(child))
        }))
      };
    });
    console.log('preparedQLs: ', preparedQLs);
    return preparedQLs;
  }

  getMatchingFieldType(fieldName) {
    if (this.allFieldTypes && this.allFieldTypes[fieldName]) {
      return this.allFieldTypes[fieldName];
    }
    return 'STRING'; //default
  }

  async  getAllFieldTypes(quoteLines) {
    if (quoteLines) {
      const allFieldTypes = await getFieldTypes({selectedQuoteLines: quoteLines});
      return allFieldTypes;
      // return null;
    }
  }

  async getAllFieldLabels(quoteLines) {
    if (quoteLines) {
      const getCustomMetadataResult = await getCustomMetadata ({customMetaDataName : 'Quote_Line_Item_Setting__mdt', customMetaDataRecordDevName : ''});
      const fieldLabelMap = getCustomMetadataResult.reduce((map, obj) => {
        map[obj.Field_API_Name__c] = obj.Display_Label__c;
        return map;
      }, {});

      return fieldLabelMap;
    }
  }

  closeQuickAction() {
    this.dispatchEvent(new CloseActionScreenEvent());

  }


}