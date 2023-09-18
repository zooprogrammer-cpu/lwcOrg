public with sharing class refreshContactController {
    @AuraEnabled(Cacheable= true)
    public static List<Contact> getContactList() {
        return [SELECT Id,FirstName,LastName, Email FROM Contact LIMIT 10];
    }
}