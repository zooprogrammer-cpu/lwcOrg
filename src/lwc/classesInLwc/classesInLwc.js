/**
 * Created by ashbas on 8/30/25.
 */

import { LightningElement } from 'lwc';

class Animal {
  constructor(name) {
    this.name = name;
  }
  printName() {
    console.log(this.name);
  }
}

export default class ClassesInLwc extends LightningElement {
  connectedCallback() {
    const animalObj = new Animal('dog');
    animalObj.printName();
  }
}