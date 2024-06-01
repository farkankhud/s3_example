sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'project1/test/integration/FirstJourney',
		'project1/test/integration/pages/StudentSetList',
		'project1/test/integration/pages/StudentSetObjectPage'
    ],
    function(JourneyRunner, opaJourney, StudentSetList, StudentSetObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('project1') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheStudentSetList: StudentSetList,
					onTheStudentSetObjectPage: StudentSetObjectPage
                }
            },
            opaJourney.run
        );
    }
);