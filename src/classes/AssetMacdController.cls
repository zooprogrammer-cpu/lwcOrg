/**
 * Created by ashbas on 11/13/24.
 */

public with sharing class AssetMacdController {

    @AuraEnabled
    public static List<Asset> getRelatedAssets(Id recordId) {
        Asset parentAsset = [SELECT Contract__r.Id FROM Asset WHERE Id =:recordId];
        return [SELECT Id, Name, Product2.Name, Product2.Family, Product2.Description, Description, InstallDate, ParentId, Parent.Name, Contract__r.Id
        FROM Asset WHERE Contract__r.Id =: parentAsset.Contract__r.Id];
    }

    @AuraEnabled
    public static List<Asset> getSelectedAssets(List<String> assetIds) {
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