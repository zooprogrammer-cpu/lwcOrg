public with sharing class ErrorLoggingService {
    @AuraEnabled
    public static void logClientError(String componentName, String methodName, String message, String stack) {
        logError(componentName, methodName, message, stack, 'LWC', 'Medium', null, null);
    }

    public static void logError(String sourceName, String methodName, String message, String stackTrace, String sourceType, String severity, Id userId, Id relatedRecordId) {
        try {
            Error_Log__c log = new Error_Log__c();
            log.Source_Name__c = sourceName;
            log.Method_Name__c = methodName;
            log.Error_Message__c = message;
            log.Stack_Trace__c = stackTrace;
            log.Source_Type__c = sourceType;
            log.Severity__c = severity;
            log.Related_Record_Id__c = relatedRecordId;
            insert log;
        } catch (Exception ex) {
            System.debug('Failed to log error: ' + ex.getMessage());
        }
    }

    @InvocableMethod(label='Log Error from Flow')
    public static void logErrorFromFlow(List<FlowErrorWrapper> errors) {
        List<Error_Log__c> errorLogs = new List<Error_Log__c>();
        for (FlowErrorWrapper err : errors) {
            Error_Log__c log = new Error_Log__c();
            log.Source_Name__c = err.Source_Name;
            log.Method_Name__c = err.Method_Name;
            log.Error_Message__c = err.Error_Message;
            log.Stack_Trace__c = err.Stack_Trace;
            log.Source_Type__c = 'Flow';
            log.Severity__c = err.Severity;
            log.Related_Record_Id__c = err.Related_Record_Id;
            errorLogs.add(log);
        }
        if (!errorLogs.isEmpty()) {
            insert errorLogs;
        }
    }

    public class FlowErrorWrapper {
        @InvocableVariable(label='Source Name')
        public String Source_Name;

        @InvocableVariable(label='Method Name')
        public String Method_Name;

        @InvocableVariable(label='Error Message')
        public String Error_Message;

        @InvocableVariable(label='Stack Trace')
        public String Stack_Trace;

        @InvocableVariable(label='Severity')
        public String Severity;

        @InvocableVariable(label='Related Record Id')
        public Id Related_Record_Id;
    }
}