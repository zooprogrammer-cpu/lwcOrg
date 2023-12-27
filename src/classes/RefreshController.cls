public with sharing class RefreshController {
    @AuraEnabled
    public static List<Account> getAccountRating(Id accountId) {
        return [SELECT Id, Rating FROM Account WHERE Id =: accountId];
    }
}