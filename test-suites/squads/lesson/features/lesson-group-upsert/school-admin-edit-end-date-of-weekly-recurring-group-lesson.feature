@cms
@lesson
@lesson-group-upsert

Feature: School Admin edits end date of weekly recurring group lesson
    Background:
        Given "school admin" logins CMS
        And "school admin" has applied "all child locations of parent" location

    Scenario Outline: School Admin can edit end date by adding the day of a <status> weekly recurring individual lesson
        Given "school admin" has created a "<status>" weekly recurring "individual" lesson with lesson date in the "future"
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "school admin" has opened editing lesson page of the lesson in the recurring chain
        When "school admin" edits End date by "adding 7 days from the current end date"
        And "school admin" clicks save with "<status>" the lesson page
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" sees updated end date
        And "school admin" sees newly created "<status>" "future" lessons falling on the period between old and new end date
        Examples:
            | status    |
            | Draft     |
            | Published |

    Scenario Outline: School Admin can edit end date by removing the day of a <status> weekly recurring individual lesson
        Given "school admin" has created a "<status>" weekly recurring "individual" lesson with lesson date in the "future"
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "school admin" has opened editing lesson page of the lesson in the middle of the recurring chain
        When "school admin" edits End date by "removing 7 days from the current end date"
        And "school admin" clicks save with "<status>" the lesson page
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" sees updated end date
        And "school admin" sees "<status>" "future" lessons in chain created between new end date and old end date will be deleted
        Examples:
            | status    |
            | Draft     |
            | Published |
