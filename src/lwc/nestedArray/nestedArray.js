import { LightningElement } from 'lwc';

export default class NestedArray extends LightningElement {

    data = [
        {
            id: '0001',
            name: 'John',
            location: 'India',
            gender: 'male',
            address: [{
                street1: 'street 11',
                street2: 'street 12',
                city: 'city 1',
                country: 'country 1',
                pin: '999-001'
            }]
        },
        {
            id: '0002',
            name: 'Janet',
            location: 'US',
            gender: 'female',
            address: [{
                street1: 'street 21',
                street2: 'street 22',
                city: 'city 2',
                country: 'country 2',
                pin: '999-000'
            }]
        },
        {
            id: '0003',
            name: 'Doe',
            location: 'UK',
            gender: 'male',
            address: [{
                street1: 'street 31',
                street2: 'street 32',
                city: 'city 3',
                country: 'country 3',
                pin: '999-111'
            }]
        }
    ]
}