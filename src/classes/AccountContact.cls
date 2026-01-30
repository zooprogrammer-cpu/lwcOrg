public with sharing class AccountContact {
    @AuraEnabled (Cacheable = true)
    public static List<Account> allAccountsWithContact(){
        System.debug('This is a test');
        System.debug('This is also a test');
        System.debug('This is another test');
        System.debug('Checking for CI/CD');
        System.debug('Checking for CI/CD');
        System.debug('Checking for CI/CD');
        return (List<Account>) [SELECT Id, Name, Phone, Website,
        (SELECT Id,Name, Phone, Email FROM Contacts) FROM Account LIMIT 7];
    }

}