import {LightningElement} from 'lwc';
import LightningConfirm from "lightning/confirm";

export default class LightningConfirmDemo extends LightningElement {
  async confirmHandler () {
    const result = await LightningConfirm.open({
      message: "Would you like to refresh the page?",
      label: "Are you sure?",
      theme: "warning"
    })
    console.log(result) // result is true if ok. false if cancel.

    // on click of ok result will be true else false
    if (result) {
      location.reload();
    }
  }

}