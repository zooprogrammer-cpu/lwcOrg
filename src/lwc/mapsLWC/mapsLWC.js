import { LightningElement, wire } from 'lwc';
import getAccounts from '@salesforce/apex/MapControllerLWC.getAccounts'
export default class MapsLWC extends LightningElement {
    mapMarkers =[]
    markersTitle ="Accounts Location"
    @wire(getAccounts)
    wireHandler({data,error}){
        if (data){
            console.log(data)
            this.formatResponse(data)
        }
        if (error){
            console.error(error)
        }
    }

    formatResponse(data){
        this.mapMarkers = data.map(item=>{
            return {
                location:{
                    Street: item.BillingStreet || '',
                    City: item.BillingCity || '',
                    PostalCode:item.BillingPostalCode || '',
                    State: item.BillingState || '',
                    Country: item.BillingCountry ||''
                },
                icon:'utility:salesforce',
                title:item.Name,
                value:item.Name,
                description:item.description
            }
        })
        this.selectedMarker = this.mapMarkers.length && this.map[0].value
    }

    callMarkerHandler(event){
        this.selectedMarker = event.detail.selectedMarkerValue
    }


}