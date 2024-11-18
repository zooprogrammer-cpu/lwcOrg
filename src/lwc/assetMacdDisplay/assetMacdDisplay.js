/**
 * Created by ashbas on 11/13/24.
 */

import {LightningElement, api, track, wire} from 'lwc';
import getRelatedAssets from '@salesforce/apex/AssetMacdController.getRelatedAssets';
import getSelectedAssets from '@salesforce/apex/AssetMacdController.getSelectedAssets';
import {FlowAttributeChangeEvent} from "lightning/flowSupport";

export default class AssetMacdDisplay extends LightningElement {
  @api recordId = '';
  @api objectName = '';
  @track assetGroupingArray =[];
  @track selectedAssetIds = [];
  @track assetLines = [];
  @api selectedAssets;
  @track isLoading = false;

  async connectedCallback() {
    console.log('connectedCallback');
    const relatedAssets = await getRelatedAssets({recordId: this.recordId});
    console.log('relatedAssets::', relatedAssets);
    relatedAssets.forEach((asset) =>{
      let obj = {};
      obj.Id = asset.Id;
      obj.Name = asset.Name;
      obj.InstallDate = asset.InstallDate;
      obj.Description = asset.Description;
      obj.hasParentAsset = !!asset.ParentId;
      obj.parentAssetId = asset.ParentId;
      this.assetLines.push(obj);
    });
    // console.log('assetLines: ', JSON.stringify(this.assetLines));
    this.assetGroupingArray = this.startAssetOrganization(this.assetLines);
    // console.log('this.assetGroupingArray :::', JSON.stringify(this.assetGroupingArray) );
  }

  startAssetOrganization(assetLines) {
    let assetGroupingArrayTemp = [];
    let topLevelBundles = assetLines.filter(asset => !asset.hasParentAsset);
    // console.log('topLevelBundles::', JSON.stringify(topLevelBundles));

    topLevelBundles.forEach((topAsset) =>{
      let childrenAssets = this.getChildrenAssets(topAsset.Id, assetLines);

      assetGroupingArrayTemp.push(
          {
            id: topAsset.Id,
            assetName : topAsset.Name,
            assetInstallDate : topAsset.InstallDate,
            assetDescription: topAsset.Description,
            children: childrenAssets,
            hasChildren : childrenAssets.length > 0
          }
      )
    });
    // console.log('assetGroupingArrayTemp::', JSON.stringify(assetGroupingArrayTemp));
    return assetGroupingArrayTemp;
  }

  getChildrenAssets(topLevelAssetId, assetLines) {
    let childrenAssets = [];

    assetLines.forEach((line)=>{
      let assetFound = false;

      if (line.parentAssetId === topLevelAssetId) {
        assetFound = true;
        // console.log('asset Found child asset::', JSON.stringify(line.Id));
        // console.log('asset Found topLevelAssetId::  ', topLevelAssetId);
      }

      if (assetFound) {
        // console.log('child found::', JSON.stringify(line));
        let obj = {
          id : line.Id,
          assetName : line.Name,
          assetInstallDate : line.InstallDate,
          assetDescription: line.Description,
        }

        let children = this.getChildrenAssets(line.Id, assetLines);
        if (children.length > 0) {
          obj.children = children
        }
        childrenAssets.push(obj);
      }
    });
    return childrenAssets;
  }

  async handleCheckboxChange(event) {
    const assetId = event.target.dataset.id;
    this.isLoading = true;
    if (event.target.checked) {
      // Add the Id if checked
      const childrenAssetsToAdd = this.getChildrenAssets(assetId, this.assetLines);
      let childrenAssetsToAddIdList = [];
      childrenAssetsToAdd.forEach((asset) => {
        childrenAssetsToAddIdList.push(asset.id);
        if (asset.children) {
          asset.children.forEach((asset) => {
            childrenAssetsToAddIdList.push(asset.id);
          })
        }
      });
      this.selectedAssetIds = [...this.selectedAssetIds, assetId, ...childrenAssetsToAddIdList];
      console.log('Checkbox checked::', JSON.stringify(this.selectedAssetIds));
      this.selectedAssets = await getSelectedAssets({assetIds: this.selectedAssetIds});
      console.log('this.selectedAssets: ', this.selectedAssets);

    } else {
      //Remove the Id if unchecked
      const childrenAssetsToRemove = this.getChildrenAssets(assetId, this.assetLines);
      let childrenAssetsToRemoveIdList = [];
      childrenAssetsToRemove.forEach((asset) => {
        childrenAssetsToRemoveIdList.push(asset.id);
        if (asset.children) {
          asset.children.forEach((asset) => {
            childrenAssetsToRemoveIdList.push(asset.id);
          })
        }
      });

      // console.log('childrenAssetsToRemoveIdList::', childrenAssetsToRemoveIdList);

      this.selectedAssetIds = this.selectedAssetIds.filter(id =>
          ![assetId, ...childrenAssetsToRemoveIdList].includes(id)
      );

      // this.selectedAssetIdsToFlow = this.selectedAssetIds.toString();


      console.log('Checkbox unchecked::', JSON.stringify(this.selectedAssetIds));
      this.selectedAssets = await getSelectedAssets({assetIds: this.selectedAssetIds});
      console.log('this.selectedAssets: ', this.selectedAssets);

      const attributeChangeEvent = new FlowAttributeChangeEvent(
          "selectedAssIds",
          this.selectedAssetIds
      );
      this.dispatchEvent(attributeChangeEvent);

    }
    this.isLoading = false;
  }

  // This selectedAssIds  is the value that is working on the Flow!!!
  @api set selectedAssIds(value) {
    if (value) {
      this.selectedAssetIds = value;
    }
  }

  get selectedAssIds() {
    return this.selectedAssetIds;
  }

  // Not used
  @api
  get selectedAssetIdsToFlow() {
    return this.selectedAssetIds;
  }
}