/**
 * Created by ashbas on 10/21/24.
 */

export function startQuoteLineOrganization(quoteLines) {
  let quoteLineGroupingArray = [];

  let topLevelBundles = quoteLines.filter(ql => !ql.hasParentQuoteLineItem);
  // console.log('topLevelBundles::: ', JSON.stringify(topLevelBundles));

  topLevelBundles.forEach((topLine) => {
    // console.log('topLine::', JSON.stringify(topLine));
    // console.log('topLine.Id::', topLine.Id);
    let childrenProducts = getChildrenProducts(null, topLine.Id, quoteLines);
    // console.log('childrenProducts: ', JSON.stringify(childrenProducts));

    let customizedQuoteLine = customizeObjectKeys(topLine);
    customizedQuoteLine. children = childrenProducts;
    // customizedQuoteLine.hasChildren = childrenProducts > 0;

    // console.log('customizedQuoteLine topLine:' , JSON.stringify(customizedQuoteLine));

    quoteLineGroupingArray.push(customizedQuoteLine);
  });

  // console.log('quoteLineGroupingArray::', JSON.stringify(quoteLineGroupingArray));
  return quoteLineGroupingArray;
}

function getChildrenProducts(currentProductId, topLevelProductId, quoteLines) {
  let childrenProducts = [];
  quoteLines.forEach((line)=>{
    let productFound = false;

    if (line.Parent_Quote_Line_Item__c === topLevelProductId) {
      productFound = true;
      // console.log('product found child line::', JSON.stringify(line.Id));
      // console.log('product found topLevelProductId:: ', topLevelProductId);

    }

    if (productFound) {
      // console.log('child found::', JSON.stringify(line));
      let customizedQuoteLine = customizeObjectKeys(line);

      childrenProducts.push(customizedQuoteLine);
    }
    // if (productFound) {
    //   // let obj = createObject(line, topLevelProductId);
    //   let obj = {};
    //   // let children = this.getChildrenProducts(line.Id, topLevelProductId);
    //   if (children.length > 0 ) {
    //     obj.children = children;
    //   }
    //   childrenProducts.push(obj);
    // }
  });
  return childrenProducts;
}

export function customizeObjectKeys(obj) {
  let customizedObject = {};

  for (let key in obj) {

    if (obj.hasOwnProperty(key)) {
      // Check if the value is an object to handle nested structures
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        customizedObject[key] = customizeObjectKeys(obj[key]);
      } else {
        customizedObject[key] = obj[key];
      }
    }

    if ((key) === "Parent_Quote_Line_Item__c") {
      customizedObject['hasParentQuoteLineItem'] = true;
    }
  }
  return customizedObject;
}