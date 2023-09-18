import { LightningElement,wire } from 'lwc';
import getAccounts from '@salesforce/apex/tableController.getAccounts';
import {loadStyle} from 'lightning/platformResourceLoader';
import COLORS from '@salesforce/resourceUrl/colors'; 
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
const COLUMNSLESSINDUSTRY = [
    {label:'Account Name', fieldName:'Name'},
    {label:'Annual Revenue', fieldName:'AnnualRevenue', type:'currency'},
    {label:'Phone', fieldName:'Phone'}
]
export default class DataTableDemo extends LightningElement {
    tableData
    columns = COLUMNS
    columnsLessIndustry = COLUMNSLESSINDUSTRY
    isCssLoaded = false; 

    showIndustry =true
    @wire(getAccounts) 
    accountsHandler({data,error}){
        if(data){
            this.tableData = data.map(item=>{
                let amountColor = item.AnnualRevenue < 500000 ? "slds-text-color_error": "slds-text-color_success"
                let iconName = item.AnnualRevenue < 500000 ? "utility:down": "utility:up"
                return {...item,
                    "amountColor":amountColor,
                    "iconName":iconName, 
                    "industryColor":"slds-icon-custom-custom12 slds-text-color_success",
                    "accountColor": "datatable-orange"
                }
            });
            console.log(this.tableData);
 
        }
        if(error){
            console.error(error)
        }
    }

    renderedCallback(){
        // renderedCallback is dengerous since it reloads anytime enything changes.this means the current component.
        // return immediately if Css is loaded an will not execute the rest of the code.c/accountCreator
        // if css is not laoded,  set it to true. 
        if(this,this.isCssLoaded) return
        this.isCssLoaded = true  
        loadStyle(this, COLORS).then(()=>{
            console.log("loaded successfully")
        }).catch(error=>{
            console.error("Error in loading colors",error)
        })
    }

}