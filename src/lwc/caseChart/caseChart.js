import { LightningElement, api, wire } from 'lwc';
import getCaseCountsByStatus from '@salesforce/apex/CaseDashboardController.getCaseCountsByStatus';

/** Maximum rendered bar height in pixels. */
const MAX_BAR_HEIGHT_PX = 160;

export default class CaseChart extends LightningElement {

    /**
     * The Case Status value selected in the parent caseDashboard combobox.
     * LWC automatically re-renders this component whenever the parent updates
     * this prop, so all getters that reference `this.statusFilter` are
     * recalculated reactively — no extra wire call is needed.
     */
    @api statusFilter = 'All';

    /**
     * Wire: fetch aggregate counts for ALL statuses once (cached).
     * The chart always shows every status as a bar; the selected one is
     * highlighted and its count is shown in the summary pill.
     */
    @wire(getCaseCountsByStatus)
    wiredCounts;

    // ── Derived state getters ────────────────────────────────────────────────

    get isLoading() {
        return !this.wiredCounts?.data && !this.wiredCounts?.error;
    }

    get hasError() {
        return !!this.wiredCounts?.error;
    }

    get hasData() {
        return !!this.wiredCounts?.data?.length;
    }

    /**
     * Count displayed in the summary pill.
     * - 'All' → sum of every status.
     * - Specific status → count for that status only.
     * Recalculates automatically whenever `statusFilter` changes.
     */
    get selectedCount() {
        const data = this.wiredCounts?.data;
        if (!data) return 0;
        if (this.statusFilter === 'All') {
            return data.reduce((sum, d) => sum + d.count, 0);
        }
        return data.find(d => d.status === this.statusFilter)?.count ?? 0;
    }

    /** Label shown beside the count in the summary pill. */
    get selectedLabel() {
        return this.statusFilter === 'All' ? 'All Statuses' : this.statusFilter;
    }

    /**
     * Bar descriptors consumed by the template's for:each directive.
     * Recalculates whenever `statusFilter` changes, updating:
     *   • bar height (proportional to max count)
     *   • active vs. muted CSS class (driven by selected status)
     *   • label CSS class (bold for the active bar)
     */
    get chartBars() {
        const data = this.wiredCounts?.data;
        if (!data?.length) return [];

        const maxCount = Math.max(...data.map(d => d.count), 1);

        return data.map(d => {
            const isActive =
                this.statusFilter === 'All' || this.statusFilter === d.status;

            // Enforce a minimum 4 px height so zero-count bars stay visible.
            const heightPx = Math.max(
                Math.round((d.count / maxCount) * MAX_BAR_HEIGHT_PX),
                4
            );

            return {
                label:      d.status,
                count:      d.count,
                barClass:   `bar ${isActive ? 'bar--active' : 'bar--muted'}`,
                barStyle:   `height:${heightPx}px`,
                labelClass: `bar-status-label ${isActive ? 'bar-status-label--active' : ''}`,
            };
        });
    }
}
