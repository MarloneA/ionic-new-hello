// Controller of defaultUserInterface.
appControllers.controller('recordExpenseCtrl', function(APIBASE, APIBASE_V1, $mdDialog, $mdBottomSheet, $mdToast, $mdDialog, $firebaseArray, $firebaseObject, $scope, $rootScope, $timeout, $http, $filter, $q, $interval, $state, $stateParams, $ionicHistory, FileUploader) {

        var company_id = localStorage.getItem('company_id');
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
        var thecameraImgUrl;

        $scope.dateValue = new Date();
        $scope.timeValue = new Date();
        $scope.datetimeValue = new Date();
    
        $scope.go = function() {
            //alert($scope.datetimeValue)
            //window.open("https://github.com/katemihalikova/ion-datetime-picker", "_blank");
        };



    //.constant('APIBASE_V1','https://pwc.scopicafrica.com/pwc/api_v1/')
    //.constant('APIBASE_V1','https://portal.epesibooks.com/acc/api_v1/');



        //get_expense_items

        var expenseID = 0;
        $scope.expID = function(expID){
            expenseID=expID;
            console('expenseID: '+expenseID);
        } 

        $http({
            url: 'https://pwc.scopicafrica.com/pwc/api_v1/'+'get_expense_items',
            method: "GET",
            //data: purchaseParams,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function(resp) {
            console.log('get_expense_items');
            console.log(JSON.stringify(resp.data));
            $scope.expenseTypes = resp.data;
            //expenseTypesIDs = resp.data;

        }, function(resp) { // optional
            console.log('response');
        });

        var company_id = localStorage.getItem('company_id');
        console.log('company_id');
        console.log(company_id);

        $http({
            url: 'https://portal.epesibooks.com/acc/api_v1/'+'get_expense_accounts?company_id='+company_id,
            method: "GET",
            //data: purchaseParams,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function(resp) {
            console.log('get_expense_itemsTypes');
            console.log(JSON.stringify(resp.data));
            $scope.expenseItemTypes = resp.data;
            expenseTypesIDs = resp.data;

        }, function(resp) { // optional
            console.log('response');
        });



        //File Uploader module

        var filename;

        $("#files").change(function() {
            filename = this.files[0].name
            console.log(filename);
        });

        var uploadComplete = false;
        //For the validation of forms
        $scope.expenseTypewarning = '';
        $scope.expenseItemTypewarning = '';
        $scope.expenseNamewarning = '';
        $scope.expenseCostwarning = '';
        $scope.expenseDescwarning = '';
        $scope.uploadDescwarning = '';
        // $scope.expenseTypewarning = 'blank';
        // $scope.expenseNamewarning = 'blank';
        // $scope.expenseCostwarning = 'blank';
        // $scope.expenseDescwarning = 'blank';

        var expenseType, expenseCost, expenseDesc, expenseItemType;

        $scope.validateForm = function(formID,value,expID) {

            console.log('expID: '+expID);

            if((formID==1)&&(value!=='')){
                $scope.expenseTypewarning = '';
                expenseType = value;
                console.log('notEmpty_$scope.expenseType');
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

            if((formID==4)&&(value!=='')){
                $scope.expenseItemTypewarning = '';
                expenseItemType = value;
                console.log('notEmpty_$scope.expenseDesc');
            }

        }

        $scope.displayDatePickerDialog = function(time) {
            //$interval(function(){

            function convert(str) {
                var mnths = { 
                    Jan:"01", Feb:"02", Mar:"03", Apr:"04", May:"05", Jun:"06",
                    Jul:"07", Aug:"08", Sep:"09", Oct:"10", Nov:"11", Dec:"12"
                },
                date = str.split(" ");

                if(date[2]<10){
                    date[2] = (date[2]).replace(/^0+/, '');
                }

                if(date[3]<10){
                    date[3] = (date[3]).replace(/^0+/, '');
                }

                return [ date[2], mnths[date[1]], date[3] ].join("-");
            }

            //console.log(convert(time));

            theDateToday = (convert(time.toString()));// (d.getDate() + 0) + "-" + (d.getMonth() + 1) + "-" + (d.getFullYear());

            console.log(typeof time);

            console.log(convert("Thu Jun 09 2011 00:00:00 GMT+0530 (India Standard Time)"));

            console.log('theDateTodaytheDateToday');
            console.log(theDateToday);
            //},1000);
        };


        //Submit Upload Record
        $scope.submitUploadRecord = function(item) {

            console.log($scope.datetimeValue)

            var submitRecord = true;
            $scope.expenseTypewarning = '';
            $scope.expenseItemTypewarning = '';
            $scope.expenseNamewarning = '';
            $scope.expenseCostwarning = '';
            $scope.expenseDescwarning = '';
            $scope.uploadDescwarning = '';
            if (!expenseType) {
                $scope.expenseTypewarning = 'blank';
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

            if (!expenseItemType) {
                $scope.expenseItemTypewarning = 'blank';
                submitRecord = false;
                console.log('$scope.expenseItemTypewarning');
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

                console.log(theDateToday);
                

                if(typeof thecameraImgUrl=='undefined'){
                    thecameraImgUrl = 'http://www.grass2grace.co.ke/pwc_app/uploads/unnamed.png';
                }

                
                var theDayExpesesRef = FBExpensesref.child(theDateToday);
                expensesRef = $firebaseArray(theDayExpesesRef);
                theExpense = {
                    'time': theTime,
                    //'itemTitle': $scope.expenseName,
                    'itemID': 1,
                    'itemType': expenseType,
                    'itemDesc': expenseDesc,
                    'imgUrl':thecameraImgUrl,
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

                var theDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
            
                for (var i = 0; i < expenseTypesIDs.length; i++) {
                    if(expenseItemType===expenseTypesIDs[i]['alias']){
                        expID = expenseTypesIDs[i]['id'];
                    }
                }

                var imgURL = "http://www.grass2grace.co.ke/pwc_app/uploads/"

                console.log('filenamefilename_____filenamefilename');
                console.log(filename);

                if(typeof thecameraImgUrl=='undefined'){
                    thecameraImgUrl = 'http://www.grass2grace.co.ke/pwc_app/uploads/'+filename;
                }

                // var postExpenseParams = {
                //         "expense_account_id":expenseDesc,
                //         "expenseItemType":expenseItemType,
                //         "transaction_reference": expID,
                //         "transaction_date": theDate.toString(),
                //         "expense_amount": expenseCost,
                //         "uploads": [imgURL+""+filename],
                //         "items": [{
                //             "id": expID,
                //             "cost_price": expenseCost
                //         }]
                // };

                var postExpenseParams = {
                        "transaction_reference":theTimeStamp,
                        "transaction_date":theDate.toString(),
                        "attachment_1": imgURL+""+filename,
                        "items": [{
                            "id": expID,
                            "amount": expenseCost
                        }]
                    }


                console.log('postExpenseParams');
                console.log(JSON.stringify(postExpenseParams));
                setTimeout(function() {
                    $http({
                        url: APIBASE+'post_expense?company_id='+company_id,
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

                expenseType = false;
                expenseItemType = false;
                expenseCost = false;
                expenseDesc = false;
                uploadComplete = false;
                pictureTaken = false;

                submitRecord = false;
                uploadComplete = false;
                pictureTaken = false;

                (function($){
                    $('.expenses input').val("");

                    $('.md-select-label *:first-child').html('');
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

            $scope.showPhoto = showPhoto;//false;
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

            console.log('filenamefilenamefilenamefilename');
            console.log(filename);

            thecameraImgUrl = 'http://www.grass2grace.co.ke/pwc_app/uploads/'+filename;

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
        $(function() {
            function camSuccess(imgData) {
                $('#img_camPH').attr('src', imgData);
                thecameraImgUrl = imgData;
                $scope.cameraSuccess = 'pictaken';
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
            $scope.cameraSuccess = 'pictaken';
            $scope.dataURI = imgData;
            thecameraImgUrl = imgData;
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



    //setTimeout(function(){
    var errorArrays = [];

    setInterval(function(){
        window.onerror = function(error) {
            console.log('detect____error');
            console.log(error);
            errorArrays.push(error);
            $scope.errorArrays = errorArrays;
        };
    },1);
    //},2000);

}); // End of defaultUserInterface controller.