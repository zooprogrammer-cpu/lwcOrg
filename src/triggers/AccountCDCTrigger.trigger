trigger AccountCDCTrigger on AccountChangeEvent (after insert) {
     List<Task> tasks = new List<Task>();
    // Iterate through each event message
    for (AccountChangeEvent event : Trigger.New){
        // Get some event handler fields
        EventBus.ChangeEventHeader header = event.ChangeEventHeader; 
    	System.debug('Received change event for ' + header.entityName + ' for the ' + header.changeType + ' operation.');
    	// for update operations, we can get a list of changed fields
        if ((header.changetype == 'CREATE')){
            // create a followup task
            Task tk = new Task(); 
            tk.Subject = 'Follow up on new account: ' + header.recordIds;
        	tk.OwnerId = header.CommitUser; 
            tasks.add(tk);
        }
    }
    // Insert all tasks in bulk.
    if( tasks.size() > 0) {
        insert tasks; 
    }
}