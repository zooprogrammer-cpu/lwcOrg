/**
 * Created by ashbas on 9/27/24.
 */

public with sharing class OmniChannelPresenceService {
    public static List<User> getAvailableAgents() {
//        List<ServicePresenceStatus> statusList = [SELECT Id, MasterLabel FROM ServicePresenceStatus WHERE MasterLabel = 'Available for Leads'];
        Id availableStatusId = [SELECT Id, MasterLabel FROM ServicePresenceStatus WHERE MasterLabel = 'Available for Leads' LIMIT 1].Id;
        System.debug('availableStatusId: ' + availableStatusId);

        List<UserServicePresence> availableUserServicePresence = [SELECT Id, Name, User.Name, ServicePresenceStatus.DeveloperName,
                StatusStartDate, StatusEndDate
                FROM UserServicePresence
                WHERE StatusStartDate = LAST_N_DAYS:1
                AND ServicePresenceStatusId =:availableStatusId
                AND StatusEndDate =NULL
                ORDER BY StatusStartDate ASC];
        System.debug('availableUserServicePresence: ' + availableUserServicePresence);

        List<String> availableUsersList = new List<String>();

        for (UserServicePresence usp: availableUserServicePresence) {
            availableUsersList.add(usp.UserId);
        }

        List<User> availableAgents = [SELECT Id, Name, Email FROM User WHERE Id IN:availableUsersList];
        System.debug('availableAgents: ' + availableAgents);

        return null;

    }
}