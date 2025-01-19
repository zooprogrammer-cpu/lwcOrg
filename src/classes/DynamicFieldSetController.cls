public with sharing class DynamicFieldSetController {
    @AuraEnabled(Cacheable = true)
    public static List<Map<String, Object>> fetchFieldSet(String objectApiName, String fieldSetName, Integer customLimit) {
        // Get the field set definition for the specified field set on the specified object
        Schema.DescribeSObjectResult objectDescribe = Schema.getGlobalDescribe().get(objectApiName).getDescribe();
        Schema.FieldSet fieldSet = objectDescribe.fieldSets.getMap().get(fieldSetName);

        // Build a dynamic query SOQL query using the fields in the field set
        String query = 'SELECT ';
        for (Schema.FieldSetMember field : fieldSet.getFields()) {
            query += field.getFieldPath() + ', ';
        }

        query = query.substring(0, query.length() - 2); // Remove the trailing comma
        query += ' FROM ' + objectApiName;
        if (customLimit != null) {
            query += ' LIMIT ' + customLimit;
        }

        // Execute the query
        List<Map<String, Object>> results = new List<Map<String, Object>>();
        for (SObject record : Database.query(query)) {
            Map<String, Object> row = new Map<String, Object>();
            for (Schema.FieldSetMember field: fieldSet.getFields()) {
                row.put(field.getFieldPath(), record.get(field.getFieldPath()));
            }
            results.add(row);
        }
        return results;
    }
}