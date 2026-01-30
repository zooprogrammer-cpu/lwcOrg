import { LightningElement, track, api } from 'lwc';

export default class CustomProgressTrackable extends LightningElement {
  @api currentStep;
  @api stepsString;
  @api recordId;
  @api objectName;

  steps = [
    { label: 'Step 1', value: '1' },
    { label: 'Step 2', value: '2' },
    { label: 'Step 3', value: '3' }
  ];

  get isStep1() {
    return this.currentStep === '1';
  }
  get isStep2() {
    return this.currentStep === '2';
  }
  get isStep3() {
    return this.currentStep === '3';
  }

  handleStepClick(event) {
    this.currentStep = event.target.value;
  }
}