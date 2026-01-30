global without sharing class ConvertRecordsToCSV2 implements Queueable {
    class GenerateCSVException extends Exception {}

    private static Integer SYNC_ITERATION_LIMIT = 200000;
    private static String DOC_START_CONTENT = '\n';

    private Inputs input;

    global enum CSVParseType {
        HEADERS_ONLY,
        ROWS_ONLY,
        ALL
    }

    global class Inputs {
        @InvocableVariable(description='List of records to print in report')
        global List<SObject> recordCollection;

        @InvocableVariable
        global String recordCollectionString;

        @InvocableVariable
        global String objectName;

        @InvocableVariable(description='File name for report' required=true)
        global String documentTitle;

        @InvocableVariable(description='Sharing permissions for the file. Valid values: "V" (viewer), "C" (collaborator), "I" (inferred); Default value: "V"')
        global String documentShareType;

        @InvocableVariable(description='Specifies whether the document is available to all users, internal users, or shared users. Valid values: "AllUsers", "InternalUsers", "SharedUsers"; Default value: "AllUsers"')
        global String documentVisibility;

        @InvocableVariable(description='Optional list of record Ids to link generated file to')
        global List<String> linkedRecordIds;

        @InvocableVariable(description='Optional comma-separated string of record Ids to link generated file to')
        global String linkedRecordIdsString;

        @InvocableVariable(description='Optional: Collection of fields (column names) to report. If null, all populated fields on the records will be displayed. NOTE: If you need to print related fields this parameter is required.')
        global List<String> fieldsCollection;

        @InvocableVariable(description='Optional: Comma-separated string of fields (column names) to report. If null, all populated fields on the records will be displayed. NOTE: If you need to print related fields this parameter is required.')
        global String fieldsString;

        @InvocableVariable(description='If set, the action will execute asynchrounously and file information will be posted to a platform event: CSV_Document__e. Use this identifier to listen for the platform event in a \'Wait\' element in Flow, or use Summer 20\'s \'Invoke Flow from a Platform Event\'')
        global String executeAsyncIdentifier;

        @InvocableVariable(description='If true, use field labels instead of API names for column headers. Default is false.')
        global Boolean useFieldLabels;
    }

    global class Outputs {
        @InvocableVariable(description='Id for ContentDocument generated')
        global String contentDocumentId;

        @InvocableVariable(description='Id for ContentVersion generated')
        global String contentVersionId;

        @InvocableVariable(description='If you provided linked record Ids, this will returned the related ContentDocumentLinks for each')
        global List<ContentDocumentLink> contentDocumentLinks;

        @InvocableVariable(description='Id of the asynchronous job queued (AsyncApexJob). If the action was executed asynchronously all other return values will be null. Use this to query for status of the job.')
        global List<ID> asyncJobIds;
    }

    // Use this queueable initializer if there is only one queueable task to be completed
    global ConvertRecordsToCSV2(Inputs input) {
        this.input = input;
    }

    global void execute(QueueableContext context) {
        Outputs returnVal = generateDocument(
                this.input.linkedRecordIds,
                this.input.documentTitle,
                this.input.documentShareType,
                this.input.documentVisibility,
                generateCSVContent(
                        input.recordCollection,
                        input.fieldsCollection,
                        CSVParseType.ALL,
                        true,
                        input.useFieldLabels
                )
        );
        // Generate platform event
        // Use this to get document information for jobs that were executed asyncronously from your flow.
        // NOTE: Before uncommenting these lines of code, create the `CSV_Export_Event__e` event in your salesforce environment.
        // The platform event should have 3 fields:
        //    1. ContentDocumentId__c
        //    2. ContentVersionId__c
        //    3. Source_Unique_ID__c (A unique identifer to listen for the event in flow; this can be named whatever you like)
        // UNCOMMENT BELOW THIS LINE FOR PLATFORM EVENT SUPPORT
        // CSV_Export_Event__e documentCompleteEvent = new CSV_Export_Event__e();
        // documentCompleteEvent.ContentDocumentId__c = returnVal.contentDocumentId;
        // documentCompleteEvent.ContentVersionId__c = returnVal.contentVersionId;
        // documentCompleteEvent.Source_Unique_ID__c = this.input.executeAsyncIdentifier;

        // List<Database.SaveResult> results = EventBus.publish(new List<CSV_Export_Event__e>{documentCompleteEvent});
        // for (Database.SaveResult result: results) {
        //     if (!result.isSuccess()) {
        //         // potentially throw and error here?
        //         System.debug('CSV document event publication failed.');
        //     }
        // }
    }
    @InvocableMethod(label='Convert Records to CSV with Field Labels' description='Generates a CSV given a list of sObjects, uploads it to Files, and optionally links it to a list of related records.' category='Reporting')
    global static List<ConvertRecordsToCSV2.Outputs> generateCSV(List<ConvertRecordsToCSV2.Inputs> inputVariables) {
        if (inputVariables.size() == 0) {
            throw new GenerateCSVException('No input variables provided.');
        }

        Integer currentHeap = Math.round(((Limits.getHeapSize() / Limits.getLimitHeapSize())*100));
        System.debug('Logs: Limits: HEAP: Used: ' + currentHeap + '%');
        if (currentHeap == 100) {
            throw new GenerateCSVException('Heap Limit Reached. Input is too large for processing.');
        }

        List<ConvertRecordsToCSV2.Outputs> outputs = new List<ConvertRecordsToCSV2.Outputs>{};
        for (Inputs input: inputVariables) {
            if(String.isNotEmpty(input.recordCollectionString) && (input.recordCollection == null || input.recordCollection.size() == 0)) {
                input.recordCollection = (List<SObject>) JSON.deserialize(input.recordCollectionString, List<SObject>.class);
            }
            if (input.recordCollection == null || input.recordCollection.size() == 0) {
                // Nothing to do here
                return new List<Outputs>{};
            }

            if (input.fieldsString != null && input.fieldsString.length() > 0) {
                input.fieldsCollection = input.fieldsString.replace(' ', '').split(',');
                if (input.fieldsCollection.size() == 0) {
                    throw new GenerateCSVException('Invalid list of primary fields provided. The string is not comma separated.');
                }
            }

            if (input.linkedRecordIdsString != null && input.linkedRecordIdsString.length() > 0) {
                input.linkedRecordIds = input.linkedRecordIdsString.replace(' ', '').split(',');
                if (input.linkedRecordIds.size() == 0) {
                    throw new GenerateCSVException('Invalid list of linked record ids provided. The string is not comma separated.');
                }
            }

            Boolean executeAsync = input.executeAsyncIdentifier != null;
            if (!executeAsync && input.fieldsCollection != null && input.fieldsCollection.size()*input.recordCollection.size() > SYNC_ITERATION_LIMIT) {
                throw new GenerateCSVException('The batch size you have provided is too large to execute synchronously. Please reduce the number of columns or rows or run execute this action asynchronously.');
            }

            if (!executeAsync) {
                String fullCSV = generateCSVContent(
                        input.recordCollection,
                        input.fieldsCollection,
                        CSVParseType.ALL,
                        executeAsync,
                        input.useFieldLabels
                );
                ConvertRecordsToCSV2.Outputs returnVal = generateDocument(
                        input.linkedRecordIds,
                        input.documentTitle,
                        input.documentShareType,
                        input.documentVisibility,
                        fullCSV
                );
                return new List<Outputs>{returnVal};
            }

            ID jobId = System.enqueueJob(new ConvertRecordsToCSV2(input));
            Outputs returnVal = new Outputs();
            returnVal.asyncJobIds = new List<ID>{jobId};
            outputs.add(returnVal);
        }
        return outputs;
    }

    global static String generateCSVContent(List<SObject> objectList, List<String> fieldList, CSVParseType parseType, Boolean executingAsync) {
        return generateCSVContent(objectList, fieldList, parseType, executingAsync, false);
    }

    global static String generateCSVContent(List<SObject> objectList, List<String> fieldList, CSVParseType parseType, Boolean executingAsync, Boolean useFieldLabels) {
        if (objectList[0].getSObjectType().getDescribe().getName() == 'AggregateResult') {
            // Handle AggregateResult type
            return generateAggregateResultCSV(objectList, fieldList, parseType, executingAsync, useFieldLabels);
        }
        // Handle regular sObject
        return generateRecordsToCSV(objectList, fieldList, parseType, executingAsync, useFieldLabels);
    }

    @TestVisible
    private static String generateRecordsToCSV(List<SObject> objectList, List<String> fieldList, CSVParseType parseType, Boolean executingAsync, Boolean useFieldLabels) {
        Set<String> columnHeaders = new Set<String>{};
        Map<String, String> fieldLabelMap = new Map<String, String>(); // Map to store API name to Label mapping
        List<String> rowElements = new List<String>{};

        String columnHeadersCSV = '';
        String rowElementsCSV = '';

        // Get the SObject type from the first record
        Schema.SObjectType sObjectType = objectList[0].getSObjectType();
        Map<String,Schema.SObjectField> allFields = sObjectType.getDescribe().fields.getMap();
        // If primary fields were provided, set them to the column values
        if (fieldList != null) {
            columnHeaders = new Set<String>(fieldList);
            // Create mapping of API names to Labels
            for(String fieldName : fieldList) {
                if(fieldName.contains('.')) {
                    // Handle related fields
                    List<String> fieldParts = fieldName.split('\\.');
                    Schema.SObjectType currentType = sObjectType;
                    String labelPath = '';

                    for(Integer i = 0; i < fieldParts.size(); i++) {
                        String part = fieldParts[i];
                        if(i < fieldParts.size() - 1) {
                            Schema.SObjectField relationshipField = currentType.getDescribe().fields.getMap().get(part);
                            currentType = relationshipField.getDescribe().getReferenceTo()[0];
                            labelPath += relationshipField.getDescribe().getLabel() + ' • ';
                        } else {
                            Schema.SObjectField field = currentType.getDescribe().fields.getMap().get(part);
                            labelPath += field.getDescribe().getLabel();
                        }
                    }
                    fieldLabelMap.put(fieldName, labelPath);
                } else if(allFields.containsKey(fieldName)) {
                    fieldLabelMap.put(fieldName, allFields.get(fieldName).getDescribe().getLabel());
                }
            }
        } else {
            // If no primary fields are provided, add all populated fields
            for (SObject so: objectList) {
                Set<String> populatedFieldNames = new Set<String>{};
                Set<String> allFieldsKeySet = allFields.keySet();
                for (String field: so.getPopulatedFieldsAsMap().keySet()) {
                    if (allFieldsKeySet.contains(field.toLowerCase())) {
                        populatedFieldNames.add(field);
                        if(!fieldLabelMap.containsKey(field)) {
                            fieldLabelMap.put(field, allFields.get(field).getDescribe().getLabel());
                        }
                    }
                }
                columnHeaders.addAll(populatedFieldNames);
            }
        }

        // Check limits
        if (!executingAsync && parseType != CSVParseType.HEADERS_ONLY && columnHeaders.size()*objectList.size() > SYNC_ITERATION_LIMIT) {
            throw new GenerateCSVException('The batch size you have provided is too large to execute synchronously. Please reduce the number of columns or rows or run execute this action asynchronously.');
        }

        if (parseType == CSVParseType.HEADERS_ONLY || parseType == CSVParseType.ALL) {
            List<String> headerList = new List<String>();
            for(String header : columnHeaders) {
                // Use the label if available, otherwise use the API name
                String headerText = useFieldLabels ? fieldLabelMap.get(header) : header;
                headerList.add(headerText);
            }
            columnHeadersCSV = String.join(headerList, ',') + '\n';
        }

        if (parseType == CSVParseType.ROWS_ONLY || parseType == CSVParseType.ALL) {
            for (SObject so: objectList) {
                String rowElement = '';
                for (String header: columnHeaders) {
                    if (header.contains('.')) { // Handle Related Fields
                        // pull related fields and add data
                        List<String> fieldComponents = header.split('\\.');
                        SObject traverse = so;
                        for (Integer i = 0; i < fieldComponents.size(); i++) {
                            String comp = fieldComponents[i];
                            if (i < fieldComponents.size() - 1) {
                                traverse = traverse.getSObject(comp);
                            } else if (traverse != null) {
                                // get field value for the last field component
                                Object fieldValue = traverse.get(comp);
                                if (fieldValue != null) {
                                    Schema.DisplayType fieldType = traverse.getSObjectType().getDescribe().fields.getMap().get(comp).getDescribe().getType();
                                    rowElement += getDisplayTextForFieldType(fieldValue, fieldType);
                                } else {
                                    rowElement += '';
                                }
                            } else {
                                rowElement += '';
                            }
                        }
                    } else if (so.get(header) != null) {
                        Object value = so.get(header);
                        Schema.SObjectField field = allFields.get(header);
                        if (field != null && (field.getDescribe().getType() == Schema.DisplayType.ADDRESS || field.getDescribe().getType() == Schema.DisplayType.LOCATION)) {
                            // handle compound fields like address and location
                            rowElement += JSON.serialize(value).escapeCsv();
                        } else {
                            rowElement += String.valueOf(value).replaceAll('\r\n|\n|\r',' ').escapeCsv();
                        }
                    } else {
                        rowElement += '';
                    }
                    rowElement += ',';
                }
                rowElement = rowElement.removeEnd(',');
                rowElements.add(rowElement);
            }
            rowElementsCSV = String.join(rowElements, '\n') + '\n';
        }
        return columnHeadersCSV + rowElementsCSV;
    }

    @TestVisible
    private static String generateAggregateResultCSV(List<SObject> objectList, List<String> fieldList, CSVParseType parseType, Boolean executingAsync, Boolean useFieldLabels) {
        Set<String> columnHeaders = new Set<String>{};
        List<String> rowElements = new List<String>{};
        Map<String, String> fieldLabelMap = new Map<String, String>(); // Map to store API name to Label mapping

        String columnHeadersCSV = '';
        String rowElementsCSV = '';

        // If primary fields were provided, set them to the column values
        if (fieldList != null) {
            columnHeaders = new Set<String>(fieldList);
            if (parseType == CSVParseType.HEADERS_ONLY || parseType == CSVParseType.ALL) {
                // For aggregate results, we can't get field labels directly
                // Use the provided field names as labels
                columnHeadersCSV = String.join(new List<String>(columnHeaders), ',') + '\n';
            }

            if (parseType == CSVParseType.ROWS_ONLY || parseType == CSVParseType.ALL) {
                for (AggregateResult result: (List<AggregateResult>)objectList) {
                    String rowElement = '';
                    for (String header: columnHeaders) {
                        Object fieldValue = result.get(header);
                        if (fieldValue != null) {
                            rowElement += String.valueOf(fieldValue).replaceAll('\r\n|\n|\r',' ').replace(',', '');
                        } else {
                            rowElement += '';
                        }
                        rowElement += ',';
                    }
                    rowElement = rowElement.removeEnd(',');
                    rowElements.add(rowElement);
                }
                rowElementsCSV = String.join(rowElements, '\n') + '\n';
            }
        } else {
            List<Map<String, Object>> soFieldList = new List<Map<String, Object>>{};
            // Get union of all populated field names
            for (AggregateResult result: (List<AggregateResult>)objectList) {
                soFieldList.add((Map<String, Object>)JSON.deserializeUntyped(JSON.serialize(result)));
            }

            for (Map<String, Object> data: soFieldList) {
                columnHeaders.addAll(data.keySet());
                columnHeaders.remove('attributes');
            }

            // Check limits
            if (!executingAsync && parseType != CSVParseType.HEADERS_ONLY && columnHeaders.size()*objectList.size() > SYNC_ITERATION_LIMIT) {
                throw new GenerateCSVException('The batch size you have provided is too large to execute synchronously. Please reduce the number of columns or rows or run execute this action asynchronously.');
            }

            if (parseType == CSVParseType.HEADERS_ONLY || parseType == CSVParseType.ALL) {
                columnHeadersCSV = String.join(new List<String>(columnHeaders), ',') + '\n';
            }

            if (parseType == CSVParseType.ROWS_ONLY || parseType == CSVParseType.ALL) {
                for (Map<String, Object> data: soFieldList) {
                    String rowElement = '';
                    for (String header: columnHeaders) {
                        if (data.get(header) != null) {
                            rowElement += String.valueOf(data.get(header)).replaceAll('\r\n|\n|\r',' ').replace(',', '');
                        } else {
                            rowElement += '';
                        }
                        rowElement += ',';
                    }
                    rowElement = rowElement.removeEnd(',');
                    rowElements.add(rowElement);
                }
                rowElementsCSV = String.join(rowElements, '\n') + '\n';
            }
        }
        return columnHeadersCSV + rowElementsCSV;
    }

    global static ConvertRecordsToCSV2.Outputs generateDocument(List<String> linkedRecordIds, String documentTitle, String documentShareType, String documentVisibility, String content) {
        ContentVersion cv = new ContentVersion();
        cv.VersionData = Blob.valueOf(content);
        cv.Title = documentTitle;
        cv.PathOnClient = documentTitle + '.csv';
        cv.IsMajorVersion = false;
        insert cv;

        // Is new document
        List<ContentDocument> doc = [Select Id from ContentDocument WHERE LatestPublishedVersionId =: cv.Id LIMIT 1];
        if (doc.size() == 0) {
            throw new GenerateCSVException('Document failed to generate for CSV content.');
        }

        List<ContentDocumentLink> linkRecords = new List<ContentDocumentLink>{};
        if (linkedRecordIds != null) {
            for (String recordId: linkedRecordIds) {
                ContentDocumentLink cdl = new ContentDocumentLink();
                cdl.ContentDocumentId = doc[0].Id;
                cdl.LinkedEntityId = recordId;
                if (documentShareType != null) {
                    cdl.ShareType = documentShareType;
                } else {
                    cdl.ShareType = 'V';
                }
                if (documentVisibility != null) {
                    cdl.Visibility = documentVisibility;
                } else {
                    cdl.Visibility = 'AllUsers';
                }
                linkRecords.add(cdl);
            }
            insert linkRecords;
        }

        ConvertRecordsToCSV2.Outputs returnVal = new ConvertRecordsToCSV2.Outputs();
        returnVal.contentDocumentId=doc[0].Id;
        returnVal.contentVersionId=cv.Id;
        returnVal.contentDocumentLinks=linkRecords;
        return returnVal;
    }

    private static String getDisplayTextForFieldType(Object fieldValue, Schema.DisplayType fieldType) {
        if (fieldType == Schema.DisplayType.ADDRESS || fieldType == Schema.DisplayType.LOCATION) {
            // handle compound fields
            return JSON.serialize(fieldValue).escapeCsv();
        } else if (fieldType == Schema.DisplayType.DATE || fieldType == Schema.DisplayType.DATETIME) {
            return String.valueOf(fieldValue).escapeCsv(); // Maybe some date formatting here
        } else {
            return String.valueOf(fieldValue).replaceAll('\r\n|\n|\r|\t',' ').escapeCsv();
        }
    }
}