/**
 * Created by ashbas on 1/2/25.
 */
@IsTest
public with sharing class ProjectEmailHandlerTest {
    @IsTest
    static  void testMe() {

        // create a new email and envelope object
        Messaging.InboundEmail email = new Messaging.InboundEmail() ;
        Messaging.InboundEnvelope env = new Messaging.InboundEnvelope();

        // setup the data for the email
        email.subject = 'Test Job Applicant';
        email.fromname = 'FirstName LastName';
        env.fromAddress = 'someaddress@email.com';

        // add an attachment
//        Messaging.InboundEmail.BinaryAttachment attachment = new Messaging.InboundEmail.BinaryAttachment();
//        attachment.body = blob.valueOf('my attachment text');
//        attachment.fileName = 'textfile.txt';
//        attachment.mimeTypeSubType = 'text/plain';
//
//        email.binaryAttachments =
//                new Messaging.inboundEmail.BinaryAttachment[] { attachment };

        // call the email service class and test it with the data in the testMethod
        ProjectEmailHandler emailProcess = new ProjectEmailHandler();
        emailProcess.handleInboundEmail(email, env);

        // query for the contact the email service created
//        Project__c proj = [select id, firstName, lastName, email from Project__c
//        WHERE firstName = 'FirstName' and lastName = 'LastName'];
//
//        System.assertEquals(contact.firstName,'FirstName');
//        System.assertEquals(contact.lastName,'LastName');
//        System.assertEquals(contact.email,'someaddress@email.com');

        // find the attachment
//        Attachment a = [select name from attachment where parentId = :contact.id];
//
//        System.assertEquals(a.name,'textfile.txt');

    }

}