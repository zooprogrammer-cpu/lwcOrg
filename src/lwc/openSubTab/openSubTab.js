import {LightningElement, wire, api} from 'lwc';
import {openTab, openSubtab, IsConsoleNavigation, EnclosingTabId } from "lightning/platformWorkspaceApi";

export default class OpenSubTab extends LightningElement {
  @wire(IsConsoleNavigation)
  isConsoleNavigation

  @wire(EnclosingTabId)
  parentTabId // get enclosingTabId and save it to parentTabId

  @api recordId

  connectedCallback() {
    console.log('isConsoleNavigation', this.isConsoleNavigation);
  }

  openSubTabRecordId() {
    console.log('parentTabId', this.parentTabId);

    if(this.isConsoleNavigation) {
      openSubtab(this.parentTabId, {
        recordId: '0015f000008syjbAAA',
        focus: true
      }).catch(error=>{
        console.error("Error in opening tab,", error)
      })
    }
  }

  openSubTabUsingUrl() {
    if (this.isConsoleNavigation) {
      openSubtab(this.parentTabId,{
        url: '/lightning/r/Account/0015f000008syjbAAA/view',
        focus: true
      }).catch(error=>{
        console.error("Error in opening tab,", error)
      })
    }
  }

  openSubTabUsingPageRef() {
    if (this.isConsoleNavigation) {
      openSubtab(this.parentTabId, {
        pageReference: {
          type: 'standard__objectPage',
          attributes: {
            objectApiName: 'Account',
            actionName: 'list'
          }
        },
        focus: true
      }).catch(error=>{
        console.error("Error in opening tab,", error)
      })
    }
  }

}