public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactList(){
        return [SELECT Id,Name, FirstName, LastName, Title, Email FROM Contact];
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
    public static void updateContact(Id recordId) {
        System.debug('recordId: ' + recordId);
        Contact contact = [SELECT Id, Name, FirstName, LastName, Title, Email FROM Contact WHERE Id = :recordId LIMIT 1];
        contact.FirstName = 'Bruce';
        update contact;
    }
}