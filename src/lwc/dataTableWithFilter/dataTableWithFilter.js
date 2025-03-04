/**
 * Created by ashbas on 2/25/25.
 */

import {LightningElement, track, api, wire} from 'lwc';
import {
  publish,
  subscribe,
  unsubscribe,
  MessageContext
} from 'lightning/messageService';

import FILTERSCHANGEMC from '@salesforce/messageChannel/FiltersChange__c';


const baseColumns = [
  {
    label: 'Description',
    fieldName: 'description'
  },
  {
    label: 'Room Type',
    fieldName: 'roomType'
  },
  {
    label: 'Wing',
    fieldName: 'wing'
  }

];


export default class DataTableWithFilter extends LightningElement {
  @track dataForDataTable;
  @track columns = [...baseColumns];
  @api flowData;
  @track isLoading = false;
  @track parsedFlowData;

  searchKey = '';

  @wire(MessageContext)
  messageContext;

  async connectedCallback() {
    this.subscription = subscribe(
        this.messageContext,
        FILTERSCHANGEMC,
        (message) => {
          this.handleFilterChange(message);
        }
    );

    try {
      // get this data from an async apex call. This is just sample data.
      this.data = [
        {
          description: 'King Room',
          roomType : 'A1',
          wing : 'C',
          rateDetails : [
            {
              date_z : '05/20/2025',
              roomRate : 95.00
            },
            {
              date_z : '05/25/2025',
              roomRate : 76.00
            },
          ]
        },
        {
          description: 'Queen Room',
          roomType : 'Q1',
          wing : 'W',
          rateDetails : [
            {
              date_z : '05/20/2025',
              roomRate : 67.00
            },
            {
              date_z : '05/25/2025',
              roomRate : 55.00
            },
          ]
        },
      ]

      this.processAvailableRooms(this.data);
    } catch (error) {
      console.error('Error loading room rates: ', error);
    }
  }

  processAvailableRooms(availableRooms) {
    // Reset columns to base columns on each page load
    this.columns = [...baseColumns];
    // Clear uniqueDates on each page load
    const uniqueDates = new Set();

    // Add id for data table
    let availableRoomsWithId = availableRooms.map((obj, index)=>({
      ...obj,
      id : index + 1
    }));

    // Extract unique dates for columns
    availableRooms.forEach(room=>{
      room.rateDetails.forEach(rate => {
        uniqueDates.add(rate.date_z);
      });
    });

    console.log('uniqueDates: ', uniqueDates);
    // Add unique dates to columns
    uniqueDates.forEach(date => {
      this.columns.push({
        label : date,
        fieldName: date,
        initialWidth : 175
      });
    });

    let dataForDataTableTemp = [];

    availableRoomsWithId.forEach(el => {
      let row = {
        description : el.description,
        roomType : el.roomType,
        wing : el.wing,
        id : el.id
      };

      el.rateDetails.forEach(rate => {
        row[rate.date_z] = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(rate.roomRate);
      });
      dataForDataTableTemp.push(row);
    })


    this.dataForDataTable = [...dataForDataTableTemp];
    console.log(JSON.stringify(this.dataForDataTable))

  }

  disconnectedCallback() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }

  handleFilterChange(filters) {
    this.searchKey = filters.searchKey;
    console.log('this.searchKey: ', this.searchKey);
    this.maxPrice = filters.maxPrice;
    this.minBedrooms = filters.minBedrooms;
    this.minBathrooms = filters.minBathrooms;
  }

}