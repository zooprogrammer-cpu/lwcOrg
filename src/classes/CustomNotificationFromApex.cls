public without sharing class CustomNotificationFromApex {

    public static void notifyUsers(Set<String> recipientsIds, String targetId) {

        // Get the Id for our custom notification type
        CustomNotificationType notificationType =
        [SELECT Id, DeveloperName
        FROM CustomNotificationType
        WHERE DeveloperName='Discount_Alert'];

        // Create a new custom notification
        Messaging.CustomNotification notification = new Messaging.CustomNotification();

        // Set the contents for the notification
        notification.setTitle('Apex Custom Notification');
        notification.setBody('The notifications are coming from INSIDE the Apex!');

        // Set the notification type and target
        notification.setNotificationTypeId(notificationType.Id);
        notification.setTargetId(targetId);

        // Set the URL for the notification
        String recordUrl = Url.getOrgDomainUrl().toExternalForm() + '/' + targetId;

        // Include the URL in the body of the notification
        notification.setBody('Click here to view the record: ' + recordUrl);

        // Actually send the notification
        try {
            notification.send(recipientsIds);
        }
        catch (Exception e) {
            System.debug('Problem sending notification: ' + e.getMessage());
        }
    }
}