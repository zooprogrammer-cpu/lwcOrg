public class ProjectOutboundEmailHandler {

//    public static void sendOutboundEmail(Id projectId, String subject, String body) {
//        try {
//            // Create the EmailMessage record
//            EmailMessage emailMessage = new EmailMessage();
//            emailMessage.Subject = subject;
//            emailMessage.TextBody = body;
//            emailMessage.FromAddress = 'youremail@example.com';  // Set the sender's email address
//            emailMessage.ToAddress = 'recipient@example.com';    // Set the recipient's email address
//            emailMessage.Project__c = projectId;  // Link the email to the Project record
//            emailMessage.Status = '3';  // Mark as completed (sent)
//            emailMessage.Incoming = false;  // Mark as outgoing email
//            insert emailMessage;
//        } catch (Exception ex) {
//            System.debug('Error sending email: ' + ex.getMessage());
//        }
//    }

//    public static void sendProjectUpdateEmail(Id projectId, String recipientEmail, String subject, String body) {
//        // Retrieve the Salesforce Email Service address
//        String emailServiceAddress = 'test_projectemailservice@b-1j0fppa4iisqj4oio5xry9464n051tiyft2gvw4ls11n5p7q9o.5f-4a27keaa.na163.apex.salesforce.com';
//
//        // Create the email
//        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
//        email.setToAddresses(new String[] { recipientEmail }); // Set recipient email
//        email.setSubject(subject); // Set subject
//        email.setPlainTextBody(body); // Set email body
//        email.setReplyTo(emailServiceAddress); // Set the Reply-To address
//        email.setSenderDisplayName('Ash LLC'); // Customize sender name
//
//        // Add the Project ID to the email subject or body for tracking
//        email.setSubject(subject + ' [Project Id: ' + projectId + ']');
//        email.setPlainTextBody(body + '\n\nProject Id: ' + projectId);
//
//        // Send the email
//        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { email });
//    }

    public static void sendEmailWithToken(Id projectId, String recipientEmail, String subject, String body) {
        // Get your Record ID. Here, we're using a dummy Case ID.
        Id projectIdUsingToken = projectId;

        // Get the formatted threading token.
        String formattedToken = EmailMessages.getFormattedThreadingToken(projectIdUsingToken);
        String emailServiceAddress = 'test_projectemailservice@b-1j0fppa4iisqj4oio5xry9464n051tiyft2gvw4ls11n5p7q9o.5f-4a27keaa.na163.apex.salesforce.com';


        // Create a SingleEmailMessage object.
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();

        // Set recipients and other fields.
        email.setToAddresses(new String[] { recipientEmail }); // Set recipient email
        // Append the threading token to the email body (text or html), subject,
        // or both body and subject.
        email.setPlainTextBody(body+ '\n\n' + formattedToken);
        email.setHtmlBody(body+ '<br><br>' + formattedToken);
        email.setSubject(subject+ '[ ' + formattedToken + ' ]');
        email.setReplyTo(emailServiceAddress); // Set the Reply-To address
        email.setSenderDisplayName('Ash LLC'); // Customize sender name

        // Send out the email.
        Messaging.sendEmail(new Messaging.SingleEmailMessage[]{email});

    }

/*    Id projectId = 'a075f00000DISpwAAH'; // Replace with the actual Project record ID
    String recipientEmail = 'ashbasn@gmail.com';
    String subject = 'Project Update from ProjectOutbound';
    String body = 'Here are the details for your project.';

    ProjectOutboundEmailHandler.sendProjectUpdateEmail(projectId, recipientEmail, subject, body);*/


}