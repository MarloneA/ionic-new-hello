// Controller of defaultUserInterface.
appControllers.controller('recordIncomeCtrl', function(APIBASE, APIBASE_V1, $mdDialog, $mdBottomSheet, $mdToast, $mdDialog, $firebaseArray, $firebaseObject, $scope, $rootScope, $timeout, $http, $filter, $q, $interval, $state, $stateParams, $ionicHistory, FileUploader) {
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
        var chartID;
        var compID;
        var incomeSourceID;
        var thecameraImgUrl;
        //get_expense_items

        var expenseID = 0;
        $scope.expID = function(expID){
            expenseID=expID;
            console('expenseID: '+expenseID);
        } 

        console.error(APIBASE_V1);


        //var endPointUrl = 'https://portal.epesibooks.com/acc/api_v1/'+'get_sale_items?company_id='+company_id;

        var company_id = localStorage.getItem('company_id');

        console.error('company____id');
        console.error(company_id);

        //get_income_sources
        $http({
            url: APIBASE_V1+'get_fund_sources?company_id='+company_id,
            //url: APIBASE_V1+'get_income_sources',
            //url: 'http://4a09bc05.ngrok.io/pport/epesi/acc/api_v1/get_income_sources/'+'get_fund_sources?company_id='+company_id,
            method: "GET",
            //data: purchaseParams,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function(resp) {
            console.log('get_fund_sources');
            console.log(resp.data);
            $scope.incomeTypes = resp.data;
            expenseTypesIDs = resp.data;
        }, function(resp) { // optional
            console.log('response');
        });

        //get_components

        $http({
            url: APIBASE_V1+'get_components?company_id='+company_id,
            method: "GET",
            //data: purchaseParams,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function(resp) {
            console.log('get_expense_items');
            console.log(resp.data);
            $scope.incomeComps = resp.data;
            compTypesIDs = resp.data;
        }, function(resp) { // optional
            console.log('response');
        });


        $("#files").change(function() {
            filename = this.files[0].name
            console.log(filename);
        });

        var uploadComplete = false;
        //For the validation of forms
        $scope.expenseTypewarning = '';
        $scope.expenseNamewarning = '';
        $scope.expenseCostwarning = '';
        $scope.expenseDescwarning = '';
        $scope.uploadDescwarning = '';
        // $scope.expenseTypewarning = 'blank';
        // $scope.expenseNamewarning = 'blank';
        // $scope.expenseCostwarning = 'blank';
        // $scope.expenseDescwarning = 'blank';

        var expenseType, compType, expenseCost, expenseDesc;

        $scope.validateForm = function(formID,value) {


            console.log('expID: '+expID);

            if((formID==1)&&(value!=='')){
                $scope.expenseTypewarning = '';
                var respdata = JSON.parse(value);
                expenseType = respdata.title;
                incomeSourceID = respdata.id;
                console.log('notEmpty_$scope.expenseType');
                console.log('IncomeSource');
                console.log(expenseType);
            }

            if((formID==4)&&(value!=='')){
                $scope.compTypewarning = '';
                compType = value;
                console.log('notEmpty_$scope.compType');
            }

            if((formID==2)&&(value!=='')){
                $scope.expenseCostwarning = '';
                expenseCost = value;
                console.log('notEmpty_$scope.expenseCost');
            }

            if((formID==3)&&(value!=='')){
                $scope.expenseDescwarning = '';
                expenseDesc = value;
                console.log('notEmpty_$scope.expenseDesc');
            }

        }
        //Submit Upload Record
        $scope.submitUploadRecord = function(item) {
            var submitRecord = true;
            $scope.expenseTypewarning = '';
            $scope.compTypewarning = '';
            $scope.expenseNamewarning = '';
            $scope.expenseCostwarning = '';
            $scope.expenseDescwarning = '';
            $scope.uploadDescwarning = '';
            if (!expenseType) {
                $scope.expenseTypewarning = 'blank';
                submitRecord = false;
                console.log('$scope.expenseType');
            }
            if (!compType) {
                $scope.compTypewarning = 'blank';
                submitRecord = false;
                console.log('$scope.expenseType');
            }
            // if (!$scope.expenseName) {
            //  $scope.expenseNamewarning = 'blank';
            //  submitRecord = false;
            //  console.log('$scope.expenseName');
            // }
            if (!expenseCost) {
                $scope.expenseCostwarning = 'blank';
                submitRecord = false;
                console.log('$scope.expenseCost');
            }
            if (!expenseDesc) {
                $scope.expenseDescwarning = 'blank';
                submitRecord = false;
                console.log('$scope.expenseDesc');
            }
            if (!uploadComplete && !pictureTaken) {
                $scope.uploadDescwarning = 'blank';
                $scope.showFiles = true;
            }
            if (submitRecord === true && (uploadComplete === true || pictureTaken)) {
                //Post Data using endpoint
                //alert('post')

                d = new Date();
                theTime = d.getHours() + ":" + d.getMinutes();                
                theTimeStamp = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds())-(1000*60*60*3); //add month -(minus) 1

                var theDayExpesesRef = FBExpensesref.child(theDateToday);
                expensesRef = $firebaseArray(theDayExpesesRef);
                // theExpensee = {
                //     'time': theTime,
                //     //'itemTitle': $scope.expenseName,
                //     'itemID': 1,
                //     'itemType': expenseType,
                //     'itemDesc': expenseDesc,
                //     'itemCost': Number(expenseCost),
                //     'ts': theTimeStamp
                // }

                console.log('dbExpensesData');
                console.log(dbExpensesData);



                //Post an expense item

                var theDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
            
                console.error('expenseTypesIDs');
                console.error(expenseTypesIDs);

                //Get Income Types IDs

                console.log('expenseTypeexpense___TypeexpenseTypeexpenseTypeexpenseType');
                console.log(expenseType);

                for (var i = 0; i < expenseTypesIDs.length; i++) {
                    if(expenseType===expenseTypesIDs[i]['title']){
                        expID = expenseTypesIDs[i]['id'];
                        //chartID = compTypesIDs[i]['chart_account_id'];
                    }
                }


                console.log('expID: '+expID);

                //Get Component Types IDs

                console.log('compTypesIDs');
                console.log(compTypesIDs);

                for (var i = 0; i < compTypesIDs.length; i++) {
                    if(compType===compTypesIDs[i]['title']){
                        compID = compTypesIDs[i]['id'];
                    }
                }

                if(typeof thecameraImgUrl=='undefined'){
                    thecameraImgUrl = 'http://www.grass2grace.co.ke/pwc_app/uploads/unnamed.png'
                }

                theExpense = {
                    'time': theTime,
                    'ts': theTimeStamp,
                    'itemTitle': compType,
                    'itemDesc': expenseDesc,
                    'itemID': expID,
                    'itemType': expenseType,
                    'itemCost': Number(expenseCost),
                    'imgUrl':thecameraImgUrl
                }

                dbExpensesData.push(theExpense);

                for (var i = 0; i < dbExpensesData.length; i++) {
                    expensesRef.$add(dbExpensesData[i]);
                }
                dbExpensesData = [];



                var postIncomeParams = {
                        "fund_source_id":incomeSourceID,
                        "component_id":compID,
                        "description":expenseDesc,
                        "transaction_date": theDate.toString(),
                        "amount": expenseCost,
                        //"activity_id": activity_id
                };

                console.log('postIncomeParams');
                console.log(JSON.stringify(postIncomeParams));
                setTimeout(function() {
                    $http({
                        url: APIBASE_V1 +'post_fund_receipt?company_id='+company_id,
                        method: "POST",
                        data: postIncomeParams,
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
                $scope.expenseType = "";
                $scope.compTypewarning = "";
                $scope.showFiles = false;
                console.log('clearresponseclearresponseclearresponse');

                expenseType = false;
                expenseCost = false;
                expenseDesc = false;
                compType = false;
                uploadComplete = false;
                pictureTaken = false;
                submitRecord = false;


                (function($){
                    $('.expenses input').val("");
                    //$('.expenses select').prop('selectedIndex',-1);
                    $('.md-select-label *:first-child').html('');
                    //$('.md-select-label *:first-child').css('color','rgba(0, 0, 0, 0.87)');
                })(jQuery)

            }
        }

        $scope.showFiles = false;
        $scope.showPhoto = true;
        $scope.showAttachBtn = true;

        $scope.showFilesQueue = function() {
            $scope.showFiles = true;
            var a = 0;
            var interval = $interval(function() {
                a++;
                var fileDetected = uploader.getNotUploadedItems().length;
                console.log('say hello: ' + a + " : " + fileDetected);
                if (fileDetected) {
                    uploader.uploadAll();
                    $interval.cancel(interval);
                }
            }, 1000);

            $scope.showPhoto = false;
        };

        $scope.showFiles = false;

        var docName;
        var theJson;
        /*
         * Upload Files to the server and record onto the Database
         */
        var uploader = $scope.uploader = new FileUploader({
            url: 'http://grass2grace.co.ke/pwc_app/tujivunie_v2.4/scripts/upload.php'
        });
        // FILTERS
        // a sync filter
        uploader.filters.push({
            name: 'syncFilter',
            fn: function(theItem /*{File|FileLikeObject}*/ , options) {
                console.log('syncFilter');
                return this.queue.length < 10;
            }
        });
        // an async filter
        uploader.filters.push({
            name: 'asyncFilter',
            fn: function(theItem /*{File|FileLikeObject}*/ , options, deferred) {
                console.log('asyncFilter');
                setTimeout(deferred.resolve, 1e3);
            }
        });
        // CALLBACKS
        uploader.onWhenAddingFileFailed = function(theItem /*{File|FileLikeObject}*/ , filter, options) {
            console.info('onWhenAddingFileFailed', theItem, filter, options);
        };

        uploader.onAfterAddingFile = function(filetheItem) {
            console.info('onAfterAddingFile', filetheItem);

            filename = filetheItem['_file']['name'];

            thecameraImgUrl = 'http://www.grass2grace.co.ke/pwc_app/uploads/'+filename;

            console.log('filenamefilenamefilenamefilename');
            console.log(filename);

        };
        uploader.onAfterAddingAll = function(addedFiletheItems) {
            console.info('onAfterAddingAll', addedFiletheItems);
        };
        uploader.onBeforeUploadtheItem = function(theItem) {
            console.info('onBeforeUploadtheItem', theItem);
        };
        uploader.onProgresstheItem = function(filetheItem, progress) {
            //console.info('onProgresstheItem', filetheItem, progress);
            docName = filetheItem._file.name;
            console.info("filetheItem: " + filetheItem._file.name);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccesstheItem = function(filetheItem, response, status, headers) {
            console.info('onSuccesstheItem', filetheItem, response, status, headers);
        };
        uploader.onErrortheItem = function(filetheItem, response, status, headers) {
            console.info('onErrortheItem', filetheItem, response, status, headers);
        };
        uploader.onCanceltheItem = function(filetheItem, response, status, headers) {
            console.info('onCanceltheItem', filetheItem, response, status, headers);
        };
        uploader.onCompletetheItem = function(filetheItem, response, status, headers) {
            console.info('onCompletetheItem', filetheItem, response, status, headers);
        };
        uploader.onCompleteAll = function() {
            uploadComplete = true;
            console.info('onCompleteAll');
        };
        console.info('uploader', uploader);
        //New Camera

        //New Camera
        $(function() {
            function camSuccess(imgData) {
                $('#img_camPH').attr('src', imgData);
                $scope.cameraSuccess = 'pictaken';

                console.log('imgDataimgDataimgData');
                //alert(imgData);

                $scope.dataURI = imgData;
                thecameraImgUrl = imgData;

            }

            function camError(error) {
                //alert(error);
            }

            function accessCamera() {
                var options = {
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: Camera.PictureSourceType.CAMERA
                }
                navigator.camera.getPicture(camSuccess, camError, options);
            }
            $('#btn_camera').on('click', accessCamera);
        });

        //Capture the Image via camera
        //Capture the Image via camera
        $scope.showSnapshot = false;
        $scope.showLivePic = true;
        $scope.imgPlaceholder = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
        $scope.dataURI = '';

        function camSuccess(imgData) {
            $scope.dataURI = imgData;
            $scope.cameraSuccess = 'pictaken';
            //alert(imgData);
        }

        function camError(error) {
            //alert(error);
        }

        function accessCamera() {
            var options = {
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA
            }
            navigator.camera.getPicture(camSuccess, camError, options);
        }
        // Setup a channel to receive a video property
        // with a reference to the video element
        // See the HTML binding in main.html
        $scope.makeSnapshot = function() {

            pictureTaken = true;


            $scope.showAttachBtn = false;

            //alert(111);
            accessCamera();
            $scope.showSnapshot = true;
            $scope.showLivePic = false;
        };
        $scope.deleteSnapshot = function() {
            $scope.showSnapshot = false;
            $scope.showLivePic = true;
        }
        //End capture image
        //End capture image













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
                    '<div class="confirmsale bottom-0"><h1 class="uppercase ultrabold bottom-0">CONFIRM SALE</h1><h6 class="uppercase ultrabold bottom-0">ENTER CASH RECEIVED</h6><div class="page-login-field"><input ng-model="parent.cashReceived" type="text" placeholder="KES"> <em>(required)</em></div><h6 class="uppercase ultrabold bottom-0">TOTAL: KES {{parent.totalSaleAmount}}</h6><h6 class="uppercase ultrabold bottom-0">CHANGE: KES {{(parent.cashReceived-parent.totalSaleAmount > 0) ? parent.cashReceived-parent.totalSaleAmount:"0";}}</h6><div class="sale_item_list" style=""><table class="table-borders-light" width="100%"><tbody width="100%"><tr width="100%"><th class="bg-night-dark" width="50%">Items</th><th class="bg-night-dark" width="20%">Price</th><th class="bg-night-dark" width="10%">Qty</th><th class="bg-night-dark" width="20%">Total</th></tr><tr ng-repeat="item in parent.clientReceipt"><td class="bg-night-light">{{item.title}}</td><td class="bg-night-light">{{item.amount}}</td><td class="bg-night-light">{{item.itemType}}</td><td class="bg-night-light">{{item.itemType*item.amount}}</td></tr></tbody></table></div><a href="#" ng-click="parent.confirmCheckOut(); cancel();" class="md-raised md-button md-default-theme">CONFIRM</a></div>'
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