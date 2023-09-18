public with sharing class AccountControllerAsyncAwait {
    @AuraEnabled
    public static List<Account> getAccountData() {
       return [SELECT Id, Name, Industry FROM Account];      
    }
}