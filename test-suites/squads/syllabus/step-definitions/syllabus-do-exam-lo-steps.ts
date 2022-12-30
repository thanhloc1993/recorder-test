import { createNumberArrayWithLength } from '@legacy-step-definitions/utils';
import { asyncForEach } from '@syllabus-utils/common';
import { SyllabusLearnerKeys } from '@syllabus-utils/learner-keys';
import { convertDataQuizToQuizDetails } from '@syllabus-utils/question-utils';
import { SyllabusTeacherKeys } from '@syllabus-utils/teacher-keys';

import { Given, Then, When } from '@cucumber/cucumber';

import { IMasterWorld } from '@supports/app-types';

import { Quiz } from '@services/common/quiz';

import {
    aliasBookIds,
    aliasContentBookLOQuestionQuantity,
    aliasCorrectedAnswerExamLO,
    aliasCorrectedAnswerExamLOList,
    aliasCourseId,
    aliasCourseName,
    aliasDecimalQuizResult,
    aliasExamLOFinishedQuestionCount,
    aliasExamLOName,
    aliasExamLOTimeLimit,
    aliasGradeBookCompletedRate,
    aliasLOCurrentQuestionIndex,
    aliasQuizDetailList,
    aliasQuizResult,
    aliasQuizResultListByDescSubmission,
    aliasRandomChapters,
    aliasRandomLearningObjectives,
    aliasRandomQuizzes,
    aliasRandomStudyPlanItems,
    aliasTopicName,
    aliasTotalQuestionCount,
} from './alias-keys/syllabus';
import { Chapter, LearningObjective, StudyPlanItem } from './cms-models/content';
import { QuizDetail, QuizResult } from './cms-models/quiz';
import {
    studentSeesQuestionContentInSubmitConfirmationTimeLimit,
    studentSeesTimeContentInSubmitConfirmationTimeLimit,
} from './create-exam-with-time-limit-definitions';
import { teacherSeesLatestQuizResult } from './syllabus-complete-question-in-retry-mode-correct-all-definition';
import { schoolAdminIsOnBookDetailsPage } from './syllabus-content-book-create-definitions';
import {
    getQuizTypeNumberFromAliasRandomQuizzes,
    getQuizTypeNumberFromModel,
    schoolAdminGoesToExamLOQuizDetailsPage,
    studentDoesQuizQuestion,
    studentGoesToLODetailsPage,
    teacherGoesToStudyPlanItemDetails,
} from './syllabus-create-question-definitions';
import { studentGoToTopicDetail } from './syllabus-create-topic-definitions';
import {
    createNewQuizzesForMultipleType,
    filterExamLo,
    studentBackToHomeScreenFromExamLOQuizFinished,
    studentBackToLOListFromExamLOQuizFinished,
    studentGetsExamLOResultAtQuizFinishedScreen,
    studentGoesToNextQuestionAtExamLO,
    studentRetakesExamLO,
    studentSeeForceSubmitExamLOScreen,
    studentSeesAndDoesExamLOQuestionsWithCorrectQuizzes,
    studentSelectIndexedQuestion,
    studentSubmitExamLO,
    studentSubmitExamLOWhenOpenTimeLimitPopup,
    studentWaitAutoSubmitExamLO,
    teacherSeesExamLOSubmissions,
    teacherSeesLearningRecordPopupAtIndex,
    teacherSeesNoExamLOSubmissions,
    teacherSeesQuizResultAtIndex,
} from './syllabus-do-exam-lo-definitions';
import {
    studentGoesToLearningMaterial,
    studentGoesToTopicDetailScreen,
    studentSeesLOQuestionsResult,
    teacherSeesLatestQuizResultOnStudyPlanTable,
} from './syllabus-do-lo-quiz-definitions';
import {
    studentDoesExamLOWithRandomQuizResult,
    studentStartExamLOFromInstructionScreen,
} from './syllabus-exam-lo-common-definition';
import {
    studentSeeQuizProgress,
    studentWaitingQuizScreenByLMType,
} from './syllabus-question-utils';
import {
    teacherSeesTopicGradeAtStudyplanTable,
    teacherSeeStudyPlanItemWithStatus,
} from './syllabus-study-plan-common-definitions';
import { teacherGoesToStudyPlanDetails } from './syllabus-study-plan-upsert-definitions';
import {
    mappedLOTypeWithAliasStringName,
    studentGoesToTodosScreen,
    studentGoToCourseDetail,
    studentRefreshHomeScreen,
    waitForLoadingAbsent,
} from './syllabus-utils';
import { ByValueKey } from 'flutter-driver-x';
import { QuizType } from 'manabuf/common/v1/contents_pb';
import { randomInteger } from 'test-suites/squads/syllabus/utils/common';

Given(
    'student opens exam lo at nth time',
    { timeout: 100000 },
    async function (this: IMasterWorld) {
        const scenario = this.scenario;

        const courseName = scenario.get<string>(aliasCourseName);
        const topicName = scenario.get<string>(aliasTopicName);
        const examLOName = scenario.get<string>(aliasExamLOName);

        await this.learner.instruction('Student refreshes home screen', async (learner) => {
            await studentRefreshHomeScreen(learner);
        });

        await this.learner.instruction(`Student goes to ${courseName} detail`, async (learner) => {
            await studentGoToCourseDetail(learner, courseName);
        });

        await this.learner.instruction(`Student goes to ${topicName} detail`, async (learner) => {
            await studentGoToTopicDetail(learner, topicName);
        });
        const randomNth = Math.floor(Math.random() * 3 + 2);
        await this.learner.instruction(
            `Student goes to ${examLOName} at ${randomNth} times`,
            async (learner) => {
                for (let index = 0; index < randomNth; index++) {
                    await studentGoesToLODetailsPage(learner, topicName, examLOName);
                    await studentStartExamLOFromInstructionScreen(learner);
                    if (index != randomNth - 1) {
                        await learner.flutterDriver!.tap(
                            new ByValueKey(SyllabusLearnerKeys.back_button)
                        );
                        await learner.flutterDriver!.waitFor(
                            new ByValueKey(SyllabusLearnerKeys.leavingExamLOConfirmDialog)
                        );
                        await learner.flutterDriver!.tap(
                            new ByValueKey(SyllabusLearnerKeys.leaveButtonKey)
                        );
                    }
                }
            }
        );
    }
);

When('student selects a random question', async function (this: IMasterWorld) {
    const scenario = this.scenario;

    const questionQuantity = scenario.get<number>(aliasContentBookLOQuestionQuantity);

    const randomQuestion = Math.floor(Math.random() * questionQuantity);

    await this.learner.instruction(
        `Student select a ${randomQuestion + 1}th question`,
        async (learner) => {
            await studentSelectIndexedQuestion(learner, scenario, randomQuestion);
        }
    );
});

Then(
    'student can do that question',
    // waiting for doing questions in book and see new question added
    async function (this: IMasterWorld) {
        const scenario = this.scenario;

        const questionQuantity = scenario.get<number>(aliasContentBookLOQuestionQuantity);

        const currentQuestion = scenario.get<number>(aliasLOCurrentQuestionIndex);

        await this.learner.instruction(
            `Student do a ${currentQuestion + 1}th question`,
            async (learner) => {
                await learner.flutterDriver?.waitFor(
                    new ByValueKey(SyllabusLearnerKeys.showQuizProgress(questionQuantity))
                );
                const quizQuestionNames = await learner.getQuizNameList();

                const quizTypeNumber = getQuizTypeNumberFromModel(
                    scenario,
                    quizQuestionNames[currentQuestion]
                );
                await studentDoesQuizQuestion(
                    learner,
                    quizTypeNumber!,
                    quizQuestionNames[currentQuestion]
                );
            }
        );
    }
);

Then('student can submit at that question', async function (this: IMasterWorld) {
    await this.learner.instruction(`student can submit at that question`, async (learner) => {
        await learner.flutterDriver?.tap(new ByValueKey(SyllabusLearnerKeys.submit_button));
        await learner.flutterDriver?.waitFor(
            new ByValueKey(SyllabusLearnerKeys.submitAnswerConfirmDialog)
        );
    });
});

Given(
    'student does {int} questions of exam lo',
    { timeout: 100000 },
    async function (this: IMasterWorld, numberOfLearningQuestions: number) {
        const scenario = this.scenario;

        const courseName = scenario.get<string>(aliasCourseName);
        const topicName = scenario.get<string>(aliasTopicName);
        const examLOName = scenario.get<string>(aliasExamLOName);
        const questionQuantity = scenario.get<number>(aliasContentBookLOQuestionQuantity);

        await this.learner.instruction('Student refreshes home screen', async (learner) => {
            await studentRefreshHomeScreen(learner);
        });

        await this.learner.instruction(`Student goes to ${courseName} detail`, async (learner) => {
            await studentGoToCourseDetail(learner, courseName);
        });

        await this.learner.instruction(`Student goes to ${topicName} detail`, async (learner) => {
            await studentGoToTopicDetail(learner, topicName);
        });
        await this.learner.instruction(`Student goes to ${examLOName}`, async (learner) => {
            await studentGoesToLODetailsPage(learner, topicName, examLOName);
            await studentStartExamLOFromInstructionScreen(learner);
            await learner.flutterDriver?.waitFor(
                new ByValueKey(SyllabusLearnerKeys.showQuizProgress(questionQuantity))
            );
        });

        const quizQuestionNames = await this.learner.getQuizNameList();

        for (let index = 0; index < numberOfLearningQuestions; index++) {
            await this.learner.instruction(
                `Student do a ${index + 1}th question`,
                async (learner) => {
                    const quizTypeNumber = getQuizTypeNumberFromModel(
                        scenario,
                        quizQuestionNames[index]
                    );
                    await studentDoesQuizQuestion(
                        learner,
                        quizTypeNumber!,
                        quizQuestionNames[index]
                    );

                    if (index != numberOfLearningQuestions - 1) {
                        await learner.flutterDriver!.tap(
                            new ByValueKey(SyllabusLearnerKeys.next_button)
                        );
                    }
                }
            );
        }
    }
);

Given(
    'student has submitted exam lo with doing {int} questions',
    { timeout: 100000 },
    async function (this: IMasterWorld, numberOfLearningQuestions: number) {
        const scenario = this.scenario;

        const courseName = scenario.get<string>(aliasCourseName);
        const topicName = scenario.get<string>(aliasTopicName);
        const examLOName = scenario.get<string>(aliasExamLOName);
        const questionQuantity = scenario.get<number>(aliasContentBookLOQuestionQuantity);

        await this.learner.instruction('Student refreshes home screen', async (learner) => {
            await studentRefreshHomeScreen(learner);
        });

        await this.learner.instruction(`Student goes to ${courseName} detail`, async (learner) => {
            await studentGoToCourseDetail(learner, courseName);
        });

        await this.learner.instruction(`Student goes to ${topicName} detail`, async (learner) => {
            await studentGoToTopicDetail(learner, topicName);
        });
        await this.learner.instruction(`Student goes to ${examLOName}`, async (learner) => {
            await studentGoesToLODetailsPage(learner, topicName, examLOName);
            await studentStartExamLOFromInstructionScreen(learner);
            await learner.flutterDriver?.waitFor(
                new ByValueKey(SyllabusLearnerKeys.showQuizProgress(questionQuantity))
            );
        });

        const quizQuestionNames = await this.learner.getQuizNameList();

        for (let index = 0; index < numberOfLearningQuestions; index++) {
            await this.learner.instruction(
                `Student does a ${index + 1}th question`,
                async (learner) => {
                    const quizTypeNumber = getQuizTypeNumberFromModel(
                        scenario,
                        quizQuestionNames[index]
                    );
                    await studentDoesQuizQuestion(
                        learner,
                        quizTypeNumber!,
                        quizQuestionNames[index]
                    );

                    if (index != numberOfLearningQuestions - 1) {
                        await learner.flutterDriver!.tap(
                            new ByValueKey(SyllabusLearnerKeys.next_button)
                        );
                    }
                }
            );
        }

        await this.learner.instruction(`Student submits ${examLOName}`, async (learner) => {
            await studentSubmitExamLO(learner, scenario, examLOName);
        });
    }
);

Given(
    'student reopens exam lo from Course Screen and go to Take Again mode',
    { timeout: 100000 },
    async function (this: IMasterWorld) {
        const scenario = this.scenario;

        const courseName = scenario.get<string>(aliasCourseName);
        const topicName = scenario.get<string>(aliasTopicName);
        const examLOName = scenario.get<string>(aliasExamLOName);
        const questionQuantity = scenario.get<number>(aliasContentBookLOQuestionQuantity);

        try {
            await this.learner.flutterDriver?.waitForAbsent(
                new ByValueKey(SyllabusLearnerKeys.quiz_finished_screen(examLOName))
            );
        } catch {
            await this.learner.instruction(
                'Student backs to home screen from exam LO finished screen',
                async (learner) => {
                    await studentBackToHomeScreenFromExamLOQuizFinished(
                        learner,
                        topicName,
                        examLOName
                    );
                }
            );
        }

        await this.learner.instruction('Student refreshes home screen', async (learner) => {
            await studentRefreshHomeScreen(learner);
        });

        await this.learner.instruction(`Student goes to ${courseName} detail`, async (learner) => {
            await studentGoToCourseDetail(learner, courseName);
        });

        await this.learner.instruction(`Student goes to ${topicName} detail`, async (learner) => {
            await studentGoToTopicDetail(learner, topicName);
        });
        await this.learner.instruction(`Student goes to ${examLOName}`, async (learner) => {
            await studentGoesToLODetailsPage(learner, topicName, examLOName);
        });
        await this.learner.instruction(`Student takes again ${examLOName}`, async (learner) => {
            await learner.flutterDriver?.tap(new ByValueKey(SyllabusLearnerKeys.takeAgainButton));
            await studentStartExamLOFromInstructionScreen(learner);
            await learner.flutterDriver?.waitFor(
                new ByValueKey(SyllabusLearnerKeys.showQuizProgress(questionQuantity))
            );
        });
    }
);

Given(
    'student reopens exam lo from Todo Screen and go to Take Again mode',
    { timeout: 100000 },
    async function (this: IMasterWorld) {
        const scenario = this.scenario;

        const topicName = scenario.get<string>(aliasTopicName);
        const examLOName = scenario.get<string>(aliasExamLOName);
        const questionQuantity = scenario.get<number>(aliasContentBookLOQuestionQuantity);

        try {
            await this.learner.flutterDriver?.waitForAbsent(
                new ByValueKey(SyllabusLearnerKeys.quiz_finished_screen(examLOName))
            );
        } catch {
            await this.learner.instruction(
                'Student backs to home screen from exam LO finished screen',
                async (learner) => {
                    await studentBackToHomeScreenFromExamLOQuizFinished(
                        learner,
                        topicName,
                        examLOName
                    );
                }
            );
        }

        await this.learner.instruction(`Student goes to Todo Screen`, async (learner) => {
            await studentGoesToTodosScreen(learner);
        });

        await this.learner.instruction(
            'Student goes to Completed Page on Todo Screen',
            async (learner) => {
                await learner.clickOnTab(
                    SyllabusLearnerKeys.completed_tab,
                    SyllabusLearnerKeys.completed_page
                );
            }
        );

        await this.learner.instruction(
            `Student see Exam LO ${examLOName} on Completed Page`,
            async (learner) => {
                const listKey = new ByValueKey(SyllabusLearnerKeys.completed_page);
                const itemKey = new ByValueKey(SyllabusLearnerKeys.study_plan_item(examLOName));
                await learner.flutterDriver!.waitFor(listKey);
                await learner.flutterDriver!.scrollUntilVisible(
                    listKey,
                    itemKey,
                    0.0,
                    0.0,
                    -100,
                    20000
                );
                await learner.flutterDriver!.tap(itemKey);
            }
        );

        await this.learner.instruction(`Student takes again ${examLOName}`, async (learner) => {
            await learner.flutterDriver?.tap(new ByValueKey(SyllabusLearnerKeys.takeAgainButton));
            await studentStartExamLOFromInstructionScreen(learner);
            await learner.flutterDriver?.waitFor(
                new ByValueKey(SyllabusLearnerKeys.showQuizProgress(questionQuantity))
            );
        });
    }
);

Given('student goes to Quiz Achievement Screen', async function (this: IMasterWorld) {
    const scenario = this.scenario;
    const examLOName = scenario.get<string>(aliasExamLOName);

    await this.learner.instruction('student taps on next button', async (learner) => {
        await learner.flutterDriver?.waitFor(
            new ByValueKey(SyllabusLearnerKeys.quiz_finished_screen(examLOName))
        );
        await learner.flutterDriver?.tap(new ByValueKey(SyllabusLearnerKeys.next_button));
    });

    await this.learner.instruction('student see Quiz Achievement Screen', async (learner) => {
        await learner.flutterDriver?.waitFor(
            new ByValueKey(SyllabusLearnerKeys.quiz_finished_achievement_screen(examLOName))
        );
    });
});

When('student taps to View Answer Keys button', async function (this: IMasterWorld) {
    await this.learner.instruction('student taps on view answer keys button', async (learner) => {
        await learner.flutterDriver?.tap(new ByValueKey(SyllabusLearnerKeys.viewAnswerKeyButton));
    });
});

Then('student goes to Answer Keys Screen', async function (this: IMasterWorld) {
    const scenario = this.scenario;

    const examLOName = scenario.get<string>(aliasExamLOName);
    await this.learner.instruction('student see Answer Keys Screen', async (learner) => {
        await learner.flutterDriver?.tap(
            new ByValueKey(SyllabusLearnerKeys.exam_lo_quiz_screen(examLOName))
        );
    });
});

Then(
    'student can go random question for nth times in Answer Keys Screen',
    async function (this: IMasterWorld) {
        const scenario = this.scenario;

        const questionQuantity = scenario.get<number>(aliasContentBookLOQuestionQuantity);

        const randomNth = Math.floor(Math.random() * 3 + 2);

        for (let index = 0; index < randomNth; index++) {
            const randomQuestion = Math.floor(Math.random() * questionQuantity);

            await this.learner.instruction(
                `Student select a ${randomQuestion + 1}th question`,
                async (learner) => {
                    await studentSelectIndexedQuestion(learner, scenario, randomQuestion);
                }
            );
        }
    }
);

Then('student can not submit at Answer Keys Screen', async function (this: IMasterWorld) {
    await this.learner.instruction('student can not submit Answer Keys', async (learner) => {
        await learner.flutterDriver?.tap(
            new ByValueKey(SyllabusLearnerKeys.submit_button_unenabled)
        );
    });
});

Given(
    'student has taken again exam lo mode with doing {int} questions',
    { timeout: 100000 },
    async function (this: IMasterWorld, numberOfLearningQuestions: number) {
        const scenario = this.scenario;

        const courseName = scenario.get<string>(aliasCourseName);
        const topicName = scenario.get<string>(aliasTopicName);
        const examLOName = scenario.get<string>(aliasExamLOName);
        const questionQuantity = scenario.get<number>(aliasContentBookLOQuestionQuantity);

        try {
            await this.learner.flutterDriver?.waitForAbsent(
                new ByValueKey(SyllabusLearnerKeys.quiz_finished_screen(examLOName))
            );
        } catch {
            await this.learner.instruction(
                'Student backs to home screen from exam LO finished screen',
                async (learner) => {
                    await studentBackToHomeScreenFromExamLOQuizFinished(
                        learner,
                        topicName,
                        examLOName
                    );
                }
            );
        }

        await this.learner.instruction('Student refreshes home screen', async (learner) => {
            await studentRefreshHomeScreen(learner);
        });

        await this.learner.instruction(`Student goes to ${courseName} detail`, async (learner) => {
            await studentGoToCourseDetail(learner, courseName);
        });

        await this.learner.instruction(`Student goes to ${topicName} detail`, async (learner) => {
            await studentGoToTopicDetail(learner, topicName);
        });
        await this.learner.instruction(`Student goes to ${examLOName}`, async (learner) => {
            await studentGoesToLODetailsPage(learner, topicName, examLOName);
        });
        await this.learner.instruction(`Student takes again ${examLOName}`, async (learner) => {
            await learner.flutterDriver?.tap(new ByValueKey(SyllabusLearnerKeys.takeAgainButton));
            await studentStartExamLOFromInstructionScreen(learner);
            await learner.flutterDriver?.waitFor(
                new ByValueKey(SyllabusLearnerKeys.showQuizProgress(questionQuantity))
            );
        });

        const quizQuestionNames = await this.learner.getQuizNameList();

        for (let index = 0; index < numberOfLearningQuestions; index++) {
            await this.learner.instruction(
                `Student does a ${index + 1}th question`,
                async (learner) => {
                    const quizTypeNumber = getQuizTypeNumberFromModel(
                        scenario,
                        quizQuestionNames[index]
                    );
                    await studentDoesQuizQuestion(
                        learner,
                        quizTypeNumber!,
                        quizQuestionNames[index]
                    );

                    if (index != numberOfLearningQuestions - 1) {
                        await learner.flutterDriver!.tap(
                            new ByValueKey(SyllabusLearnerKeys.next_button)
                        );
                    }
                }
            );
        }

        await this.learner.instruction(`Student submits ${examLOName}`, async (learner) => {
            await studentSubmitExamLO(learner, scenario, examLOName);
        });
    }
);

Then('student can submit exam lo with time limit', async function (this: IMasterWorld) {
    const examLOName = this.scenario.get<string>(aliasExamLOName);

    await this.learner.instruction(`Student submits ${examLOName}`, async (learner) => {
        await studentSubmitExamLOWhenOpenTimeLimitPopup(learner, examLOName);
    });
});

Given(
    'student stands at {int}th question',
    async function (this: IMasterWorld, questionIndex: number) {
        const scenario = this.scenario;

        await this.learner.instruction(
            `Student selects a ${questionIndex}th question`,
            async (learner) => {
                await studentSelectIndexedQuestion(learner, scenario, questionIndex - 1);
            }
        );

        await this.learner.instruction(
            `Student sees a ${questionIndex}th question`,
            async (learner) => {
                await learner.flutterDriver?.waitFor(
                    new ByValueKey(SyllabusLearnerKeys.currentQuizNumber(questionIndex))
                );
            }
        );
    }
);

When('student goes to next question by next button', async function (this: IMasterWorld) {
    await this.learner.instruction(`Student taps next button`, async (learner) => {
        await learner.flutterDriver?.tap(new ByValueKey(SyllabusLearnerKeys.next_button));
    });
});

Then('student sees {int}th question', async function (this: IMasterWorld, questionIndex: number) {
    await this.learner.instruction(
        `Student sees a ${questionIndex}th question`,
        async (learner) => {
            await learner.flutterDriver?.waitFor(
                new ByValueKey(SyllabusLearnerKeys.currentQuizNumber(questionIndex))
            );
        }
    );
});

Given(
    'school admin creates {int} questions of each question type in Exam LO',
    { timeout: 200000 },
    async function (this: IMasterWorld, numOfQuestions: number) {
        const cms = this.cms;
        const scenario = this.scenario;
        const examLOName = scenario.get<string>(aliasExamLOName);

        await cms.instruction('school admin is on book details page', async function (cms) {
            await schoolAdminIsOnBookDetailsPage(cms, scenario);
        });

        await cms.instruction(
            'school admin goes to Exam LO Quiz details page',
            async function (cms) {
                await schoolAdminGoesToExamLOQuizDetailsPage(cms, examLOName);
            }
        );

        await cms.instruction(`school admin create 10 new questions in LO`, async function (cms) {
            await createNewQuizzesForMultipleType(cms, scenario, numOfQuestions, [
                'fill in the blank',
                'multiple answer',
                'multiple choice',
            ]);
        });
    }
);

Given(
    'student has done some LO exams with ascending correct answers and retried 1 exam',
    { timeout: 100000 },
    async function (this: IMasterWorld) {
        const LOExams = this.scenario.get<StudyPlanItem[]>(aliasRandomStudyPlanItems);
        const courseId = this.scenario.get(aliasCourseId);
        const bookId = this.scenario.get(aliasBookIds)[0];
        const chapter = this.scenario.get<Chapter[]>(aliasRandomChapters)[0];
        const topicName = this.scenario.get<string>(aliasTopicName);
        const allQuestionsCount = 3;
        let completedRate = this.scenario.get<number>(aliasGradeBookCompletedRate) ?? 0;

        await this.learner.instruction(`student goes to topic page via URL`, async () => {
            const domainUrl = this.learner.page!.url().split('#')[0] + '#/';
            const path = `learning?course_id=${courseId}/losByTopic?book_id=${bookId}&chapter_id=${chapter.info?.id}&topic_id=${LOExams[0].topicId}`;
            const topicPageUrl = `${domainUrl}${path}`;

            await this.learner.page?.goto(topicPageUrl);
        });

        await this.learner.instruction(
            `student submits some exams with ascending correct answers`,
            async () => {
                // skips last exam and does the others
                for (let i = 0; i < LOExams.length - 1; i++) {
                    const exam = LOExams[i];
                    const examName = exam.name;
                    const examId = exam.learningMaterialId;
                    completedRate++;

                    await studentGoesToLODetailsPage(this.learner, topicName, examName);
                    await studentStartExamLOFromInstructionScreen(this.learner);
                    await studentSeesAndDoesExamLOQuestionsWithCorrectQuizzes(
                        this.learner,
                        this.scenario,
                        i,
                        i,
                        allQuestionsCount,
                        QuizType.QUIZ_TYPE_MCQ
                    );
                    await studentSubmitExamLO(this.learner, this.scenario, examName);

                    if (examId) {
                        await studentGetsExamLOResultAtQuizFinishedScreen(
                            this.learner,
                            this.scenario,
                            examId
                        );
                    }

                    await studentBackToLOListFromExamLOQuizFinished(
                        this.learner,
                        topicName,
                        examName
                    );
                }
            }
        );

        this.scenario.set(aliasGradeBookCompletedRate, completedRate);

        await this.learner.instruction(
            'student retries first exam with all correct answers',
            async () => {
                const exam = LOExams[0];
                const examName = exam.name;
                const examId = exam.learningMaterialId;

                await studentGoesToLODetailsPage(this.learner, topicName, examName);

                await this.learner.flutterDriver!.tap(
                    new ByValueKey(SyllabusLearnerKeys.takeAgainButton)
                );

                await studentStartExamLOFromInstructionScreen(this.learner);
                await studentSeesAndDoesExamLOQuestionsWithCorrectQuizzes(
                    this.learner,
                    this.scenario,
                    allQuestionsCount,
                    allQuestionsCount,
                    allQuestionsCount,
                    QuizType.QUIZ_TYPE_MCQ
                );

                await studentSubmitExamLO(this.learner, this.scenario, examName);
                if (examId) {
                    await studentGetsExamLOResultAtQuizFinishedScreen(
                        this.learner,
                        this.scenario,
                        examId
                    );
                }
            }
        );
    }
);

Given(
    'student has done {int} questions with {int} corrected answers',
    { timeout: 300000 },
    async function (this: IMasterWorld, numberOfQuestion: number, numOfIncorrect: number) {
        const scenario = this.scenario;

        const courseName = scenario.get<string>(aliasCourseName);
        const topicName = scenario.get<string>(aliasTopicName);
        const examLOName = scenario.get<string>(aliasExamLOName);
        const totalQuizQuestions = scenario.get<number>(aliasTotalQuestionCount);

        try {
            await this.learner.flutterDriver?.waitFor(
                new ByValueKey(SyllabusLearnerKeys.exam_lo_quiz_screen(examLOName))
            );
        } catch {
            await this.learner.instruction('Student refreshes home screen', async (learner) => {
                await studentRefreshHomeScreen(learner);
            });

            await this.learner.instruction(
                `Student goes to ${courseName} detail`,
                async (learner) => {
                    await studentGoToCourseDetail(learner, courseName);
                }
            );

            await this.learner.instruction(
                `Student goes to ${topicName} detail`,
                async (learner) => {
                    await studentGoToTopicDetail(learner, topicName);
                }
            );
            await this.learner.instruction(`Student goes to ${examLOName}`, async (learner) => {
                await studentGoesToLODetailsPage(learner, topicName, examLOName);
                try {
                    await studentStartExamLOFromInstructionScreen(learner);
                } catch {
                    console.warn('Not found: instruction screen');
                }
                try {
                    await learner.flutterDriver?.tap(
                        new ByValueKey(SyllabusLearnerKeys.takeAgainButton)
                    );
                    await studentStartExamLOFromInstructionScreen(learner);
                } catch {
                    console.warn('Not found: takeAgainButton');
                }
            });
        } finally {
            await this.learner.flutterDriver?.waitFor(
                new ByValueKey(SyllabusLearnerKeys.showQuizProgress(totalQuizQuestions)),
                30000
            );
        }

        await studentSeesAndDoesExamLOQuestionsWithCorrectQuizzes(
            this.learner,
            scenario,
            numOfIncorrect,
            numberOfQuestion,
            totalQuizQuestions
        );
    }
);

When('student submits exam lo', async function (this: IMasterWorld) {
    const scenario = this.scenario;

    const examLOName = scenario.get<string>(aliasExamLOName);
    await this.learner.instruction(`Student submits ${examLOName}`, async (learner) => {
        await studentSubmitExamLO(learner, scenario, examLOName);
    });
});

When(
    'student submits exam lo the {int}th time',
    async function (this: IMasterWorld, numberOfTime: number) {
        const scenario = this.scenario;

        const examLOName = scenario.get<string>(aliasExamLOName);
        await this.learner.instruction(
            `Student submits ${examLOName} at ${numberOfTime} time`,
            async (learner) => {
                await studentSubmitExamLO(learner, scenario, examLOName);
            }
        );
    }
);

Then("exam lo's result of student is updated on Learner App", async function (this: IMasterWorld) {
    const scenario = this.scenario;
    const examLOName = scenario.get<string>(aliasExamLOName);

    const totalQuizQuestions = scenario.get<number>(aliasTotalQuestionCount);

    const correctQuizzesCount = scenario.get<number>(aliasCorrectedAnswerExamLO);

    const resultExpected = Math.round((correctQuizzesCount * 100) / totalQuizQuestions);
    await this.learner.instruction(
        `student sees Exam LO questions result is ${resultExpected}`,
        async (learner) => {
            await studentSeesLOQuestionsResult(learner, scenario, examLOName);
            const decimalQuizResult = scenario.get<number>(aliasDecimalQuizResult);
            weExpect(Math.round(decimalQuizResult * 100)).toEqual(resultExpected);
        }
    );

    await this.learner.instruction(`Student doesn't see retry button`, async (learner) => {
        await learner.flutterDriver?.waitForAbsent(
            new ByValueKey(SyllabusLearnerKeys.retry_button)
        );
    });
});

Then(
    "exam lo's result of student is updated on Teacher App",
    { timeout: 100000 },
    async function (this: IMasterWorld) {
        const scenario = this.scenario;

        const courseName = scenario.get<string>(aliasCourseName);
        const courseId = scenario.get<string>(aliasCourseId);
        const topicName = scenario.get<string>(aliasTopicName);
        const studentId = await this.learner.getUserId();
        const studyPlanItemName = scenario.get<string>(aliasExamLOName);

        const decimalQuizResult = scenario.get<number>(aliasDecimalQuizResult);
        const quizResultText = scenario.get<string>(aliasQuizResult);

        const resultExpected = Math.round(decimalQuizResult * 100);

        await this.teacher.instruction(
            `Teacher goes to course ${courseName} student tab from home page`,
            async (teacher) => {
                await teacherGoesToStudyPlanDetails(teacher, courseId, studentId);
            }
        );

        await this.teacher.instruction(
            `teacher sees "${topicName}"'s grade is ${resultExpected}%`,
            async (teacher) => {
                await teacherSeesTopicGradeAtStudyplanTable(teacher, topicName, resultExpected);
            }
        );

        await this.teacher.instruction(
            `teacher sees "${studyPlanItemName}"'s grade is ${quizResultText}`,
            async (teacher) => {
                await teacherSeesLatestQuizResultOnStudyPlanTable(
                    teacher,
                    studyPlanItemName,
                    quizResultText
                );
            }
        );

        await this.teacher.instruction(
            `teacher sees "${studyPlanItemName}"'s status is completed`,
            async (teacher) => {
                await teacherSeeStudyPlanItemWithStatus(teacher, studyPlanItemName, 'completed');
            }
        );

        await this.teacher.instruction(
            `Teacher goes to view the study plan item details`,
            async function (teacher) {
                await teacherGoesToStudyPlanItemDetails(teacher, studyPlanItemName);
            }
        );

        await this.teacher.instruction(
            `Teacher sees result of the latest student's quiz attempt`,
            async (teacher) => {
                await teacherSeesLatestQuizResult(
                    teacher,
                    quizResultText,
                    courseId,
                    studentId,
                    studyPlanItemName
                );
            }
        );
    }
);

Given(
    'student is in Take Again mode for {int}th time',
    { timeout: 300000 },
    async function (this: IMasterWorld, numberOfTimeInTakeAgainMode: number) {
        const scenario = this.scenario;

        const courseName = scenario.get<string>(aliasCourseName);
        const topicName = scenario.get<string>(aliasTopicName);
        const examLOName = scenario.get<string>(aliasExamLOName);
        const totalQuizQuestions = scenario.get<number>(aliasTotalQuestionCount);
        await this.learner.instruction('Student submit exam LO 1st time', async (learner) => {
            await studentRefreshHomeScreen(learner);
            await studentGoToCourseDetail(learner, courseName);
            await studentGoToTopicDetail(learner, topicName);
            await studentGoesToLODetailsPage(learner, topicName, examLOName);
            await studentStartExamLOFromInstructionScreen(learner);
            await learner.flutterDriver?.waitFor(
                new ByValueKey(SyllabusLearnerKeys.showQuizProgress(totalQuizQuestions))
            );
            await studentSubmitExamLO(learner, scenario, examLOName);
            await studentBackToHomeScreenFromExamLOQuizFinished(learner, topicName, examLOName);
        });

        for (let i = 1; i < numberOfTimeInTakeAgainMode; i++) {
            await this.learner.instruction(
                `Student submit exam LO ${i + 1}th time (Take Again mode ${i}th time)`,
                async (learner) => {
                    await studentGoToCourseDetail(learner, courseName);
                    await studentGoToTopicDetail(learner, topicName);
                    await studentGoesToLODetailsPage(learner, topicName, examLOName);
                    await learner.flutterDriver?.tap(
                        new ByValueKey(SyllabusLearnerKeys.takeAgainButton)
                    );
                    await studentStartExamLOFromInstructionScreen(learner);
                    await learner.flutterDriver?.waitFor(
                        new ByValueKey(SyllabusLearnerKeys.showQuizProgress(totalQuizQuestions))
                    );
                    await studentSubmitExamLO(learner, scenario, examLOName);
                    await studentBackToHomeScreenFromExamLOQuizFinished(
                        learner,
                        topicName,
                        examLOName
                    );
                }
            );
        }
        await this.learner.instruction(
            `Student is in Take Again mode ${numberOfTimeInTakeAgainMode}th time)`,
            async (learner) => {
                await studentGoToCourseDetail(learner, courseName);
                await studentGoToTopicDetail(learner, topicName);
                await studentGoesToLODetailsPage(learner, topicName, examLOName);
                await learner.flutterDriver?.tap(
                    new ByValueKey(SyllabusLearnerKeys.takeAgainButton)
                );
                await studentStartExamLOFromInstructionScreen(learner);
                await learner.flutterDriver?.waitFor(
                    new ByValueKey(SyllabusLearnerKeys.showQuizProgress(totalQuizQuestions))
                );
            }
        );
    }
);

Then('student is at [n+1]th question of Exam LO Quiz', async function (this: IMasterWorld) {
    const questionIndex = this.scenario.get<number>(aliasLOCurrentQuestionIndex);
    await this.learner.instruction(
        `Student is at ${questionIndex + 2}th question`,
        async (learner) => {
            await learner.flutterDriver!.waitFor(
                new ByValueKey(SyllabusLearnerKeys.currentQuizNumber(questionIndex + 2))
            );
        }
    );
});

When(
    'student does and submit exam lo {int} times with randomness',
    { timeout: 300000 },
    async function (this: IMasterWorld, numberOfTime: number) {
        const scenario = this.scenario;

        const courseName = scenario.get<string>(aliasCourseName);
        const topicName = scenario.get<string>(aliasTopicName);
        const examLOName = scenario.get<string>(aliasExamLOName);
        const totalQuizQuestions = scenario.get<number>(aliasTotalQuestionCount);
        let correctAnswerRandom = Math.floor(Math.random() * totalQuizQuestions) + 1;
        let incorrectAnswerRandom = Math.floor(
            Math.random() * (totalQuizQuestions - correctAnswerRandom)
        );
        await this.learner.instruction(
            `Student submit exam LO 1st time with ${correctAnswerRandom}/${totalQuizQuestions}`,
            async (learner) => {
                await studentRefreshHomeScreen(learner);
                await studentGoToCourseDetail(learner, courseName);
                await studentGoToTopicDetail(learner, topicName);
                await studentGoesToLODetailsPage(learner, topicName, examLOName);
                await studentStartExamLOFromInstructionScreen(learner);
                await learner.flutterDriver?.waitFor(
                    new ByValueKey(SyllabusLearnerKeys.showQuizProgress(totalQuizQuestions))
                );
                await studentSeesAndDoesExamLOQuestionsWithCorrectQuizzes(
                    learner,
                    scenario,
                    correctAnswerRandom,
                    correctAnswerRandom + incorrectAnswerRandom,
                    totalQuizQuestions
                );
                await studentSubmitExamLO(learner, scenario, examLOName);
                await studentBackToHomeScreenFromExamLOQuizFinished(learner, topicName, examLOName);
            }
        );

        for (let i = 1; i < numberOfTime; i++) {
            correctAnswerRandom = Math.floor(Math.random() * totalQuizQuestions) + 1;
            incorrectAnswerRandom = Math.floor(
                Math.random() * (totalQuizQuestions - correctAnswerRandom)
            );
            await this.learner.instruction(
                `Student submit exam LO ${
                    i + 1
                }th time with ${correctAnswerRandom}/${totalQuizQuestions}`,
                async (learner) => {
                    await studentGoToCourseDetail(learner, courseName);
                    await studentGoToTopicDetail(learner, topicName);
                    await studentGoesToLODetailsPage(learner, topicName, examLOName);
                    await learner.flutterDriver?.tap(
                        new ByValueKey(SyllabusLearnerKeys.takeAgainButton)
                    );
                    await studentStartExamLOFromInstructionScreen(learner);
                    await learner.flutterDriver?.waitFor(
                        new ByValueKey(SyllabusLearnerKeys.showQuizProgress(totalQuizQuestions))
                    );
                    await studentSeesAndDoesExamLOQuestionsWithCorrectQuizzes(
                        learner,
                        scenario,
                        correctAnswerRandom,
                        correctAnswerRandom + incorrectAnswerRandom,
                        totalQuizQuestions
                    );
                    await studentSubmitExamLO(learner, scenario, examLOName);
                    await studentBackToHomeScreenFromExamLOQuizFinished(
                        learner,
                        topicName,
                        examLOName
                    );
                }
            );
        }
    }
);

When('student submits exam lo with attempt {int}', async function (attemptNumber: number) {
    const driver = this.learner.flutterDriver!;
    const topicName = this.scenario.get<string>(aliasTopicName);
    const studyPlanItemName = this.scenario.get<string>(mappedLOTypeWithAliasStringName['exam LO']);
    const randomQuestionList = this.scenario.get<Quiz[]>(aliasRandomQuizzes);
    const quizResultListByDescSubmission =
        this.scenario.get<QuizResult[]>(aliasQuizResultListByDescSubmission) || [];

    const quizDetailList: QuizDetail[] = convertDataQuizToQuizDetails(randomQuestionList);

    if (attemptNumber > 1) {
        await this.teacher.instruction(
            `Student goes to ${studyPlanItemName} detail screen`,
            async () => {
                await studentGoesToLODetailsPage(this.learner, topicName, studyPlanItemName);
                await waitForLoadingAbsent(this.learner.flutterDriver!);
            }
        );

        await this.learner.instruction(`Student taps take again button`, async () => {
            await driver.tap(new ByValueKey(SyllabusLearnerKeys.takeAgainButton));
        });
    }

    await this.learner.instruction(
        `Student taps start button to do the exam lo ${studyPlanItemName}`,
        async () => {
            await studentStartExamLOFromInstructionScreen(this.learner);
            await studentWaitingQuizScreenByLMType(this.learner, {
                type: 'exam LO',
                name: studyPlanItemName,
            });
            await studentSeeQuizProgress(this.learner, quizDetailList.length);
        }
    );

    await this.learner.instruction(`Student does the exam ${studyPlanItemName}`, async () => {
        const currentQuizResult = await studentDoesExamLOWithRandomQuizResult(
            this.learner,
            quizDetailList
        );

        this.scenario.set(aliasQuizResultListByDescSubmission, [
            currentQuizResult,
            ...quizResultListByDescSubmission,
        ]);
    });

    await this.learner.instruction(
        `Student submits the exam lo with attempt ${attemptNumber}`,
        async () => {
            await studentSubmitExamLO(this.learner, this.scenario, studyPlanItemName);
            await waitForLoadingAbsent(this.learner.flutterDriver!);
        }
    );

    await this.learner.instruction(
        `Student goes back to topic ${topicName} detail screen`,
        async () => {
            await studentBackToLOListFromExamLOQuizFinished(
                this.learner,
                topicName,
                studyPlanItemName
            );
        }
    );

    this.scenario.set(aliasQuizDetailList, quizDetailList);
});

Then(
    "{int} exam lo's submission of student is updated on Teacher App",
    { timeout: 100000 },
    async function (this: IMasterWorld, numberOfTime: number) {
        const scenario = this.scenario;

        const courseName = scenario.get<string>(aliasCourseName);
        const courseId = scenario.get<string>(aliasCourseId);
        const studentId = await this.learner.getUserId();
        const studyPlanItemName = scenario.get<string>(aliasExamLOName);
        const totalQuizQuestions = scenario.get<number>(aliasTotalQuestionCount);

        const correctAnswerExamLOList =
            scenario.get<number[]>(aliasCorrectedAnswerExamLOList) ?? [];

        await this.teacher.instruction(
            `Teacher goes to course ${courseName} student tab from home page`,
            async (teacher) => {
                await teacherGoesToStudyPlanDetails(teacher, courseId, studentId);
            }
        );

        await this.teacher.instruction(
            `teacher opens "${studyPlanItemName}"'s history records`,
            async (teacher) => {
                await teacher.flutterDriver?.waitFor(
                    new ByValueKey(
                        SyllabusTeacherKeys.studentStudyPlanItemGradeDropdownButton(
                            studyPlanItemName
                        )
                    ),
                    20000
                );
                await teacher.flutterDriver?.tap(
                    new ByValueKey(
                        SyllabusTeacherKeys.studentStudyPlanItemGradeDropdownButton(
                            studyPlanItemName
                        )
                    )
                );
            }
        );

        for (let i = 0; i < numberOfTime; i++) {
            await this.teacher.instruction(
                `teacher sees "${studyPlanItemName}"'s grade ${i + 1}th record is ${
                    correctAnswerExamLOList[i]
                }/${totalQuizQuestions}`,
                async (teacher) => {
                    await teacherSeesLearningRecordPopupAtIndex(
                        teacher,
                        correctAnswerExamLOList[i],
                        totalQuizQuestions,
                        numberOfTime - i - 1
                    );
                }
            );
        }

        await this.teacher.instruction(
            `Teacher goes to view the study plan item details`,
            async function (teacher) {
                await teacher.flutterDriver?.tap(
                    new ByValueKey(SyllabusTeacherKeys.hideHistoryPopupMenu)
                );
                await teacherGoesToStudyPlanItemDetails(teacher, studyPlanItemName);
            }
        );

        await this.teacher.instruction(
            `teacher opens study plan item detail's history records`,
            async (teacher) => {
                await teacher.flutterDriver?.tap(
                    new ByValueKey(SyllabusTeacherKeys.quizHistoryDropdown)
                );
            }
        );

        for (let i = 0; i < numberOfTime; i++) {
            await this.teacher.instruction(
                `Teacher sees result of the student's quiz attempt ${i + 1}th record is ${
                    correctAnswerExamLOList[i]
                }/${totalQuizQuestions}`,
                async (teacher) => {
                    await teacherSeesQuizResultAtIndex(
                        teacher,
                        courseId,
                        studentId,
                        studyPlanItemName,
                        correctAnswerExamLOList[i],
                        totalQuizQuestions,
                        numberOfTime - i - 1
                    );
                }
            );
        }
    }
);

Given('student does some questions at exam lo', { timeout: 100000 }, async function () {
    const scenario = this.scenario;

    const questionQuantity = scenario.get<number>(aliasContentBookLOQuestionQuantity);

    const numberOfLearningQuestions = randomInteger(1, questionQuantity);

    const quizQuestionNames = await this.learner.getQuizNameList();

    await asyncForEach(createNumberArrayWithLength(numberOfLearningQuestions), async (_, index) => {
        await this.learner.instruction(`Student do a ${index + 1}th question`, async (learner) => {
            const quizTypeNumber = getQuizTypeNumberFromAliasRandomQuizzes(
                scenario,
                quizQuestionNames[index]
            );
            await studentDoesQuizQuestion(learner, quizTypeNumber!, quizQuestionNames[index]);

            await studentGoesToNextQuestionAtExamLO(learner, index, numberOfLearningQuestions);
        });
    });

    scenario.set(aliasExamLOFinishedQuestionCount, numberOfLearningQuestions);
});

When(
    'student stays at the exam until the time limit is over',
    { timeout: 1000000 },
    async function () {
        const scenario = this.scenario;

        const timeLimit = scenario.get<number>(aliasExamLOTimeLimit);
        const examLoName = scenario.get<string>(aliasExamLOName);

        await this.learner.instruction(
            `student waits exam lo screen ${examLoName} disappear`,
            async () => {
                await studentWaitAutoSubmitExamLO(this.learner, examLoName, timeLimit);
            }
        );
    }
);

Then('student sees exam lo is auto-submitted', async function () {
    await this.learner.instruction(`student sees Force Submit ExamLO Screen`, async () => {
        await studentSeeForceSubmitExamLOScreen(this.learner);
    });
});

When('student answers and submits exam lo', { timeout: 100000 }, async function () {
    const scenario = this.scenario;
    const courseName = scenario.get<string>(aliasCourseName);
    const topicName = scenario.get<string>(aliasTopicName);
    const examLOName = scenario.get<string>(aliasExamLOName);

    await studentGoesToLearningMaterial(this.learner, courseName, topicName, examLOName, 'exam LO');

    await studentSubmitExamLO(this.learner, scenario, examLOName);

    await this.learner.flutterDriver?.tap(new ByValueKey(SyllabusLearnerKeys.next_button));
    await this.learner.flutterDriver?.waitFor(
        new ByValueKey(SyllabusLearnerKeys.quizFinishedAchievementScreen(examLOName))
    );
    await this.learner.flutterDriver?.tap(new ByValueKey(SyllabusLearnerKeys.viewAnswerKeyButton));
    await this.learner.flutterDriver?.tap(new ByValueKey(SyllabusLearnerKeys.back_button));
});

When('student retakes exam', { timeout: 90 * 1000 }, async function () {
    const topicName = this.scenario.get<string>(aliasTopicName);
    const examLOName = this.scenario.get<string>(aliasExamLOName);

    await this.learner.instruction(`student retakes exam`, async () => {
        await studentRetakesExamLO(this.learner, topicName, examLOName);
    });
});

When('student goes back to exam attempt history', { timeout: 90 * 1000 }, async function () {
    const scenario = this.scenario;
    const topicName = scenario.get<string>(aliasTopicName);
    const examLOName = scenario.get<string>(aliasExamLOName);

    await this.learner.flutterDriver?.tap(new ByValueKey(SyllabusLearnerKeys.next_button));
    await this.learner.flutterDriver?.waitFor(
        new ByValueKey(SyllabusLearnerKeys.quizFinishedAchievementScreen(examLOName))
    );
    await this.learner.flutterDriver?.tap(new ByValueKey(SyllabusLearnerKeys.viewAnswerKeyButton));
    await this.learner.flutterDriver?.tap(new ByValueKey(SyllabusLearnerKeys.back_button));
    await this.learner.instruction(`Student goes to ${examLOName} detail`, async () => {
        await studentGoesToLODetailsPage(this.learner, topicName, examLOName);
    });
});
When(
    'student retakes and submits exam lo',
    { timeout: 90 * 1000 },
    async function (this: IMasterWorld) {
        const scenario = this.scenario;
        const topicName = scenario.get<string>(aliasTopicName);
        const examLOName = scenario.get<string>(aliasExamLOName);

        await this.learner.instruction(`student retakes exam ${examLOName}`, async () => {
            await studentRetakesExamLO(this.learner, topicName, examLOName);
        });

        await this.learner.instruction(`Student submits ${examLOName}`, async (learner) => {
            await studentSubmitExamLO(learner, scenario, examLOName);
        });
    }
);

Then('student sees submitted-content of exam lo', async function () {
    const questionQuantity = this.scenario.get<number>(aliasContentBookLOQuestionQuantity);
    const finishedQuestionCount = this.scenario.get<number>(aliasExamLOFinishedQuestionCount);

    await this.learner.instruction(
        `Student sees questions content in popup: ${finishedQuestionCount}/${questionQuantity}`,
        async () => {
            await studentSeesQuestionContentInSubmitConfirmationTimeLimit(
                this.learner,
                finishedQuestionCount,
                questionQuantity
            );
        }
    );

    await this.learner.instruction(`Student sees timer content in popup`, async () => {
        await studentSeesTimeContentInSubmitConfirmationTimeLimit(this.learner, 0);
    });
});

When('teacher select lo type filter is exam', async function () {
    await this.teacher.instruction(`Teacher filters submission lo type`, async () => {
        await filterExamLo(this.teacher);
    });
});

Then('teacher sees exam lo with manual grading is on', async function () {
    const examLOs = this.scenario.get<LearningObjective[]>(aliasRandomLearningObjectives);
    const examLO = examLOs.find((item) => item.manualGrading === true) as LearningObjective;

    await this.teacher.instruction(`Teacher sees exam lo submission ${examLO.name}`, async () => {
        await teacherSeesExamLOSubmissions(this.teacher, examLO);
    });
});

Then('teacher can not see exam lo with manual grading is off', async function () {
    const examLOs = this.scenario.get<LearningObjective[]>(aliasRandomLearningObjectives);
    const examLO = examLOs.find((item) => item.manualGrading === false) as LearningObjective;

    await this.teacher.instruction(
        `Teacher can not see exam lo submission ${examLO.name}`,
        async () => {
            await teacherSeesNoExamLOSubmissions(this.teacher, examLO);
        }
    );
});

Given('student submitted 2 exam los', async function (this: IMasterWorld) {
    const scenario = this.scenario;
    const courseName = scenario.get<string>(aliasCourseName);
    const topicName = scenario.get<string>(aliasTopicName);
    const examLOs = scenario.get<LearningObjective[]>(aliasRandomLearningObjectives);

    await studentGoesToTopicDetailScreen(this.learner, courseName, topicName);

    for (const examLO of examLOs) {
        const examLOName = examLO.name;
        await this.learner.instruction(`Student goes to ${examLOName}`, async (learner) => {
            await studentGoesToLODetailsPage(learner, topicName, examLOName);
            await studentStartExamLOFromInstructionScreen(learner);
        });

        await this.learner.instruction(`Student submits ${examLOName}`, async (learner) => {
            await studentSubmitExamLO(learner, scenario, examLOName);
        });

        await this.learner.instruction('student taps on next button', async (learner) => {
            await learner.flutterDriver?.waitFor(
                new ByValueKey(SyllabusLearnerKeys.quiz_finished_screen(examLOName))
            );
            await learner.flutterDriver?.tap(new ByValueKey(SyllabusLearnerKeys.next_button));
        });

        if (!examLO.manualGrading) {
            await this.learner.instruction(
                'student taps on view answer keys button',
                async (learner) => {
                    await learner.flutterDriver?.tap(
                        new ByValueKey(SyllabusLearnerKeys.viewAnswerKeyButton)
                    );
                }
            );
            await this.learner.instruction(`Student taps on back button`, async (learner) => {
                await learner.flutterDriver!.tap(new ByValueKey(SyllabusLearnerKeys.back_button));
            });
        } else {
            await this.learner.instruction(`Student taps on back button`, async (learner) => {
                await learner.flutterDriver!.tap(
                    new ByValueKey(SyllabusLearnerKeys.back_to_list_text)
                );
            });
        }
    }
});
