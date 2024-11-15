/**
 * Created by ashbas on 11/13/24.
 */

public with sharing class AssetMacdController {

    public static Asset selectedAsset;

    @AuraEnabled
    public static Asset getCurrentAsset(Id recordId) {
        Asset queryAsset = [SELECT Id,
                Name,
                Product2.Name,
                Product2.Family,
                Product2.Description,
                InstallDate,
                ParentId,
                Parent.Name,
                Contract__c
        FROM Asset WHERE Id =:recordId];
        selectedAsset = queryAsset;
        return queryAsset;
    }

    @AuraEnabled
    public static List<Asset> getRelatedAssets(Id recordId) {
        System.debug('selectedAsset::' + recordId);
        Asset parentAsset = [SELECT Id,
                Name,
                Product2.Name,
                Product2.Family,
                Product2.Description,
                Description,
                InstallDate,
                ParentId,
                Parent.Name,
                Contract__r.Id
        FROM Asset WHERE Id =:recordId];

        Contract parentContract = [SELECT Id FROM Contract WHERE Id=:parentAsset.Contract__r.Id];
        List<Asset> relatedAssets = [SELECT Id,
                Name,
                Product2.Name,
                Product2.Family,
                Product2.Description,
                Description,
                InstallDate,
                ParentId,
                Parent.Name,
                Contract__r.Id FROM Asset WHERE Contract__r.Id =: parentContract.Id];
        return relatedAssets;
    }

    @AuraEnabled
    public static List<Asset> getSelectedAssets(List<String> assetIds) {
        System.debug('getSelectedAssets::' + assetIds);
        List<Asset> selectedAssetsList = [SELECT Id,
                Name,
                Product2.Name,
                Product2.Family,
                Product2.Description,
                Description,
                InstallDate,
                ParentId,
                Parent.Name,
                Contract__r.Id
        FROM Asset WHERE Id IN: assetIds];
        return selectedAssetsList;
    }

}