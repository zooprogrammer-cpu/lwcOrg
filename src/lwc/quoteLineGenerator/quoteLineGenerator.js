import { LightningElement, api, wire, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { getRecord, updateRecord } from 'lightning/uiRecordApi';
// import saveProducts from "@salesforce/apex/SimpleSellControllerCPQ.saveProducts";
// import getExistingCatalog from "@salesforce/apex/SimpleSellControllerCPQ.getExistingCatalog";
// import deleteProducts from "@salesforce/apex/SimpleSellControllerCPQ.deleteProducts";
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
import { refreshApex } from '@salesforce/apex';
import { CloseActionScreenEvent } from 'lightning/actions';
// import PRODUCT_OBJECT from "@salesforce/schema/ProductCatalog__c";
// import PRODUCT_NAME_FIELD from "@salesforce/schema/ProductCatalog__c.ProductName__c";
// import PRODUCT_QUANTITY_FIELD from "@salesforce/schema/ProductCatalog__c.Product_Quantity__c";
import ACCOUNT_ID from '@salesforce/schema/Quote.AccountId';
import { NavigationMixin } from 'lightning/navigation';

const QUOTE_FIELDS = [
  ACCOUNT_ID
];

export default class simpleSellCPQ extends NavigationMixin(LightningElement) {


  @api recordId;
  @api isTech = false;
  quoteData;
  accountId;
  nameOptions;
  quantityOptions;
  productCatalogData;

  showTable = false;
  disableSave = false;
  saveError = true;
  notes = "";
  message;
  loading = true;
  @track rows = [{ index: 1, pQuantity: "", pName: "" }];
  productsCatalog = [{ index: 1, pQuantity: "", pName: "", pNotes: "" }];

  @wire(getRecord, { recordId : '$recordId', fields: QUOTE_FIELDS })
  getQuote({ error, data }){
    if(error){
      this.error = error;
      this.showToast('Error getting record data', error.message, 'error');
    } else if(data){
      console.log('data: ' + JSON.stringify(data));
      this.quoteData = data;
      this.accountId = data.fields.SBQQ__Account__c.value;
      this.getProductCatalogData();
    }
  }

  getProductCatalogData(){
    getExistingCatalog({ accountId: this.accountId })
        .then((result)=>{
          console.log('getExistingCatalog result: ' + JSON.stringify(result));
          this.productCatalogData = result;
          this.loading = false;
          this.rows = [];
          this.productsCatalog = [];
          let tempIndex = 1;
          result.forEach((item) => {
            let obj = new Object();
            obj.pName = item.ProductName__c;
            obj.pQuantity = item.Product_Quantity__c;
            obj.index = tempIndex;
            this.rows.push(obj);
            tempIndex++;
            console.log('obj: ' + JSON.stringify(obj));
          });
          // MParrella: Adding array length check in order to get existing product notes: START
          let existingNote = '';
          console.log('getExistingCatalog result.length: ' + result.length);
          if (result.length > 0){
            existingNote = result[0].Product_Notes__c;
            this.showTable = true;
          } else {
            this.showTable = false;
          }
          this.notes = existingNote;

        })
        .catch((error)=>{
          console.log('error getting catalog data: ' + JSON.stringify(error));
        })
  }

  @wire(getObjectInfo, { objectApiName: PRODUCT_OBJECT })
  accountMetadata;

  @wire(getPicklistValues, {
    recordTypeId: "$accountMetadata.data.defaultRecordTypeId",
    fieldApiName: PRODUCT_NAME_FIELD,
  })
  getProductCatalogNames({ error, data }){
    if(error){
      this.error = error;
      this.showToast('error getting product catalog name metadata', error.message, 'error');
    } else if(data){
      console.log('product catalog name picklist values: ' + JSON.stringify(data.values));
      this.nameOptions = data.values.map(plValue => {
        return {
          label: plValue.label,
          value: plValue.value
        };
      });
    }
  }

  @wire(getPicklistValues, {
    recordTypeId: "$accountMetadata.data.defaultRecordTypeId",
    fieldApiName: PRODUCT_QUANTITY_FIELD,
  })
  getProductCatalogQuantity({ error, data }){
    if(error){
      this.error = error;
      this.showToast('error getting product  quantity metadata', error.message, 'error');
    } else if(data){
      console.log('product catalog quantity picklist values: ' + JSON.stringify(data.values));
      this.quantityOptions = data.values.map(plValue => {
        return {
          label: plValue.label,
          value: plValue.value
        };
      });
    }
  }

  handleAddRow() {
    var Obj = new Object();
    Obj.index = this.rows.length + 1;
    Obj.pQuantity = '';
    Obj.pName = "";
    this.rows.push(Obj);
  }

  handleChangeProduct(event) {
    this.disableSave = false;
    this.rows[event.target.dataset.row - 1].pName = event.detail.value;
  }

  handleChangeNotes(event) {
    this.notes = event.target.value;
  }

  handleChangeQuantity(event) {
    this.disableSave = false;
    this.rows[event.target.dataset.row -1].pQuantity = event.detail.value;
  }

  handleDeleteRow(event) {
    this.disableSave = false;
    var index = event.target.dataset.row;
    this.rows.splice(index - 1, 1);
    var temp = 1;
    this.rows.forEach((element) => {
      element.index = temp;
      temp++;
    });
    if (this.rows.length == 0) this.showTable = false;
  }

  handleShowTable() {
    this.resetTable();
    this.handleAddRow();
  }

  handlePositive() {
    this.saveProductsCatalog();
  }

  handleNegative() {
    if(this.isTech){
      this.handleNavigate();
    } else {
      this.resetTable();
      // this.dispatchEvent(new CustomEvent("close")); // MParrella: Commenting out to use native event to close quick action
      this.dispatchEvent(new CloseActionScreenEvent()); // MParrella: Adding native event to close quick action
    }
  }

  handleNavigate(){
    this[NavigationMixin.Navigate]({
      type: "standard__component",
      attributes: {
        componentName: "c__quoteSummaryContainer"
      },
      state: {
        "c__id": this.quoteData.id
      }
    }, true);
  }

  handleClose() {
    this.dispatchEvent(new CustomEvent("close"));
  }

  resetTable() {
    this.rows = JSON.parse(JSON.stringify(this.productsCatalog));
    // MParrella: Adding check for array length before assigning pNotes attribute value: START
    if (this.productsCatalog.length > 0){
      this.notes = this.productsCatalog[0].pNotes;
    } else {
      this.notes = '';
    }
    // MParrella: Adding check for array length before assigning pNotes attribute value: STOP
    this.showTable = true;
    this.disableSave = false;
  }

  showNotification() {
    const evt = new ShowToastEvent({
      title: "Warning",
      message: this.message,
      variant: "error",
    });
    this.dispatchEvent(evt);
  }

  saveProductsCatalog() {
    console.log('this.rows: ', this.rows);
    this.saveError = false;
    this.loading = true;
    this.disableSave = true;
    console.log('this.rows.length: ' + this.rows.length);
    if (this.rows.length == 0) {
      deleteProducts({
        accountId: this.accountId
      }).then((result)=>{
        console.log('delete result: ' + JSON.stringify(result));
        if(result){
          this.showToast('Success', 'Records successfully deleted', 'success');
          this.dispatchEvent(new CloseActionScreenEvent());
        } else {
          this.showToast('Error', 'Error deleting Product Catalog records', 'error');
        }
      }).catch((error) => {
        console.log(error);
      });
      this.loading = false;
    } else {
      this.rows.forEach((element) => {
        if (element.pQuantity == "" || element.pName == "") {
          this.saveError = true;
        }
        element.pNotes = this.notes;
      });
      if (this.saveError) {
        this.disableSave = true;
        this.message = "Please choose Product Name and Product Quantity";
        this.loading = false;
        this.showNotification();
      } else {
        saveProducts({
          accountId: this.accountId,
          productCatalogToSave: JSON.stringify(this.rows),
        })
            .then((result) => {
              console.log('save result: ' + result);
              this.productsCatalog = JSON.parse(JSON.stringify(this.rows));
              if (result){ // this.dispatchEvent(new CustomEvent("positive"));
                this.loading = false;
                this.disableSave = false;
                // updateRecord();
                this.showToast('Success', 'Record successfully updated!', 'success');
                if(this.isTech){
                  this.handleNavigate();
                } else {
                  this.dispatchEvent(new CloseActionScreenEvent());
                }
              }

            })
            .catch((error) => {
              console.log('error: ' + JSON.stringify(error));
              this.loading = false;
              this.disableSave = false;
            });
      }
    }
  }

  showToast(title, message, variant){
    this.dispatchEvent(new ShowToastEvent({
      title, message, variant
    }));
  }
}