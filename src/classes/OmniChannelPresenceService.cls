/**
 * Created by ashbas on 9/27/24.
 */

public with sharing class OmniChannelPresenceService {
    public static List<User> getAvailableAgents() {
        List<ServicePresenceStatus> availableForLeadsStatus = [SELECT Id, MasterLabel FROM ServicePresenceStatus WHERE MasterLabel = 'Available for Leads'];

        List<User> availableUsers = [SELECT UserId FROM UserServicePresence WHERE ServicePresenceStatusId = :availableForLeadsStatus[0].Id];

//        List<User> availUserList = [SELECT Id, Name, Email FROM User WHERE Id IN: availableUsers];

        return null;

    }
}