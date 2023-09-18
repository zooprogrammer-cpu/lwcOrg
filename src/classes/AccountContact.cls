public with sharing class AccountContact {
    @AuraEnabled (Cacheable = true)
    public static List<Account> allAccountsWithContact(){
        return (List<Account>) [SELECT Id, Name, Phone, Website,
        (SELECT Id,Name, Phone, Email FROM Contacts) FROM Account LIMIT 5];
    }
    //
}