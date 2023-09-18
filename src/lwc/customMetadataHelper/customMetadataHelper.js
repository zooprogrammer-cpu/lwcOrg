const metadataResults = (installments, formattedData)=>{
    console.log(installments);
    console.log(formattedData);
    console.log(this);
    return performCalc(installments,formattedData)
}

let performCalc = (installments,formattedData)=>{
    return  formattedData[installments].Default_Discount__c;


}

export {metadataResults};