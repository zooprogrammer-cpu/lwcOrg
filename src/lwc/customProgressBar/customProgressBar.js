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
    console.log('this.steps:', this.steps);
  }

  parseSteps(stepsString) {
    return stepsString.split(',').map((step, index) => ({
      label: step.trim(),
      value: `step-${index + 1}`
    }));
  }

  setCurrentStepValue() {
    this.currentStepValue = this.getStepValue(this.currentStep);
    console.log('currentStepValue', this.currentStepValue);
  }

  getStepValue(currentStepLabel) {
    const step = this.steps.find(step => step.label === currentStepLabel);
    return step ? step.value : '';
  }

  handleStepClick(event) {
    console.log('Step Clicked');
    this.currentStep = event.target.value;
    console.log('this.currentStep: ', this.currentStep );
    // event.preventDefault();
    this.handleNext();
  }

  @api availableActions = []; // Gives us the ability to know what actions are available in the flow

  handleNext() {
    // If we are already in the last screen, we don't want to do anything
    if(this.availableActions.find((action)=> action === "NEXT")) {
      const navigateNextEvent = new FlowNavigationNextEvent();
      this.dispatchEvent(navigateNextEvent);
    }
  }

  handleBack() {
    // If we are already in the first screen, we don't want to do anything
    if (this.availableActions.find((action)=> action === "BACK")) {
      const navigateBackEvent = new FlowNavigationBackEvent();
      this.dispatchEvent(navigateBackEvent);
    }

  }

}