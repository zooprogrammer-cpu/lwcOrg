import { LightningElement, track } from 'lwc';

export default class CheckboxButton extends LightningElement {
  @track coaches = [];
  selectedCoachId = null;

  connectedCallback() {
    // Simulating API response — replace with your actual data
    this.coaches = [
      {
        coachName: "Ash Basnyat",
        salesforceUuid: "A1"
      },
      {
        coachName: "John Doe",
        salesforceUuid: "B2"
      },
      {
        coachName: "Sarah Coach",
        salesforceUuid: "C3"
      }
    ];
  }

  handleCoachSelection(event) {
    const selectedId = event.target.dataset.id;
    this.selectedCoachId = selectedId;
    console.log('this.selectedCoachId: ' , this.selectedCoachId);

    // Uncheck all others except the selected one
    this.template.querySelectorAll('lightning-input').forEach(input => {
      input.checked = input.dataset.id === selectedId;
    });
  }
}