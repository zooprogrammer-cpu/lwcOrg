public with sharing class CustomProgressBarController {
    @AuraEnabled
    public static String getCurrentStatus(Id recordId) {
        if (recordId == null) {
            throw new AuraHandledException('recordId is null');
        }
        System.debug('recordId: ' + recordId);
        List<Project__c> projectList = [SELECT Id, Status__c FROM Project__c WHERE Id = :recordId LIMIT 1];
        if (projectList.isEmpty()) {
            return 'No Status Found';
        }
        return projectList[0].Status__c;
    }
}