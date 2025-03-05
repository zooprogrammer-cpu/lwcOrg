import { LightningElement, api, track, wire} from 'lwc';
import {FlowNavigationBackEvent, FlowNavigationNextEvent, FlowAttributeChangeEvent} from "lightning/flowSupport";

export default class CustomProgressBar extends LightningElement {
  @api currentStep;
  @api stepsString;
  @api recordId;
  @api objectName;

  @track steps = [];
  @track currentStepValue;

  connectedCallback() {
    this.initializeSteps();
    this.setCurrentStepValue();
  }

  initializeSteps() {
    this.steps = this.parseSteps(this.stepsString);
  }

  parseSteps(stepsString) {
    return stepsString.split(',').map((step, index) => ({
      label: step.trim(),
      value: `step-${index + 1}`
    }));
  }

  setCurrentStepValue() {
    this.currentStepValue = this.getStepValue(this.currentStep);
  }

  getStepValue(currentStepLabel) {
    const step = this.steps.find(step => step.label === currentStepLabel);
    return step ? step.value : '';
  }

  handleStepClick(event) {
    event.preventDefault();
  }

}