/**
 * Created by ashbas on 10/21/24.
 */
public with sharing class QuoteLineController {
    @AuraEnabled(Cacheable=true)
    public static List<QuoteLineItem> getQuoteLineItems(Id quoteId) {
        String s = '';
        Integer i = 0;
        List<String> fieldsToQuery = new List<String>{'Id', 'Parent_Quote_Line_Item__c'};
        List<SObject> sObjectList = CustomMetadataService.getCustomMetadata('Quote_Line_Item_Setting__mdt', '');

        sObjectList.sort(new OrderComparator());
//        System.debug('sObjectList: ' + sObjectList);
        for (SObject sObj : sObjectList) {

            if (sObj.get('Active__c') == true) {
                fieldsToQuery.add((String)sObj.get('Field_API_Name__c'));
            }
        }
//        System.debug('fieldsToQuery:: ' + fieldsToQuery);

        for (String field : fieldsToQuery) {
            if ( i ==0 ) {
                s+= field;
            } else {
                s+= ',' + field;
            }
            i ++;
        }
        String query = 'SELECT ' + s + ' FROM QuoteLineItem WHERE QuoteId = : quoteId';
//        System.debug('query: ' + query);
        return Database.query(query);
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
    public static void insertQuoteLineItem(Id quoteId, Id productId, Integer quantity, Id parentQuoteLineId) {
        try {

            Id standardPricebookId = [SELECT Id FROM Pricebook2 WHERE IsStandard = TRUE].Id;
            System.debug('Standard Pricebook ID: ' + standardPricebookId);

            Quote quote = [SELECT Id, Pricebook2Id FROM Quote WHERE Id =:quoteId LIMIT 1];
            System.debug('Quote Pricebook2Id: ' + quote.Pricebook2Id);


            if (quote.Pricebook2Id == null ) {
                quote.Pricebook2Id = standardPricebookId;
                update quote;
            }

            PricebookEntry pbe = [SELECT Id, Name, UnitPrice FROM PricebookEntry WHERE
                    Product2Id = :productId
                    AND Pricebook2Id =:quote.Pricebook2Id LIMIT 1];

            System.debug('PricebookEntry ID: ' + pbe.Id);

            QuoteLineItem ql = new QuoteLineItem();
            ql.Product2Id = productId;
            ql.QuoteId = quoteId;
            ql.Quantity = quantity;
            ql.PricebookEntryId = pbe.Id;
            ql.UnitPrice = pbe.UnitPrice;
            if (parentQuoteLineId!=null) {
                ql.Parent_Quote_Line_Item__c = parentQuoteLineId;
            }
            insert ql;
        }
        catch (Exception e) {
            System.debug('Error inserting Quote Line' + e.getMessage());
            throw new AuraHandledException('Error inserting Quote Line Item: ' + e.getMessage());
        }
    }

    @AuraEnabled
    public static PricebookEntry getNewQuoteLineItem(Id productId) {
        try {
            PricebookEntry pbe = [SELECT Id, Name, UnitPrice FROM PricebookEntry WHERE Product2Id = :productId LIMIT 1];
            return pbe;
        }
        catch (Exception e) {
            throw new AuraHandledException('Error retrieving Quote Line Item: ' + e.getMessage());
        }
    }

    @AuraEnabled
    public static Map<String, String> getFieldTypes(List<String> selectedFields) {
        String objectName = 'QuoteLineItem';
        Map<String, String> fieldTypeMap = new Map<String, String>();

        for(String field : selectedFields){
            Schema.DisplayType fieldType = Schema.getGlobalDescribe().get(objectName).getDescribe().fields.getMap().get(field).getDescribe().getType();
            fieldTypeMap.put(field, String.valueOf(fieldType));
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
}