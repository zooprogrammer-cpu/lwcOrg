import { LightningElement } from 'lwc';

export default class Getters extends LightningElement {
    users = ["John", "Tim" ,"Bob"]
    num1 = 2; 
    num2 =10;

    get firstUser(){
        return this.users[0].toUpperCase()
    }

    get multiple(){
        return (this.num1 * this.num2)
    }
}