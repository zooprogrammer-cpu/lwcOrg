/**
 * Created by ashbas on 11/18/24.
 */

@IsTest
private class AssetMacdControllerTest {
    @TestSetup
    static void setup() {
        // Setup
        Account account = new Account(Name = 'Test Account');
        insert account;

        Contract contract = new Contract(AccountId = account.Id, Status = 'Draft', StartDate = Date.today(), ContractTerm = 12);
        insert contract;

        Asset parentAsset = new Asset(Name = 'Parent Asset', AccountId = account.Id, Contract__c= contract.Id);
        insert parentAsset;

        Asset childAsset = new Asset(Name = 'Child Asset', AccountId = account.Id, ParentId = parentAsset.Id, Contract__c = contract.Id);
        insert childAsset;
    }

    @IsTest
    static void getRelatedAssets_withValidRecordId_returnsRelatedAssets() {
        Asset parentAsset = [SELECT Id FROM Asset WHERE Name = 'Parent Asset'];

        // Execute
        List<Asset> relatedAssets = AssetMacdController.getRelatedAssets(parentAsset.Id);

        // Verify
        System.assertEquals(2, relatedAssets.size());
    }
    @IsTest
    static void getSelectedAssets_withValidAssetIds_returnsSelectedAssets() {
        Contract con = [SELECT Id FROM Contract LIMIT 1];
        List<Asset> testAssets = [SELECT Id FROM Asset WHERE Contract__c =:con.Id];
        List<Id> testAssetIds = new List<Id>();
        for (Asset ass : testAssets) {
            testAssetIds.add(ass.Id);
        }

        // Execute
        List<Asset> selectedAssets = AssetMacdController.getSelectedAssets(testAssetIds);

        // Verify
        System.assertEquals(2, selectedAssets.size());
    }
}