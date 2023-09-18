import { LightningElement } from 'lwc';

export default class GroupedCategory extends LightningElement {
    contacts = [
        {
            Id: 1,
            Name: 'Amy Taylor',
            Title: 'VP of Engineering',
            Category:'One',
            First:true
        },
        {
            Id: 2,
            Name: 'Michael Jones',
            Title: 'VP of Sales',
            Category:'One',
            First:false
        },
        {
            Id: 3,
            Name: 'Jennifer Wu',
            Title: 'CEO',
            Category:'Two',
            First:true

        },
        {
            Id: 4,
            Name: 'John Smith',
            Title: 'Developer',
            Category:'Two',
            First:false
        },
    ];

}