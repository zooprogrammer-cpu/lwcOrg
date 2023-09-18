import {protectThis} from "c/protectThis";

export class DatatableSorter {

    defaultSortDirection = 'asc';
    sortDirection = 'asc';
    sortedBy = null;
    parent;
    dataFieldName

    constructor(parent, dataFieldName) {
        protectThis(this);
        this.parent = parent;
        this.dataFieldName = dataFieldName;
    }

    sortBy(field, reverse) {
        return function (a, b) {
            a = a[field];
            b = b[field];
            return reverse * ((a > b) - (b > a));
        };
    }

    sortData(event) {
        const { fieldName, sortDirection } = event.detail;
        const cloneData = [...this.parent[this.dataFieldName]];

        cloneData.sort(this.sortBy(fieldName, sortDirection === 'asc' ? -1 : 1));
        this.parent[this.dataFieldName] = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = fieldName;
    }
}