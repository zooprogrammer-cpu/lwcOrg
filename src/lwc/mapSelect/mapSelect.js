/**
 *
 */

import {LightningElement, api} from 'lwc';
import {FlowAttributeChangeEvent} from "lightning/flowSupport";

export default class MapSelect extends LightningElement {
  @api set selectedMarkerValue(value) {
    if (value) {
      this._selectedMarkerValue = value;
    }
  }

  get selectedMarkerValue() {
    return this._selectedMarkerValue;
  }

  _selectedMarkerValue = "SFHQ";

  mapMarkers= [
    {
      location: {
        City: "San Francisco",
        Country: "USA",
        PostalCode: "94105",
        State: "CA",
        Street: "The Landmark @ One Market, Suite 300"
      },
      value: "SFHQ",
      title: "The Landmark Building",
      description:
      "The landmark is iconic."
    },
    {
      location: {
        City: "San Francisco",
        Country: "USA",
        PostalCode: "94105",
        State: "CA",
        Street: "50 Fremont Street"
      },
      value: "SF1- Julies",
      icon: "standard:account",
      title: "Julies Kitchen",

    },
    {
      location: {
        City: "San Francisco",
        Country: "USA",
        PostalCode: "94105",
        State: "CA",
        Street: "30 Fremont Street"
      },
      value: "SF2- Tender",
      icon: "standard:account",
      title: "Tender Greens",
    }
  ]

  handleMarkerSelect(event) {
    this._selectedMarkerValue = event.target.selectedMarkerValue;
    const attributeChangeEvent = new FlowAttributeChangeEvent(
        "selectedMarkerValue",
        this.selectedMarkerValue
    );
    this.dispatchEvent(attributeChangeEvent);
  }
}