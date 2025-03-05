public with sharing class AccountControllerAsyncAwait {
    @AuraEnabled
    public static List<Account> getAccountData() {
        List<Account> accountsList = [SELECT Id, Name, Industry FROM Account];
        System.debug('accountsList::' + accountsList);
        return accountsList;
    }
}