import { LightningElement } from "lwc";

export default class P2cParentComponentLwcSpread extends LightningElement {
  childData = { percentage: 20, name: 'Kapil' };

  handleonchange(event){
      this.childData = { percentage: event.target.value };
  }
}