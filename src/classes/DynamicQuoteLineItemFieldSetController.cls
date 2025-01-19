public with sharing class DynamicQuoteLineItemFieldSetController {
    @AuraEnabled(Cacheable = true)
    public static List<Map<String, Object>> fetchFieldSet(String objectApiName, String fieldSetName, Integer customLimit, Id quoteId) {
        // Get the field set definition for the specified field set on the specified object
        Schema.DescribeSObjectResult objectDescribe = Schema.getGlobalDescribe().get(objectApiName).getDescribe();
        Schema.FieldSet fieldSet = objectDescribe.fieldSets.getMap().get(fieldSetName);
        System.debug('FieldSet: ' + fieldSet);

        // Build a dynamic query SOQL query using the fields in the field set
        String query = 'SELECT Id, Product2.Name, ';
        for (Schema.FieldSetMember field : fieldSet.getFields()) {
            if (field.getType() == Schema.DisplayType.Reference) {
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

        // Execute the query
        List<Map<String, Object>> results = new List<Map<String, Object>>();
        for (SObject record : Database.query(query)) {
            Map<String, Object> row = new Map<String, Object>();
            for (Schema.FieldSetMember field: fieldSet.getFields()) {
                row.put(field.getFieldPath(), record.get(field.getFieldPath()));
            }
            // Add Product2.Name to the row map
            row.put('Product2.Name', record.getSObject('Product2').get('Name'));
            row.put('Id', record.Id );
            results.add(row);
        }
        return results;
    }
}