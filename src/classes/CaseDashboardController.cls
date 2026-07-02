public with sharing class CaseDashboardController {

    /**
     * Returns the count of Cases grouped by every Status value present in the org.
     * Used by the caseChart child component to render the bar chart.
     *
     * @return  List of maps, each containing 'status' (String) and 'count' (Integer).
     */
    @AuraEnabled(cacheable=true)
    public static List<Map<String, Object>> getCaseCountsByStatus() {
        List<AggregateResult> results = [
            SELECT Status, COUNT(Id) cnt
            FROM Case
            WITH USER_MODE
            GROUP BY Status
            ORDER BY Status ASC
        ];
        List<Map<String, Object>> counts = new List<Map<String, Object>>();
        for (AggregateResult ar : results) {
            counts.add(new Map<String, Object>{
                'status' => (String)  ar.get('Status'),
                'count'  => (Integer) ar.get('cnt')
            });
        }
        return counts;
    }

    /**
     * Returns a list of Cases filtered by status.
     * Passing 'All' (or a blank value) returns cases of every status.
     *
     * @param status  The Case Status value to filter on, or 'All' for no filter.
     * @return        List of Cases with Id, CaseNumber, Subject, and Status.
     */
    @AuraEnabled(cacheable=true)
    public static List<Case> getCases(String status) {
        if (String.isNotBlank(status) && status != 'All') {
            return [
                SELECT Id, CaseNumber, Subject, Status
                FROM Case
                WHERE Status = :status
                WITH USER_MODE
                ORDER BY CaseNumber ASC
                LIMIT 200
            ];
        }
        return [
            SELECT Id, CaseNumber, Subject, Status
            FROM Case
            WITH USER_MODE
            ORDER BY CaseNumber ASC
            LIMIT 200
        ];
    }
}
