import { LightningElement,wire } from 'lwc';
import getAccounts from '@salesforce/apex/tableController.getAccounts';
const COLUMNS = [
  {label:'Account Name', fieldName:'Name', cellAttributes:{
      class:{fieldName:'accountColor'}
    }},
  {label:'Annual Revenue', fieldName:'AnnualRevenue', type:'currency', cellAttributes:{
      class:{fieldName:'amountColor'},
      iconName : {fieldName: 'iconName'}, iconPosition:'right'
    }},
  {label:'Industry', fieldName:'Industry', type:'text',cellAttributes:{
      class:{fieldName:'industryColor'}
    }},
  {label:'Phone', fieldName:'Phone'}
]

export default class DataTableWithPicklist extends LightningElement {
  tableData
  columns = COLUMNS

  @wire(getAccounts)
  accountsHandler({data,error}){
    if(data){
      this.tableData = data;
      console.log(this.tableData);
    }
    if(error){
      console.error(error)
    }
  }

}