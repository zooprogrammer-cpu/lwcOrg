/**
 * Created by ashbas on 10/21/24.
 */

import {LightningElement, api, wire, track} from 'lwc';
import { CloseActionScreenEvent } from 'lightning/actions';
import {ShowToastEvent} from "lightning/platformShowToastEvent";
import getQuoteLineItems from "@salesforce/apex/QuoteLineController.getQuoteLineItems";
import deleteQuoteLineItems from "@salesforce/apex/QuoteLineController.deleteQuoteLineItem";
import insertQuoteLineItem from "@salesforce/apex/QuoteLineController.insertQuoteLineItem";
import getNewQuoteLineItem from "@salesforce/apex/QuoteLineController.getNewQuoteLineItem";
import getFieldTypes from "@salesforce/apex/QuoteLineController.getFieldTypes";
import getCustomMetadata from "@salesforce/apex/CustomMetadataService.getCustomMetadata";
import {startQuoteLineOrganization} from "c/quoteLineService";
import {customizeObjectKeys} from "c/quoteLineService";
import {RefreshEvent} from "lightning/refresh";
import {refreshApex} from "@salesforce/apex";

export default class QuoteLineGenerator extends LightningElement {
  @api recordId;
  @track isLoading = false;
  @track quoteLineGroupingArray = [];
  showModal = false;
  wiredResult;
  selectedProduct2Id = '';
  selectedParentQuoteLineId;
  disableAddProduct = true;
  itemPrice;
  quoteLineItemObject;
  @track fetchedQuoteLineItemFields;
  @track allFieldTypes;
  fieldLabelMap;

  filter = {
    criteria : [
      {
        fieldPath: 'IsActive',
        operator: 'eq',
        value: true
      }
    ]
  }

  matchingInfo = {
    primaryField: {fieldPath:"Name"},
    additionalFields: [{fieldPath: "ProductCode"}]
  };

  displayInfo = {
    additionalFields: ["ProductCode"]
  }


  async handleChange(event) {
    // console.log('event', event);
    this.selectedProduct2Id =event.detail.recordId;
    // console.log("---this.selectedProduct2Id : ", this.selectedProduct2Id );

    if (this.selectedProduct2Id) {
      this.disableAddProduct = false;
      const result = await getNewQuoteLineItem({productId: this.selectedProduct2Id});
      this.itemPrice = result.UnitPrice;
    }
  }

  @wire(getQuoteLineItems, {quoteId: '$recordId'})
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
      this.allFieldTypes = await this.getAllFieldTypes(wiredResult.data);
      this.fieldLabelMap = await this.getAllFieldLabels(wiredResult.data);
      console.log('this.fieldLabelMap: ', JSON.stringify(this.fieldLabelMap));
    }
    this.quoteLineGroupingArray = startQuoteLineOrganization(quoteLines);
    // console.log('allFieldTypes::', JSON.stringify(this.allFieldTypes));
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
      console.log('Product removed successfully');
      this.fetchUpdatedQuoteLineItems();
      this.isLoading = false;
    }
    catch (error) {
      this.showToast('Error', 'Error removing product', 'error');
      console.error('Error in removing product', error);
      this.isLoading = false;
    }
  }

  openChildModal(quoteId, parentQuoteLineId) {
    this.selectedParentQuoteLineId = parentQuoteLineId;
    this.showModal = true;
  }

  closeHandler() {
    this.showModal = false;
  }

  async handleAddProduct() {
    this.isLoading = true;
    try {
      await insertQuoteLineItem({
        quoteId: this.recordId,
        productId : this.selectedProduct2Id,
        quantity: this.quantity,
        description: this.description,
        enteredPrice : this.enteredPrice ? this.enteredPrice : 0,
        parentQuoteLineId : null,
      });
      this.showToast('Success', 'Product added successfully', 'success');
      this.fetchUpdatedQuoteLineItems();
      this.isLoading = false;
    } catch (error) {
      console.error(error);
      this.handleError(error);
      this.isLoading = false;
    }
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

  qtyHandler(event){
    this.quantity = event.target.value;
  }

  descriptionHandler(event){
    this.description = event.target.value;
  }

  enteredPriceHandler(event) {
    this.enteredPrice = event.target.value;
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

  async handleClickEdit(event) {
    const qlRecordId = event.target.dataset.id;
    this.quoteLineItemObject = {
      recordId: this.recordId,
      qlRecordId : qlRecordId,
      quoteLineGroupingArray : this.quoteLineGroupingArray
    }
    this.openChildModal(this.recordId, qlRecordId);
  }

  getFields(quoteLine) {
    const fields = Object.keys(quoteLine)
        .filter(key => key !== 'Product2'
            && key !== 'Id'
            && key !== 'Product2Id'
            && key !== 'children'
            && key !== 'Parent_Quote_Line_Item__c'
            && key !== 'hasParentQuoteLineItem'
        )
        .map(key => {
          let isCurrency = this.getMatchingFieldType(key) === 'CURRENCY';
          // return { label: key, value: quoteLine[key], isCurrency: isCurrency };
          return { label: this.fieldLabelMap[key] || key, value: quoteLine[key], isCurrency: isCurrency };
        });

    if (quoteLine.Product2 && quoteLine.Product2.Name) {
      fields.unshift({ label: 'Product Name', value: quoteLine.Product2.Name, isCurrency: false });
    }

    return fields;
  }

  get preparedQuoteLines() {
    return this.quoteLineGroupingArray.map(ql => {
      return {
        ...ql,
        fields: this.getFields(ql),
        children: ql.children
            .map(child => ({
              ...child,
              fields: this.getFields(child)
            }))
      };
    });
  }

  getMatchingFieldType(fieldName) {
    if (this.allFieldTypes && this.allFieldTypes[fieldName]) {
      return this.allFieldTypes[fieldName];
    }
    return 'STRING'; //default
  }

  async  getAllFieldTypes(quoteLines) {
    if (quoteLines) {
      let selected =[];
      const filteredQuoteLines = quoteLines.map(ql => {
        return Object.keys(ql).reduce((acc, key) => {
          if (key !== 'Product2Id' && key !== 'Product2') {
            acc[key] = ql[key];
          }
          return acc;
        }, {});
      });

      filteredQuoteLines.forEach(ql => {
        Object.keys(ql).forEach(key => {
          if (!selected.includes(key)) {
            selected.push(key);
          }
        });
      });
      return await getFieldTypes({selectedFields: selected});
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