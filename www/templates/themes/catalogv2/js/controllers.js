// Controller of defaultUserInterface.
appControllers.controller('recordExpensev2Ctrl', function(APIBASE, APIBASE_V1, $mdDialog, $mdBottomSheet, $mdToast, $mdDialog, $firebaseArray, $firebaseObject, $scope, $rootScope, $timeout, $http, $filter, $q, $interval, $state, $stateParams, $ionicHistory, FileUploader) {

        var company_id = localStorage.getItem('company_id');
        var FBExpensesref = firebase.database().ref().child('donorexpenses'+company_id);
        var FBrefDisbursements = firebase.database().ref().child('dailyDisbursements');
        var FBrefPayments = firebase.database().ref().child('dailyPayments');
        var FBBudgetref = firebase.database().ref().child('budget');
        var expensesRef;
        var theExpense;
        var dbExpensesData = [];
        var d = new Date();
        var theDateToday = (d.getDate() + 0) + "-" + (d.getMonth() + 1) + "-" + (d.getFullYear());

        var theTime = d.getHours() + ":" + d.getMinutes();
        var theTimeStamp = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds())-(1000*60*60*3); //add month -(minus) 1
        var pictureTaken = false;
        var expenseTypesIDs;
        var expenseActTypesIDs;
        var expID;
        var validBudget = false;
        var thecameraImgUrl;
        var component_id;
        var activity_id;
        var company_id = localStorage.getItem("company_id");

        $scope.dateValue = new Date();
        $scope.timeValue = new Date();
        $scope.datetimeValue = new Date();
        $scope.resetdatetimeValue = new Date();
        
        $scope.actualDate = true;

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
            url: APIBASE_V1+'get_components?company_id='+company_id,
            method: "GET",
            //data: purchaseParams,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function(resp) {
            console.log('get_expense_items');
            console.log(resp.data);
            $scope.expenseTypes = resp.data;
            expenseTypesIDs = resp.data;


        }, function(resp) { // optional
            console.log('response');
        });


        //Components Activity Types

        console.error('company_idddd');
        console.error(company_id);


        //get_components
        $http({
            //url: APIBASE_V1+'get_components',
            url:APIBASE_V1+'get_components?company_id='+company_id,
            method: "GET",
            //data: purchaseParams,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function(resp) {
            console.log('get_component_items');
            console.log(resp.data);
            $scope.incomeComps = resp.data;
            compTypesIDs = resp.data;
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
        $scope.expenseNamewarning = '';
        $scope.expenseCostwarning = '';
        $scope.expenseDescwarning = '';
        $scope.theexpenseDescwarning = '';
        $scope.theexpenseSupplierwarning = '';
        $scope.uploadDescwarning = '';
        // $scope.expenseTypewarning = 'blank';
        // $scope.expenseNamewarning = 'blank';
        // $scope.expenseCostwarning = 'blank';
        // $scope.expenseDescwarning = 'blank';

        var expenseType, expenseCost, expenseDesc, theexpenseDesc, theexpenseSupplier;

        //Get budget data to compare with created expenses and alert user if the expense has not been budgeted for

        FBBudgetref.orderByKey().on("value", function(snapshot) {
            budgetData = [];
            budgetSummary = [];

            var returnData = snapshot.val();
            //console.log('budgetreturnData');
            //console.log(returnData);

            var p = returnData;

            for (var key in p) {
                if (p.hasOwnProperty(key)) {
                    //console.log(key + " -> " + p[key]);
                    budgetData.push(p[key]);
                }
            }

            console.error('get_budgetDataget_budgetDataget_budgetDataget_budgetData');
            console.log(budgetData);

        });


        $scope.validateForm = function(formID,value,expID) {

            validBudget = false

            console.log('expID: '+expID);

            if((formID==1)&&(value!=='')){
                $scope.expenseTypewarning = '';
                var respdata = JSON.parse(value);
                expenseType = respdata.title;
                component_id = respdata.id;
                console.log('notEmpty_$scope.expenseType');
                console.log(expenseType);
                console.log('component_id: '+component_id);


                $http({
                    url:APIBASE_V1+'get_activities?component_id='+component_id,
                    //url: APIBASE_V1+'get_activities',
                    method: "GET",
                    //data: purchaseParams,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(function(resp) {
                    console.log('get_expense_items');
                    console.log(resp.data);

                    var sampleActData = [
                            {
                                description: "Activity 1",
                                id: 1,
                                title: "Activity 1"
                            },
                            {
                                description: "Activity 2",
                                id: 2,
                                title: "Activity 2"
                            },
                            {
                                description: "Activity 3",
                                id: 3,
                                title: "Activity 3"
                            }
                        ];

                    var sampleActData = resp.data;

                    console.error('sampleActData');
                    console.error(sampleActData);

                    $scope.expenseActTypes = sampleActData;//resp.data;
                    expenseActTypesIDs = sampleActData;//resp.data;

                    //Data for Suppliers

                    $http({
                        url:"https://portal.epesibooks.com/acc/api_v1/get_suppliers?company_id=522",
                        //url:APIBASE_V1+'get_suppliers?company_id='+component_id,
                        //url: APIBASE_V1+'get_activities',
                        method: "GET",
                        //data: purchaseParams,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).then(function(suppliersResp) {
                        console.log('get_suppliers');
                        console.log(suppliersResp.data);

                        $scope.theSuppliers = suppliersResp.data;

                    }, function(suppliersResp) { // optional
                        console.log('response');
                    });

                }, function(resp) { // optional
                    console.log('response');
                });




            }

            if((formID==2)&&(value!=='')){
                $scope.expenseCostwarning = '';
                expenseCost = value;
                console.log('notEmpty_$scope.expenseCost');
            }

            if((formID==3)&&(value!=='')){
                var respdata = JSON.parse(value);
                $scope.expenseDescwarning = '';
                expenseDesc = respdata.title;
                activity_id = respdata.id;
                console.log('expenseDesc___::');
                console.log(expenseDesc);
                console.log('notEmpty_$scope.expenseDesc');
            }

            if((formID==4)&&(value!=='')){
                $scope.theexpenseDescwarning = '';
                theexpenseDesc = value;
                console.log('theexpenseDesc: '+theexpenseDesc);
                console.log('notEmpty_$scope.theexpenseDesc');
            }

            if((formID==5)&&(value!=='')){
                $scope.theexpenseSupplierwarning = '';

                var theSupplierVal = value;

                if(typeof(theSupplierVal) == 'string'){
                    var parsedJson = JSON.parse(theSupplierVal);
                    theexpenseSupplier = parsedJson['id'];
                }else{
                    theexpenseSupplier = theSupplierVal['id'];
                }   

                console.log('theexpenseSupplier: '+theexpenseSupplier);
                console.log('notEmpty_$scope.theexpenseSupplier');
            }

            for (var i = 0; i < budgetData.length; i++) {
                if((budgetData[i]['itemType'])==expenseType){
                    var targetComp = budgetData[i]['itemType'];

                    console.error("(budgetData[i]['itemType'])"+' : '+(budgetData[i]['itemType']));
                    console.error("expenseType: "+expenseType);

                    budgetData.forEach(function(item) {
                        console.warn("itemDuration: "+item);
                        console.warn(item);
                        console.warn("item.itemAct: "+item.itemAct);
                        console.warn("expenseDesc: "+expenseDesc);

                        if((targetComp == item.itemType) && (item.itemDur == 'month')){
                        //if((targetComp == item.itemType) && (item.itemDur == 'week')){
                            if ((item.itemAct == expenseDesc)) {
                                console.warn('validBudgetTrue');
                                validBudget = true;
                            }
                        }
                    })

                }
            }

            $timeout(function() {
                if(expenseDesc){
                    if(!validBudget){
                        showExpenseErrorAlertDialog($scope.$event,expenseType,expenseDesc);
                    }
                }
            }, 1000);

        }

        $scope.displayDatePickerDialog = function(time) {
            //$interval(function(){

            $scope.actualDate = true;
            $scope.resetDate = false;

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

            var oldDateFormat = (convert(time.toString()));// (d.getDate() + 0) + "-" + (d.getMonth() + 1) + "-" + (d.getFullYear());
            var oldDateArray = oldDateFormat.split("-");
            var newDateArray = [];


            for (var i = 0; i < oldDateArray.length; i++) {
                newDateArray.push(Number(oldDateArray[i]));
            }
            var newDateFormat = newDateArray.join("-");

            theDateToday = newDateFormat;

            console.log(typeof time);

            console.log(convert("Thu Jun 09 2011 00:00:00 GMT+0530 (India Standard Time)"));

            console.log('theDateTodaytheDateToday');
            console.log(theDateToday);



            //},1000);
        };


        //Submit Upload Record
        $scope.submitUploadExpRecord = function(item) {

            console.log('recordedDate');
            console.log($scope.datetimeValue);

            var submitRecord = true;
            $scope.expenseTypewarning = '';
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
            if (!theexpenseDesc) {
                $scope.theexpenseDescwarning = 'blank';
                submitRecord = false;
                console.log('$scope.theexpenseDescwarning');
            }
            if (!theexpenseSupplier) {
                $scope.theexpenseSupplierwarning = 'blank';
                submitRecord = false;
                console.log('$scope.theexpenseSupplierwarning');
            }




            if (!uploadComplete && !pictureTaken) {
                $scope.uploadDescwarning = 'blank';
                $scope.showFiles = true;
            }
            if (submitRecord === true && (uploadComplete === true || pictureTaken) && validBudget) {
            //if (submitRecord === true && (uploadComplete === true || pictureTaken)) {
                //Post Data using endpoint
                //alert('post')
                d = new Date();
                theTime = d.getHours() + ":" + d.getMinutes();                
                theTimeStamp = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds())-(1000*60*60*3); //add month -(minus) 1

                console.log(theDateToday);
                


                var theDayExpesesRef = FBExpensesref.child(theDateToday);
                expensesRef = $firebaseArray(theDayExpesesRef);

                if(typeof thecameraImgUrl=='undefined'){
                    thecameraImgUrl = 'http://www.grass2grace.co.ke/pwc_app/uploads/unnamed.png'
                }



                //Number of expenses


                //Post an expense item

                var theDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
            
                for (var i = 0; i < expenseTypesIDs.length; i++) {
                    if(expenseType===expenseTypesIDs[i]['alias']){
                        expID = expenseTypesIDs[i]['id'];
                    }
                }

                var imgURL = "http://www.grass2grace.co.ke/pwc_app/uploads/"

                console.log('filenamefilename_____filenamefilename');
                console.log(filename);

                var postExpenseParams = {
                        "component_id":component_id,
                        "activity_id":activity_id,
                        "description":expenseDesc,
                        "transaction_reference": theTimeStamp,//expID,
                        "transaction_date": theDate.toString(),
                        "amount": expenseCost,
                        'contact_id':theexpenseSupplier,
                        "attachment_1": imgURL+""+filename,
                };

                console.log('postExpenseParams');
                console.log(JSON.stringify(postExpenseParams));
                setTimeout(function() {

                    $http({
                        url: APIBASE_V1+'post_expenditure?company_id='+company_id,
                        method: "POST",
                        data: postExpenseParams,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).then(function(response) {
                        console.log(response);

                        FBExpensesref.orderByChild("itemID").once("value", function(snapshot) { 
                            var newID = snapshot.numChildren();

                            theExpense = {
                                'time': theTime,
                                //'itemTitle': $scope.expenseName,
                                'itemID': Number(newID)+1,
                                'itemType': expenseType,
                                'itemDesc': expenseDesc,
                                'item_Desc': theexpenseDesc,
                                'imgUrl':thecameraImgUrl,
                                'itemCost': Number(expenseCost),
                                'contact_id':theexpenseSupplier,
                                'ts': theTimeStamp
                            }
                            dbExpensesData.push(theExpense);

                            console.log('dbExpensesData');
                            console.log(dbExpensesData);

                            for (var i = 0; i < dbExpensesData.length; i++) {
                                expensesRef.$add(dbExpensesData[i]);
                            }
                            dbExpensesData = [];

                        });


                    }, function(response) { // optional
                        //xhrErrorTracking.response();
                        //xhrErrorTracking.responseError();
                        console.log('responseresponseresponseresponseresponseresponseresponseresponseresponseresponseresponseresponseresponseresponseresponseresponse');
                    });
                }, 1000);

                //End Post an expense item

                $scope.showAlertDialog($scope.$event);

                $scope.expenseTypewarning = '';
                $scope.expenseNamewarning = '';
                $scope.expenseCostwarning = '';
                $scope.expenseDescwarning = '';
                $scope.theexpenseDescwarning = '';
                $scope.theexpenseSupplierwarning = '';
                $scope.uploadDescwarning = '';

                //expenseType = false;
                //expenseCost = false;
                //expenseDesc = false;
                //theexpenseDesc = false;
                uploadComplete = false;
                pictureTaken = false;

                submitRecord = false;

                (function($){
                    $('.expenses input').val("");
                    $('.md-select-label *:first-child').html('');
                })(jQuery)

                $scope.expenseCost = "";
                $scope.expenseDesc = "";
                $scope.expenseType = "";
                $scope.showFiles = false;
                console.log('clearresponseclearresponseclearresponse');

                (function($){
                    $('.expenses input').val("");
                    //$('.expenses select').prop('selectedIndex',-1);
                    $('.md-select-label *:first-child').html('');
                    //$('.md-select-label *:first-child').css('color','rgba(0, 0, 0, 0.87)');
                })(jQuery)

                $timeout(function() {
                    //$scope.datetimeValue = new Date();  


                    $scope.dateValue = new Date();//new Date(1541001113000);
                    $scope.timeValue = new Date();//new Date(1541001113000);
                    $scope.datetimeValue = new Date();//new Date(1541001113000);
                    $scope.resetdatetimeValue = new Date();

                    console.error('newDateete2');
                    console.error($scope.datetimeValue);

                    theDateToday = (d.getDate() + 0) + "-" + (d.getMonth() + 1) + "-" + (d.getFullYear());

                    //$scope.changeDay('today');

                    $scope.actualDate = false;
                    $scope.resetDate = true;

                }, 1);

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

            $scope.showPhoto = true;//false;
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


        $scope.dataURI = '';

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
    var showExpenseErrorAlertDialog = function ($event,expType,expAct) {

        if(typeof expAct == 'undefined'){
            expAct = 'an activity';
        }

        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Oh no :(",
                    content: "First create a monthly budget for "+expAct+" under "+expType +" before proceeding",
                    ok: "Confirm"
                }
            }
        }).then(function () {
            $scope.dialogResult = "You choose Confirm!"
        });
    }// End showAlertDialog.


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