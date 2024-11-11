@IsTest
public class QuoteLineControllerTest {

    @TestSetup
    static void setup() {
        Account a = new Account(Name = 'Test account');
        insert a;

        Opportunity o = new Opportunity(Name = 'Test opportunity', AccountId = a.Id, CloseDate = Date.today(), StageName = 'Prospecting');
        insert o;

        Product2 product = new Product2(Name = 'Test Product', IsActive = true);
        insert product;

        Id pbId = Test.getStandardPricebookId();
        PriceBook2 standardPriceBook = new Pricebook2(
                Id = pbId,
                IsActive = true
        );

        update standardPriceBook;

        PricebookEntry pe = new PricebookEntry(Pricebook2Id = standardPriceBook.Id, Product2Id = product.Id, UnitPrice = 100, IsActive = true);
        insert pe;


        Pricebook2 customPricebook = new Pricebook2(Name = 'Custom Pricebook', IsActive = true);
        insert customPricebook;

        Quote quote = new Quote(Name = 'Test Quote', Pricebook2Id = standardPriceBook.Id, OpportunityId =o.Id );
        insert quote;

        QuoteLineItem quoteLine = new QuoteLineItem(
                QuoteId = quote.Id,
                Product2Id = product.Id,
                UnitPrice = pe.UnitPrice,
                Quantity = 1,
                PricebookEntryId = pe.Id
        );
        insert quoteLine;

        QuoteLineItem secondaryQuoteLine = new QuoteLineItem(
                QuoteId = quote.Id,
                Product2Id = product.Id,
                UnitPrice = pe.UnitPrice,
                Quantity = 2,
                PricebookEntryId = pe.Id,
                Parent_Quote_Line_Item__c = quoteLine.Id
        );
        insert secondaryQuoteLine;
    }

    @IsTest
    static void testGetQuoteLineItems() {
        Quote testQuote = [SELECT Id FROM Quote LIMIT 1];
        List<QuoteLineItem> result = QuoteLineController.getQuoteLineItems(testQuote.Id);
        System.assertNotEquals(0, result.size(), 'Quote Line Items should be returned');
    }

    @IsTest
    static void testDeleteQuoteLineItem() {
        QuoteLineItem primaryQuoteLine = [SELECT Id FROM QuoteLineItem LIMIT 1];
        QuoteLineController.deleteQuoteLineItem(primaryQuoteLine.Id);
        List<QuoteLineItem> deletedQuoteLines = [SELECT Id FROM QuoteLineItem WHERE Id = :primaryQuoteLine.Id];
        System.assertEquals(0, deletedQuoteLines.size(), 'Quote Line Item should be deleted');
    }

    @IsTest
    static void testInsertQuoteLineItem() {
        Id standardPricebookId = Test.getStandardPricebookId();

        Product2 product = [SELECT Id FROM Product2 LIMIT 1];
        Quote quote = [SELECT Id FROM Quote LIMIT 1];
        quote.Pricebook2Id = standardPricebookId;
        QuoteLineController.insertQuoteLineItem(quote.Id, product.Id, 1, 'This is a description', 5, null);
        List<QuoteLineItem> newQuoteLines = [SELECT Id FROM QuoteLineItem WHERE QuoteId = :quote.Id];
        System.assertEquals(3, newQuoteLines.size(), 'A new Quote Line Item should be inserted');
    }

    @IsTest
    static void testGetNewQuoteLineItem() {
        Product2 product = [SELECT Id FROM Product2 LIMIT 1];
        PricebookEntry result = QuoteLineController.getNewQuoteLineItem(product.Id);
        System.assertNotEquals(null, result, 'PricebookEntry should be returned');
    }

    @IsTest
    static void testGetFieldTypes() {
        List<String> selectedFields = new List<String>{'Quantity', 'UnitPrice', 'Product2Id'};
        Map<String, String> fieldTypes = QuoteLineController.getFieldTypes(selectedFields);
        System.assertEquals('DOUBLE', fieldTypes.get('Quantity'), 'Quantity field should be of type DOUBLE');
        System.assertEquals('CURRENCY', fieldTypes.get('UnitPrice'), 'UnitPrice field should be of type CURRENCY');
    }

    @IsTest
    static void compareEqualOrders() {
        List<SObject> sObjectList = CustomMetadataService.getCustomMetadata('Quote_Line_Item_Setting__mdt', '');
        sObjectList.sort(new QuoteLineController.OrderComparator());
    }

}