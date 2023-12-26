import {LightningElement} from 'lwc';
import LightningAlert from "lightning/alert";

export default class LightningAlertDemo extends LightningElement {
  async alertHandler(event) {
    const {name}= event.target;
    //window.alert("Hello"); //earlier we were using this
    LightningAlert.open( {
      message: "This is a test",
      variant:"headerless",
      label: `Pay Attention, I am ${name}`,
      theme: "warning" // "success" - green ; "warning"- orange ; "error" - red; "info" - grey
    }).then(result=>{
      console.log('result:', result);
      let x = 2;
      let y = 3;
      this.add(x,y);
    })
  }

  add(a,b) {
    console.log(a + b);
  }
}