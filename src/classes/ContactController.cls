public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactList(){
        return [SELECT Id,Name, Title, Email FROM Contact LIMIT 5];
    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactListFromAccount(Id accId){
        List<Contact> conList = [SELECT Id,Name, Title, Email, AccountId FROM Contact WHERE AccountId =:accId];
        System.debug('accId' + accId);
        System.debug('conList' + conList);
        return conList;
    }

    @AuraEnabled
    public static string updateContacts(Object data){
        List<Contact> contactsToUpdate = (List<Contact>) JSON.deserialize(
            JSON.serialize(data), 
            List<Contact>.class
        );
        try {
            update contactsToUpdate;
            return 'Success: Contacts have been updated';
        }
        catch (Exception e) {
            return 'The following exception has error' + e.getMessage();
        }
        
    }

    @AuraEnabled
    public static void updateContact (String contactId , String email) {
        List<Contact> conList = [SELECT Id, Email FROM Contact WHERE Id=: contactId LIMIT 1];
        Contact con = conList[0];
        con.Email = email;
        update con;

    }
}