import { LightningElement, api, wire } from 'lwc';
import getCases from '@salesforce/apex/CaseDashboardController.getCases';

/** Datatable column definitions. */
const COLUMNS = [
    {
        label: 'Case Number',
        fieldName: 'CaseNumber',
        type: 'text',
        sortable: true,
        initialWidth: 140
    },
    {
        label: 'Subject',
        fieldName: 'Subject',
        type: 'text',
        sortable: true,
        wrapText: true
    },
    {
        label: 'Status',
        fieldName: 'Status',
        type: 'text',
        sortable: true,
        initialWidth: 140
    }
];

export default class CaseDataTable extends LightningElement {

    columns = COLUMNS;

    /** Backing field for the @api property — used as the $wire parameter. */
    _statusFilter = 'All';

    /**
     * Public property set by the parent caseDashboard via:
     *   <c-case-data-table status-filter={selectedStatus}>
     *
     * Using a getter/setter lets us update the private _statusFilter that
     * the @wire adapter watches reactively ($ prefix syntax).
     */
    @api
    get statusFilter() {
        return this._statusFilter;
    }
    set statusFilter(value) {
        this._statusFilter = value || 'All';
    }

    /** Wire call re-executes automatically whenever _statusFilter changes. */
    @wire(getCases, { status: '$_statusFilter' })
    wiredCases({ data, error }) {
        if (data) {
            this.cases  = data;
            this.error  = undefined;
        } else if (error) {
            this.error  = error;
            this.cases  = undefined;
        }
    }

    cases;
    error;

    // ── Computed state helpers ──────────────────────────────────────────────

    /** True while the wire call hasn't returned data or an error yet. */
    get isLoading() {
        return this.cases === undefined && this.error === undefined;
    }

    /** True when data arrived and contains at least one record. */
    get hasCases() {
        return Array.isArray(this.cases) && this.cases.length > 0;
    }

    /** True when data arrived but no records matched the filter. */
    get isEmpty() {
        return Array.isArray(this.cases) && this.cases.length === 0;
    }

    /** True when the wire call returned an error. */
    get hasError() {
        return !!this.error;
    }

    /** Human-readable error message for the template. */
    get errorMessage() {
        if (!this.error) return '';
        return (
            this.error?.body?.message ||
            this.error?.message ||
            'An unexpected error occurred while loading cases.'
        );
    }
}
