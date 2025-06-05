import { LightningElement, api } from 'lwc';

export default class ErrorDisplay extends LightningElement {
  @api errorMessage;
  @api stackTrace;
  @api visible = false;
  viewDetails = false;

  handleShowDetailsClick() {
    this.viewDetails = !this.viewDetails;
  }
}