@cms
@user
@import-students

Feature: Import students fails
    Background:
        Given "school admin" logins CMS

    Scenario Outline: Import fails when file has <condition>
        Given school admin has created a "student template csv" file with "<condition>" and "invalid on row <numberRow>"
        When school admin imports the "student template csv" file
        And school admin sees a "error" message contained "<content>" on the snackbar
        And school admin "does not see" new imported students on the Student Management
        Examples:
            | condition   | content                                                   | numberRow |
            | > 1000 rows | Invalid number of row. The maximum number of rows is 1000 | 0         |
            | duplicated  | email is duplicated at row 3                              | 3         |

    Scenario Outline: Import fails when the value of mandatory items is missing field <condition>
        Given school admin has created a "student template csv" file with "missing field <condition>" and "invalid on row <numberRow>"
        When school admin imports the "student template csv" file
        And school admin sees a "error" message contained "<content>" on the snackbar
        And school admin "does not see" new imported students on the Student Management
        Examples:
            | condition         | content                                | numberRow |
            | First Name        | first_name is required at row 2        | 2         |
            | Last Name         | last_name is required at row 2         | 2         |
            | Email             | email is required at row 3             | 3         |
            | Enrollment Status | enrollment_status is required at row 2 | 2         |
            | Grade             | grade is required at row 3             | 3         |

    Scenario Outline: Scenario: Import fails with multiple error on <numberRow> rows
        Given school admin has created a "student template csv" file with "multiple error rows" and "invalid on row <numberRow>"
        When school admin imports the "student template csv" file
        And school admin sees a "error" message contained "<content>" on the snackbar
        And school admin "does not see" new imported students on the Student Management
        Examples:
            | content                    | numberRow |
            | email is required at row 2 | [2,3]     |