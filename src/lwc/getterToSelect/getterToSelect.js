import { LightningElement, track } from 'lwc';

export default class GetterToSelect extends LightningElement {
    @track textValue
    @track displayText =''; 

    handleTextChange(event){
        this.textValue = event.target.value;
        console.log(this.textValue); 
    }

    handleDisplayText(){
        this.displayText = this.textValue;
        console.log('this.displayText', this.displayText);
    }

    handleClickClear(){        
        //this.textValue = 'this.clearField'; 
        this.displayText = this.displayText * 9;
        
        console.log(this.textValue); // Prints ''

    }

    get clearField(){ 
        return ''; // return '' to blank this field
    }

}