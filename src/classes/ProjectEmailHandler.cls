global class ProjectEmailHandler implements Messaging.InboundEmailHandler {

    global Messaging.InboundEmailResult handleInboundEmail(Messaging.InboundEmail email,
            Messaging.InboundEnvelope envelope) {
        // Result object
        Messaging.InboundEmailResult result = new Messaging.InboundEmailResult();

        try {
            System.debug('Email references' + email.references);
            Id projectId = EmailMessages.getRecordIdFromEmail(email.subject, email.plainTextBody, email.htmlBody);

            if (projectId==null) {
                // Regex to extract Project ID (e.g., [Project ID: 001XXXXXXXXXXXXXXX])
                Pattern idPattern = Pattern.compile('\\[Project Id: (\\w{15,18})\\]');
                Matcher idMatcher = idPattern.matcher(email.subject + email.plainTextBody);

                if (idMatcher.find()) {
                    projectId = idMatcher.group(1);
                }

                if (String.isBlank(projectId)) {
                    throw new EmailProcessingException('Project Id not found in the email.');
                }
            }

            // Verify if the Project exists
            Project__c project = [SELECT Id, Name FROM Project__c WHERE Id = :projectId LIMIT 1];

            if (project == null) {
                throw new EmailProcessingException('Project record not found.');
            }

            // Log the email as an EmailMessage related to the Project
            EmailMessage emailMessage = new EmailMessage();
            emailMessage.RelatedToId = project.Id; //// Link to the Project. TODO: to show the related list of email messages-  emailMessage.Project__c = project.Id;
            emailMessage.Subject = email.subject;
            emailMessage.TextBody = email.plainTextBody + email.references;
            emailMessage.ThreadIdentifier = email.references[0];
            emailMessage.FromAddress = envelope.fromAddress;
            emailMessage.ToAddress = envelope.toAddress;
            emailMessage.Status = '3'; // Completed
            emailMessage.Incoming = true; // Mark as incoming email
            insert emailMessage;

            System.debug('EmailMessage created successfully: ' + emailMessage.Id);

            // Create Task to show in Activities
            Task task = new Task();
            task.WhatId = project.Id; // Link to the Project record
            task.Subject = 'Email: ' + email.subject;
            task.Description = email.plainTextBody;
            task.Status = 'Completed';
            task.Priority = 'Normal';
            task.ActivityDate = Date.today(); // Set the activity date to today
            insert task;

            System.debug('Task created successfully.');

            result.success = true;

        } catch (Exception ex) {
            System.debug('Error processing email: ' + ex.getMessage());
            result.success = false;
            result.message = ex.getMessage();
        }

        return result;
    }

    // Custom exception for email processing errors
    global class EmailProcessingException extends Exception {}
}