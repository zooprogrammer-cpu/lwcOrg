import { LightningElement } from 'lwc';

export default class TabbedApp extends LightningElement {

    personObject = {}; 

    handleOpenTabOne(){
        console.log('Tab One Clicked');
        let tabOneTitle = this.template.querySelector('[title="Item One"]');
        tabOneTitle.classList.add('slds-is-active');
        let tabTwoTitle = this.template.querySelector('[title="Item Two"]');
        tabTwoTitle.classList.remove('slds-is-active');
        let tabThreeTitle = this.template.querySelector('[title="Item Three"]');
        tabThreeTitle.classList.remove('slds-is-active');
        let tabOne = this.template.querySelector('#tab-default-1-200');
        let tabTwo = this.template.querySelector('#tab-default-2-200');
        let tabThree = this.template.querySelector('#tab-default-3-200');
        tabOne.classList.replace('slds-hide', 'slds-show');
        tabTwo.classList.replace('slds-show', 'slds-hide');
        tabThree.classList.replace('slds-show', 'slds-hide');

        this.personObject = {
            firstName: "Ash",
            lastName: "Basnyat"
        }

        console.log(this.personObject.firstName);
        console.log(this.personObject.lastName);
    }

    handleOpenTabTwo(){
        console.log('Tab Two Clicked');
        let tabTwoTitle = this.template.querySelector('[title="Item Two"]');
        tabTwoTitle.classList.add('slds-is-active');
        let tabOneTitle = this.template.querySelector('[title="Item One"]');
        tabOneTitle.classList.remove('slds-is-active');
        let tabThreeTitle = this.template.querySelector('[title="Item Three"]');
        tabThreeTitle.classList.remove('slds-is-active');
        let tabOne = this.template.querySelector('#tab-default-1-200');
        let tabTwo = this.template.querySelector('#tab-default-2-200');
        let tabThree = this.template.querySelector('#tab-default-3-200');
        tabOne.classList.replace('slds-show', 'slds-hide');
        tabTwo.classList.replace('slds-hide', 'slds-show');
        tabThree.classList.replace('slds-show', 'slds-hide');

        this.personObject = {
            firstName: "Brita",
            lastName: "Basnyat"
        }
        console.log(this.personObject.firstName);
        console.log(this.personObject.lastName);

    }

    handleOpenTabThree(){
        console.log('Tab Three Clicked');
        let tabThreeTitle = this.template.querySelector('[title="Item Three"]');
        tabThreeTitle.classList.add('slds-is-active');
        let tabOneTitle = this.template.querySelector('[title="Item One"]');
        tabOneTitle.classList.remove('slds-is-active');
        let tabTwoTitle = this.template.querySelector('[title="Item Two"]');
        tabTwoTitle.classList.remove('slds-is-active');
        let tabOne = this.template.querySelector('#tab-default-1-200');
        let tabTwo = this.template.querySelector('#tab-default-2-200');
        let tabThree = this.template.querySelector('#tab-default-3-200');
        tabOne.classList.replace('slds-show', 'slds-hide');
        tabTwo.classList.replace('slds-show', 'slds-hide');
        tabThree.classList.replace('slds-hide', 'slds-show');

        this.personObject = {
            firstName: "Dug",
            lastName: "Basnyat"
        }

        console.log(this.personObject.firstName);
        console.log(this.personObject.lastName);

    }
}