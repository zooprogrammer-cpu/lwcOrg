import { LightningElement , track, api} from 'lwc';
import {FlowAttributeChangeEvent, FlowNavigationNextEvent} from 'lightning/flowSupport';


export default class RetainPreviousValues extends LightningElement {
  @track _txtBoxVal = '';
  @track _selectedDate;
  @api availableActions = [];

  @api
  get txtBoxVal(){
    return this._txtBoxVal;
  }

  @api
  get selectedDate() {
    return this._selectedDate;
  }

  set txtBoxVal(val){
    this._txtBoxVal = val;
  }

  set selectedDate(val){
    this._selectedDate = val;
  }

  handleChange(event) {
    this._txtBoxVal = event.target.value;
  }

  handleDateChange(event) {
    this._selectedDate = event.target.value;
  }

  //Change attribute on Flow
  handleClick(event) {
    const attributeChangeEvent = new FlowAttributeChangeEvent('txtBoxVal', this._txtBoxVal);
    this.dispatchEvent(attributeChangeEvent);
  }

  handleClickDate(event) {
    const attributeChangeEvent = new FlowAttributeChangeEvent('selectedDate', this._selectedDate);
    this.dispatchEvent(attributeChangeEvent);

  }

  //Hook to Flow's Validation engine
  @api
  validate() {
    if(!this._txtBoxVal.includes('oracle')) {
      return { isValid: true };
    }
    //If the component is invalid, return the isValid parameter as false and return an error message.
    return {
      isValid: false,
      errorMessage:  'You cannot have string oracle in String'
    };
  }

  //Go to Next screen of Flow
  handleNext(event){
    const nextNavigationEvent = new FlowNavigationNextEvent();
    this.dispatchEvent(nextNavigationEvent);
  }
}