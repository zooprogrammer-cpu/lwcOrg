/**
 * Created by ashbas on 6/21/25.
 */

public with sharing class AccountListController {
    @AuraEnabled
    public static List<Account> fetchAccounts(Integer intOffset) {
        List<Account> listAccounts = new List<Account>();
        System.debug('intOffSet is:' + intOffset);

        if (intOffset !=null) {
            listAccounts = [SELECT Id, Name, Industry, AccountNumber
            FROM Account LIMIT 10 OFFSET : Integer.valueOf(intOffset)];
        }
        System.debug('listOfAccounts is:: ' + listAccounts);

        return listAccounts;

    }

}