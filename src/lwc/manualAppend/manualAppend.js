/**
 *
 */

import {LightningElement} from 'lwc';

export default class ManualAppend extends LightningElement {
  demographics = [
    {
      state: 'Washington',
      population : 71000
    },
    {
      state : 'California',
      population: 2700000
    }
  ]

  renderedCallback() {
    const el = this.template.querySelector('.myList');
    this.demographics.forEach((d) =>{
      const li = document.createElement('li');
      li.innerHTML = `${d.state} (pop: ${d.population})`;
      el.append(li);
    })
  }
}

