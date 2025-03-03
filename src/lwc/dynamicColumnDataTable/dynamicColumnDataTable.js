/**
 * Created by ashbas on 2/25/25.
 */

import {LightningElement, track, api} from 'lwc';


export default class DynamicColumnDataTable extends LightningElement {
  @track roomRates =[];
  @track dataForDataTable;
  @api flowData;
  @track isLoading = false;
  @track data;
  @track columns = [
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

  async connectedCallback() {
    try {
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

      this.dataForDataTable = [];

      // Extract unique dates
      const uniqueDates = new Set();
      this.data.forEach(item =>{
        item.rateDetails.forEach(rate => {
          uniqueDates.add(rate.date_z);
        })
      })

      // Add date columns
      uniqueDates.forEach(date => {
        this.columns.push({
          label: date,
          fieldName: date
        });
      });

      this.dataForDataTable = this.data.map(item=>{
        const row = {
          description : item.description,
          roomType: item.roomType,
          wing: item.wing
        };
        item.rateDetails.forEach(rate => {
          row[rate.date_z] = rate.roomRate;
        });
        return row;
      });


      console.log('this.dataForDataTable: ' , JSON.stringify(this.dataForDataTable));





      // console.log(JSON.stringify(this.dataForDataTable))
    } catch (error) {
      console.error('Error loading room rates: ', error);
    }
  }

}