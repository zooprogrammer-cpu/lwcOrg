public with sharing class PaginationService {
    @AuraEnabled
    public static Map<String, Object> getData(
            Integer pageSize,
            Integer pageNumber
    ) {
        try {
            // Get total count for pagination
            Integer totalRecords = [SELECT COUNT() FROM Opportunity];

            // Calculate offset for pagination
            Integer offset = pageNumber * pageSize;

            // Query paginated Opportunity records
            List<Opportunity> oppList = [
                SELECT Id, Name, StageName, CloseDate
                FROM Opportunity
                ORDER BY Name
                LIMIT :pageSize
                OFFSET :offset
            ];

            // Build rows for the datatable
            List<Map<String, Object>> rows = new List<Map<String, Object>>();
            for (Opportunity opp : oppList) {
                Map<String, Object> rowMap = new Map<String, Object>();
                rowMap.put('Id', opp.Id);
                rowMap.put('Name', opp.Name);
                rowMap.put('StageName', opp.StageName);
                rowMap.put('CloseDate', opp.CloseDate);
                rows.add(rowMap);
            }

            return new Map<String, Object>{
                'rows' => rows,
                'totalRows' => totalRecords,
                'currentPage' => pageNumber,
                'pageSize' => pageSize
            };
        } catch (Exception e) {
            throw new AuraHandledException('Error getting Opportunities: ' + e.getMessage());
        }
    }

}