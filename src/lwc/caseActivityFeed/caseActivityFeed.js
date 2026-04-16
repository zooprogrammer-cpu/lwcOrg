import { LightningElement, api, wire, track } from 'lwc';
import getCaseActivity from '@salesforce/apex/CaseActivityController.getCaseActivity';

const BADGE_CLASS_MAP = {
  'Comment':       'badge badge_comment',
  'Inbound Email': 'badge badge_inbound',
  'Outbound Email':'badge badge_outbound',
};

export default class CaseActivityFeed extends LightningElement {

  @api recordId;

  @track _items = [];
  @track _error;
  _isLoading = true;

  @wire(getCaseActivity, { caseId: '$recordId' })
  wiredActivity({ data, error }) {
    this._isLoading = false;
    if (data) {
      this._error = undefined;
      this._items = data.map(item => ({
        ...item,
        badgeClass: BADGE_CLASS_MAP[item.type] ?? 'badge badge_default',
      }));
    } else if (error) {
      this._items = [];
      this._error = this._extractErrorMessage(error);
    }
  }

  get isLoading()    { return this._isLoading; }
  get hasError()     { return !!this._error; }
  get isEmpty()      { return !this._isLoading && !this._error && this._items.length === 0; }
  get hasItems()     { return !this._isLoading && !this._error && this._items.length > 0; }
  get activityItems(){ return this._items; }
  get errorMessage() { return this._error; }

  _extractErrorMessage(error) {
    if (Array.isArray(error?.body)) {
      return error.body.map(e => e.message).join(', ');
    }
    return error?.body?.message ?? error?.message ?? 'An unknown error occurred.';
  }
}