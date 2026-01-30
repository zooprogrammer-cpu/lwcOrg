import { LightningElement,wire } from 'lwc';
import getAccounts from '@salesforce/apex/tableController.getAccounts';
import {getObjectInfo} from "lightning/uiObjectInfoApi";
import {getPicklistValues} from "lightning/uiObjectInfoApi";
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';

const COLUMNS = [
  {label:'Account Name', fieldName:'Name', cellAttributes:{
      class:{fieldName:'accountColor'}
    }},
  {label:'Annual Revenue', fieldName:'AnnualRevenue', type:'currency', cellAttributes:{
      class:{fieldName:'amountColor'},
      iconName : {fieldName: 'iconName'}, iconPosition:'right'
    }},
  {label:'Industry', fieldName:'Industry', type:'industryPicklist',
    typeAttributes:{
      options:{fieldName:'picklistOptions'},
      value:{fieldName:'Industry'},
      placeholder: 'Choose Industry'
    }},
  {label:'Phone', fieldName:'Phone'}
]

export default class DataTableWithPicklist extends LightningElement {
  tableData
  columns = COLUMNS;
  // accounts = [];
  accountIndustry = [];

  @wire(getObjectInfo, {objectApiName : ACCOUNT_OBJECT})
  AccountObjectMetadata;

  @wire(getPicklistValues, {recordTypeId: '$AccountObjectMetadata.data.defaultRecordTypeId', fieldApiName: INDUSTRY_FIELD})
  AccountIndustryPicklist({data, error}) {
    if (data) {
      this.accountIndustry = data.values;
      this.fetchIndustries();
    } else if (error) {
      console.error('Error retrieving picklist: ' , error);
    }
  }

  fetchIndustries() {
    getAccounts()
        .then((result)=> {
          let options = [];
          for (var key in this.accountIndustry) {
            options.push({label : this.accountIndustry[key].label, value : this.accountIndustry[key].value})
          }

          this.tableData = result.map((record)=> {
            return {
              ...record,
              'picklistOptions' : options
            }
          });
          this.error = undefined;
        })
        .catch((error)=> {
          this.error = error;
          this.tableData = undefined
        })
  }


  // @wire(getAccounts)
  // accountsHandler({data,error}){
  //   if(data){
  //     this.tableData = data;
  //     console.log(this.tableData);
  //   }
  //   if(error){
  //     console.error(error)
  //   }
  // }

}