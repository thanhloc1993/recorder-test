@cms
@calendar
@calendar-weekly-view

Feature: School admin can view published one time both of individual and group lessons on calendar weekly view
    Background:
        Given "school admin" logins CMS

    Scenario: School admin can view published one time individual lesson on calendar weekly view
        Given "school admin" has created an one time "individual" lesson with lesson date of today and "location L1" in lessonmgmt
        And "school admin" has gone to Calendar tab
        When "school admin" chooses "Center" as location type
        And "school admin" chooses "location L1" as previous lesson location in location list
        Then "school admin" sees current weekly date in weekly view
        And "school admin" sees day time from 00:00 to 23:00
        And "school admin" sees lesson is displayed in today cell with light blue filling

    Scenario: School admin can view published one time group lesson on calendar weekly view
        Given "school admin" has created an one time "group" lesson with lesson date of today and "location L1" in lessonmgmt
        And "school admin" has gone to Calendar tab
        When "school admin" chooses "Center" as location type
        And "school admin" chooses "location L1" as previous lesson location in location list
        Then "school admin" sees current weekly date in weekly view
        And "school admin" sees day time from 00:00 to 23:00
        And "school admin" sees lesson is displayed in today cell with light blue filling
