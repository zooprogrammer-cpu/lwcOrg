/**
 * Created by ashbas on 10/21/24.
 */
public with sharing class QuoteLineController {
//    @AuraEnabled(Cacheable=true)
//    public static List<QuoteLineItem> getQuoteLineItems(Id quoteId) {
//        String s = '';
//        Integer i = 0;
//        List<String> fieldsToQuery = new List<String>{'Id', 'Parent_Quote_Line_Item__c'};
//        List<SObject> sObjectList = CustomMetadataService.getCustomMetadata('Quote_Line_Item_Setting__mdt', '');
//
//        sObjectList.sort(new OrderComparator());
////        System.debug('sObjectList: ' + sObjectList);
//
//        Set<String> uniqueFields = new Set<String>();
//
//        for (SObject sObj : sObjectList) {
//            if (sObj.get('Active__c') == true) {
//                uniqueFields.add((String)sObj.get('Field_API_Name__c'));
//            }
//        }
//        fieldsToQuery.addAll(uniqueFields);
////        System.debug('fieldsToQuery:: ' + fieldsToQuery);
//
//        for (String field : fieldsToQuery) {
//            if ( i ==0 ) {
//                s+= field;
//            } else {
//                s+= ',' + field;
//            }
//            i ++;
//        }
//        String query = 'SELECT ' + s + ' FROM QuoteLineItem WHERE QuoteId = : quoteId';
////        System.debug('query: ' + query);
//        return Database.query(query);
//    }
//    @AuraEnabled(Cacheable=true)
//    public static List<QuoteLineItem> getQuoteLineItemsWIthFieldSet(String objectApiName, String fieldSetName, Integer customLimit, Id quoteId) {
//        // Get the field set definition for the specified field set on the specified object
//        Schema.DescribeSObjectResult objectDescribe = Schema.getGlobalDescribe().get(objectApiName).getDescribe();
//        Schema.FieldSet fieldSet = objectDescribe.fieldSets.getMap().get(fieldSetName);
//        System.debug('FieldSet: ' + fieldSet);
//
//        // Build a dynamic query SOQL query using the fields in the field set
//        String query = 'SELECT Id, Product2.Name, ';
//        for (Schema.FieldSetMember field : fieldSet.getFields()) {
//            System.debug('Field:: ' + field.getType());
//            if (field.getType() == Schema.DisplayType.Reference && field.getFieldPath() != 'Product2Id') {
//                System.debug('Reference field: + ' + field);
//                System.debug('Reference field path: ' + field.getFieldPath());
//                query += field.getLabel() + '__r.Name' + ', ';
//            } else {
//                query += field.getFieldPath() + ', ';
//            }
//        }
//
//        query = query.substring(0, query.length() - 2); // Remove the trailing comma
//        query += ' FROM ' + objectApiName;
//        query += ' WHERE QuoteId = :quoteId';
//        if (customLimit != null) {
//            query += ' LIMIT ' + customLimit;
//        }
//
//        System.debug('query::' + query);
//        List<QuoteLineItem> results = Database.query(query);
//        return results;
//
//    }

    @AuraEnabled (Cacheable = true)
    public static List<QuoteLineWrapperClass> fetchQuoteLineDetails(String objectApiName, String fieldSetName, Integer customLimit, Id quoteId) {
        List<QuoteLineWrapperClass> quoteLineWrapperList = new List<QuoteLineWrapperClass>();

        // Get the field set definition for the specified field set on the specified object
        Schema.DescribeSObjectResult objectDescribe = Schema.getGlobalDescribe().get(objectApiName).getDescribe();
        Schema.FieldSet fieldSet = objectDescribe.fieldSets.getMap().get(fieldSetName);
        System.debug('FieldSet: ' + fieldSet);

        // Build a dynamic query SOQL query using the fields in the field set
        String query = 'SELECT Id, Product2.Name,  ';
        for (Schema.FieldSetMember field : fieldSet.getFields()) {
            System.debug('Field:: ' + field.getType());
            if (field.getType() == Schema.DisplayType.Reference && field.getFieldPath() != 'Product2Id' && field.getFieldPath() != 'Parent_Quote_Line_Item__c') {
                System.debug('Reference field: + ' + field);
                System.debug('Reference field path: ' + field.getFieldPath());
                query += field.getFieldPath().replace('__c', '__r.Name') + ', ';
            } else {
                query += field.getFieldPath() + ', ';
            }
        }

        query = query.substring(0, query.length() - 2); // Remove the trailing comma
        query += ' FROM ' + objectApiName;
        query += ' WHERE QuoteId = :quoteId';
        if (customLimit != null) {
            query += ' LIMIT ' + customLimit;
        }

        System.debug('query::' + query);

        // Execute the query and create instances of the wrapper class
        for (QuoteLineItem ql : Database.query(query)) {
            Map<String, String> labels = new Map<String, String>();
            Map<String, String> fieldTypes = new Map<String, String>();
            for (Schema.FieldSetMember field : fieldSet.getFields()) {
                labels.put(field.getFieldPath(), field.getLabel());
                fieldTypes.put(field.getFieldPath(), String.valueOf(field.getType()));
            }
            quoteLineWrapperList.add(new QuoteLineWrapperClass(ql, labels, fieldTypes));
        }

        System.debug('quoteLineWrapperList: ' + quoteLineWrapperList);

        return quoteLineWrapperList;
    }

    @AuraEnabled
    public static void deleteQuoteLineItem(Id quoteLineItemId) {
        try {
            System.debug('deleteQuoteLineItem::' + quoteLineItemId);
            List<QuoteLineItem> quoteLinesToDelete = new List<QuoteLineItem>();
            QuoteLineItem primaryQuoteLine = [SELECT Id FROM QuoteLineItem WHERE Id =: quoteLineItemId];
            quoteLinesToDelete.add(primaryQuoteLine);

            List<QuoteLineItem> secondaryQuoteLinesList = [SELECT Id FROM QuoteLineItem WHERE Parent_Quote_Line_Item__c =:quoteLineItemId];
            if (!secondaryQuoteLinesList.isEmpty()) {
                for(QuoteLineItem ql : secondaryQuoteLinesList) {
                    quoteLinesToDelete.add(ql);
                }
            }
            delete quoteLinesToDelete;
        }
        catch (Exception e) {
            throw new AuraHandledException('Error deleting Quote Line Item: ' + e.getMessage());
        }
    }


    @AuraEnabled
    public static Map<String, String> getFieldTypes(List<QuoteLineItem> selectedQuoteLines) {
        String objectName = 'QuoteLineItem';
        Map<String, String> fieldTypeMap = new Map<String, String>();

        // Get the describe result for the QuoteLineItem object
        Map<String, Schema.SObjectField> fieldMap = Schema.getGlobalDescribe().get(objectName).getDescribe().fields.getMap();

        // Iterate over the fields in the selectedQuoteLines
        for (QuoteLineItem qli : selectedQuoteLines) {
            for (String fieldName : qli.getPopulatedFieldsAsMap().keySet()) {
                if (fieldMap.containsKey(fieldName)) {
                    Schema.DisplayType fieldType = fieldMap.get(fieldName).getDescribe().getType();
                    fieldTypeMap.put(fieldName, String.valueOf(fieldType));
                }
            }
        }

        return fieldTypeMap;
    }

    public class OrderComparator implements Comparator<sObject> {
        public Integer compare(SObject param1, SObject param2) {
            Decimal orderA = (Decimal) param1.get('Order__c');
            Decimal orderB = (Decimal) param2.get('Order__c');

            if (orderA == orderB) return 0;
            return orderA > orderB ? 1 : -1;
        }
    }

    public class QuoteLineWrapperClass {
        @AuraEnabled
        public QuoteLineItem quoteLine;
        @AuraEnabled
        public Map<String, String> labels;
        @AuraEnabled
        public Map<String, String> fieldTypes;

        public QuoteLineWrapperClass(QuoteLineItem quoteLine, Map<String, String> labels, Map<String, String> fieldTypes) {
            this.quoteLine = quoteLine;
            this.labels = labels;
            this.fieldTypes = fieldTypes;
        }
    }
}
