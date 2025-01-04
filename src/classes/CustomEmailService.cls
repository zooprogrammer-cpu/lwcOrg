/**
 * Created by ashbas on 12/31/24.
 */

    public with sharing class CustomEmailService implements Messaging.InboundEmailHandler {
        public Messaging.InboundEmailResult handleInboundEmail(Messaging.InboundEmail email, Messaging.InboundEnvelope envelope) {
            Messaging.InboundEmailResult result = new Messaging.InboundEmailresult();
            String plainTextBody = email.plainTextBody;
            System.debug('Email Body:: ' + plainTextBody);

            // Regex patterns to extract values between tags
            Pattern namePattern = Pattern.compile('<Name>(.*?)</Name>');
            Pattern accNumPattern = Pattern.compile('<AccNum>(.*?)</AccNum>');
            Pattern accPhonePattern = Pattern.compile('<AccPhone>(.*?)</AccPhone>');

            // FInd matches using regex
            Matcher nameMatcher = namePattern.matcher(plainTextBody);
            Matcher accNumMatcher = accNumPattern.matcher(plainTextBody);
            Matcher accPhoneMatcher = accPhonePattern.matcher(plainTextBody);

            // Create a new account record
            Account acc = new Account();
            if (nameMatcher.find()) {
                acc.Name = nameMatcher.group(1); // Extract matched group
            }
            if (accNumMatcher.find()) {
                acc.AccountNumber = accNumMatcher.group(1);
            }
            if (accPhoneMatcher.find()) {
                acc.Phone = accPhoneMatcher.group(1);
            }

            // Insert the account record
            try {
                Database.SaveResult insertAccountRecord = Database.insert(acc);
                System.debug('Account Inserted: ' + insertAccountRecord.isSuccess());
            }
            catch( Exception e) {
                System.debug('Error inserting account: ' + e.getMessage());
            }

            return result;
        }
    }