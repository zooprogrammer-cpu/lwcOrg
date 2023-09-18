public with sharing class tableController {
   @AuraEnabled(cacheable = true)
   public static List<Account> getAccounts(){
      return [SELECT ID, NAME, AnnualRevenue, Industry, Phone FROM ACCOUNT]; 
   }
}