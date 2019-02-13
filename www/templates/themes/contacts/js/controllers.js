// Controller of defaultUserInterface.
appControllers.controller('contactsCtrl', function(APIBASE, APIBASE_V1, $mdDialog, $mdBottomSheet, $mdToast, $mdDialog, $firebaseArray, $firebaseObject, $scope, $rootScope, $timeout, $http, $filter, $q, $interval, $state, $stateParams, $ionicHistory, FileUploader) {
        var company_id = localStorage.getItem('company_id');
        var FBExpensesref = firebase.database().ref().child('income'+company_id);
        var FBrefDisbursements = firebase.database().ref().child('dailyDisbursements');
        var FBrefPayments = firebase.database().ref().child('dailyPayments');
        var expensesRef;
        var theExpense;
        var dbExpensesData = [];
        var d = new Date();
        var theDateToday = (d.getDate() + 0) + "-" + (d.getMonth() + 1) + "-" + (d.getFullYear());

        var theTime = d.getHours() + ":" + d.getMinutes();
        var theTimeStamp = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds())-(1000*60*60*3); //add month -(minus) 1
        var pictureTaken = false;
        var expenseTypesIDs;
        var compTypesIDs;
        var expID;
        var compID;

        //For the validation of forms

        $scope.contactNameWarning = '';
        $scope.contactEmailWarning = '';
        $scope.contactPhoneWarning = '';
        $scope.contactMessageWarning = '';

        // $scope.expenseTypewarning = 'blank';
        // $scope.expenseNamewarning = 'blank';
        // $scope.expenseCostwarning = 'blank';
        // $scope.expenseDescwarning = 'blank';

        var contactName, contactEmail, contactPhone, contactMessage;

        $scope.validateForm = function(formID,value) {

            if((formID==1)&&(value!=='')){
                $scope.contactNameWarning = '';
                contactName = value;
                console.log('notEmpty_$scope.expenseType');
            }

            if((formID==2)&&(value!=='')){
                $scope.contactEmailWarning = '';
                contactEmail = value;
                console.log('notEmpty_$scope.compType');
            }

            if((formID==3)&&(value!=='')){
                $scope.contactPhoneWarning = '';
                contactPhone = value;
                console.log('notEmpty_$scope.expenseCost');
            }

            if((formID==4)&&(value!=='')){
                $scope.contactMessageWarning = '';
                contactMessage = value;
                console.log('notEmpty_$scope.expenseDesc');
            }

        }


        //Submit Upload Record
        $scope.submitContactForm = function(item) {
            var submitRecord = true;
            $scope.contactNameWarning = '';
            $scope.contactEmailWarning = '';
            $scope.contactPhoneWarning = '';
            $scope.contactMessageWarning = '';

            if (!contactName) {
                $scope.contactNameWarning = 'blank';
                submitRecord = false;
                console.log('$scope.contactNameWarning');
            }
            if (!contactEmail) {
                $scope.contactEmailWarning = 'blank';
                submitRecord = false;
                console.log('$scope.contactEmailWarning');
            }
            if (!contactPhone) {
                $scope.contactPhoneWarning = 'blank';
                submitRecord = false;
                console.log('$scope.contactPhoneWarning');
            }
            if (!contactMessage) {
                $scope.contactMessageWarning = 'blank';
                submitRecord = false;
                console.log('$scope.contactMessageWarning');
            }

            if (submitRecord === true) {

                d = new Date();
                theTime = d.getHours() + ":" + d.getMinutes();                
                theTimeStamp = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds())-(1000*60*60*3); //add month -(minus) 1

                console.log("$scope.contactName: "+$scope.contactName);

                $scope.contactName = "";
                $scope.contactEmail = "";
                $scope.contactPhone = "";
                $scope.contactMessage = "";

                (function($){
                    $('.contact_form input').val("");
                    $('.contact_form textarea').val("");
                })(jQuery)

                console.log("$scope.contactName: "+$scope.contactName);

                function DialogController($scope, $mdDialog, parent) {
                    $scope.parent = parent;
                    $scope.cancel = function() {
                        $mdDialog.cancel();
                    };
                }
                // For show alert Dialog.
                var showformAlertDialog = function ($event) {
                    $mdDialog.show({
                        controller: 'DialogController',
                        templateUrl: 'confirm-dialog.html',
                        targetEvent: $event,
                        locals: {
                            displayOption: {
                                title: "Good!",
                                content: "Your message has been sent. We will get back to you very soon!",
                                ok: "Confirm"
                            }
                        }
                    }).then(function () {
                        $scope.dialogResult = "You choose Confirm!"
                    });
                }// End showAlertDialog.

                showformAlertDialog($scope.$event)

            }
        }

}); // End of defaultUserInterface controller.