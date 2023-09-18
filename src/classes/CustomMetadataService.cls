/**
 * Created by aayushbasnyat on 1/8/23.
 */

 public with sharing class CustomMetadataService {
    public static void fetchAllMetadata(){
        Map<String, Support_Tier__mdt>  allSupportTiers= Support_Tier__mdt.getAll();
        System.debug('allSupportTiers: ' + allSupportTiers);
        System.debug('All support tiers size: ' + allSupportTiers.size());

        for (String supportTierName : allSupportTiers.keySet()) {
            System.debug('Support Tier Names: ' + supportTierName +
                    'Discount: ' + allSupportTiers.get(supportTierName).Default_Discount__c );
        }
    }
    
    @AuraEnabled  (cacheable = true)
    public static Map<String, Support_Tier__mdt> getAllMetadata(){
        return Support_Tier__mdt.getAll();
        
    }

    // find the discount of one specific support tier:
    @AuraEnabled (cacheable = true)
    public static void fetchDiscount(String supportTier) {
        Support_Tier__mdt singleTier = Support_Tier__mdt.getInstance(supportTier);
        System.debug('Support Tier Name: ' + supportTier + 'Discount: ' + singleTier?.Default_Discount__c);
        coolMethod(singleTier);
    }

    @AuraEnabled (cacheable = true)
    public static Decimal getDiscount(String supportTier) {
        Support_Tier__mdt singleTier = Support_Tier__mdt.getInstance(supportTier);
        System.debug('Support Tier Name: ' + supportTier + 'Discount: ' + singleTier?.Default_Discount__c);
        return singleTier?.Default_Discount__c;
    }

    // this method is being called by the fetchDiscount method
    public static void coolMethod(Support_Tier__mdt val) {
        System.debug('Cool Support Tier: ' + val); 
        System.debug('Cool Support Tier Discount: ' + val.Default_Discount__c);   
    }

    // this method returns all of the Minimum Spending field values in all the records with a SOQL query
    public static void getDiscountwithSOQL() {
        Support_Tier__mdt [] minSpent = [SELECT Minimum_Spending__c FROM Support_Tier__mdt]; 
        System.debug('The minimum spent values are: ' + minSpent);     
    }

    // This method instantiates a custom metadata record of typw Suppor_Tier__mdt
    // and sets the developer name to input string. 
    // The record is not inserted into the database, and would not be found by a SOQL query
    public static Support_Tier__mdt getCustomMetadataRecord(String myName) {
        Support_Tier__mdt supportTier = new Support_Tier__mdt();    
        supportTier.DeveloperName = myName;
        return supportTier; 
    }


    
}