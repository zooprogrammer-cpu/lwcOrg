public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactList(){
        return [SELECT Id,Name, Title, Email FROM Contact];
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
}