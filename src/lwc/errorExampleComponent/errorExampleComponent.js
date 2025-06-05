import { LightningElement } from 'lwc';
import { handleError } from 'c/errorHandler';

export default class ExampleComponent extends LightningElement {
  errorVisible = false;
  errorMsg = '';
  errorStack = '';

  async simulateError() {
    try {
      // Simulate an error on button click
      throw new Error('Simulated error triggered by user click');
    } catch (error) {
      await handleError(
          'ExampleComponent',
          'simulateError',
          error,
          'High',
          null,
          ({ message, stack }) => {
            this.errorMsg = message;
            this.errorStack = stack;
            this.errorVisible = true;
          }
      );
    }
  }
}