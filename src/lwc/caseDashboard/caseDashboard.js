import { LightningElement } from 'lwc';

/** Static picklist options shown in the combobox. */
const STATUS_OPTIONS = [
    { label: 'All',         value: 'All'         },
    { label: 'New',        value: 'New'        },
    { label: 'Working', value: 'Working' },
    { label: 'Escalated', value: 'Escalated' },
    { label: 'Closed',      value: 'Closed'      }
];

export default class CaseDashboard extends LightningElement {

    /** Currently selected status — starts at "All" to show every case. */
    selectedStatus = 'All';

    /** Expose options to the template. */
    get statusOptions() {
        return STATUS_OPTIONS;
    }

    /**
     * Fired when the user picks a new value from the combobox.
     * Updating selectedStatus causes the bound @api prop on the child
     * (status-filter={selectedStatus}) to change, which in turn re-fires
     * the child's @wire call and refreshes the data table automatically.
     */
    handleStatusChange(event) {
        this.selectedStatus = event.detail.value;
    }
}
