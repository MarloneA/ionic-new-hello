// Controller of menu toggle.
// Learn more about Sidenav directive of angular material
// https://material.angularjs.org/latest/#/demo/material.components.sidenav
appControllers.controller('menuCtrl', function (APIBASE_V1, $scope, $rootScope, $timeout, $interval, $mdUtil, $mdSidenav, $log, $ionicHistory, $state, $ionicPlatform, $mdDialog, $mdBottomSheet, $mdMenu, $mdSelect, $firebaseArray, $firebaseObject, $http) {
    
    $scope.toggleLeft = buildToggler('left');

    var userTypeRef = firebase.database().ref().child('userType');

    var userType = $firebaseArray(userTypeRef);
    var company_id = localStorage.getItem("company_id");

        var k = 0;
        $interval(function() {
            $scope.currState = $state;
            var currentState = $state.current.url; 
            // console.log('sssssstate');
            // console.log(currentState);


            if(currentState=='/menuDashboard'||currentState=='/expense'||currentState=='/pricing'||currentState=='/dashboard'||currentState=='/onlineCourse'||currentState=='/donorExpenseReports'||currentState=='/dashboardv2'){
                console.log('k: '+k);
                if(k<1){
                    (function($){
                        //Make sure week tabs are loaded before running currentWkChart()
                        var showWksTabChart = setInterval(function(){
                            var showWksTab = $('body md-card.recent');
                            console.log("GoTabsRecentAAAA: "+showWksTab.length);

                            if(showWksTab.length>1){

                                console.log("GoTabsRecent: "+showWksTab.length);

                                setTimeout(function() {
                                    var exeCount = 0;

                                    $('body md-card.recent [data-toggle-box]').unbind('click');

                                    $('body md-card.recent [data-toggle-box]').on('click', function() {
                                        
                                        $(this).parent().toggleClass("active");
                                        var toggle_box = $(this).data('toggle-box');
                                        
                                        console.error('toggleclicked: '+toggle_box+' : '+'exeCount: '+exeCount);
                                        if(exeCount<1){
                                            if ($('body md-card.recent #' + toggle_box).is(":visible")) {
                                                $('body md-card.recent #' + toggle_box).slideUp(250);
                                                console.log('isvisible');
                                            } else {
                                                $("body md-card.recent [id^='box']").slideUp(250);
                                                $('body md-card.recent #' + toggle_box).slideDown(250);
                                                console.log('notvisible');
                                            }
                                        }
                                        exeCount++;
                                        //setTimeout(function() {
                                            exeCount = 0;
                                        //}, 1000);

                                    });
                                }, 2000);

                                clearInterval(showWksTabChart);
                            }
                        },1000);
                    })(jQuery); 
                    k++; 
                }
            }else{
                k = 0;
            }
        }, 2000);


    userTypeRef.orderByKey().on("value", function(snapshot) {
            userType = snapshot.val();
            console.log('userTypeuserTypeuserType: '+userType);
            //var userType = localStorage.getItem("userType");

            $interval(function(){
                if(userType == 'for_profit'){
                    $scope.userType = true;
                }else{
                    $scope.userType = false;
                }
            },1000);
    });

    $rootScope.openTabs = function(){

            (function($){
                //Make sure week tabs are loaded before running currentWkChart()
                var showWksTabChart = setInterval(function(){
                    var showWksTab = $('body md-card.recent');
                    console.log("GoTabsRecentAAAA: "+showWksTab.length);

                    if(showWksTab.length>1){

                        console.log("GoTabsRecent: "+showWksTab.length);

                        setTimeout(function() {
                            var exeCount = 0;

                            $('body md-card.recent [data-toggle-box]').unbind('click');

                            $('body md-card.recent [data-toggle-box]').on('click', function() {
                                
                                $(this).parent().toggleClass("active");
                                var toggle_box = $(this).data('toggle-box');
                                
                                console.error('toggleclicked: '+toggle_box+' : '+'exeCount: '+exeCount);
                                if(exeCount<1){
                                    if ($('body md-card.recent #' + toggle_box).is(":visible")) {
                                        $('body md-card.recent #' + toggle_box).slideUp(250);
                                        console.log('isvisible');
                                    } else {
                                        $("body md-card.recent [id^='box']").slideUp(250);
                                        $('body md-card.recent #' + toggle_box).slideDown(250);
                                        console.log('notvisible');
                                    }
                                }
                                exeCount++;
                                //setTimeout(function() {
                                    exeCount = 0;
                                //}, 1000);

                            });
                        }, 2000);

                        clearInterval(showWksTabChart);
                    }
                },1000);
            })(jQuery);        
    };


    // buildToggler is for create menu toggle.
    // Parameter :  
    // navID = id of navigation bar.
    function buildToggler(navID) {
        var debounceFn = $mdUtil.debounce(function () {
            $mdSidenav(navID).toggle();
        }, 0);
        return debounceFn;
    };// End buildToggler.

    // navigateTo is for navigate to other page 
    // by using targetPage to be the destination state. 
    // Parameter :  
    // stateNames = target state to go
    $scope.navigateTo = function (stateName) {
        $timeout(function () {
            $mdSidenav('left').close();
            if ($ionicHistory.currentStateName() != stateName) {
                $ionicHistory.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true
                });
                $state.go(stateName);
            }
        }, ($scope.isAndroid == false ? 300 : 0));
    };// End navigateTo.

    //closeSideNav is for close side navigation
    //It will use with event on-swipe-left="closeSideNav()" on-drag-left="closeSideNav()"
    //When user swipe or drag md-sidenav to left side
    $scope.closeSideNav = function(){
        $mdSidenav('left').close();
    };
    //End closeSideNav

    //  $ionicPlatform.registerBackButtonAction(callback, priority, [actionId])
    //
    //     Register a hardware back button action. Only one action will execute
    //  when the back button is clicked, so this method decides which of
    //  the registered back button actions has the highest priority.
    //
    //     For example, if an actionsheet is showing, the back button should
    //  close the actionsheet, but it should not also go back a page view
    //  or close a modal which may be open.
    //
    //  The priorities for the existing back button hooks are as follows:
    //  Return to previous view = 100
    //  Close side menu         = 150
    //  Dismiss modal           = 200
    //  Close action sheet      = 300
    //  Dismiss popup           = 400
    //  Dismiss loading overlay = 500
    //
    //  Your back button action will override each of the above actions
    //  whose priority is less than the priority you provide. For example,
    //  an action assigned a priority of 101 will override the ‘return to
    //  previous view’ action, but not any of the other actions.
    //
    //  Learn more at : http://ionicframework.com/docs/api/service/$ionicPlatform/#registerBackButtonAction

    $ionicPlatform.registerBackButtonAction(function(){

        if($mdSidenav("left").isOpen()){
            //If side navigation is open it will close and then return
            $mdSidenav('left').close();
        }
        else if(jQuery('md-bottom-sheet').length > 0 ) {
            //If bottom sheet is open it will close and then return
            $mdBottomSheet.cancel();
        }
        else if(jQuery('[id^=dialog]').length > 0 ){
            //If popup dialog is open it will close and then return
            $mdDialog.cancel();
        }
        else if(jQuery('md-menu-content').length > 0 ){
            //If md-menu is open it will close and then return
            $mdMenu.hide();
        }
        else if(jQuery('md-select-menu').length > 0 ){
            //If md-select is open it will close and then return
            $mdSelect.hide();
        }

        else{

            // If control :
            // side navigation,
            // bottom sheet,
            // popup dialog,
            // md-menu,
            // md-select
            // is not opening, It will show $mdDialog to ask for
            // Confirmation to close the application or go to the view of lasted state.

            // Check for the current state that not have previous state.
            // It will show $mdDialog to ask for Confirmation to close the application.

            if($ionicHistory.backView() == null){

                //Check is popup dialog is not open.
                if(jQuery('[id^=dialog]').length == 0 ) {

                    // mdDialog for show $mdDialog to ask for
                    // Confirmation to close the application.

                    $mdDialog.show({
                        controller: 'DialogController',
                        templateUrl: 'confirm-dialog.html',
                        targetEvent: null,
                        locals: {
                            displayOption: {
                                title: "Confirmation",
                                content: "Do you want to close the application?",
                                ok: "Confirm",
                                cancel: "Cancel"
                            }
                        }
                    }).then(function () {
                        //If user tap Confirm at the popup dialog.
                        //Application will close.
                        ionic.Platform.exitApp();
                    }, function () {
                        // For cancel button actions.
                    }); //End mdDialog
                }
            }
            else{
                //Go to the view of lasted state.
                $ionicHistory.goBack();
            }
        }

    },100);
    //End of $ionicPlatform.registerBackButtonAction
        

}); // End of menu toggle controller.