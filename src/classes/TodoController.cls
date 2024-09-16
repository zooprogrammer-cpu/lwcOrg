/**
 * Created by ashbas on 9/12/24.
 */

public with sharing class TodoController {
    @AuraEnabled(Cacheable = true)
    public static List<Todo_Item__c> getTodoItems(String relatedRecordId) {
        try {
            return [
                    SELECT Id, Name, Is_Complete__c, Due_Date__c, RelatedRecordId__c
                    FROM Todo_Item__c
                    WHERE
                    RelatedRecordId__c =:relatedRecordId
                    AND Is_Complete__c = FALSE
                    ORDER BY Due_Date__c
            ];
        }

        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


}