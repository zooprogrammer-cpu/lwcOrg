import { LightningElement, track } from 'lwc';
let displayText = '';

export default class FieldValidation extends LightningElement {
    handleClick() {
      //this.displayText = displayText;

      let searchCmp = this.template.querySelector(".nameCmp");  
      let searchValue = searchCmp.value; 
      if (!searchValue){
        searchCmp.setCustomValidity("Need to enter a value.");
      }
      else {
        searchCmp.setCustomValidity("");
      }
      searchCmp.reportValidity(); 

      this.displayText= document.getElementById("myText").value;
      console.log(this.displayText);
    }

    handleChange(event){
      displayText = event.target.value;
    }
}