/**
 * Created by ashbas on 9/30/24.
 */

@IsTest
private class GetOrgBaseUrlTest {
    @testSetup
    static void setup() {

        // Create a test account
        Account a = new Account(Name='Test Account');
        insert a;
    }

    @isTest
    static void stripHtmlTags() {

        // Access the opportunity that was just created.
        Account account = [SELECT Id, Name FROM Account LIMIT 1];

        GetOrgBaseUrl.getBaseUrl(new List<sObject> {account});
    }
}