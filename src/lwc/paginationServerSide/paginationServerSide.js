/**
 * Created by ashbasn on 3/19/26.
 */

import { LightningElement, track } from 'lwc';
import getData from "@salesforce/apex/PaginationService.getData";

export default class PaginationServerSide extends LightningElement {
    @track data = [];
    @track isLoading = false;

    // Server-side pagination properties
    @track page = 1;
    @track pageSize = 5;
    @track totalRecordCount = 0;
    @track totalPage = 0;

    connectedCallback() {
        this.loadPage();
    }

    async loadPage() {
        this.isLoading = true;

        try {
            const pageNumber = this.page - 1; // Convert to 0-based for Apex

            console.log('Loading page:', this.page, '(pageNumber:', pageNumber, ') pageSize:', this.pageSize);

            const result = await getData({
                pageSize: this.pageSize,
                pageNumber: pageNumber
            });

            console.log('Loaded rows:', result.rows?.length, 'Total rows:', result.totalRows);

            this.data = result.rows || [];
            this.totalRecordCount = result.totalRows || 0;
            this.totalPage = Math.ceil(this.totalRecordCount / this.pageSize);

        } catch (error) {
            console.error('Error loading Opportunities:', error);
            this.data = [];
            this.totalRecordCount = 0;
            this.totalPage = 0;
        } finally {
            this.isLoading = false;
        }
    }

    get columns() {
        return [
            {
                label: 'Name',
                fieldName: 'Name',
                type: 'text',
                sortable: true
            },
            {
                label: 'Stage',
                fieldName: 'StageName',
                sortable: true
            },
            {
                label: 'Close Date',
                fieldName: 'CloseDate',
                type: 'date',
                sortable: true
            }
        ];
    }

    // Getters for button disabled state
    get isFirstPage() {
        return this.page === 1;
    }

    get isLastPage() {
        return this.page >= this.totalPage || this.totalPage === 0;
    }

    // Pagination info display
    get currentPageInfo() {
        if (this.totalRecordCount === 0) {
            return 'No records to display';
        }
        const startingRecord = ((this.page - 1) * this.pageSize) + 1;
        const endingRecord = Math.min(this.page * this.pageSize, this.totalRecordCount);
        return `Showing ${startingRecord}-${endingRecord} of ${this.totalRecordCount} records`;
    }

    // Previous button handler
    handlePrevious() {
        if (this.page > 1) {
            this.page = this.page - 1;
            this.loadPage();
        }
    }

    // Next button handler
    handleNext() {
        if (this.page < this.totalPage) {
            this.page = this.page + 1;
            this.loadPage();
        }
    }
}
