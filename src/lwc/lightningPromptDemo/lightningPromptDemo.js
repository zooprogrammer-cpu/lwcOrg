import {LightningElement} from 'lwc';
import LightningPrompt from "lightning/prompt";
import LightningAlert from "lightning/alert";
export default class LightningPromptDemo extends LightningElement {
  async promptHandler() {
    const result = await LightningPrompt.open({
      message: "Please Enter Your Age",
      label: "Check your voting eligibility",
      theme: "success",
      defaultValue: 30
    })
    console.log(result);
    if (result && Number(result) > 18){
      console.log("Hurray, you are eligible to vote")
      this.alertHandler("Hurray, you are eligible to vote", "Success!", "success")
    }
    else {
      console.log("Sorry, you cannot vote yet.")
      this.alertHandler("Sorry, you cannot vote yet.", "Sorry!", "error")

    }
  }

  alertHandler(message, label, theme) {
    LightningAlert.open({
      message: message,
      label: label,
      theme: theme
    })
  }
}