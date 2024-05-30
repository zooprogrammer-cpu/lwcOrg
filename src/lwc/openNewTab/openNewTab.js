import {LightningElement, wire} from 'lwc';
import {openTab, IsConsoleNavigation } from "lightning/platformWorkspaceApi";

export default class OpenNewTab extends LightningElement {
  @wire(IsConsoleNavigation)
  isConsoleNavigation

  openTabRecordId() {
    if(this.isConsoleNavigation) {
      openTab({
        recordId: '0015f000008syjbAAA',
        label:'Troop',
        focus: true
      }).catch(error=>{
        console.error("Error in opening tab,", error)
      })
    }
  }

  openTabUsingUrl() {
    if (this.isConsoleNavigation) {
      openTab({
        url: '/lightning/r/Account/0015f000008syjbAAA/view',
        label:'Troop url',
        focus: true
      }).catch(error=>{
        console.error("Error in opening tab,", error)
      })
    }
  }

  openTabUsingPageRef() {
    if (this.isConsoleNavigation) {
      openTab({
        pageReference: {
          type: 'standard__objectPage',
          attributes: {
            objectApiName: 'Account',
            actionName: 'list'
          }
        },
        label:'Accounts list',
        focus: true
      }).catch(error=>{
        console.error("Error in opening tab,", error)
      })
    }
  }
}