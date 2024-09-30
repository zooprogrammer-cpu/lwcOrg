/**
 * Created by ashbas on 9/27/24.
 */

public with sharing class OmniChannelPresenceService {
    public static List<User> getAvailableAgents() {
//        List<ServicePresenceStatus> statusList = [SELECT Id, MasterLabel FROM ServicePresenceStatus WHERE MasterLabel = 'Available for Leads'];
        Id availableStatusId = [SELECT Id, MasterLabel FROM ServicePresenceStatus WHERE MasterLabel = 'Available for Leads' LIMIT 1].Id;
        System.debug(availableStatusId);

        List<UserServicePresence> availableUsers = [SELECT UserId FROM UserServicePresence WHERE ServicePresenceStatusId =:availableStatusId ];
        System.debug(availableUsers);

        List<String> availableUsersList = new List<String>();

        for (UserServicePresence usp: availableUsers) {
            availableUsersList.add(usp.UserId);
        }

        List<User> availableAgents = [SELECT Id, Name, Email FROM User WHERE Id IN:availableUsersList];
        System.debug('availableAgents: ' + availableAgents);

        return null;

    }
}