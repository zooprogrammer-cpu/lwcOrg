/**
 * Created by ashbas on 2/20/25.
 */

public with sharing class ActivityTimelineController {
    public static List<Task> activitiesList = new List<Task>();
    @AuraEnabled(Cacheable=true)
    public static List<Task> getRecentActivities(String recordId) {

        List<Task> activitiesInAccount = [
                SELECT Id, Subject, Status, Priority, CreatedDate, ActivityDate
                FROM Task
                WHERE WhatId = :recordId
        ];

        activitiesList.addAll(activitiesInAccount);

        List<Case> caseList = [SELECT Id FROM Case WHERE AccountId =: recordId];
        List<Id> caseListIds = new List<Id>();
        for (Case c : caseList) {
            caseListIds.add(c.Id);
        }

        List<Task> activitiesInCase = [
                SELECT Id, Subject, Status, Priority, CreatedDate, ActivityDate
                FROM
                Task
                WHERE WhatId IN: caseListIds
        ];

        activitiesList.addAll(activitiesInCase);


        return activitiesList;
    }

}