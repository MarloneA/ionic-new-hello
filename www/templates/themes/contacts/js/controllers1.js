// Controller of defaultUserInterface.
appControllers.controller('contactsCtrl', function(APIBASE, APIBASE_V1, $mdDialog, $mdBottomSheet, $mdToast, $mdDialog, $firebaseArray, $firebaseObject, $scope, $rootScope, $timeout, $http, $filter, $q, $interval, $state, $stateParams, $ionicHistory, FileUploader) {


        var FBExpensesref = firebase.database().ref().child('expenses'+company_id);
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
        var expID;

        $scope.dateValue = new Date();
        $scope.timeValue = new Date();
        $scope.datetimeValue = new Date();
    
        $scope.go = function() {
            //alert($scope.datetimeValue)
            //window.open("https://github.com/katemihalikova/ion-datetime-picker", "_blank");
        };





        //get_expense_items

        var expenseID = 0;
        $scope.expID = function(expID){
            expenseID=expID;
            console('expenseID: '+expenseID);
        } 

        $http({
            url: APIBASE_V1+'get_expense_items',
            method: "GET",
            //data: purchaseParams,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function(resp) {
            console.log('get_expense_items');
            console.log(JSON.stringify(resp.data));
            $scope.expenseTypes = resp.data;
            expenseTypesIDs = resp.data;

        }, function(resp) { // optional
            console.log('response');
        });




        $scope.expenseCostwarning = '';

        var expenseCost;

        $scope.validateForm = function(formID,value) {

            if((formID==2)&&(value!=='')){
                $scope.expenseCostwarning = '';
                expenseCost = value;
                console.log('notEmpty_$scope.expenseCost');
            }

        }


        //Submit Upload Record
        $scope.submitUploadRecord = function(item) {

            console.log($scope.datetimeValue)

            var submitRecord = true;
            $scope.expenseCostwarning = '';

            if (!expenseCost) {
                $scope.expenseCostwarning = 'blank';
                submitRecord = false;
                console.log('$scope.expenseCost');
            }

            if (submitRecord === true) {
                //Post Data using endpoint
                //alert('post')

                console.log(theDateToday);
                
                var theDayExpesesRef = FBExpensesref.child(theDateToday);
                expensesRef = $firebaseArray(theDayExpesesRef);
                theExpense = {
                    'time': theTime,
                    //'itemTitle': $scope.expenseName,
                    'itemID': 1,
                    'itemType': expenseType,
                    'itemDesc': expenseDesc,
                    'itemCost': Number(expenseCost),
                    'ts': theTimeStamp
                }
                dbExpensesData.push(theExpense);

                console.log('dbExpensesData');
                console.log(dbExpensesData);

                for (var i = 0; i < dbExpensesData.length; i++) {
                    expensesRef.$add(dbExpensesData[i]);
                }
                dbExpensesData = [];

                //Post an expense item

                var theDate = "{date (" + d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + ")}";
            
                for (var i = 0; i < expenseTypesIDs.length; i++) {
                    if(expenseType===expenseTypesIDs[i]['alias']){
                        expID = expenseTypesIDs[i]['id'];
                    }
                }

                var imgURL = "http://www.grass2grace.co.ke/pwc_app/uploads/"

                console.log('filenamefilename_____filenamefilename');
                console.log(filename);

                var postExpenseParams = {
                        "expense_account_id":expenseDesc,
                        "transaction_reference": expID,
                        "transaction_date": theDate.toString(),
                        "expense_amount": expenseCost,
                        "uploads": [imgURL+""+filename],
                        "items": [{
                            "id": expID,
                            "cost_price": expenseCost
                        }]
                };

                console.log('postExpenseParams');
                console.log(JSON.stringify(postExpenseParams));
                setTimeout(function() {
                    $http({
                        url: APIBASE_V1 + 'post_expense',
                        method: "POST",
                        data: postExpenseParams,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).then(function(response) {
                        console.log(response);
                    }, function(response) { // optional
                        //xhrErrorTracking.response();
                        //xhrErrorTracking.responseError();
                        console.log('responseresponseresponseresponseresponseresponseresponseresponseresponseresponseresponseresponseresponseresponseresponseresponse');
                    });
                }, 1000);

                //End Post an expense item

                $scope.showAlertDialog($scope.$event);

                $scope.expenseCost = "";
                $scope.expenseDesc = "";
                $scope.showFiles = false;

                $timeout(function() {
                    $scope.expenseType = 0;
                }, 1000);


                console.log('clearresponseclearresponseclearresponse');

                $scope.expenseTypewarning = '';
                $scope.expenseNamewarning = '';
                $scope.expenseCostwarning = '';
                $scope.expenseDescwarning = '';
                $scope.uploadDescwarning = '';


                submitRecord = false;
                uploadComplete = false;
                pictureTaken = false;


                (function($){
                    $('.expenses input').val("");
                })(jQuery)
            }
        }









    //$scope.searchStockItem = '';
    //Default value of dialog.
    $scope.dialogResult = "";
    //Default value of Selection.
    $scope.mdSelectValue = "0";
    //Default value of switch.
    $scope.switchData = {
        switchNormal: "Please change me",
        switchNoInk: false
    };
    //Default value of radio data.
    $scope.radioData = {fruit: 0};

    // For show show List Bottom Sheet.
    $scope.showListBottomSheet = function ($event) {
        $mdBottomSheet.show({
            templateUrl: 'ui-list-bottom-sheet-template',
            targetEvent: $event,
            scope: $scope.$new(false),
        });
    };// End of showListBottomSheet.

    // For show Grid Bottom Sheet.
    $scope.showGridBottomSheet = function ($event) {
        $mdBottomSheet.show({
            templateUrl: 'ui-grid-bottom-sheet-template',
            targetEvent: $event,
            scope: $scope.$new(false),
        });
    };// End of showGridBottomSheet.

    // For show toast.
    $scope.showToast = function (toastPosition) {
        $mdToast.show({
            controller: 'toastController',
            templateUrl: 'toast.html',
            hideDelay: 800,
            position: toastPosition,
            locals: {
                displayOption: {
                    title: 'Action Toast'
                }
            }
        });
    }; // End of showToast.

    // For close list bottom sheet.
    $scope.closeListBottomSheet = function () {
        $mdBottomSheet.hide();
    } // End of closeListBottomSheet.

    // For do something in this function.
    $scope.doSomeThing = function () {
        // you can put any function here.
    }// Emd of doSomeThing


    //function DialogControllerCustom($scope, $mdDialog) {

      $scope.cancel = function() {
        $mdDialog.hide();
      }
      $scope.ok = function() {
        $mdDialog.hide();
      }
    //}

        function myDialogControllerr($scope, $mdDialog, parent) {
            $scope.parent = parent;
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
        }
        $scope.showConfirmDialog = function($event) {
            $mdDialog.show({
                controller: myDialogControllerr,
                template:
                    // '<md-dialog md-theme="mytheme">' +
                    // '  <md-dialog-content>'+
                    //      '<div class="test"><p>TOTAL: KES {{parent.totalSaleAmount}}</p></div>'+
                    //         '<div class="md-actions" layout="row"><a class="md-primary-color dialog-action-btn ng-binding" ng-click="cancel()" tabindex="0">Close</a><a class="md-primary-color dialog-action-btn ng-binding" ng-click="ok()" tabindex="0">Confirm</a></div>'
                    //      +
                    //   '  </md-dialog-content>' +
                    //   '</md-dialog>',

                    '<md-dialog md-theme="mytheme">' +
                    '  <md-dialog-content>'+
                    '<div class="confirmsale bottom-0"><h1 class="uppercase ultrabold bottom-0">CONFIRM SALE</h1><h6 class="uppercase ultrabold bottom-0">ENTER CASH RECEIVED</h6><div class="page-login-field"><input ng-model="parent.cashReceived" type="text" placeholder="KES"> <em>(required)</em></div><h6 class="uppercase ultrabold bottom-0">TOTAL: KES {{parent.totalSaleAmount}}</h6><h6 class="uppercase ultrabold bottom-0">CHANGE: KES {{(parent.cashReceived-parent.totalSaleAmount > 0) ? parent.cashReceived-parent.totalSaleAmount:"0";}}</h6><div class="sale_item_list" style=""><table class="table-borders-light" width="100%"><tbody width="100%"><tr width="100%"><th class="bg-night-dark" width="50%">Items</th><th class="bg-night-dark" width="20%">Price</th><th class="bg-night-dark" width="10%">Qty</th><th class="bg-night-dark" width="20%">Total</th></tr><tr ng-repeat="item in parent.clientReceipt"><td class="bg-night-light">{{item.title}}</td><td class="bg-night-light">{{item.amount}}</td><td class="bg-night-light">{{item.quantity}}</td><td class="bg-night-light">{{item.quantity*item.amount}}</td></tr></tbody></table></div><a href="#" ng-click="parent.confirmCheckOut(); cancel();" class="md-raised md-button md-default-theme">CONFIRM</a></div>'
                      + '  </md-dialog-content>' +
                      '</md-dialog>',

                targetEvent: $event,
                locals: {
                    parent: $scope
                }
            });
        }

    // For show alert Dialog.
    $scope.showAlertDialog = function ($event) {
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Good!",
                    content: "Record has been successfully submitted",
                    ok: "Confirm"
                }
            }
        }).then(function () {
            $scope.dialogResult = "You choose Confirm!"
        });
    }// End showAlertDialog.

}); // End of defaultUserInterface controller.