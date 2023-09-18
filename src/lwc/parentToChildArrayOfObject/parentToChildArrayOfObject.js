import { LightningElement } from 'lwc';

export default class ParentToChildArrayOfObject extends LightningElement {
    userDetails = [
        {
            name: 'John Doe',
            title: 'CEO & Founder',
            company: 'Harvard University, example',
            buttontext: 'Contact',
            imageUrl: 'https://www.w3schools.com/w3images/team1.jpg'
        },
        {
            name: 'Steve Smith',
            title: 'CEO & Founder',
            company: 'Standford University, example',
            buttontext: 'Contact',
            imageUrl: 'https://www.w3schools.com/w3images/team2.jpg'
        }
    ]


}