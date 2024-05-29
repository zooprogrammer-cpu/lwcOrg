public with sharing class AccountController {
    @AuraEnabled(Cacheable=true)
    public static List<Account> getAccountList(){
//        return [SELECT Id, Name, Type, Industry FROM Account LIMIT 5];
        throw new AuraHandledException('Forced error');

    }

    @AuraEnabled(Cacheable=true)
    public static List<Account> getAccounts(){
//        return [SELECT Id, Name, Type, Industry FROM Account LIMIT 5];
        throw new AuraHandledException('Forced error');
    }

    @AuraEnabled(Cacheable=true)
    public static List<Account> getAccList(){
        return [SELECT Id, Name, Type, Industry FROM Account LIMIT 5];

    }

    @AuraEnabled
    public static void deleteAccount(String accountId) {
        Database.delete(accountId);
    }

    @AuraEnabled(Cacheable=true)
    public static List<Account> filterAccountTypeType(String type){
        return [SELECT Id, Name, Type, Industry FROM Account WHERE Type=:type LIMIT 5];
    }

    @AuraEnabled(Cacheable=true)
    public static List<Account> findAccounts(String searchKey){
        String key ='%' + searchKey + '%';

        return [SELECT Id, Name, Type, Industry FROM Account
        WHERE Name LIKE:key LIMIT 5];
    }

    @AuraEnabled(Cacheable=true)
    public static List<Account> getAccountRecordWithRelatedContactList(Id recordId) {

        List <Account> accountList = new List<Account>();
        accountList =  [SELECT Id, Name, (SELECT Id, FirstName, LastName, Title, Phone, Email FROM Contacts) FROM Account WHERE Id = :recordId];

        return accountList;
    }

    @AuraEnabled(Cacheable=true)
    public static List<Opportunity> getOpps( String searchKey, String sortBy,String sortDirection) {

       String query = 'SELECT Id, Name,StageName,CloseDate FROM Opportunity';
       System.debug('query---'+query);
       if ( searchKey != null && searchKey != '' ) {
           String key = '%' + searchKey + '%';
           query += ' WHERE Name LIKE :key';
       }
       if ( sortBy != null && sortDirection != null ) {
           query += ' ORDER BY ' + sortBy + ' ' + sortDirection;
       }
       query = query + ' LIMIT 10';
       return Database.query( query );
    }

    @AuraEnabled(Cacheable = true)
    public static List<Contact> getContacts(Id accountId) {
    return [SELECT Id, Name, Email, Phone FROM Contact WHERE AccountId =:accountId];
    }
}