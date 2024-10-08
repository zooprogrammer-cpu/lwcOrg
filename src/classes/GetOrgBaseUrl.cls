/**
 * Created by ashbas on 9/30/24.
 */

global with sharing class GetOrgBaseUrl {
    @InvocableMethod(Label='Get Salesforce base and record url')
    global static List<Results> getBaseUrl(List<sObject> sourceRecords){

        List<Results> sfdcURLs=new List<Results>();
        for(sObject obj:sourceRecords){
            Results r=new Results();

            r.sfdcBaseURL   = Url.getOrgDomainUrl().toExternalForm();

            r.sfdcRecordURL = Url.getOrgDomainUrl().toExternalForm()+'/'+obj.id;

            sfdcURLs.add(r);
        }
        return sfdcURLs;
    }

    global class Results{

        @InvocableVariable
        global String sfdcBaseURL;

        @InvocableVariable
        global String sfdcRecordURL;
    }

}