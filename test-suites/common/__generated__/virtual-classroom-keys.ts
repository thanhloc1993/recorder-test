export class VirtualClassroomKeys {
    static coursesScreen = `Courses Screen`;

    static courseDetailsScreen = `Course Details Screen`;

    static courseParticipantScreen = `Course Participant Screen`;

    static viewMaterialScreen = `View Material Screen`;

    static liveLessonScreen = `Live Lesson Screen`;

    static liveStreamScreen = `Live Stream Screen`;

    static noCourseResultScreen = `No Course Result Screen`;

    static disconnectingScreenLiveLesson = `Disconnecting Screen Live Lesson`;

    static liveLessonScreenVisible = (index: number): string =>
        `Live Lesson Screen Visible ${index}`;

    static courseScrollView = `Course Scroll View`;

    static liveLessonActionBarView = `Live Lesson Action Bar View`;

    static liveLessonWhiteBoardView = `Live Lesson White Board View`;

    static liveLessonVideoView = ([videoId = ``]): string => `Live Lesson Video View ${videoId}`;

    static liveLessonSharedScreenView = `Live Lesson Shared Screen View`;

    static liveLessonListCameraView = `Live Lesson List Camera View`;

    static liveLessonCameraViewStatus = `Live Lesson Camera View`;

    static liveLessonDisconnectCameraView = `Live Lesson Disconnect Camera View`;

    static liveLessonNoneCameraView = (userId: string): string =>
        `Live Lesson None Camera View ${userId}`;

    static videoView = `Video View`;

    static liveLessonSpeakerStatus = (userId: string, active: boolean): string =>
        `Live Lesson Speaker Status ${userId} ${active}`;

    static course = (name: string): string => `${name} Course`;

    static courseList = (length: number): string => `Course list ${length}`;

    static courseItem = `Course Item`;

    static courseAvatarKey = (avatar: string): string => `Course Avatar ${avatar}`;

    static liveLessonItem = (id: string, name: string): string => `${id} ${name} Live Lesson Item`;

    static listLessonsName = (names: string): string => `List Lesson Name ${names}`;

    static listActiveLesson = (names: string): string => `List Active Lessons ${names}`;

    static listCompletedLesson = (names: string): string => `List Completed Lesson ${names}`;

    static liveLabelLiveLessonItem = (lessonId: string, lessonName: string): string =>
        `Live Label Live Lesson Item ${lessonId} ${lessonName}`;

    static liveLessonsList = `Live lesson list`;

    static startTimeLiveLesson = `Start Time Live Lesson `;

    static startTimeToEndTimeLiveLesson = `Start Time To End Time Live Lesson `;

    static lessonActiveTab = `Lesson Active Tab`;

    static lessonCompletedTab = `Lesson Completed Tab`;

    static studentTab = `Student Tab`;

    static lessonTab = `Lesson Tab`;

    static materialTab = `Material Tab`;

    static liveLessonChatTab = `Live Lesson Chat Tab`;

    static liveLessonPublicChatTab = `Live Lesson Public Chat Tab`;

    static liveLessonPrivateChatTab = `Live Lesson Private Chat Tab`;

    static liveLessonPublicChatView = `Live Lesson Public Chat View`;

    static liveLessonDetailPrivateChatView = `Live Lesson Detail Private Chat View`;

    static liveLessonAllParticipantsPrivateChatView = `Live Lesson All Participants Private Chat View`;

    static liveLessonUserTab = `Live Lesson User Tab`;

    static liveLessonRightDrawer = (visible: boolean): string =>
        `Live Lesson Right Drawer ${visible}`;

    static studentSearchTextField = `Student Search Text Field`;

    static studentSearchButton = `Student Search Button`;

    static startLessonButton = `Start Lesson Button`;

    static endLessonButton = `End Lesson Button`;

    static leaveLessonButton = `Leave Lesson Button`;

    static leaveForNowButton = `Leave room button`;

    static endLessonForAllButton = `End Lesson For All Button`;

    static endNowButton = `End Now Button`;

    static closeAnnotationButton = `Live Lesson White Board Close Annotation Button`;

    static annotationButton = `Live Lesson Annotation Button`;

    static messageLessonButton = `Message Lesson Button`;

    static closeEndLiveLessonDialogButton = `Close End Live Lesson Dialog Button`;

    static cannotOverlapShareScreenDialogOkButton = `Cannot Overlap Share Screen Dialog Ok Button`;

    static microButtonLiveLessonInteraction = (enable: boolean): string =>
        `Micro Button Live Lesson Interaction ${enable}`;

    static cameraButtonLiveLessonInteraction = (enable: boolean): string =>
        `Camera Button Live Lesson Interaction ${enable}`;

    static microButtonLiveLessonActive = (active: boolean): string =>
        `Micro Button Live Lesson Active ${active}`;

    static cameraButtonLiveLessonActive = (active: boolean): string =>
        `Camera Button Live Lesson Active ${active}`;

    static shareScreenButtonInteraction = (interaction: boolean): string =>
        `Share Screen Button Interaction ${interaction ?? false}`;

    static shareScreenButtonActive = (active: boolean): string =>
        `Share Screen Button Active ${active ?? false}`;

    static shareMaterialButtonActive = (active: boolean): string =>
        `Share Material Button Active ${active ?? false}`;

    static userButtonInteraction = (interaction: boolean): string =>
        `User Button Interaction ${interaction ?? false}`;

    static shareMaterialButtonInteraction = (interaction: boolean): string =>
        `Share Material Button Interaction ${interaction ?? false}`;

    static liveLessonOnPrevActionBar = `Live Lesson On Prev Action Bar`;

    static liveLessonOnNextActionBar = `Live Lesson On Next Action Bar`;

    static liveLessonPageActionBar = (page: number): string =>
        `Live Lesson Page Action Bar ${page}`;

    static stopShareMaterialButton = `Stop Share Material Button`;

    static hideListStudentButton = `Hide List Student Button`;

    static raiseHandButton = ([raiseHand = false]): string => `Raise Hand Button ${raiseHand}`;

    static enableWhiteboardPermissionDialog = `Enable Whiteboard Permission Dialog`;

    static enableWhiteboardPermissionDialogCloseButton = `Enable Whiteboard Permission Dialog Close Button`;

    static muteAllAudioButton = `Mute All Audio Button`;

    static muteAllCameraButton = `Mute All Camera Button`;

    static handOffButton = `Hand Off Button`;

    static joinButton = (enable: boolean, isFirstTeacher: boolean): string =>
        `Join Button ${enable} - Is First Teacher ${isFirstTeacher}`;

    static materialButton = (lessonId: string): string => `Material Button ${lessonId}`;

    static joinLiveLessonButton = (
        lessonId: string,
        lessonName: string,
        canJoin: boolean
    ): string => `Join live lesson - ${lessonId ?? ``} ${lessonName ?? ``} button ${canJoin}`;

    static raiseHandNotificationButton = ([hasRaiseHand = false]): string =>
        `Raise Hand Notification Button ${hasRaiseHand}`;

    static liveLessonStopShareScreenOptionButton = `Live Lesson Stop Share Screen Option Button`;

    static liveLessonScheduleCalendarPreviousButton = `Live Lesson Schedule Calendar Previous Button`;

    static liveLessonScheduleCalendarNextButton = `Live Lesson Schedule Calendar Next Button`;

    static closeButton = `Close Button`;

    static acceptRequestButton = `Accept Request Button`;

    static declineRequestButton = `Decline Request Button`;

    static toReviewButton = `To Review Button`;

    static pageControl = `Page Control`;

    static liveLessonsEmpty = `Live lesson empty`;

    static emptyCourseParticipantList = `Empty Course Participant List`;

    static student = (studentId: string): string => `Student ${studentId}`;

    static studentName = `Student Name`;

    static notLoggedInTagWithUserName = (username: string): string => `Not Logged In ${username}`;

    static studentAvatarWidget = (avatarUrl: string): string => `Student Avatar Url ${avatarUrl}`;

    static snackBar = `Snack Bar`;

    static annotationBar = `Live Lesson Annotation Bar`;

    static liveLessonScreenShareBar = `Live Lesson Screen Bar View`;

    static waitingRoomBanner = `Waiting Room Banner`;

    static studentList = `Student List`;

    static materialList = (length: number): string => `Material List ${length}`;

    static mediaItem = (mediaName: string, isAnnotated: boolean): string =>
        `Media Item ${mediaName} ${isAnnotated}`;

    static materialItem = (name: string): string => `${name} material item`;

    static lessonPage = `Lesson Page`;

    static schedulePage = `Schedule page`;

    static scheduleTitlePage = `Schedule title page`;

    static endLiveLessonDialog = `End Live Lesson Dialog`;

    static listMaterialDialog = `List Material Dialog`;

    static cannotOverlapShareScreenDialog = `Cannot Overlap Share Screen Dialog`;

    static endLessonDialog = `End Lesson Dialog`;

    static dialogJoinLiveLessonLoading = `Live lesson loading`;

    static requestMicroDialog = `Request Micro Dialog`;

    static requestVideoDialog = `Request Video Dialog`;

    static liveLessonConversationUnreadBadge = `Live Lesson Conversation Unread Badge`;

    static liveLessonScheduleCalendar = `Live Lesson Schedule Calendar`;

    static startDayLiveLesson = `Start Day Live Lesson `;

    static normalDate = (day: number, month: number): string => `Normal Date ${day} ${month}`;

    static liveLessonWhiteBoardIndex = (index: number): string =>
        `Live Lesson White Board Index ${index}`;

    static waitingTeacherJoin = `Waiting Teacher Join`;

    static attachmentPdfKey = (name: string): string => `Attachment PDF with ${name}`;

    static searchCourseInput = `Search Course Input`;

    static pinnedUserView = (userId: string, active: boolean): string =>
        `Pinned User View ${userId} ${active}`;

    static spotlightUserView = (userId: string, active: boolean): string =>
        `Spotlight User View ${userId} ${active}`;

    static unpinButton = `Unpin Button`;

    static toolPicker = `Live Lesson White Board Tool Picker`;

    static selectorTool = `Live Lesson White Board Selector Tool`;

    static laserPointerTool = `Live Lesson White Board Laser Pointer Tool`;

    static textTool = `Live Lesson White Board Text Tool`;

    static pencilTool = `Live Lesson White Board Pencil Tool`;

    static rectangleTool = `Live Lesson White Board Rectangle Tool`;

    static ellipseTool = `Live Lesson White Board Ellipse Tool`;

    static straightTool = `Live Lesson White Board Straight Tool`;

    static handTool = `Live Lesson White Board Hand Tool`;

    static eraserTool = `Live Lesson White Board Eraser Tool`;

    static cameraDisplay = (userId: string, active: boolean): string =>
        `Camera Display ${userId} ${active}`;

    static cameraDisplayOptionButton = (userId: string): string =>
        `Camera Display Option Button ${userId}`;

    static cameraDisplayOptionsMenu = (options: string[]): string =>
        `Camera Display Option Menu ${options.join(`-`)}`;

    static cameraDisplayOptionItem = (text: string, enable: boolean): string =>
        `Camera Display Option Item ${text} ${enable}`;

    static cameraDisplayContainerKey = (userId: string, isSpotlighting: boolean): string =>
        `Camera Display Container Key ${userId} ${isSpotlighting}`;

    static spotlightIconKey = (userId: string): string => `Spotlight Icon Key ${userId}`;

    static previewAnnotatedPdfScreen = `Preview Annotated Pdf Screen`;

    static previewButtonKey = (active: boolean): string => `Preview Button Key ${active}`;

    static previewThumbnailList = `Preview Thumbnail List`;

    static itemPreviewThumbnail = (index: number, selected: boolean): string =>
        `Item Preview Thumbnail ${index} ${selected}`;

    static multiWhiteboardAnnotationButton = (hasStudentEnablesWhiteboard: boolean): string =>
        `Multi Whiteboard Annotation Button ${hasStudentEnablesWhiteboard}`;

    static userRowInUnjoinedSection = (userId: string): string =>
        `User Row In Unjoined Section ${userId}`;

    static startRecordButton = `Start Record Button`;

    static stopRecordButtonInteraction = (enable: boolean): string =>
        `Stop Record Button Interaction ${enable}`;

    static recordIcon = `Record Icon`;

    static inProgressRecordingSnackBar = `In Progress Recording Snack Bar`;

    static stopRecordingSnackBar = `Stop Recording Snack Bar`;

    static confirmRecordingDialog = `Confirm Recording Dialog`;

    static cancelConfirmRecordingDialogButton = `Cancel Confirm Recording Dialog Button`;

    static startConfirmRecordingDialogButton = `Start Confirm Recording Dialog Button`;

    static annotationBarStrokePathKey = (size: number, selected: boolean): string =>
        `Live Lesson Annotation Bar Stroke Path size ${size} selected ${selected}`;

    static annotationBarColorPickerColorIndexKey = (
        colorIndex: number,
        selected: boolean
    ): string =>
        `Live Lesson Annotation Bar Color Picker Color Index ${colorIndex} selected ${selected}`;

    static studentLength = (length: number): string => `Student Length ${length}`;

    static teacherLength = (length: number): string => `Teacher Length ${length}`;

    static conversationItem = (userId: string): string =>
        `Virtual Classroom Conversation Item ${userId}`;

    static popBackButton = `Pop Back Button`;

    static joinedStudent = (count: number): string => `Joined Student List ${count}`;

    static unJoinStudent = (count: number): string => `UnJoin Student List ${count}`;

    static teacherList = (count: number): string => `Teacher List ${count}`;

    static divider = (position: number): string => `Divider ${position}`;

    static pollButton = (active: boolean): string => `Poll Button ${active}`;

    static submitPollButton = (active: boolean): string => `Submit Poll Button ${active}`;
}
