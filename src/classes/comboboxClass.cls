public with sharing class comboboxClass {
    @AuraEnabled
    public static List<Account> getAccounts() {
        List<Account> accountList = [SELECT Id, Name FROM Account]; 
        return accountList; 
    }
}