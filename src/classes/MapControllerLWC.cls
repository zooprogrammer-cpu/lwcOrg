public with sharing class MapControllerLWC {
@AuraEnabled(Cacheable=true)
public static List<Account> getAccounts() {
   return [SELECT Id,Name,Description, BillingStreet,
   BillingCountry, BillingCity, BillingState, BillingPostalCode
   FROM Account WHERE BillingPostalCode != NULL ORDER BY Name LIMIT 5];
}
}