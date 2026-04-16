/**
 * CaseActivityController
 *
 * Provides read-only case activity (comments + emails) for portal users.
 * - "with sharing" enforces OWD and sharing rules for the running user.
 * - Validates the requesting user has explicit read access to the Case
 *   before returning any child records.
 * - Only public (IsPublished = true) CaseComments are exposed.
 */
public with sharing class CaseActivityController {

    /**
     * Returns a unified, time-sorted list of activity items for a given Case.
     *
     * @param caseId  The Id of the Case record to load activity for.
     * @return        List of CaseActivityItem wrappers, newest first.
     * @throws AuraHandledException when the user lacks Case read access.
     */
    @AuraEnabled(cacheable=true)
    public static List<CaseActivityItem> getCaseActivity(Id caseId) {

        // ── Security: confirm running user can read this Case ──────────────
        List<Case> accessCheck = [
                SELECT Id
                FROM   Case
                WHERE  Id = :caseId
                WITH   USER_MODE  // enforces FLS + sharing in a single clause
                LIMIT  1
        ];
        if (accessCheck.isEmpty()) {
            throw new AuraHandledException(
                    'You do not have access to view this case.'
            );
        }

        System.debug('case List: ' + accessCheck);

        List<CaseActivityItem> items = new List<CaseActivityItem>();

// ── Chatter posts linked to the case ───────────────────────────────
        for (FeedItem fi : [
                SELECT Id,
                        Body,
                        CreatedById,
                        CreatedBy.Name,
                        CreatedDate,
                        Type
                FROM   FeedItem
                WHERE  ParentId = :caseId
                AND    Type = 'TextPost'  // Filter for text posts only
                WITH   USER_MODE
                ORDER BY CreatedDate DESC
        ]) {
            String postBody = String.isNotBlank(fi.Body)
                    ? fi.Body.abbreviate(500)
                    : '(no content)';

            items.add(new CaseActivityItem(
                    fi.Id,
                    'Post',
                    postBody,
                    fi.CreatedBy.Name,
                    fi.CreatedDate,
                    null,   // no subject for posts
                    null    // no fromAddress for posts
            ));
        }


        // ── Public case comments ───────────────────────────────────────────
        for (CaseComment cc : [
                SELECT Id,
                        CommentBody,
                        CreatedById,
                        CreatedBy.Name,
                        CreatedDate,
                        IsPublished
                FROM   CaseComment
                WHERE  ParentId    = :caseId
                AND    IsPublished = true
                WITH   USER_MODE
                ORDER BY CreatedDate DESC
        ]) {
            items.add(new CaseActivityItem(
                    cc.Id,
                    'Comment',
                    cc.CommentBody,
                    cc.CreatedBy.Name,
                    cc.CreatedDate,
                    null,
                    null
            ));
        }

        System.debug('items:' + items);

        // ── Inbound / outbound emails linked to the case ───────────────────
        for (EmailMessage em : [
                SELECT Id,
                        Subject,
                        TextBody,
                        FromName,
                        FromAddress,
                        ToAddress,
                        MessageDate,
                        Incoming
                FROM   EmailMessage
                WHERE  ParentId = :caseId
                WITH   USER_MODE
                ORDER BY MessageDate DESC
        ]) {
            String direction = em.Incoming ? 'Inbound Email' : 'Outbound Email';
            String body = String.isNotBlank(em.TextBody)
                    ? em.TextBody.abbreviate(500)
                    : '(no body)';

            items.add(new CaseActivityItem(
                    em.Id,
                    direction,
                    body,
                    em.Incoming ? em.FromName : 'Support Team',
                    em.MessageDate,
                    em.Subject,
                    em.FromAddress
            ));
        }

        // ── Track multiple important fields for the case ───────────────────
        for (CaseHistory ch : [
                SELECT Id,
                        Field,
                        OldValue,
                        NewValue,
                        CreatedById,
                        CreatedBy.Name,
                        CreatedDate
                FROM   CaseHistory
                WHERE  CaseId = :caseId
                AND    Field IN ('Status', 'Priority', 'Owner', 'OwnerId')
                WITH   USER_MODE
                ORDER BY CreatedDate DESC
        ]) {
            String fieldLabel = ch.Field;
            // Make field names more readable
            if (ch.Field == 'OwnerId' || ch.Field == 'Owner') {
                fieldLabel = 'Owner';
            }

            String changeBody = fieldLabel + ' changed from "'
                    + (ch.OldValue != null ? String.valueOf(ch.OldValue) : '(none)')
                    + '" to "'
                    + (ch.NewValue != null ? String.valueOf(ch.NewValue) : '(none)')
                    + '"';

            items.add(new CaseActivityItem(
                    ch.Id,
                    'Field Change',
                    changeBody,
                    ch.CreatedBy.Name,
                    ch.CreatedDate,
                    null,
                    null
            ));
        }

// ── Call logs (Tasks of type 'Call') linked to the case ────────────
        for (Task t : [
                SELECT Id,
                        Subject,
                        Description,
                        ActivityDate,
                        CallType,
                        CallDurationInSeconds,
                        Status,
                        CreatedById,
                        CreatedBy.Name,
                        CreatedDate,
                        OwnerId,
                        Owner.Name
                FROM   Task
                WHERE  WhatId = :caseId
                AND    TaskSubtype = 'Call'
                WITH   USER_MODE
                ORDER BY CreatedDate DESC
        ]) {
            // Build a descriptive body for the call
            String callDirection = '';
            if (t.CallType == 'Inbound') {
                callDirection = 'Inbound Call';
            } else if (t.CallType == 'Outbound') {
                callDirection = 'Outbound Call';
            } else {
                callDirection = 'Call';
            }

            // Format duration if available
            String durationText = '';
            if (t.CallDurationInSeconds != null && t.CallDurationInSeconds > 0) {
                Integer minutes = t.CallDurationInSeconds / 60;
                Integer seconds = Math.mod(t.CallDurationInSeconds, 60);
                durationText = ' (Duration: ' + minutes + 'm ' + seconds + 's)';
            }

            String callBody = String.isNotBlank(t.Description)
                    ? t.Description.abbreviate(500)
                    : '(no notes)';
            callBody += durationText;

            items.add(new CaseActivityItem(
                    t.Id,
                    callDirection,
                    callBody,
                    t.Owner.Name,
                    t.CreatedDate,
                    t.Subject,    // use Subject for call subject
                    null
            ));
        }



        // ── Sort unified list newest-first ─────────────────────────────────
        items.sort();

        System.debug('items: ' + items);
        return items;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Inner wrapper class – serialised to JSON for the LWC
    // ─────────────────────────────────────────────────────────────────────────
    public class CaseActivityItem implements Comparable {

        @AuraEnabled public String  recordId    { get; set; }
        @AuraEnabled public String  type        { get; set; }  // Comment | Inbound Email | Outbound Email
        @AuraEnabled public String  body        { get; set; }
        @AuraEnabled public String  authorName  { get; set; }
        @AuraEnabled public DateTime activityDate { get; set; }
        @AuraEnabled public String  subject     { get; set; }  // emails only
        @AuraEnabled public String  fromAddress { get; set; }  // emails only

        public CaseActivityItem(
                String   recordId,
                String   type,
                String   body,
                String   authorName,
                DateTime activityDate,
                String   subject,
                String   fromAddress
        ) {
            this.recordId     = recordId;
            this.type         = type;
            this.body         = body;
            this.authorName   = authorName;
            this.activityDate = activityDate;
            this.subject      = subject;
            this.fromAddress  = fromAddress;
        }

        /** Sorts descending by activityDate (newest first). */
        public Integer compareTo(Object other) {
            CaseActivityItem o = (CaseActivityItem) other;
            if (this.activityDate == o.activityDate) return 0;
            return this.activityDate > o.activityDate ? -1 : 1;
        }
    }
}