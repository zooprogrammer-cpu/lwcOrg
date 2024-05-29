public with sharing class refreshContactController {
    @AuraEnabled(Cacheable= true)
    public static List<Contact> getContactList(Id accId) {
        return [SELECT Id,FirstName,LastName, Email FROM Contact WHERE AccountId =:accId LIMIT 10];
    }
}