public with sharing class QuoteLineGenController {

//    @AuraEnabled
//    public static Boolean saveProducts(String accountId, String productCatalogToSave) {
//        System.debug('product data: ' + productCatalogToSave);
//        Boolean saveFlag = daoObj.saveProductDetailsOnAccount(accountId,productCatalogToSave);
//        InsideSalesFlowAccountUpdate.updateAccountAndRecs(Utilities.queryAccount(accountId), false);
//
//        return saveFlag;
//    }

//    @AuraEnabled
//    public static List<ProductCatalog__c> getExistingCatalog(String accountId){
//        List<ProductCatalog__c> productList = [
//                SELECT
//                        Id,
//                        ProductName__c,
//                        Product_Quantity__c,
//                        Product_Notes__c,
//                        CreatedDate
//                FROM
//                        ProductCatalog__c
//                WHERE
//                        ProductAccount__c =: accountId
//        ];
//
//        return productList;
//    }
    @AuraEnabled
    public static List<Product2> getExistingProducts(String accountId) {
        List<Product2> productList = [SELECT Id, Name FROM Product2];
        return productList;
    }

//    @AuraEnabled
//    public static Boolean deleteProducts(String accountId){
//        List<ProductCatalog__c> productCatalogListToDelete = [SELECT Id
//        FROM ProductCatalog__c
//        WHERE ProductAccount__c = :accountId];
//        Set<Id> productCatalogIdSet = new Set<Id>();
//        for(ProductCatalog__c productCatalog : productCatalogListToDelete){
//            productCatalogIdSet.add(productCatalog.Id);
//        }
//        System.debug('productCatalogIdSet: ' + productCatalogIdSet);
//
//        System.debug('productCatalogListToDelete: ' + productCatalogListToDelete);
//        System.debug('productCatalogListToDelete.size(): ' + productCatalogListToDelete.size());
//
//        if(!productCatalogListToDelete.isEmpty()){
//            // delete productCatalogListToDelete;
//            // return true;
//            Database.DeleteResult[] drList = Database.delete(productCatalogListToDelete, true);
//            for(Database.DeleteResult dr : drList) {
//                if (dr.isSuccess()) {
//                    // Operation was successful, so get the ID of the record that was processed
//                    System.debug('Successfully deleted product catalog record with ID: ' + dr.getId());
//                    productCatalogIdSet.remove(dr.getId());
//                }
//                else {
//                    // Operation failed, so get all errors
//                    for(Database.Error err : dr.getErrors()) {
//                        System.debug('The following error has occurred.');
//                        System.debug(err.getStatusCode() + ': ' + err.getMessage());
//                        System.debug('product catalog fields that affected this error: ' + err.getFields());
//                    }
//                }
//            }
//            if(productCatalogIdSet.isEmpty()){
//                System.debug('productCatalogIdSet: ' + productCatalogIdSet);
//                return true;
//            } else {
//                return false;
//            }
//        } else {
//            return false;
//        }
//    }
}