public with sharing class AccountListControllerLwc {
    @AuraEnabled (Cacheable=true)
    public static List<Account> queryAccountsByRevenue(Decimal annualRevenue) {
        return [SELECT Id, AnnualRevenue FROM Account WHERE AnnualRevenue >= :annualRevenue];
    }

    @AuraEnabled(Cacheable=true)
    public static List<Account> queryAccountsByEmployeeNumber(Integer numberOfEmployees) {
        return [
                SELECT Name
                FROM Account
                WHERE NumberOfEmployees >= :numberOfEmployees
        ];
    }
}