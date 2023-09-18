import { LightningElement } from 'lwc';

export default class Looping extends LightningElement {
    carList=["Ford","Audi","BMW","Chevy","Mazda"]

    ceoList = [
        {
            id:1,
            company: "Google",
            name: "Sundar Pichai"
        },
        {
            id:2,
            company: "Apple Inc.",
            name: "Tim Cook"
        },
        {
            id:3,
            company: "Facebook",
            name: "Mark Zuckerberg"
        },
        {
            id:4,
            company: "Amazon",
            name: "Jeff Bezos"
        }
           

    ]
}