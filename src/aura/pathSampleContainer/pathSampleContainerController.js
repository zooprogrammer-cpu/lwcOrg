({
    doInit : function(component, event, helper) {
        console.log('aura reviewQuotePaymentLWC Container doInit');
        console.log('aura recordId = ' + component.get('v.recordId'));
    },
    
    closeQuickAction : function(component, event, helper){
        console.log('{!c.closeAction}');
        $A.get("e.force:closeQuickAction").fire();
    }
})