// Controller of defaultUserInterface.
appControllers.controller('budgetCtrl', function(APIBASE, APIBASE_V1, $mdDialog, $mdBottomSheet, $mdToast, $mdDialog, $firebaseArray, $firebaseObject, $scope, $rootScope, $timeout, $http, $filter, $q, $interval, $state, $stateParams, $ionicHistory, FileUploader) {

       //Default value of input number

       //CUSTOM CODE
        var company_id = localStorage.getItem('company_id');
        var FBSalesref = firebase.database().ref().child('sales'+company_id);;
        var FBrefDisbursements = firebase.database().ref().child('dailyDisbursements');
        var FBrefPayments = firebase.database().ref().child('dailyPayments');
        var salesRef;
        var theSale;
        var dbSalesData = [];
        var monthlyExpenses;
        var FBExpensesref = firebase.database().ref().child('donorexpenses'+company_id);
        var FBBudgetref = firebase.database().ref().child('budget');
        var theExpense;
        var dbExpensesData = [];
        var d = new Date();
        var theDateToday = (d.getDate() + 0) + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
        var expenseTypesIDs, budgetTypes, donorWkExpTotals;
        var switchDuration;
        var saveBudget = true;
        var currentWkChart, currentMthChart, currentYrChart;
        var quickSpentTotals = 0;
        var quickBudgetTotals = 0;
        $scope.quickBudgetPerc = 0;
        $scope.quickSpentTotals = quickSpentTotals;
        $scope.quickBudgetTotals = quickBudgetTotals;

        var component_id;

        function addCommas(num) {
            var str = num.toString().split('.');
            if (str[0].length >= 4) {
                //add comma every 3 digits befor decimal
                str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
            }
            /* Optional formating for decimal places
            if (str[1] && str[1].length >= 4) {
                //add space every 3 digits after decimal
                str[1] = str[1].replace(/(\d{3})/g, '$1 ');
            }*/
            return str.join('.');
        }
        //The DATA Sources
        //Sign In to the App

        //Add excerpt to words

        var theWordCnt = 20;

        $scope.excerpt = function(theWord) {
            if (theWord.length > theWordCnt) {
                return theWord.substr(0, theWordCnt) + '...';
            }else{
                return theWord;
            }
        };


        //Get budget durations
        $scope.expenseDurations = [
        // {
        //     alias: "week",
        //     description: "week",
        //     title: "Weekly"
        // },
        {
            alias: "month",
            description: "month",
            title: "Monthly"
        },{
            alias: "year",
            description: "year",
            title: "Yearly"
        }];



        $scope.authURL = '';

        $scope.authUser = function(username, password) {
            //console.log(username);
            //console.log(password);
            //username = localStorage.getItem("username");
            //password = localStorage.getItem("password");
            //$scope.auth = function() {
                //alert(11)
                if (username === 'admin' && password == '12345') {


                    return 'home.html';
                    // body...
                

                    //$scope.authURL = 'home.html';

                    //username = $scope.username;
                    //password = $scope.password;
                } else {

                    return 'home.html';
                    //$scope.authURL = '';
                }
        }



        $scope.login = function(username, password) {
            //$scope.login = function(username,password){
            //console.log(username);
            //console.log(password);
            //username = localStorage.getItem("username");
            //password = localStorage.getItem("password");
            //$scope.auth = function() {
                //alert(11)
                if (username === 'admin' && password == 12345) {


                    return 'home.html';
                    // body...
                

                    //$scope.authURL = 'home.html';

                    //username = $scope.username;
                    //password = $scope.password;
                } else {

                    return '';
                    //$scope.authURL = '';
                }
            //}

            /*
            //console.log(username);
            var loginParams = {
                "username": username,
                "password": password
            }
            $http({
                url: 'http://pwc.scopicafrica.com/pwc/login',
                method: "POST",
                data: loginParams,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function(response) {
                //console.log(response.data);
                localStorage.setItem("username", username);
                localStorage.setItem("password", password);
            }, function(response) { // optional
                //console.log('failed login');
            });
            */
        }
        //login('admin', '');
        //End Sign in to the App 
        //The Stats Page
        // Load google charts
        // google.charts.load('current', {'packages':['corechart']});
        // google.charts.setOnLoadCallback(drawChart);
        // // Draw the chart and set the chart values
        // function drawChart() {
        //   var data = google.visualization.arrayToDataTable([
        //   ['Task', 'Hours per Day'],
        //   ['Work', 100],
        //   ['Eat', 2],
        //   ['TV', 4],
        //   ['Gym', 2],
        //   ['Sleep', 8]
        // ]);
        //   // Optional; add a title and set the width and height of the chart
        //   var options = {'title':'My Average Day', 'width':550, 'height':400};
        //   // Display the chart inside the <div> element with id="piechart"
        //   var chart = new google.visualization.PieChart(document.getElementById('piechart'));
        //   chart.draw(data, options);
        // }
        //End of the stats page
        $scope.checkStatus = false;
        //$scope.activateSell = false;
        //$scope.theQuatity = 10;
        $http.get('https://pwc.scopicafrica.com/pwc/api_v1/' + 'get_sale_items').then(function(resp) {
            //console.log('resp.dataresp.dataresp.data');
            //console.log(JSON.stringify(resp.data));

            var saleItems = resp.data;
            //console.log('saleItemssaleItems');
            //console.log(JSON.stringify(saleItems));

            for (var i = 0; i < saleItems.length; i++) {
                saleItems[i]['count'] = 1;
                saleItems[i]['counter'] = true;
                var maxWordCount = 20;
                var excerpt = function() {
                    if (saleItems[i]['title'].length > maxWordCount) {
                        return saleItems[i]['title'].substr(0, maxWordCount) + '.';
                    }
                    return saleItems[i]['title'];
                };
                saleItems[i]['title'] = excerpt();
            }
            $scope.items = saleItems;


            $scope.minusCount = function(item) {
                if (typeof item.count === "undefined") {
                    item.count = 1;
                }
                var count = item.count;
                count--;
                if (count < 1) {
                    count = 1;
                }
                item.count = count;
                $scope.item = item;
            };
            $scope.addCount = function(item) {
                if (typeof item.count === "undefined") {
                    item.count = 1;
                }
                var count = item.count;
                count++;
                if (count > 100) {
                    count = 100;
                }
                item.count = count;
                $scope.item = item;
            };
            $scope.enableCounter = function(item) {
                //$scope.activateSell = false;
                if (item.selected === true) {
                    item.counter = true;
                } else {
                    item.counter = false;
                }
                $scope.item = item;
                //console.log(item.selected);
            };
            // Check checkboxes checked or not



                        //$scope.totalSaleAmount = "totalSaleAmounttotalSaleAmounttotalSaleAmounttotalSaleAmount";

            $scope.sellItems = function() {

                var receiptArray = [];
                var checkedItems = [];
                var totalSaleAmount;

                $scope.items.forEach(function(item) {
                    if (item.selected === true) {
                        if (item.title == "") {
                            item.title = "Unnamed";
                        }
                        receiptArray.push({
                            "title": (item.title).toString(),
                            "amount": Number(item.sell_price),
                            "quantity": Number(item.count)
                        });
                        //Capture today's date and create a new object for the day e.g '01-10-2018':[array of the day's sales]
                        //var d = new Date();
                        var theTime = d.getHours() + ":" + d.getMinutes();
                        var theDaySalesRef = FBSalesref.child(theDateToday);
                        salesRef = $firebaseArray(theDaySalesRef);
                        theSale = {
                            'time': theTime,
                            'itemTitle': (item.title).toString(),
                            'itemID': (item.id).toString(),
                            'quantity': Number(item.count),
                            'itemSellPrice': Number(item.sell_price) * Number(item.count)
                        }
                        dbSalesData.push(theSale);
                        checkedItems.push({
                            "id": (item.id).toString(),
                            "sell_price": (item.sell_price).toString(),
                            "quantity": (item.count).toString()
                        });
                        $scope.clientReceipt = receiptArray;
                        totalSaleAmount = 0;
                        for (var i = 0; i < receiptArray.length; i++) {
                            totalSaleAmount = totalSaleAmount + (receiptArray[i]['amount'] * receiptArray[i]['quantity']);
                        }

                        $scope.totalSaleAmount = totalSaleAmount;

                        //console.log(JSON.stringify(receiptArray));
                    }
                });
                //var d = new Date();
                var theDate = "{date (" + d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + ")}";
                var theTimeStamp = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds())-(1000*60*60*3); //add month -(minus) 1
              
                var itemCount = 1;
                var postSaleParams = {
                    "transaction_reference": "string",
                    "customer_id": 1,
                    "transaction_date": theDate.toString(),
                    "due_date": theDate.toString(),
                    "sale_amount": (totalSaleAmount).toString(),
                    "items": checkedItems,
                    "ts": theTimeStamp
                };

                //console.error('postSaleParamspostSaleParamspostSaleParams');

                //console.log(JSON.stringify(postSaleParams));

                //console.log(checkedItems);

                $scope.confirmCheckOut = function() {
                    //console.log('dbSalesData');
                    //console.log(dbSalesData);
                    for (var i = 0; i < dbSalesData.length; i++) {
                        salesRef.$add(dbSalesData[i]);
                    }
                    dbSalesData = [];
                    setTimeout(function() {
                        $http({
                            url: APIBASE_V1 + 'post_sale',
                            method: "POST",
                            data: postSaleParams,
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        }).then(function(response) {
                            //console.log(response);
                        }, function(response) { // optional
                            //xhrErrorTracking.response();
                            //xhrErrorTracking.responseError();
                            //console.log(response);
                        });
                        angular.forEach($scope.items, function(item) {
                            item.selected = false;
                            item.count = 1;
                            item.counter = true;
                        });
                        //$scope.activateSell = true;
                    }, 1000);
                }

            }
            var itemsSold = [];
            $scope.itemSalesDetails = function(item) {
                ////alert(item.id);
                itemsSold.push({
                    "id": (item.id).toString(),
                    "amount": (item.sell_price).toString()
                });
                //console.log(itemsSold);
                //console.log(item);
                $scope.theItem = item;
                //Post Sales
                //var d = new Date();
                var theDate = "{date (" + d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + ")}";
                var itemCount = 1;
                //console.log(theDate.toString());
                var postSaleParams = {
                    "sample_data": {
                        "transaction_reference": "string",
                        "customer_id": 1,
                        "transaction_date": theDate.toString(),
                        "due_date": theDate.toString(),
                        "sale_amount": (item.sell_price).toString(),
                        "items": itemsSold
                    },
                    "endpoint": "https://pwc.scopicafrica.com/acc/api_v1/post_sale",
                    "title": "Expenses Posting",
                    "description": "Allows you to post sales made"
                };
                var postSaleParamsa = {
                    "transaction_reference": "",
                    "customer_id": "",
                    "transaction_date": "",
                    "due_date": "",
                    "sale_amount": "",
                    "items": [{
                        "id": "",
                        "amount": ""
                    }]
                };
                //console.log(JSON.stringify(postSaleParams));
                var postExpenseParams = {
                    "sample_data": {
                        "transaction_reference": "randomString",
                        "transaction_date": "{date (Y-m-d)}",
                        "expense_amount": "{}",
                        "items": [{
                            "id": "{int}",
                            "amount": "{optional}"
                        }]
                    },
                    "endpoint": "https://pwc.scopicafrica.com/acc/api_v1/post_expense",
                    "title": "Expenses Posting",
                    "description": "Allows you to post expenses"
                };
                setTimeout(function() {
                    $http({
                        url: APIBASE + 'post_sale',
                        method: "POST",
                        data: postSaleParams,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).then(function(response) {
                        //console.log(response);
                    }, function(response) { // optional
                        //xhrErrorTracking.response();
                        //xhrErrorTracking.responseError();
                        //console.log(response);
                    });
                }, 1000);
            }
            setTimeout(function() {
                ////alert(resp.data);
                // $('#make_select_search_lp').multipleSelect({
                //     placeholder: "Car Make",
                //     filter: true,
                //     selectAll: false,
                //     single:true
                // });
            }, 0)
        });
        //getYears();
        //}]);
        //app.controller('ExpenseCtrl', ['APIBASE', '$scope', '$rootScope', '$timeout', '$http', '$filter', '$q', '$interval', function(APIBASE, $scope, $rootScope, $timeout, $http, $filter, $q, $interval) {
        //The DATA Sources
        var params = {
            "item_type_id": "26"
        }

        /*
            $http({
                url: APIBASE + 'GetItems',
                method: "POST",
                data: params,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function(response) {
                //console.log(response.data);
                $scope.expenseItems = response.data;
                $scope.itemExpenseDetails = function(item) {
                    //console.log(item);
                    $scope.theItem = item;
                    //Post Sales
                    //var d = new Date();
                    var theDate = "{date (" + d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + ")}";
                    var itemCount = 1;
                    //console.log(theDate.toString());
                    var postSaleParams = {
                        "transaction_reference": "string",
                        "customer_id": 1,
                        "transaction_date": theDate.toString(),
                        "due_date": theDate.toString(),
                        "sale_amount": (item.sell_price).toString(),
                        "items": [{
                            "id": (item.id).toString(),
                            "amount": (item.sell_price).toString()
                        }]
                    };
                    var postSaleParamsa = {
                        "transaction_reference": "",
                        "customer_id": "",
                        "transaction_date": "",
                        "due_date": "",
                        "sale_amount": "",
                        "items": [{
                            "id": "",
                            "amount": ""
                        }]
                    };
                    var postExpenseParams = {
                        "sample_data": {
                            "transaction_reference": "randomString",
                            "transaction_date": theDate.toString(),
                            "expense_amount": item.cost_price,
                            "items": [{
                                "id": item.id,
                                "amount": "optional"
                            }]
                        },
                        "endpoint": "https://pwc.scopicafrica.com/acc/api_v1/post_expense",
                        "title": "Expenses Posting",
                        "description": "Allows you to post expenses"
                    };
                    //console.log(JSON.stringify(postExpenseParams));
                    setTimeout(function() {
                        $http({
                            url: APIBASE + 'post_expense',
                            method: "POST",
                            data: postExpenseParams,
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        }).then(function(response) {
                            //console.log(response);
                        }, function(response) { // optional
                            //xhrErrorTracking.response();
                            //xhrErrorTracking.responseError();
                            //console.log('responseresponseresponseresponseresponseresponseresponseresponseresponseresponseresponseresponseresponseresponseresponseresponse');
                        });
                    }, 1000);
                }
            }, function(response) { // optional
                //console.log('response');
            });
        */

        //Purchase Items
        var purchaseParams = {
            "item_type_id": "25"
        }
        /*
            $http({
                url: 'https://pwc.scopicafrica.com/interpreter/GetItems?purchase=1',
                method: "GET",
                //data: purchaseParams,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function(resp) {
                var purchaseItems = resp.data;
                var filteredPurchaseItems = [];
                for (var i = 0; i < purchaseItems.length; i++) {
                    //if(purchaseItems[i]['cost_price'] === null)   {
                    purchaseItems[i]['count'] = 1;
                    purchaseItems[i]['counter'] = true;
                    var maxWordCount = 20;
                    var excerpt = function() {
                        if (purchaseItems[i]['title'].length > maxWordCount) {
                            return purchaseItems[i]['title'].substr(0, maxWordCount) + '.';
                        }
                        return purchaseItems[i]['title'];
                    };
                    purchaseItems[i]['title'] = excerpt();
                    filteredPurchaseItems.push(purchaseItems[i]);
                    //}
                }
                $scope.purchaseItems = filteredPurchaseItems;
                //console.log(filteredPurchaseItems);
                $scope.purchaseMinusCount = function(item) {
                    if (typeof item.count === "undefined") {
                        item.count = 1;
                    }
                    var count = item.count;
                    count--;
                    if (count < 1) {
                        count = 1;
                    }
                    item.count = count;
                    $scope.item = item;
                };
                $scope.purchaseAddCount = function(item) {
                    if (typeof item.count === "undefined") {
                        item.count = 1;
                    }
                    var count = item.count;
                    count++;
                    if (count > 100) {
                        count = 100;
                    }
                    item.count = count;
                    $scope.item = item;
                };
                $scope.purchaseEnableCounter = function(item) {
                    //$scope.activateSell = false;
                    if (item.selected === true) {
                        item.counter = false;
                    } else {
                        item.counter = true;
                    }
                    $scope.item = item;
                    //console.log(item.selected);
                };
                // Check checkboxes checked or not
                $scope.purchaseTheItems = function() {
                    var purchaseReceiptArray = [];
                    var purchaseCheckedItems = [];
                    $scope.purchaseItems.forEach(function(item) {
                        if (item.selected === false) {
                            if (item.title == "") {
                                item.title = "Unnamed";
                            }
                            purchaseReceiptArray.push({
                                "title": (item.title).toString(),
                                "amount": Number(item.sell_price),
                                "quantity": Number(item.count)
                            });
                            purchaseCheckedItems.push({
                                "id": (item.id).toString(),
                                "amount": (item.sell_price).toString(),
                                "quantity": (item.count).toString()
                            });
                            $scope.purchaseClientReceipt = purchaseReceiptArray;
                            var totalSaleAmount = 0;
                            for (var i = 0; i < purchaseReceiptArray.length; i++) {
                                totalSaleAmount = totalSaleAmount + (purchaseReceiptArray[i]['amount'] * purchaseReceiptArray[i]['quantity']);
                            }
                            $scope.totalSaleAmount = totalSaleAmount;
                            //console.log(JSON.stringify(purchaseReceiptArray));
                        }
                    });
                    //var d = new Date();
                    var theDate = "{date (" + d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + ")}";
                    var itemCount = 1;
                    var postPurchaseParams = {
                        "transaction_reference": "string",
                        "supplier_id": 1,
                        "transaction_date": theDate.toString(),
                        "due_date": theDate.toString(),
                        "purchase_amount": (100).toString(),
                        "items": purchaseCheckedItems
                    };
                    //console.log(JSON.stringify(postPurchaseParams));
                    //console.log(purchaseCheckedItems);
                    $scope.purchaseConfirmCheckOut = function() {
                        setTimeout(function() {
                            $http({
                                url: APIBASE + 'CreateBill', //'CreateBill',//'post_purchase',
                                method: "POST",
                                data: postPurchaseParams,
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                }
                            }).then(function(response) {
                                //console.log(response);
                            }, function(response) { // optional
                                ////xhrErrorTracking.response();
                                ////xhrErrorTracking.responseError();
                                //console.log(response);
                            });
                            angular.forEach($scope.purchaseItems, function(item) {
                                item.selected = true;
                                item.counter = true;
                            });
                            //$scope.activateSell = true;
                        }, 1000);
                    }
                }
            }, function(resp) { // optional
                //console.log('response');
            });
        */

        /*
        $http.get(APIBASE + 'GetItems').then(function(resp) {});
        //End of Purchase Items
        //Expense Items
        var expenseParams = {
            "item_type_id": "25"
        }
        $http({
            url: APIBASE + 'GetItems',
            method: "POST",
            data: expenseParams,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function(resp) {
            //console.log(resp.data);
            var expenseItems = resp.data;
            for (var i = 0; i < expenseItems.length; i++) {
                expenseItems[i]['count'] = 1;
                expenseItems[i]['counter'] = true;
                var maxWordCount = 20;
                var excerpt = function() {
                    if (expenseItems[i]['title'].length > maxWordCount) {
                        return expenseItems[i]['title'].substr(0, maxWordCount) + '.';
                    }
                    return expenseItems[i]['title'];
                };
                expenseItems[i]['title'] = excerpt();
            }
            $scope.expenseItems = expenseItems;
            $scope.expenseMinusCount = function(item) {
                if (typeof item.count === "undefined") {
                    item.count = 1;
                }
                var count = item.count;
                count--;
                if (count < 1) {
                    count = 1;
                }
                item.count = count;
                $scope.item = item;
            };
            $scope.expenseAddCount = function(item) {
                if (typeof item.count === "undefined") {
                    item.count = 1;
                }
                var count = item.count;
                count++;
                if (count > 100) {
                    count = 100;
                }
                item.count = count;
                $scope.item = item;
            };
            $scope.expenseEnableCounter = function(item) {
                //$scope.activateSell = false;
                if (item.selected === true) {
                    item.counter = false;
                } else {
                    item.counter = true;
                }
                $scope.item = item;
                //console.log(item.selected);
            };
            // Check checkboxes checked or not
            $scope.expenseTheItems = function() {
                var expenseReceiptArray = [];
                var expenseCheckedItems = [];
                $scope.expenseItems.forEach(function(item) {
                    if (item.selected === false) {
                        if (item.title == "") {
                            item.title = "Unnamed";
                        }
                        expenseReceiptArray.push({
                            "title": (item.title).toString(),
                            "amount": Number(item.sell_price),
                            "quantity": Number(item.count)
                        });
                        expenseCheckedItems.push({
                            "id": (item.id).toString(),
                            "amount": (item.sell_price).toString(),
                            "quantity": (item.count).toString()
                        });
                        $scope.expenseClientReceipt = expenseReceiptArray;
                        var totalSaleAmount = 0;
                        for (var i = 0; i < expenseReceiptArray.length; i++) {
                            totalSaleAmount = totalSaleAmount + (expenseReceiptArray[i]['amount'] * expenseReceiptArray[i]['quantity']);
                        }
                        $scope.totalSaleAmount = totalSaleAmount;
                        //console.log(JSON.stringify(expenseReceiptArray));
                    }
                });
                //var d = new Date();
                var theDate = "{date (" + d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + ")}";
                var itemCount = 1;
                var postexpenseParams = {
                    "sample_data": {
                        "transaction_reference": "string",
                        "supplier_id": 1,
                        "transaction_date": theDate.toString(),
                        "due_date": theDate.toString(),
                        "expense_amount": (100).toString(),
                        "items": expenseCheckedItems
                    },
                    "endpoint": "https://pwc.scopicafrica.com/acc/api_v1/post_expense",
                    "title": "Expenses Posting",
                    "description": "Allows you to post expenses made"
                }
                //console.log(expenseCheckedItems);
                $scope.expenseConfirmCheckOut = function() {
                    setTimeout(function() {
                        $http({
                            url: APIBASE + 'post_expense', //'CreateBill',//'post_expense',
                            method: "POST",
                            data: postexpenseParams,
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        }).then(function(response) {
                            //console.log(response);
                        }, function(response) { // optional
                            ////xhrErrorTracking.response();
                            ////xhrErrorTracking.responseError();
                            //console.log(response);
                        });
                        angular.forEach($scope.expenseItems, function(item) {
                            item.selected = true;
                            item.counter = true;
                        });
                        //$scope.activateSell = true;
                    }, 1000);
                }
            }
        }, function(resp) { // optional
            //console.log('response');
        });
        */

        //End of Expense Items
        //SALES REPORT
        /*
        $http({
            url: 'https://pwc.scopicafrica.com/interpreter/Sales?connection_id=5',
            method: "GET",
            //data: purchaseParams,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function(resp) {
            var salesData = resp['data']['data'];
            //var d = new Date();
            var formatMonth = (d.getMonth() + 1);
            if (formatMonth < 10) {
                formatMonth = '0' + formatMonth;
            }
            var formatDay = d.getDate();
            if (formatDay < 10) {
                formatDay = '0' + formatDay;
            }
            var dateToday = +d.getFullYear() + "-" + formatMonth + "-" + formatDay;
            var totalSales = 0;
            var todaySales = 0;
            for (var i = 0; i < salesData.length; i++) {
                totalSales = totalSales + salesData[i]['total_amount'];
            }
            //Calculate sales in the last 24 hours
            for (var i = 0; i < salesData.length; i++) {
                if (dateToday === (salesData[i]['transaction_date']['date']).replace(' 00:00:00.000000', '')) {
                    todaySales = totalSales + salesData[i]['total_amount'];
                }
            }
            for (var i = 0; i < salesData.length; i++) {
                salesData[i]['total_amount'] = addCommas((salesData[i]['total_amount']).toFixed(2));
            }
            $scope.salesData = salesData;
            $scope.totalSales = addCommas(totalSales.toFixed(2));
            $scope.todaySales = addCommas(todaySales.toFixed(2));
            //console.log('sales report data');
            //console.log(totalSales);
            //console.log($scope.salesData);
        }, function(resp) { // optional
            //console.log('response');
        });
        */
        //PURCHASES REPORT
        /*
        $http({
            url: 'https://pwc.scopicafrica.com/interpreter/Purchases?connection_id=5',
            method: "GET",
            //data: purchaseParams,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function(resp) {
            var purchasesData = resp['data']['data'];
            var totalPurchases = 0;
            // Add comma to output
            //-------------------------------------------------------------------//
            function addCommas(num) {
                var str = num.toString().split('.');
                if (str[0].length >= 4) {
                    //add comma every 3 digits befor decimal
                    str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
                }
                /* Optional formating for decimal places
                if (str[1] && str[1].length >= 4) {
                    //add space every 3 digits after decimal
                    str[1] = str[1].replace(/(\d{3})/g, '$1 ');
                }*/
                /*
                return str.join('.');
            }
            for (var i = 0; i < purchasesData.length; i++) {
                totalPurchases = totalPurchases + purchasesData[i]['total_amount'];
            }
            for (var i = 0; i < purchasesData.length; i++) {
                purchasesData[i]['total_amount'] = addCommas((purchasesData[i]['total_amount']).toFixed(2));
            }
            $scope.purchasesData = purchasesData;
            $scope.totalPurchases = addCommas(totalPurchases.toFixed(2));
            //console.log('totalPurchases report data');
            //console.log(totalPurchases);
        }, function(resp) { // optional
            //console.log('response');
        });
        */
        //Monthly expenses
        //Manage sales records
        //{
        $scope.aa = 45000 * 7;
        $scope.getKey = function(object) {
            return Object.keys(object)[0];
        };
        var dayTotalSales = 0;
        var dailySales; // = $firebaseArray(FBSalesref);
        FBSalesref.orderByKey().on("value", function(snapshot) {
            var returnData = snapshot.val();
            var testData = {
                "14-10-2018": {
                    "-LOlnFRE1wERkbW0ZBkt": {
                        "itemID": "DevD",
                        "itemSellPrice": 1950,
                        "itemTitle": "Development work - d.",
                        "quantity": 3,
                        "time": "11:59"
                    },
                    "-LOlnFRMKfBSk3xrB3xs": {
                        "itemID": "DevH",
                        "itemSellPrice": 90,
                        "itemTitle": "Development work - p.",
                        "quantity": 1,
                        "time": "11:59"
                    },
                    "-LOlnFRPUEHcplUEqUzh": {
                        "itemID": "Support-M",
                        "itemSellPrice": 1000,
                        "itemTitle": "Desktop/network supp.",
                        "quantity": 2,
                        "time": "11:59"
                    }
                }
            };
            //console.log('returnDatareturnDatareturnDatareturnData');
            //console.log(JSON.stringify(testData));
            //console.log(JSON.stringify(returnData));
            //returnData = testData;
            var arrayOfDaySales = [];
            var objCounts = 0;
            for (var key in returnData) {
                if (returnData.hasOwnProperty(key)) {
                    objCounts++;
                    //console.log(objCounts);
                    var theDataValue = returnData[key];
                    //console.log(key + " ->>> " + theDataValue + " count: " + objCounts);
                    var theDataArray = [];
                    for (var dataKey in theDataValue) {
                        if (theDataValue.hasOwnProperty(dataKey)) {
                            theDataArray.push(theDataValue[dataKey]);
                            //console.log(dataKey + " -> " + theDataValue[dataKey]);
                            //console.log(theDataArray);
                        }
                    }
                    returnData[key] = theDataArray;
                    var saleData = {};
                    saleData[key] = theDataArray;
                    arrayOfDaySales.push(saleData);
                }
            }
            dailySales = arrayOfDaySales;
            //console.log('dailySalesAAAAAAA');
            //console.log(dailySales);

            $scope.todayStats = dayTotalSales;
            $timeout(function() {
                $scope.todayStats = dayTotalSales;
            }, 3000);

            //console.log(JSON.stringify(dailySales));
            for (var i = 0; i < dailySales.length; i++) {
                var theDayKeyFun = function(object) {
                    return Object.keys(object)[0];
                };
                var theDayKey = theDayKeyFun(dailySales[i]);
                var theDayArray = dailySales[i][theDayKey];
                var theDayTotals = 0;
                var itemSoldCount = 0;
                for (var k = 0; k < theDayArray.length; k++) {
                    theDayTotals = theDayTotals + theDayArray[k]['itemSellPrice'];
                    itemSoldCount = itemSoldCount + theDayArray[k]['quantity'];
                    //console.log('theDayKey');
                    //console.log(theDayKey);
                    //console.log(theDateToday);
                    if (theDayKey === theDateToday) {
                        dayTotalSales = dayTotalSales + theDayArray[k]['itemSellPrice'];
                    }
                }
                dailySales[i]['dayTotal'] = theDayTotals;
                dailySales[i]['itemCount'] = itemSoldCount; //theDayArray.length;
            }
            //$scope.monthlySales = dailySales;
            $interval(function() {
                ////console.log('dayTotalSales: '' + dayTotalSales);
                $scope.monthlySales = dailySales;
                $scope.dailyTotalSales = dayTotalSales;
            }, 1000);


            $(document).ready(function() {
                //'use strict'
                //(function($){
                //Toggle Box
                // setTimeout(function() {
                //     $('[data-toggle-box]').on('click', function() {
                //         $(this).parent().toggleClass("active");
                //         var toggle_box = $(this).data('toggle-box');
                //         if ($('#' + toggle_box).is(":visible")) {
                //             $('#' + toggle_box).slideUp(250);
                //         } else {
                //             $("[id^='box']").slideUp(250);
                //             $('#' + toggle_box).slideDown(250);
                //         }
                //     });
                // }, 3000);
                //})(jQuery);
            });


        })


   //END OF CUSTOM CODE











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
            }).then(function(answer) {
              alert('you submitted - ' + answer);
            }, function() {

            // For show alert Dialog.
            //$scope.showSaleAlertDialog = function ($event) {
                $timeout(function() {
                    $mdDialog.show({
                        controller: 'DialogController',
                        templateUrl: 'confirm-dialog.html',
                        targetEvent: $event,
                        locals: {
                            displayOption: {
                                title: "Good!",
                                content: "You have made a successfully sale",
                                ok: "Confirm"
                            }
                        }
                    }).then(function () {
                        $scope.dialogResult = "You choose Confirm!"
                    });
                },1000);
            //}

            });
        }


        //GET TOTAL EXPENDITURE
        var budgetData = [];
        var copyBudgetData;
        var budgetSummary = [];
        var monthlyExpenses = [];
        var donorWkExpTotals = [];

        FBBudgetref.orderByKey().on("value", function(snapshot) {
            budgetData = [];
            budgetSummary = [];
            monthlyExpenses = [];
            donorWkExpTotals = [];

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

            console.log('budgetData2');
            console.log(budgetData);

            copyBudgetData = budgetData;

            console.log('copyBudgetData2');
            console.log(copyBudgetData);

            var budgetObjs = localStorage.getItem("compTypes");

            console.log('budgetTypesbudgetTypesbudgetTypesbudgetTypes');
            console.log(typeof budgetObjs);
            budgetTypes = JSON.parse(budgetObjs);

            console.log('thebudgetObjs');
            console.log(budgetObjs);

            $scope.budgetTypes = budgetTypes;

            //Components Activity Types


            //var budgetTypes = [{"id":21,"alias":"Business Expense","item_code":"00100","item_type_id":26,"title":"Business Expense","description":"Transport","cost_price":20000,"sell_price":0,"in_stock":0,"photo_1":null,"photo_2":null,"photo_3":null},{"id":22,"alias":"Personal Expense","item_code":"00100","item_type_id":26,"title":"Personal Expense","description":"Transport","cost_price":20000,"sell_price":0,"in_stock":0,"photo_1":null,"photo_2":null,"photo_3":null},{"id":23,"alias":"COGS","item_code":"00100","item_type_id":26,"title":"Stock Expense","description":"Employee Payroll","cost_price":20000,"sell_price":0,"in_stock":0,"photo_1":null,"photo_2":null,"photo_3":null}];//$scope.expenseTypes;


            setTimeout(function() {



                $scope.weekBudgetSummary = 'active';

                var dayTotalExpenses = 0;
                var dailyExpenses; // = $firebaseArray(FBExpensesref);

                var t = 0;

                FBExpensesref.orderByKey().on("value", function(snapshot) {
                    t++;
                    console.log('TTTTTTT: '+t);

                    monthlyExpenses = [];
                    donorWkExpTotals = [];

                    var returnData = snapshot.val();
                    //console.log('returnDatareturnDatareturnDatareturnData');
                    //console.log(JSON.stringify(returnData));
                    //returnData = testData;
                    var arrayOfDayExpenses = [];
                    var objCounts = 0;
                    for (var key in returnData) {
                        if (returnData.hasOwnProperty(key)) {
                            objCounts++;
                            //console.log(objCounts);
                            var theDataValue = returnData[key];
                            //console.log(key + " ->>>>>>>> " + theDataValue + " count: " + objCounts);
                            var theDataArray = [];
                            for (var dataKey in theDataValue) {
                                if (theDataValue.hasOwnProperty(dataKey)) {
                                    theDataArray.push(theDataValue[dataKey]);
                                    //console.log(dataKey + " -> " + theDataValue[dataKey]);
                                    monthlyExpenses.push({
                                        'day': key,
                                        'expType': theDataValue[dataKey]['itemType'],
                                        'time': theDataValue[dataKey]['time'],
                                        'amount': theDataValue[dataKey]['itemCost'],
                                        'desc': theDataValue[dataKey]['itemDesc'],
                                    });
                                    //console.log(theDataArray);
                                }
                            }
                            //console.log('monthlyExpensesmonthlyExpensesmonthlyExpensesmonthlyExpensesmonthlyExpenses');
                            //console.log(monthlyExpenses);
                            returnData[key] = theDataArray;
                            var expenseData = {};
                            expenseData[key] = theDataArray;
                            arrayOfDayExpenses.push(expenseData);
                        }
                    }

                    dailyExpenses = arrayOfDayExpenses;
                    //console.log('dailyExpensesAAAAAAA');
                    //console.log(dailyExpenses);
                    //console.log(JSON.stringify(dailyExpenses));
                    for (var i = 0; i < dailyExpenses.length; i++) {
                        var theDayKeyFun = function(object) {
                            return Object.keys(object)[0];
                        };
                        var theDayKey = theDayKeyFun(dailyExpenses[i]);
                        var theDayArray = dailyExpenses[i][theDayKey];
                        var theDayTotals = 0;
                        for (var k = 0; k < theDayArray.length; k++) {
                            theDayTotals = theDayTotals + theDayArray[k]['itemCost'];
                            //console.log('theDayKeyaaaaa');
                            //console.log(theDayKey);
                            //console.log(theDateToday);
                            if (theDayKey === theDateToday) {
                                dayTotalExpenses = dayTotalExpenses + theDayArray[k]['itemCost'];
                            }
                        }
                        dailyExpenses[i]['dayTotal'] = theDayTotals;
                        dailyExpenses[i]['expCount'] = (dailyExpenses[i][theDayKey]).length;
                    }

                    var monthsIndex = 13;
                    var allYearWeeks = [];
                    var halfWeeks = 0;
                    var weekCount = 0;
                    var alterStart,alterEnd,alterMonth;

                    var currentWkNo;
                    var currentMthNo = d.getMonth();
                    var currentYrNo = d.getFullYear();
                    var weekNumber;
                    var yearData;
                    var yearsList = [];
                    var mthTabClicks = 0; //Count how many times you click the months tab
                    currentWkChart, currentMthChart, currentYrChart;

                    $scope.yearData = [{'name':'Jan','mthCount':0,},{'name':'Feb','mthCount':1,},{'name':'Mar','mthCount':2,},{'name':'Apr','mthCount':3,},{'name':'May','mthCount':4,},{'name':'Jun','mthCount':5,},{'name':'Jul','mthCount':6,},{'name':'Aug','mthCount':7,},{'name':'Sep','mthCount':8,},{'name':'Oct','mthCount':9,},{'name':'Nov','mthCount':10,},{'name':'Dec','mthCount':11,}];
                    yearData = $scope.yearData;

                    function getCurrentWkNo(){
                        var dayNumber;
                        Date.prototype.getWeek = function () {
                            var target  = new Date(this.valueOf());
                            //console.log(target);
                            var dayNr   = ((this.getDay() + 6) % 7);
                            dayNumber = dayNr;
                            //console.log('dayNr: '+dayNr);
                            target.setDate(target.getDate() - dayNr + 3);
                            var firstThursday = (target.valueOf());
                            //console.log('firstThursday');
                            //console.log(firstThursday);
                            target.setMonth(0, 1);
                            if (target.getDay() != 4) {
                                target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
                            }
                            return 1 + Math.ceil((firstThursday - target) / 604800000);
                        }

                        var d= new Date();
                        
                        if(dayNumber===6){
                            weekNumber = (d.getWeek())+1;
                        }else{
                            weekNumber = d.getWeek();
                        }

                        //alert(weekNumber)

                    };

                    getCurrentWkNo();

                    //Get all the weeks of the current year

                    function getWeeksInMonth(month, year){
                       var weeks=[],
                           firstDate=new Date(year, month, 1),
                           lastDate=new Date(year, month+1, 0), 
                           numDays= lastDate.getDate();
                            //console.error(firstDate);
                            //console.error(lastDate);
                            //console.error(":"+numDays);
                       
                       var start=1;
                       var end=7-firstDate.getDay();
                       while(start<=numDays){
                            
                            weeks.push({start:alterStart,end:alterEnd});
                            
                            if((end-start)<6){
                                halfWeeks++;
                                if(halfWeeks===1){
                                    alterStart = start;
                                    alterMonth = month;
                                    var endMonthDate = (lastDate.toString()).split(" ")[2];
                                    //console.log(typeof endMonthDate+"--------"+ typeof end);

                                    if(month == 0 && endMonthDate != end){
                                        weekCount++;
                                        allYearWeeks.push({start:{'date':start,'month':month},end:{'date':end,'month':month},'weekCount':weekCount});
                                    }
                                }else{
                                    weekCount++;
                                    alterEnd = end;
                                    allYearWeeks.push({start:{'date':alterStart,'month':alterMonth},end:{'date':alterEnd,'month':month},'weekCount':weekCount});
                                }
                            } else {
                                weekCount++;
                                halfWeeks = 0;
                                allYearWeeks.push({start:{'date':start,'month':month},end:{'date':end,'month':month},'weekCount':weekCount});
                            }



                           start = end + 1;
                           end = end + 7;
                           if(end>numDays)
                               end=numDays;    
                       }        
                        return weeks;
                    }

                    for (var i = 0; i < monthsIndex; i++) {
                        getWeeksInMonth(i,d.getFullYear());
                    }

                    //Automatically display chart of the current week
                    currentWkChart = function(budgetDur){

                        donorWkExpTotals = [];
                        budgetSummary = [];

                        for (var i = 0; i < budgetTypes.length; i++) {
                            var budgetKey = (budgetTypes[i]['title']).replace(/\s/g, '');

                            console.log('donorWkExpTotalkkkkk');
                            console.log(donorWkExpTotals);

                            //console.log(JSON.stringify(donorWkExpTotals));

                            donorWkExpTotals.push({
                                'title':budgetKey,
                                'total':0,
                                'activities':[]
                            });

                            console.log('donorWkExpTotalsssss: '+i+" : "+(budgetTypes.length-2));
                            console.log(donorWkExpTotals);
                        }
                
                        for (var i = 0; i < budgetTypes.length; i++) {

                            //console.log(budgetTypes[i]);

                            var totalBudget = 0;//total weekly Budget NB: if budget duration is year, divide ans/52 weeks
                            var budgetedActivities = [];

                            console.log('budgetDatabudgetDatabudgetDatabudgetData');
                            console.log(budgetData);



                            budgetData.forEach(function(item) {
                                if(item['itemType'] == budgetTypes[i]['title']){
                                    // if(item['itemDur']=='week'){
                                    //     totalBudget = 0;//totalBudget+item['itemCost'];
                                    // }

                                    if(budgetDur == 'week'){
                                        switchDuration = 'day';
                                    }

                                    if(item['itemDur']==budgetDur){
                                        totalBudget = totalBudget+(item['itemCost']/1);
                                    }else if (item['itemDur']==switchDuration){
                                        totalBudget = totalBudget+(item['itemCost']/1);
                                    }else if (item['itemDur']=='week'){
                                        totalBudget = totalBudget+(item['itemCost']/1);
                                    }
                                    // if(item['itemDur']=='year'){
                                    //     totalBudget = 0;//totalBudget+(item['itemCost']/52);
                                    // }

                                    budgetedActivities.push({
                                        actCost: item['itemCost'],//amount budgeted per activity
                                        activity: item['itemAct'],//activity budgeted for
                                        duration: item['itemDur']//budgeted period
                                    });

                                }
                            });

                            budgetSummary.push({
                                'budgetType': (budgetTypes[i]['title']).replace(/\s/g, ''),
                                'budgetNameType': (budgetTypes[i]['title']),
                                'budgetTotal':totalBudget,
                                'budgetActivities': budgetedActivities
                            });

                        }


                        //console.log('budgetDatabudgetDatabudgetData');
                        //console.log(budgetData);
                        //console.log(budgetTypes);
                        console.log('budgetSummary___');
                        console.log(budgetSummary);


                        //console.log('allYearWeeksallYearWeeksallYearWeeksallYearWeeks');
                        //console.log(allYearWeeks);

                        currentWkNo = weekNumber;
                        var weekData = allYearWeeks[currentWkNo-1];
                        var startDate = weekData.start.date;
                        var endDate = weekData.end.date;
                        var fromMonth = weekData.start.month;
                        var toMonth = weekData.end.month;

                        var currentWeekBarCharts = function(startDate,endDate,fromMonth,toMonth) {

                            //console.log(startDate+' : '+endDate+' : '+fromMonth+' : '+toMonth)

                            ////alert('official period');
                            console.log('official__chart');
                            if (typeof period == 'undefined') {
                                period = "week2";
                            }

                            var lowerDate;
                            var upperDate;
                            var targetMonth;
                            totalBusinessExpenses = 0;
                            totalPersonalExpenses = 0;
                            totalStockExpenses = 0;
                            totalExpenses = 0;


                            


                            console.log('donorWkExpTotal11111');

                            console.log(donorWkExpTotals);
                            //var donorWkExpTotals = [];
                            console.log(donorWkExpTotals);



                            
                            //console.log('monthlyExpenseAAAA');
                            //console.log(monthlyExpenses);



                            for (var i = 0; i < monthsIndex.length; i++) {
                                monthsIndex[i]
                            }

                            var tempTotal = 0;

                            for (var i = 0; i < monthlyExpenses.length; i++) {
                                var theDay = Number(((monthlyExpenses[i]['day']).split("-"))[0]);
                                var theMonth = Number(((monthlyExpenses[i]['day']).split("-"))[1])-1;

                                //console.log('theDay: '+theDay);

                                    console.error('error2');

                                    console.error(monthlyExpenses);

                                    //if(i>(budgetTypes.length-2)){
                                        if((theMonth==fromMonth)&&(theMonth==toMonth)){
                                            if (theDay > (startDate - 1) && theDay < (endDate + 1)) {
                                                //console.log(theDay);
                                                totalExpenses = totalExpenses + monthlyExpenses[i]['amount'];

                                                console.error('budgetTypesbudgetTypesbudgetTypes');
                                                console.log((budgetTypes.length));
                                                console.log(JSON.stringify(budgetTypes));

                                                tempTotal = 0;

                                                console.error("Temptoatals: "+tempTotal);

                                                budgetTypes.forEach(function(item){
                                                    var budgetKey = (item.title).replace(/\s/g, '');
                                                    if(monthlyExpenses[i]['expType'] == (item.title)){
                                                        var n = 0;

                                                        donorWkExpTotals.forEach(function(expItem){

                                                            var budgetKey = (monthlyExpenses[i]['expType']).replace(/\s/g, '');

                                                            //console.log("monthlyExpenses[i]['expType']: "+budgetKey);
                                                            //console.log("expItem.title: "+expItem.title);

                                                            if(budgetKey == expItem.title){
                                                                console.error('targetIssue');
                                                                console.error(monthlyExpenses[i]['amount']);



                                                                tempTotal = tempTotal+monthlyExpenses[i]['amount']+donorWkExpTotals[n]['total'];

                                                                console.error("nNNNNNNNNNNNN: "+n+" : "+tempTotal+" : "+monthlyExpenses[i]['amount']+" : "+donorWkExpTotals[n]['total']+" CountArray: "+donorWkExpTotals.length);
                                                                console.error(n);

                                                                donorWkExpTotals[n]['total'] = tempTotal;

                                                                (donorWkExpTotals[n]['activities']).push({
                                                                                'activity':monthlyExpenses[i]['desc'],
                                                                                'actCost':monthlyExpenses[i]['amount']
                                                                            });


                                                            }

                                                            console.log('donorWk_ExpTotals');
                                                            console.log(donorWkExpTotals);
                                                            console.log(JSON.stringify(donorWkExpTotals));

                                                            n++;
                                                        });

                                                    }
                                                });
                                            }
                                        }else{
                                            if(theMonth === fromMonth){
                                                if (theDay > (startDate - 1)) {
                                                    //console.log('formulae1: '+theDay);
                                                    tempTotal = 0;

                                                    totalExpenses = totalExpenses + monthlyExpenses[i]['amount'];

                                                    budgetTypes.forEach(function(item){
                                                        var budgetKey = (item.title).replace(/\s/g, '');
                                                        if(monthlyExpenses[i]['expType'] == (item.title)){
                                                            var n = 0;

                                                            donorWkExpTotals.forEach(function(expItem){

                                                                var budgetKey = (monthlyExpenses[i]['expType']).replace(/\s/g, '');

                                                                //console.log("monthlyExpenses[i]['expType']: "+budgetKey);
                                                                //console.log("expItem.title: "+expItem.title);

                                                                if(budgetKey == expItem.title){
                                                                    console.error('targetIssue');
                                                                    console.error(monthlyExpenses[i]['amount']);

                                                                    tempTotal = tempTotal+monthlyExpenses[i]['amount'];
                                                                    donorWkExpTotals[n]['total'] = tempTotal;
                                                                }



                                                                console.error("nNNNNNNNNNNNN2: "+n+" : "+tempTotal);
                                                                console.log('donorWk_ExpTotals');

                                                                console.log(JSON.stringify(donorWkExpTotals));

                                                                n++;
                                                            });

                                                        }
                                                    });

                                                }
                                            }
                                            if(theMonth === toMonth){
                                                if (theDay < (endDate + 1)) {
                                                    //console.log('formulae2: '+theDay);
                                                    tempTotal = 0;
                                                    
                                                    totalExpenses = totalExpenses + monthlyExpenses[i]['amount'];

                                                    budgetTypes.forEach(function(item){
                                                        var budgetKey = (item.title).replace(/\s/g, '');
                                                        if(monthlyExpenses[i]['expType'] == (item.title)){
                                                            var n = 0;

                                                            donorWkExpTotals.forEach(function(expItem){

                                                                var budgetKey = (monthlyExpenses[i]['expType']).replace(/\s/g, '');

                                                                //console.log("monthlyExpenses[i]['expType']: "+budgetKey);
                                                                //console.log("expItem.title: "+expItem.title);

                                                                if(budgetKey == expItem.title){
                                                                    console.error('targetIssue');
                                                                    console.error(monthlyExpenses[i]['amount']);

                                                                    tempTotal = tempTotal+monthlyExpenses[i]['amount'];
                                                                    donorWkExpTotals[n]['total'] = tempTotal;
                                                                }

                                                                console.error("nNNNNNNNNNNNN3: "+n+" : "+tempTotal);
                                                                console.log('donorWk_ExpTotals');

                                                                console.log(JSON.stringify(donorWkExpTotals));

                                                                n++;
                                                            });

                                                        }
                                                    });
                                                }
                                            }
                                        }

                                    //}
                                
                            }
                            //console.log('totalBusinessExpenses');
                            //console.log(totalBusinessExpenses);


                            console.log('donorWkExpTotals');
                            console.log(JSON.stringify(donorWkExpTotals));

                            console.error('init_budgetSummary');
                            console.error(budgetSummary);


                            for (var i = 0; i < budgetSummary.length; i++) {

                                //budgetTypes.forEach(function(item){
                                var k = 0;


                                donorWkExpTotals.forEach(function(expTotalItem){

                                    console.log(budgetSummary[i]['budgetType']);
                                    console.log('budget___Summary');
                                    console.log(expTotalItem.title);

                                    if(budgetSummary[i]['budgetType'] == expTotalItem.title){
                                        
                                        //donorWkExpTotals.forEach(function(expTotalItem){
                                            //if(budgetSummary[i]['budgetType'] == expTotalItem.title){
                                                console.error('budgetType: '+budgetSummary[i]['budgetType']);
                                                console.error('budgetTotal: '+budgetSummary[i]['budgetTotal']);
                                                console.error('donorWkExpTotals: '+donorWkExpTotals[k]['total']);
                                                console.error('expTotalItem.title: '+expTotalItem.title);
                                                console.error('kkkkkkkkk: '+k);

                                                var budgetRatio = donorWkExpTotals[k]['total']/(budgetSummary[i]['budgetTotal']);

                                                if(isNaN(budgetRatio)){
                                                    budgetRatio = 0;
                                                }

                                                budgetSummary[i]['budgetRatio'] = budgetRatio;
                                                budgetSummary[i]['budgetSpent'] = donorWkExpTotals[k]['total'];
                                                budgetSummary[i]['budgetSum'] = (budgetSummary[i]['budgetTotal']);
                                                budgetSummary[i]['activities'] = donorWkExpTotals[k]['activities']
                                                
                                            //}
                                        //});

                   
                                        console.log('budgetSummarybudgetSummarybudgetSummary');
                                        console.log(budgetSummary);




                                    }
                                    k++;
                                    console.log('donorWkExp__KKKKK: '+k);
                                })

                                
                                console.log('donorWkExp__Totals');
                                console.log(donorWkExpTotals);



                                /*

                                                    budgetTypes.forEach(function(item){
                                                        var budgetKey = (item.title).replace(/\s/g, '');
                                                        if(monthlyExpenses[i]['expType'] == (item.title)){
                                                            var n = 0;

                                                            donorWkExpTotals.forEach(function(expItem){

                                                                var budgetKey = (monthlyExpenses[i]['expType']).replace(/\s/g, '');

                                                                //console.log("monthlyExpenses[i]['expType']: "+budgetKey);
                                                                //console.log("expItem.title: "+expItem.title);

                                                                if(budgetKey == expItem.title){
                                                                    console.error('targetIssue');
                                                                    console.error(monthlyExpenses[i]['amount']);

                                                                    tempTotal = tempTotal+monthlyExpenses[i]['amount'];
                                                                    donorWkExpTotals[n]['total'] = tempTotal;
                                                                }

                                                                console.log('donorWk_ExpTotals');
                                                                console.log(JSON.stringify(donorWkExpTotals));

                                                                n++;
                                                            });

                                                        }
                                                    });
                                */


                                
                                    //if(i>(budgetSummary.length-2)){

                                        budgetSummary = budgetSummary.filter((thing, index, self) =>
                                          index === self.findIndex((t) => (
                                            t.budgetType === thing.budgetType
                                          ))
                                        );

                                        $scope.budgetitems = budgetSummary;

                                        console.log('$scope_budgetitems');
                                        console.log(budgetSummary);
                                        console.log(JSON.stringify(budgetSummary));
                                    //}

                            }

                            // Section 1 Chart 1
                            var totalBusinessExpPercent = Math.round(totalBusinessExpenses / totalExpenses * 100);
                            var totalPersonalExpPercent = Math.round(totalPersonalExpenses / totalExpenses * 100);
                            var totalStockExpPercent = Math.round(totalStockExpenses / totalExpenses * 100);


                            //console.log('totalBusinessExpPercent');
                            //console.log(totalBusinessExpPercent);

                            if(isNaN(totalBusinessExpPercent)){
                                totalBusinessExpPercent = 0;
                            }
                            if(isNaN(totalPersonalExpPercent)){
                                totalPersonalExpPercent = 0;
                            }
                            if(isNaN(totalStockExpPercent)){
                                totalStockExpPercent = 0;
                            }

                        };

                            var quickBudgetStats = function(){

                                quickSpentTotals = 0;
                                quickBudgetTotals = 0;

                                for (var i = 0; i < budgetSummary.length; i++) {
                                    //budgetSummary[i]
                                    console.log(budgetSummary[i]);

                                    var quickSpent = Number(budgetSummary[i]['budgetSpent']);
                                    var quickBudget = Number(budgetSummary[i]['budgetTotal']);

                                    if(isNaN(quickSpent)){
                                        quickSpent = 0;
                                    }
                                    if(isNaN(quickBudget)){
                                        quickBudget = 0;
                                    }


                                    quickSpentTotals = quickSpentTotals + quickSpent;
                                    quickBudgetTotals = quickBudgetTotals + quickBudget;

                                    $scope.quickSpentTotals = quickSpentTotals;
                                    $scope.quickBudgetTotals = quickBudgetTotals;

                                    $scope.quickBudgetPerc = (quickSpentTotals/quickBudgetTotals)*100;

                                }

                                console.log('quickBudgetTotals: '+quickBudgetTotals);
                                console.log('quickSpentTotals: '+quickSpentTotals);

                            };

                            $timeout(function() {
                                quickBudgetStats();
                            }, 500);

                        //$timeout(function(){
                            currentWeekBarCharts(startDate,endDate,fromMonth,toMonth);
                        //},300);

                    }

                    currentMthChart = function(budgetDur){

                        donorWkExpTotals = [];
                        budgetSummary = [];

                        for (var i = 0; i < budgetTypes.length; i++) {
                            var budgetKey = (budgetTypes[i]['title']).replace(/\s/g, '');

                            console.log('donorWkExpTotalkkkkk');
                            console.log(donorWkExpTotals);

                            //console.log(JSON.stringify(donorWkExpTotals));

                            donorWkExpTotals.push({
                                'title':budgetKey,
                                'total':0,
                                'activities':[]
                            });

                            console.log('donorWkExpTotalsssss: '+i+" : "+(budgetTypes.length-2));
                            console.log(donorWkExpTotals);
                        }
                
                        for (var i = 0; i < budgetTypes.length; i++) {

                            //console.log(budgetTypes[i]);

                            var totalBudget = 0;//total weekly Budget NB: if budget duration is year, divide ans/52 weeks
                            var budgetedActivities = [];

                            console.log('budgetDatabudgetDatabudgetDatabudgetData');
                            console.log(budgetData);

                            var monthlyBudget = 0;
                            var weeklyBudget = 0;

                            var timePriodsBudgets = function(){

                                var yearlyBudget = 0;
                                var thefinalYrBudget;
                                var monthlyBudget = 0;
                                var weeklyBudget = 0;
                                var activityBudgetsYr = [];
                                var activityBudgetsMth = [];
                                var activityBudgetsWk = [];

                                //Refined Monthly Budget Totals Variables
                                var cumBudgetItemDiff = 0;
                                var cumMonthlyBudgetA = 0;
                                var cumMonthlyBudgetB = 0;
                                var cumBudgetItemActA;
                                var cumBudgetItemTypeA;
                                var cumBudgetItemActB;
                                var cumBudgetItemTypeB;
                                var cumBudgetItemActC;
                                var cumBudgetItemTypeC;


                                var totalBudgetA, totalBudgetB;

                                var totalTargetBudget = 0;
                                var totalTargetBudgetYr = 0;
                                var totalTargetBudgetMth = 0;
                                var totalTargetBudgetWk = 0;
                                //End of refined Monthly Budget Totals Variables
                                var newBudgetTotals = [];
                                var allBudgetedActivities = [];
                                var newBudgetTotalsYr = [];
                                var newBudgetTotalsMth = [];
                                var newBudgetTotalsWk = [];

                                budgetData.forEach(function(item) {
                                    if(item['itemType'] == budgetTypes[i]['title']){

                                        if((item['itemDur'] == 'year')){
                                            totalTargetBudgetYr = item['itemCost'];

                                            newBudgetTotals.push({
                                                                    'activityID':'A_year'+(budgetKey+'_'+item['itemAct']),
                                                                    'totalBudget':totalTargetBudgetYr
                                                                });
                                            allBudgetedActivities.push(budgetKey+'_'+item['itemAct']);

                                                console.log(newBudgetTotals);
                                                console.log('theWWWWWWWWW1: ');
                                        }
                                        if((item['itemDur'] == 'month')){
                                            totalTargetBudgetMth = item['itemCost'];

                                            newBudgetTotals.push({
                                                                    'activityID':'B_month'+(budgetKey+'_'+item['itemAct']),
                                                                    'totalBudget':totalTargetBudgetMth
                                                                });
                                            allBudgetedActivities.push(budgetKey+'_'+item['itemAct']);

                                                console.log(newBudgetTotals);
                                                console.log('theWWWWWWWWW2: ');
                                        }
                                        if((item['itemDur'] == 'week')){
                                            totalTargetBudgetWk = item['itemCost'];

                                            newBudgetTotals.push({
                                                                    'activityID':'C_week'+(budgetKey+'_'+item['itemAct']),
                                                                    'totalBudget':totalTargetBudgetWk
                                                                });
                                            allBudgetedActivities.push(budgetKey+'_'+item['itemAct']);

                                                console.log(newBudgetTotals);
                                                console.warn('theWWWWWWWWW3: '+totalTargetBudgetWk);
                                        }

     
                                                allBudgetedActivities = allBudgetedActivities.filter(function(item, pos) {
                                                    return allBudgetedActivities.indexOf(item) == pos;
                                                });

                                                console.log(JSON.stringify(newBudgetTotals));
                                                console.log('theWWWWWWWWW4: '+newBudgetTotals.length);
                                                console.log('allBudgetedActivities: '+allBudgetedActivities);
                                                console.log('allBudgetedActivities4: '+allBudgetedActivities.length);

                                                totalTargetBudget = 0;


                                                newBudgetTotals.sort(function(a, b) {
                                                    var textA = a.activityID.toUpperCase();
                                                    var textB = b.activityID.toUpperCase();
                                                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                                                });

                                                console.warn(newBudgetTotals.length);


                                        budgetedActivities.push({
                                            actCost: item['itemCost'],//amount budgeted per activity
                                            activity: item['itemAct'],//activity budgeted for
                                            duration: item['itemDur']//budgeted period
                                        });

                                    }
                                });

                                                    
                                                    var runForYr=true, runForMth=true, runForWk=true;
                                                    var activitiesRanFor = [];

                                                    console.warn(allBudgetedActivities);

                                                newBudgetTotals.forEach(function(item) {

                                                    allBudgetedActivities.forEach(function(itemAct) {

                                                            //console.warn('initYear for '+yrValid);

                                                        // if(item.activityID==('A_year'+itemAct)){
                                                        //     totalTargetBudget = totalTargetBudget + item.totalBudget;
                                                        //     //activitiesRanFor.push(itemAct);
                                                        //     runForMth = 'false'+itemAct;
                                                        //     runForWk = 'false'+itemAct;
                                                        //     console.warn('runTheYear for '+itemAct+" TotalBudget: "+totalTargetBudget+" item.totalBudget: "+item.totalBudget);
                                                        // }
                                                        if(item.activityID==('B_month'+itemAct)){

                                                            console.warn('runForMthhhhh: '+runForMth);
                                                            console.warn('runForMtkkkkk: '+('false'+itemAct));

                                                            totalTargetBudget = totalTargetBudget + item.totalBudget;
                                                            console.warn('runTheMonth for '+itemAct+" TotalBudget: "+totalTargetBudget+" item.totalBudget: "+item.totalBudget);
                                                            runForWk = 'false'+itemAct;
                                                        }else if((item.activityID==('C_week'+itemAct))&&(runForWk!=('false'+itemAct))){
                                                            totalTargetBudget = totalTargetBudget + item.totalBudget;

                                                            console.warn('runTheWeek for '+itemAct+" TotalBudget: "+totalTargetBudget+" item.totalBudget: "+item.totalBudget);
                                                        }

                                                        //console.warn('runForMth: '+runForMth);

                                                    });


                                                });
                                                    console.warn('newBudgetTotals');
                                                    console.warn(newBudgetTotals);

                                                console.warn('totalTargetBudgetA: '+totalTargetBudget);


                                        totalBudget = totalTargetBudget;
                            }

                            timePriodsBudgets();



                            budgetSummary.push({
                                'budgetType': (budgetTypes[i]['title']).replace(/\s/g, ''),
                                'budgetNameType': (budgetTypes[i]['title']),
                                'budgetTotal':totalBudget,
                                'budgetActivities': budgetedActivities
                            });

                        }


                        //console.log('budgetDatabudgetDatabudgetData');
                        //console.log(budgetData);
                        //console.log(budgetTypes);
                        console.log('budgetSummary___');
                        console.log(budgetSummary);


                        //console.log('allYearWeeksallYearWeeksallYearWeeksallYearWeeks');
                        //console.log(allYearWeeks);

                        var mthData = yearData[currentMthNo];
                        var fromMonth = mthData.mthCount;
                        var toMonth = mthData.mthCount;

                        var currentMonthBarCharts = function(fromMonth,toMonth) {

                            //console.log(startDate+' : '+endDate+' : '+fromMonth+' : '+toMonth)

                            ////alert('official period');
                            console.log('official__chart');
                            if (typeof period == 'undefined') {
                                period = "week2";
                            }

                            var lowerDate;
                            var upperDate;
                            var targetMonth;
                            totalBusinessExpenses = 0;
                            totalPersonalExpenses = 0;
                            totalStockExpenses = 0;
                            totalExpenses = 0;


                            


                            console.log('donorWkExpTotal11111');

                            console.log(donorWkExpTotals);
                            //var donorWkExpTotals = [];
                            console.log(donorWkExpTotals);

                            
                            //console.log('monthlyExpenseAAAA');
                            //console.log(monthlyExpenses);


                            for (var i = 0; i < monthsIndex.length; i++) {
                                monthsIndex[i]
                            }

                            var tempTotal = 0;


                            for (var i = 0; i < monthsIndex.length; i++) {
                                monthsIndex[i]
                            }

                            for (var i = 0; i < monthlyExpenses.length; i++) {
                                var theDay = Number(((monthlyExpenses[i]['day']).split("-"))[0]);
                                var theMonth = Number(((monthlyExpenses[i]['day']).split("-"))[1])-1;

                                if (theMonth > (fromMonth - 1) && theMonth < (toMonth + 1)) {
                                    //console.log(theDay);
                                    totalExpenses = totalExpenses + monthlyExpenses[i]['amount'];

                                    console.error('budgetTypesbudgetTypesbudgetTypes');
                                    console.log((budgetTypes.length));
                                    console.log(JSON.stringify(budgetTypes));

                                    tempTotal = 0;

                                    console.error("Temptoatals: "+tempTotal);

                                    budgetTypes.forEach(function(item){
                                        var budgetKey = (item.title).replace(/\s/g, '');
                                        if(monthlyExpenses[i]['expType'] == (item.title)){
                                            var n = 0;

                                            donorWkExpTotals.forEach(function(expItem){

                                                var budgetKey = (monthlyExpenses[i]['expType']).replace(/\s/g, '');

                                                //console.log("monthlyExpenses[i]['expType']: "+budgetKey);
                                                //console.log("expItem.title: "+expItem.title);

                                                if(budgetKey == expItem.title){
                                                    console.error('targetIssue');
                                                    console.error(monthlyExpenses[i]['amount']);



                                                    tempTotal = tempTotal+monthlyExpenses[i]['amount']+donorWkExpTotals[n]['total'];

                                                    console.error("nNNNNNNNNNNNN: "+n+" : "+tempTotal+" : "+monthlyExpenses[i]['amount']+" : "+donorWkExpTotals[n]['total']+" CountArray: "+donorWkExpTotals.length);
                                                    console.error(n);

                                                    donorWkExpTotals[n]['total'] = tempTotal;

                                                    (donorWkExpTotals[n]['activities']).push({
                                                                    'activity':monthlyExpenses[i]['desc'],
                                                                    'actCost':monthlyExpenses[i]['amount']
                                                                });


                                                }

                                                console.log('donorWk_ExpTotals');
                                                console.log(donorWkExpTotals);
                                                console.log(JSON.stringify(donorWkExpTotals));

                                                n++;
                                            });

                                        }
                                    });
                                }
                            }

                            //console.log('totalBusinessExpenses');
                            //console.log(totalBusinessExpenses);


                            console.log('donorWkExpTotals');
                            console.log(JSON.stringify(donorWkExpTotals));

                            console.error('init_budgetSummary');
                            console.error(budgetSummary);


                            for (var i = 0; i < budgetSummary.length; i++) {

                                //budgetTypes.forEach(function(item){
                                var k = 0;


                                donorWkExpTotals.forEach(function(expTotalItem){

                                    console.log(budgetSummary[i]['budgetType']);
                                    console.log('budget___Summary');
                                    console.log(expTotalItem.title);

                                    if(budgetSummary[i]['budgetType'] == expTotalItem.title){
                                        
                                        //donorWkExpTotals.forEach(function(expTotalItem){
                                            //if(budgetSummary[i]['budgetType'] == expTotalItem.title){
                                                console.error('budgetType: '+budgetSummary[i]['budgetType']);
                                                console.error('budgetTotal: '+budgetSummary[i]['budgetTotal']);
                                                console.error('donorWkExpTotals: '+donorWkExpTotals[k]['total']);
                                                console.error('expTotalItem.title: '+expTotalItem.title);
                                                console.error('kkkkkkkkk: '+k);

                                                var budgetRatio = donorWkExpTotals[k]['total']/(budgetSummary[i]['budgetTotal']);

                                                if(isNaN(budgetRatio)){
                                                    budgetRatio = 0;
                                                }

                                                if(isFinite(budgetRatio) == false){
                                                    budgetRatio = 0;
                                                }

                                                budgetSummary[i]['budgetRatio'] = budgetRatio;
                                                budgetSummary[i]['budgetSpent'] = donorWkExpTotals[k]['total'];
                                                budgetSummary[i]['budgetSum'] = (budgetSummary[i]['budgetTotal']);
                                                budgetSummary[i]['activities'] = donorWkExpTotals[k]['activities']
                                                
                                            //}
                                        //});

                   
                                        console.log('budgetSummarybudgetSummarybudgetSummary');
                                        console.log(budgetSummary);
                                    }
                                    k++;
                                    console.log('donorWkExp__KKKKK: '+k);
                                })

                                
                                console.log('donorWkExp__Totals');
                                console.log(donorWkExpTotals);



                                /*

                                                    budgetTypes.forEach(function(item){
                                                        var budgetKey = (item.title).replace(/\s/g, '');
                                                        if(monthlyExpenses[i]['expType'] == (item.title)){
                                                            var n = 0;

                                                            donorWkExpTotals.forEach(function(expItem){

                                                                var budgetKey = (monthlyExpenses[i]['expType']).replace(/\s/g, '');

                                                                //console.log("monthlyExpenses[i]['expType']: "+budgetKey);
                                                                //console.log("expItem.title: "+expItem.title);

                                                                if(budgetKey == expItem.title){
                                                                    console.error('targetIssue');
                                                                    console.error(monthlyExpenses[i]['amount']);

                                                                    tempTotal = tempTotal+monthlyExpenses[i]['amount'];
                                                                    donorWkExpTotals[n]['total'] = tempTotal;
                                                                }

                                                                console.log('donorWk_ExpTotals');
                                                                console.log(JSON.stringify(donorWkExpTotals));

                                                                n++;
                                                            });

                                                        }
                                                    });
                                */


                                
                                    //if(i>(budgetSummary.length-2)){

                                        budgetSummary = budgetSummary.filter((thing, index, self) =>
                                          index === self.findIndex((t) => (
                                            t.budgetType === thing.budgetType
                                          ))
                                        );

                                        $scope.budgetitems = budgetSummary;

                                        console.log('$scope_budgetitemsMonthly');
                                        console.log(JSON.stringify(budgetSummary));
                                    //}

                            }


                            // Section 1 Chart 1
                            var totalBusinessExpPercent = Math.round(totalBusinessExpenses / totalExpenses * 100);
                            var totalPersonalExpPercent = Math.round(totalPersonalExpenses / totalExpenses * 100);
                            var totalStockExpPercent = Math.round(totalStockExpenses / totalExpenses * 100);


                            //console.log('totalBusinessExpPercent');
                            //console.log(totalBusinessExpPercent);

                            if(isNaN(totalBusinessExpPercent)){
                                totalBusinessExpPercent = 0;
                            }
                            if(isNaN(totalPersonalExpPercent)){
                                totalPersonalExpPercent = 0;
                            }
                            if(isNaN(totalStockExpPercent)){
                                totalStockExpPercent = 0;
                            }

                        };

                            var quickBudgetStats = function(){

                                quickSpentTotals = 0;
                                quickBudgetTotals = 0;

                                for (var i = 0; i < budgetSummary.length; i++) {
                                    //budgetSummary[i]
                                    console.log(budgetSummary[i]);

                                    var quickSpent = Number(budgetSummary[i]['budgetSpent']);
                                    var quickBudget = Number(budgetSummary[i]['budgetTotal']);

                                    if(isNaN(quickSpent)){
                                        quickSpent = 0;
                                    }
                                    if(isNaN(quickBudget)){
                                        quickBudget = 0;
                                    }


                                    quickSpentTotals = quickSpentTotals + quickSpent;
                                    quickBudgetTotals = quickBudgetTotals + quickBudget;

                                    $scope.quickSpentTotals = quickSpentTotals;
                                    $scope.quickBudgetTotals = quickBudgetTotals;

                                    $scope.quickBudgetPerc = (quickSpentTotals/quickBudgetTotals)*100;
                                }

                                console.log('quickBudgetTotals: '+quickBudgetTotals);
                                console.log('quickSpentTotals: '+quickSpentTotals);

                            };

                            $timeout(function() {
                                quickBudgetStats();
                            }, 500);

                        //$timeout(function(){
                            currentMonthBarCharts(fromMonth,toMonth);
                        //},300);

                    }

                    currentYrChart = function(budgetDur){

                        var newProfiledActs = [];
                        var newBudgetTotals = [];

                        console.log('rerun');

                        donorWkExpTotals = [];
                        budgetSummary = [];
                        //var allBudgetActivities = [];//['Activity 1','Activity 2','Activity 3'];

                        // budgetTypes.forEach(function(item) {
                        //     var actsbudgetKey = (item['title']).replace(/\s/g, '');
                        //     allBudgetActivities.push(actsbudgetKey+'_Activity 1');
                        // });


                        for (var i = 0; i < budgetTypes.length; i++) {
                            var budgetKey = (budgetTypes[i]['title']).replace(/\s/g, '');

                            console.log('donorWkExpTotalkkkkk');
                            console.log(donorWkExpTotals);

                            //console.log(JSON.stringify(donorWkExpTotals));

                            donorWkExpTotals.push({
                                'title':budgetKey,
                                'total':0,
                                'activities':[]
                            });

                            console.log('donorWkExpTotalsssss: '+i+" : "+(budgetTypes.length-2));
                            console.log(donorWkExpTotals);
                        }
                
                        for (var i = 0; i < budgetTypes.length; i++) {

                            var budgetKey = (budgetTypes[i]['title']).replace(/\s/g, '');
                            console.log(budgetTypes[i]);

                            var totalBudget = 0;//total weekly Budget NB: if budget duration is year, divide ans/52 weeks
                            var budgetedActivities = [];

                            console.log('budgetDatabudgetDatabudgetDatabudgetData');
                            console.log(budgetData);

                            var timePriodsBudgets = function(){

                                var yearlyBudget = 0;
                                var thefinalYrBudget;
                                var monthlyBudget = 0;
                                var weeklyBudget = 0;
                                var activityBudgetsYr = [];
                                var activityBudgetsMth = [];
                                var activityBudgetsWk = [];

                                //Refined Monthly Budget Totals Variables
                                var cumBudgetItemDiff = 0;
                                var cumMonthlyBudgetA = 0;
                                var cumMonthlyBudgetB = 0;
                                var cumBudgetItemActA;
                                var cumBudgetItemTypeA;
                                var cumBudgetItemActB;
                                var cumBudgetItemTypeB;
                                var cumBudgetItemActC;
                                var cumBudgetItemTypeC;


                                var totalBudgetA, totalBudgetB;

                                var totalTargetBudget = 0;
                                var totalTargetBudgetYr = 0;
                                var totalTargetBudgetMth = 0;
                                var totalTargetBudgetWk = 0;
                                //End of refined Monthly Budget Totals Variables
                                var newBudgetTotals = [];
                                var allBudgetedActivities = [];
                                var newBudgetTotalsYr = [];
                                var newBudgetTotalsMth = [];
                                var newBudgetTotalsWk = [];

                                budgetData.forEach(function(item) {
                                    if(item['itemType'] == budgetTypes[i]['title']){

                                        if((item['itemDur'] == 'year')){
                                            totalTargetBudgetYr = item['itemCost'];

                                            newBudgetTotals.push({
                                                                    'activityID':'A_year'+(budgetKey+'_'+item['itemAct']),
                                                                    'totalBudget':totalTargetBudgetYr
                                                                });
                                            allBudgetedActivities.push(budgetKey+'_'+item['itemAct']);

                                                console.log(newBudgetTotals);
                                                console.log('theWWWWWWWWW1: ');
                                        }
                                        if((item['itemDur'] == 'month')){
                                            totalTargetBudgetMth = item['itemCost'];

                                            newBudgetTotals.push({
                                                                    'activityID':'B_month'+(budgetKey+'_'+item['itemAct']),
                                                                    'totalBudget':totalTargetBudgetMth
                                                                });
                                            allBudgetedActivities.push(budgetKey+'_'+item['itemAct']);

                                                console.log(newBudgetTotals);
                                                console.log('theWWWWWWWWW2: ');
                                        }
                                        if((item['itemDur'] == 'week')){
                                            totalTargetBudgetWk = item['itemCost'];

                                            newBudgetTotals.push({
                                                                    'activityID':'C_week'+(budgetKey+'_'+item['itemAct']),
                                                                    'totalBudget':totalTargetBudgetWk
                                                                });
                                            allBudgetedActivities.push(budgetKey+'_'+item['itemAct']);

                                                console.log(newBudgetTotals);
                                                console.warn('theWWWWWWWWW3: '+totalTargetBudgetWk);
                                        }

     
                                                allBudgetedActivities = allBudgetedActivities.filter(function(item, pos) {
                                                    return allBudgetedActivities.indexOf(item) == pos;
                                                });

                                                console.log(JSON.stringify(newBudgetTotals));
                                                console.log('theWWWWWWWWW4: '+newBudgetTotals.length);
                                                console.log('allBudgetedActivities: '+allBudgetedActivities);
                                                console.log('allBudgetedActivities4: '+allBudgetedActivities.length);

                                                totalTargetBudget = 0;


                                                newBudgetTotals.sort(function(a, b) {
                                                    var textA = a.activityID.toUpperCase();
                                                    var textB = b.activityID.toUpperCase();
                                                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                                                });

                                                console.warn(newBudgetTotals.length);


                                        budgetedActivities.push({
                                            actCost: item['itemCost'],//amount budgeted per activity
                                            activity: item['itemAct'],//activity budgeted for
                                            duration: item['itemDur']//budgeted period
                                        });

                                    }
                                });

                                                    
                                                    var runForYr=true, runForMth=true, runForWk=true;
                                                    var activitiesRanFor = [];

                                                    console.warn(allBudgetedActivities);

                                                newBudgetTotals.forEach(function(item) {

                                                    allBudgetedActivities.forEach(function(itemAct) {

                                                            //console.warn('initYear for '+yrValid);

                                                        if(item.activityID==('A_year'+itemAct)){
                                                            totalTargetBudget = totalTargetBudget + item.totalBudget;
                                                            //activitiesRanFor.push(itemAct);
                                                            runForMth = 'false'+itemAct;
                                                            runForWk = 'false'+itemAct;
                                                            console.warn('runTheYear for '+itemAct+" TotalBudget: "+totalTargetBudget+" item.totalBudget: "+item.totalBudget);
                                                        }
                                                        else if((item.activityID==('B_month'+itemAct))&&(runForMth!=('false'+itemAct))){

                                                            console.warn('runForMthhhhh: '+runForMth);
                                                            console.warn('runForMtkkkkk: '+('false'+itemAct));

                                                            totalTargetBudget = totalTargetBudget + item.totalBudget;
                                                            console.warn('runTheMonth for '+itemAct+" TotalBudget: "+totalTargetBudget+" item.totalBudget: "+item.totalBudget);
                                                            runForWk = 'false'+itemAct;
                                                        }else if((item.activityID==('C_week'+itemAct))&&(runForWk!=('false'+itemAct))){
                                                            totalTargetBudget = totalTargetBudget + item.totalBudget;

                                                            console.warn('runTheWeek for '+itemAct+" TotalBudget: "+totalTargetBudget+" item.totalBudget: "+item.totalBudget);
                                                        }

                                                        console.warn('runForWk: '+runForWk);

                                                        console.warn('AAAAABBBBBB');
                                                        console.warn('false'+itemAct);

                                                        console.warn('runForMth: '+runForMth);

                                                    });


                                                });
                                                    console.warn('newBudgetTotals');
                                                    console.warn(newBudgetTotals);

                                                console.warn('totalTargetBudgetA: '+totalTargetBudget);


                                        totalBudget = totalTargetBudget;
                            }

                            timePriodsBudgets();

                            budgetSummary.push({
                                'budgetType': (budgetTypes[i]['title']).replace(/\s/g, ''),
                                'budgetNameType': (budgetTypes[i]['title']),
                                'budgetTotal':totalBudget,
                                'budgetActivities': budgetedActivities
                            });

                        }


                        //console.log('budgetDatabudgetDatabudgetData');
                        //console.log(budgetData);
                        //console.log(budgetTypes);
                        console.log('budgetSummary___');
                        console.log(budgetSummary);

                        //var yrData = yearData[currentMthNo];
                        var fromYear = currentYrNo;
                        var toYear = currentYrNo;

                        var currentYearBarCharts = function(fromYear,toYear) {

                            //console.log(startDate+' : '+endDate+' : '+fromMonth+' : '+toMonth)

                            ////alert('official period');
                            console.log('official__chart');
                            if (typeof period == 'undefined') {
                                period = "week2";
                            }

                            var lowerDate;
                            var upperDate;
                            var targetMonth;
                            totalBusinessExpenses = 0;
                            totalPersonalExpenses = 0;
                            totalStockExpenses = 0;
                            totalExpenses = 0;

                            console.log('donorWkExpTotal11111');

                            console.log(donorWkExpTotals);

                            var tempTotal = 0;

                            for (var i = 0; i < monthlyExpenses.length; i++) {

                                var theDay = Number(((monthlyExpenses[i]['day']).split("-"))[0]);
                                var theMonth = Number(((monthlyExpenses[i]['day']).split("-"))[1])-1;
                                var theYear = Number(((monthlyExpenses[i]['day']).split("-"))[2]);

                                if (theYear > (fromYear - 1) && theYear < (toYear + 1)) {
                                    //console.log(theDay);
                                    totalExpenses = totalExpenses + monthlyExpenses[i]['amount'];

                                    console.error('budgetTypesbudgetTypesbudgetTypes');
                                    console.log((budgetTypes.length));
                                    console.log(JSON.stringify(budgetTypes));

                                    tempTotal = 0;

                                    console.error("Temptoatals: "+tempTotal);

                                    budgetTypes.forEach(function(item){
                                        var budgetKey = (item.title).replace(/\s/g, '');
                                        if(monthlyExpenses[i]['expType'] == (item.title)){
                                            var n = 0;

                                            donorWkExpTotals.forEach(function(expItem){

                                                var budgetKey = (monthlyExpenses[i]['expType']).replace(/\s/g, '');

                                                //console.log("monthlyExpenses[i]['expType']: "+budgetKey);
                                                //console.log("expItem.title: "+expItem.title);

                                                if(budgetKey == expItem.title){
                                                    console.error('targetIssue');
                                                    console.error(monthlyExpenses[i]['amount']);



                                                    tempTotal = tempTotal+monthlyExpenses[i]['amount']+donorWkExpTotals[n]['total'];

                                                    console.error("nNNNNNNNNNNNN: "+n+" : "+tempTotal+" : "+monthlyExpenses[i]['amount']+" : "+donorWkExpTotals[n]['total']+" CountArray: "+donorWkExpTotals.length);
                                                    console.error(n);

                                                    donorWkExpTotals[n]['total'] = tempTotal;

                                                    (donorWkExpTotals[n]['activities']).push({
                                                                    'activity':monthlyExpenses[i]['desc'],
                                                                    'actCost':monthlyExpenses[i]['amount']
                                                                });


                                                }

                                                console.log('donorWk_ExpTotals');
                                                console.log(donorWkExpTotals);
                                                console.log(JSON.stringify(donorWkExpTotals));

                                                n++;
                                            });

                                        }
                                    });
                                }
                            }

                            //console.log('totalBusinessExpenses');
                            //console.log(totalBusinessExpenses);


                            console.log('donorWkExpTotals');
                            console.log(JSON.stringify(donorWkExpTotals));

                            console.error('init_budgetSummary');
                            console.error(budgetSummary);


                            for (var i = 0; i < budgetSummary.length; i++) {

                                //budgetTypes.forEach(function(item){
                                var k = 0;


                                donorWkExpTotals.forEach(function(expTotalItem){

                                    console.log(budgetSummary[i]['budgetType']);
                                    console.log('budget___Summary');
                                    console.log(expTotalItem.title);

                                    if(budgetSummary[i]['budgetType'] == expTotalItem.title){
                                        
                                        //donorWkExpTotals.forEach(function(expTotalItem){
                                            //if(budgetSummary[i]['budgetType'] == expTotalItem.title){
                                                console.error('budgetType: '+budgetSummary[i]['budgetType']);
                                                console.error('budgetTotal: '+budgetSummary[i]['budgetTotal']);
                                                console.error('donorWkExpTotals: '+donorWkExpTotals[k]['total']);
                                                console.error('expTotalItem.title: '+expTotalItem.title);
                                                console.error('kkkkkkkkk: '+k);

                                                var budgetRatio = donorWkExpTotals[k]['total']/(budgetSummary[i]['budgetTotal']);

                                                if(isNaN(budgetRatio)){
                                                    budgetRatio = 0;
                                                }

                                                if(isFinite(budgetRatio) == false){
                                                    budgetRatio = 0;
                                                }

                                                budgetSummary[i]['budgetRatio'] = budgetRatio;
                                                budgetSummary[i]['budgetSpent'] = donorWkExpTotals[k]['total'];
                                                budgetSummary[i]['budgetSum'] = (budgetSummary[i]['budgetTotal']);
                                                budgetSummary[i]['activities'] = donorWkExpTotals[k]['activities']
                                                
                                            //}
                                        //});

                   
                                        console.log('budgetSummarybudgetSummarybudgetSummary');
                                        console.log(budgetSummary);
                                    }
                                    k++;
                                    console.log('donorWkExp__KKKKK: '+k);
                                })

                                
                                console.log('donorWkExp__Totals');
                                console.log(donorWkExpTotals);



                                /*

                                                    budgetTypes.forEach(function(item){
                                                        var budgetKey = (item.title).replace(/\s/g, '');
                                                        if(monthlyExpenses[i]['expType'] == (item.title)){
                                                            var n = 0;

                                                            donorWkExpTotals.forEach(function(expItem){

                                                                var budgetKey = (monthlyExpenses[i]['expType']).replace(/\s/g, '');

                                                                //console.log("monthlyExpenses[i]['expType']: "+budgetKey);
                                                                //console.log("expItem.title: "+expItem.title);

                                                                if(budgetKey == expItem.title){
                                                                    console.error('targetIssue');
                                                                    console.error(monthlyExpenses[i]['amount']);

                                                                    tempTotal = tempTotal+monthlyExpenses[i]['amount'];
                                                                    donorWkExpTotals[n]['total'] = tempTotal;
                                                                }

                                                                console.log('donorWk_ExpTotals');
                                                                console.log(JSON.stringify(donorWkExpTotals));

                                                                n++;
                                                            });

                                                        }
                                                    });
                                */


                                
                                    //if(i>(budgetSummary.length-2)){

                                        budgetSummary = budgetSummary.filter((thing, index, self) =>
                                          index === self.findIndex((t) => (
                                            t.budgetType === thing.budgetType
                                          ))
                                        );

                                        $scope.budgetitems = budgetSummary;

                                        console.log('$scope_budgetitemsMonthly');
                                        console.log(budgetSummary);
                                        console.log(JSON.stringify(budgetSummary));
                                    //}

                            }


                            // Section 1 Chart 1
                            var totalBusinessExpPercent = Math.round(totalBusinessExpenses / totalExpenses * 100);
                            var totalPersonalExpPercent = Math.round(totalPersonalExpenses / totalExpenses * 100);
                            var totalStockExpPercent = Math.round(totalStockExpenses / totalExpenses * 100);


                            //console.log('totalBusinessExpPercent');
                            //console.log(totalBusinessExpPercent);

                            if(isNaN(totalBusinessExpPercent)){
                                totalBusinessExpPercent = 0;
                            }
                            if(isNaN(totalPersonalExpPercent)){
                                totalPersonalExpPercent = 0;
                            }
                            if(isNaN(totalStockExpPercent)){
                                totalStockExpPercent = 0;
                            }

                        };

                        var quickBudgetStats = function(){

                            quickSpentTotals = 0;
                            quickBudgetTotals = 0;

                            for (var i = 0; i < budgetSummary.length; i++) {
                                //budgetSummary[i]
                                console.log(budgetSummary[i]);

                                var quickSpent = Number(budgetSummary[i]['budgetSpent']);
                                var quickBudget = Number(budgetSummary[i]['budgetTotal']);

                                if(isNaN(quickSpent)){
                                    quickSpent = 0;
                                }
                                if(isNaN(quickBudget)){
                                    quickBudget = 0;
                                }


                                quickSpentTotals = quickSpentTotals + quickSpent;
                                quickBudgetTotals = quickBudgetTotals + quickBudget;

                                $scope.quickSpentTotals = quickSpentTotals;
                                $scope.quickBudgetTotals = quickBudgetTotals;

                                $scope.quickBudgetPerc = (quickSpentTotals/quickBudgetTotals)*100;
                            }

                            console.log('quickBudgetTotals: '+quickBudgetTotals);
                            console.log('quickSpentTotals: '+quickSpentTotals);

                        };

                        $timeout(function() {
                            quickBudgetStats();
                        }, 500);

                        //$timeout(function(){
                            currentYearBarCharts(fromYear,toYear);
                        //},500);

                    }



                    //load weeks data by default
                    
                    //currentWkChart();
                    currentMthChart();

                    $scope.thebudgetWk = function(){

                        budgetDur = 'week';

                        currentWkChart(budgetDur);
                        $scope.weekBudgetSummary = 'active';
                        $scope.monthBudgetSummary = 'inactive';
                        $scope.yearBudgetSummary = 'inactive';
                    };

                    $scope.thebudgetWkEqualMth = function(){

                        budgetDur = 'month';

                        currentMthChart(budgetDur);
                        $scope.weekBudgetSummary = 'active';
                        $scope.monthBudgetSummary = 'inactive';
                        $scope.yearBudgetSummary = 'inactive';
                    };

                    $scope.thebudgetMth = function(){

                        budgetDur = 'month';

                        currentMthChart(budgetDur);
                        $scope.weekBudgetSummary = 'inactive';
                        $scope.monthBudgetSummary = 'active';
                        $scope.yearBudgetSummary = 'inactive';

                    };

                    $scope.thebudgetYr = function(){

                        budgetDur = 'year';

                        currentYrChart(budgetDur);
                        $scope.weekBudgetSummary = 'inactive';
                        $scope.monthBudgetSummary = 'inactive';
                        $scope.yearBudgetSummary = 'active';

                    };
                        
                });

            }, 1000);

        });

        //END OF GET TOTAL EXPENDITURE


        //Add new items to the stock list
        function myDialogControllerrr($scope, $mdDialog, parent) {
            $scope.parent = parent;
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.ok = function() {
                $mdDialog.hide();
            };
        }

        var budgetDur = 'week';

        $scope.addBudgetAnalysisDialog = function($event,item) {

            console.error('pieitem: '+budgetDur);
            console.error(item.activities);
            console.error('budget_pieitem');
            console.error(item.budgetActivities);

            $scope.compName = item.budgetNameType;

            var mergedActCosts;
            var mergedActBudgets;

            var mergerActivities = function(){
                var arr = item.activities;

                var holder = {};

                arr.forEach(function (d) {
                    if(holder.hasOwnProperty(d.activity)) {
                       holder[d.activity] = holder[d.activity] + d.actCost;
                    } else {       
                       holder[d.activity] = d.actCost;
                    }
                });

                mergedActCosts = [];

                for(var prop in holder) {
                    mergedActCosts.push({activity: prop, actCost: holder[prop]});   
                }
            };

            var mergerBudgetsActivities = function(){
                var arr = item.budgetActivities;
                console.log(arr);

                var holder = {};

                var seivedArr = [];

                var dialogYearlyBudget = 0;
                var dialogMonthlyBudget = 0;
                var dialogWeeklyBudget = 0;
                var dialogTotalBudget = 0;

                if(budgetDur == 'month'){
                    switchDuration = 'week';
                }

                if(budgetDur == 'year'){
                    switchDuration = 'month';
                }

                console.log('budgetDur: '+budgetDur);

                arr.forEach(function (d) {

                        /*
                            if(d.duration==budgetDur){
                                //totalBudget = (item['itemCost']/1);
                                //dialogMonthlyBudget = dialogMonthlyBudget+(d.actCost);

                                console.log('totalBudgetttt5: '+dialogTotalBudget);

                                if(holder.hasOwnProperty(d.activity)) {
                                    dialogMonthlyBudget = dialogMonthlyBudget+(d.actCost);
                                    //holder[d.activity] = holder[d.activity] + d.actCost;
                                } else {     
                                    dialogMonthlyBudget = d.actCost;
                                    //holder[d.activity] = d.actCost;
                                }

                                dialogMonthlyBudget = holder[d.activity];

                            }else if (d.duration==switchDuration){

                                if(holder.hasOwnProperty(d.activity)) {
                                    dialogWeeklyBudget = dialogWeeklyBudget+(d.actCost);
                                    //holder[d.activity] = holder[d.activity] + d.actCost;
                                } else {     
                                    dialogWeeklyBudget = d.actCost;
                                    //holder[d.activity] = d.actCost;
                                }

                                dialogWeeklyBudget = holder[d.activity];
                            }

                            if(dialogMonthlyBudget<dialogWeeklyBudget){
                                dialogTotalBudget = dialogWeeklyBudget;
                            }else{
                                dialogTotalBudget = dialogMonthlyBudget;
                            }

                            holder[d.activity] = dialogTotalBudget;
                        */

                        console.log('switchDuration: '+switchDuration);
                    
                        if(d.duration==budgetDur){
                            if(holder.hasOwnProperty(d.activity)) {
                                if(budgetDur == 'year'){
                                    dialogYearlyBudget = d.actCost;
                                    console.log('holder[d.activity]: '+holder[d.activity]);
                                    console.log('d.actCost: '+d.actCost);
                                    console.log('dialogYearlyBudget_1A: '+dialogYearlyBudget);
                                }
                                if(budgetDur == 'month'){
                                    dialogMonthlyBudget = d.actCost;
                                }
                                if(budgetDur == 'week'){
                                    dialogWeeklyBudget = d.actCost;
                                }
                            } else {       
                                if(budgetDur == 'year'){
                                    dialogYearlyBudget = d.actCost;

                                    console.log('dialogYearlyBudget_1B: '+dialogYearlyBudget);
                                }       
                                if(budgetDur == 'month'){
                                    dialogMonthlyBudget = d.actCost;
                                }
                                if(budgetDur == 'week'){
                                    dialogWeeklyBudget = d.actCost;
                                }
                            }
                            console.log('holderholderholder');
                            console.log(holder[d.activity]);

                            console.log('d.activity_1: '+d.activity);
                            console.log('dialogYearlyBudget_1: '+dialogYearlyBudget);
                            console.log('dialogMonthlyBudget_1: '+dialogMonthlyBudget);
                            console.log('dialogWeeklyBudget_1: '+dialogWeeklyBudget);
                            console.log('dialogTotalBudget_1: '+dialogTotalBudget);

                        }else if(d.duration==switchDuration){
                            if(holder.hasOwnProperty(d.activity)) {
                                if(switchDuration == 'month'){
                                    //dialogMonthlyBudget = holder[d.activity] + d.actCost;
                                    dialogMonthlyBudget = d.actCost;

                                    console.log('dialogWeeklyBudget_4: '+dialogWeeklyBudget);
                                }
                                if(switchDuration == 'week'){
                                    //dialogWeeklyBudget = holder[d.activity] + d.actCost;
                                    dialogWeeklyBudget = d.actCost;

                                    console.log('d.actCost: '+d.actCost);
                                    console.log('holder[d.activity]: '+holder[d.activity]);
                                    console.log('dialogWeeklyBudget_3: '+dialogWeeklyBudget);
                                }
                            } else {       
                                if(switchDuration == 'month'){
                                    dialogMonthlyBudget = d.actCost;


                                    console.log('dialogWeeklyBudget_6: '+dialogWeeklyBudget);
                                }
                                if(switchDuration == 'week'){
                                    dialogWeeklyBudget = d.actCost;


                                    console.log('dialogWeeklyBudget_5: '+dialogWeeklyBudget);
                                }
                            }
                        }


                        if(budgetDur=='year'){
                            if(d.duration=='week'){
                                if(holder.hasOwnProperty(d.activity)) {

                                        //dialogWeeklyBudget = holder[d.activity] + d.actCost;
                                        dialogWeeklyBudget = d.actCost;

                                        console.log('d.actCost: '+d.actCost);
                                        console.log('holder[d.activity]: '+holder[d.activity]);
                                        console.log('dialogWeeklyBudget_3qqq: '+dialogWeeklyBudget);

                                } else {       

                                        dialogWeeklyBudget = d.actCost;


                                        console.log('dialogWeeklyBudget_5qqq: '+dialogWeeklyBudget);
                
                                }
                            }
                        }


                        if(dialogMonthlyBudget<dialogWeeklyBudget){
                            dialogTotalBudget = dialogWeeklyBudget;
                        }else{
                            dialogTotalBudget = dialogMonthlyBudget;
                        }

                        console.warn('dialogMonthlyBudget: '+dialogMonthlyBudget);
                        console.warn('dialogWeeklyBudget: '+dialogWeeklyBudget);
                        console.warn('dialogTotalBudget: '+dialogTotalBudget);

                        if(budgetDur=='year'){
                            if(dialogYearlyBudget>0){
                                dialogTotalBudget = dialogYearlyBudget;
                            }
                        }


                        // if(budgetDur=='year'){
                        //     if(dialogYearlyBudget<dialogMonthlyBudget){
                        //         dialogTotalBudget = dialogMonthlyBudget;
                        //     }else{
                        //         dialogTotalBudget = dialogYearlyBudget;
                        //     }

                        //     console.log('dialogWeeklyBudget_555: '+dialogWeeklyBudget);
                        //     console.log('dialogWeeklyBudget_999: '+dialogTotalBudget);

                        //     if(dialogTotalBudget<dialogWeeklyBudget){
                        //         dialogTotalBudget = dialogWeeklyBudget;
                        //     }
                        // }

                        holder[d.activity] = dialogTotalBudget;

                        console.log('d.activity_: '+d.activity);
                        console.log('dialogYearlyBudget_2: '+dialogYearlyBudget);
                        console.log('dialogMonthlyBudget_2: '+dialogMonthlyBudget);
                        console.log('dialogWeeklyBudget_2: '+dialogWeeklyBudget);
                        console.log('dialogTotalBudget_2: '+dialogTotalBudget);

                        dialogTotalBudget = 0;

                        /*
                            //Original Code
                            if(d.duration==budgetDur){
                                if(holder.hasOwnProperty(d.activity)) {
                                   holder[d.activity] = holder[d.activity] + d.actCost;
                                } else {       
                                   holder[d.activity] = d.actCost;
                                }
                            }else if(d.duration==switchDuration){
                                if(holder.hasOwnProperty(d.activity)) {
                                   holder[d.activity] = holder[d.activity] + d.actCost;
                                } else {       
                                   holder[d.activity] = d.actCost;
                                }
                            }
                        */

                });

                mergedActBudgets = [];

                for(var prop in holder) {
                    mergedActBudgets.push({activity: prop, actCost: holder[prop]});   
                }
            };

            mergerActivities();
            mergerBudgetsActivities();

            console.error('pieitem_mergedActCosts');
            console.log(mergedActCosts);
            console.error('pieitem_mergedActBudgets');
            console.log(mergedActBudgets);

            var dataVals = [];
            var dataLabels = [];
            var dataColors = [];
            var dataAllAttr = [];
            var datasetDetails = [];
            var amountSpent = [];
            var amountBudgeted = [];

            var sampleColors = [
                            'red',
                            'orange',
                            'yellow',
                            'green',
                            'blue',
                        ];

            for (var i = 0; i < mergedActCosts.length; i++) {
                dataVals.push(mergedActCosts[i]['actCost']);
                dataLabels.push(mergedActCosts[i]['activity']);
                dataColors.push(sampleColors[i]);

                console.log(mergedActBudgets[i]);

                if( typeof mergedActBudgets[i] === 'undefined' || mergedActBudgets[i] === null ){
                    console.log('aaaaa_aaaaa')
                    console.log('aaaaa')
                    console.log('aaaaa')
                    mergedActBudgets.push({
                        'activity':'N/A',
                        'actCost':'N/A'
                    });
                }

                //PopUp Budget Details
                var activityCostTitle = mergedActCosts[i]['activity'];
                var activityBudgetTitle = mergedActBudgets[i]['activity'];
                var activityBudgetTotal = mergedActBudgets[i]['actCost'];
                var k = 0;

                while (activityCostTitle!==activityBudgetTitle) {
                    k++;
                    activityBudgetTitle = mergedActBudgets[i+k]['activity'];
                    activityBudgetTotal = mergedActBudgets[i+k]['actCost'];
                }

                console.error('activityBudgetTitle: '+activityBudgetTitle);

                dataAllAttr.push({
                    'label':activityCostTitle,
                    'value':mergedActCosts[i]['actCost'],
                    'budgetlabel':activityBudgetTitle,
                    'budgetvalue':activityBudgetTotal,
                    'color':{'color':sampleColors[i]},
                });
                amountSpent.push(mergedActCosts[i]['actCost']);
                amountBudgeted.push(activityBudgetTotal);
                //End of PopUp Budget Details

            }

            $scope.dataAllAttr = dataAllAttr;

            var configv2 = {
                type: 'pie',
                data: {
                    datasets: [{
                        data: dataVals,
                        backgroundColor: dataColors,
                        label: 'Dataset 1'
                    }],
                    labels: dataLabels
                },
                options: {
                    responsive: true,
                    legend: {
                        display: false
                    },
                    maintainAspectRatio: false,
                }
            };


            var budgetChartData = {
              labels: dataLabels,
              datasets: [
              {
                label: "Budget",
                backgroundColor: "#2880b9",
                data: amountBudgeted
              }, {
                label: "Spent",
                backgroundColor: "#ac1a01",
                data: amountSpent
              }
              ]
            };

            var config = {
              type: 'bar',
              data: budgetChartData,
              options: {
                barValueSpacing: 20,
                    scales: {
                        xAxes: [{
                            ticks: {
                                autoSkip: false,
                                maxRotation: 0,
                                beginAtZero:true,
                                fontSize: 9
                            },
                            gridLines: {
                                display:false,
                                color: "#FFFFFF"
                            }
                        }],
                        yAxes: [{
                            ticks: {
                                autoSkip: false,
                                maxRotation: 0,
                                padding: 0,
                                beginAtZero:true,
                                fontSize: 9
                            },
                            gridLines: {
                                display:false,
                                color: "#FFFFFF"
                            }
                        }]
                    },
              }
            };

            $timeout(function() {
                new Chart('pieChartv1', config);
                new Chart('pieChartv2', configv2);
            }, 1000);


            // new Chart('chartLinev2', {
            //     type: 'bar',
            //     //type: 'pie',
            //     //type: 'line',
            //     data: {
            //         labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            //         datasets: [{
            //             backgroundColor: chartBGcolor,
            //             borderColor: chartBGcolor,
            //             data: weeklyRevenue,
            //             label: 'KES',
            //             fill: false
            //         }]
            //     },
            //     options: Chart.helpers.merge(options, {
            //         title: {
            //             text: "weeklysummary",
            //             display: false
            //         }
            //     })
            // });
            var compExpenses = item.activities;
            var dialogTemplate;
            if(compExpenses.length < 1){
                dialogTemplate = '<md-dialog> <md-card class="form budget_analysis"> <md-card-content><div class="col-100 {{expenseTypewarning}}"><p style="text-align:center;">No recorded expenses for {{parent.compName}}</p><a href="#" ng-click="cancel();" class="button" tabindex="0">Ok</a></div> </md-card-content> </md-card> </md-dialog>';
            } else {
                dialogTemplate = '<md-dialog><ion-scroll direction="y"><md-card class="form budget_analysis"> <md-card-content><div class="col-100 {{expenseTypewarning}}"><h5>{{parent.compName}}</h5><div style="height:100px;"><canvas id="pieChartv2"></canvas></div><ul><li><span>Expense Breakdown</span></li><li ng-style="{{attr.color}}" ng-repeat="attr in parent.dataAllAttr"><span>{{attr.label}}:</span><strong>KES {{attr.value}}</strong></p></li></ul><canvas id="pieChartv1"></canvas><table><tbody><tr><th>Activity</th><th>Spent(KES)</th><th>Budget(KES)</th></tr><tr ng-repeat="attr in parent.dataAllAttr"><td>{{attr.label}}</td><td>{{attr.value}}</td><td>{{attr.budgetvalue}}</td></tr></tbody></table><a href="#" ng-click="cancel();" class="button" tabindex="0">Ok</a></div></md-card-content></md-card></ion-scroll></md-dialog>';
            }

            $mdDialog.show({
                controller: myDialogControllerrr,
                template:
                    // '<md-dialog md-theme="mytheme">' +
                    // '  <md-dialog-content>'+
                    //      '<div class="test"><p>TOTAL: KES {{parent.totalSaleAmount}}</p></div>'+
                    //         '<div class="md-actions" layout="row"><a class="md-primary-color dialog-action-btn ng-binding" ng-click="cancel()" tabindex="0">Close</a><a class="md-primary-color dialog-action-btn ng-binding" ng-click="ok()" tabindex="0">Confirm</a></div>'
                    //      +
                    //   '  </md-dialog-content>' +
                    //   '</md-dialog>',
                    dialogTemplate,
                    //'<md-dialog><md-card class="form budget_analysis"> <md-card-content><div class="col-100 {{expenseTypewarning}}"><h5>{{parent.compName}}</h5><div style="height:100px;"><canvas id="pieChartv2"></canvas></div><ul><li><span>Expense Breakdown</span></li><li ng-style="{{attr.color}}" ng-repeat="attr in parent.dataAllAttr"><span>{{attr.label}}:</span><strong>KES {{attr.value}}</strong></p></li></ul><canvas id="pieChartv1"></canvas><table><tbody><tr><th>Activity</th><th>Spent(KES)</th><th>Budget(KES)</th></tr><tr ng-repeat="attr in parent.dataAllAttr"><td>{{attr.label}}</td><td>{{attr.value}}</td><td>{{attr.budgetvalue}}</td></tr></tbody></table><a href="#" ng-click="cancel();" class="button" tabindex="0">Ok</a></div></md-card-content></md-card></md-dialog>',
                    //'<md-card class="form"><a href="#" ng-click="cancel();" data-menu="menu-confirmation" class="button button-full button-rounded button-green uppercase ultrabold take_photo">Submit Record</a></md-card>',

                targetEvent: $event,
                locals: {
                    parent: $scope
                }
            }).then(function(answer) {
                //alert('you submitted - ' + answer);
            }, function() {

            });
        }

        $scope.addBudgetItemsDialog = function($event) {
            $mdDialog.show({
                controller: myDialogControllerrr,
                template:
                    // '<md-dialog md-theme="mytheme">' +
                    // '  <md-dialog-content>'+
                    //      '<div class="test"><p>TOTAL: KES {{parent.totalSaleAmount}}</p></div>'+
                    //         '<div class="md-actions" layout="row"><a class="md-primary-color dialog-action-btn ng-binding" ng-click="cancel()" tabindex="0">Close</a><a class="md-primary-color dialog-action-btn ng-binding" ng-click="ok()" tabindex="0">Confirm</a></div>'
                    //      +
                    //   '  </md-dialog-content>' +
                    //   '</md-dialog>',
                    '<md-dialog> <md-card class="form"> <md-card-content><div class="col-100 {{expenseTypewarning}}"> <strong>Required Field</strong> <em>Select a budget for:</em> <md-select ng-change="parent.validateForm(1,expenseType);" ng-model="expenseType" aria-label="md-option"> <md-option ng-repeat="expType in parent.budgetTypes" value="{{expType}}">{{expType.title}}</md-option> </md-select></div><div class="clear"></div><div class="col-100 {{expenseTypewarning}}"> <strong>Required Field</strong> <em>Select an activity:</em> <md-select ng-change="parent.validateForm(5,activityType);" ng-model="activityType" aria-label="md-option"> <md-option ng-repeat="expType in parent.expenseActTypes" value="{{expType.title}}">{{expType.title}}</md-option> </md-select></div><div class="clear"></div><div class="col-100 {{expenseDurationwarning}}"> <strong>Required Field</strong> <em>Select budget duration</em> <md-select ng-change="parent.validateForm(4,expenseDuration);" ng-model="expenseDuration" aria-label="md-option"> <md-option ng-repeat="expDuration in parent.expenseDurations" value="{{expDuration.alias}}">{{expDuration.title}}</md-option> </md-select></div><div class="clear"></div><div class="col-100 {{expenseCostwarning}}"> <strong>Required Field</strong> <em>Amount to budget for:</em> <md-input-container md-no-float="" class="md-list-item-full-width"> <input ng-change="parent.validateForm(2,expenseCost);" ng-model="expenseCost" placeholder=" Cost incurred in KES" type="number"> </md-input-container></div><div class="clear"></div><div class="col-100"><a href="#" ng-click="parent.submitUploadRecord(); cancel();" data-menu="menu-confirmation" class="button button-full button-rounded button-green uppercase ultrabold take_photo">Submit Record</a><a href="#" ng-click="ok();" data-menu="menu-confirmation" class="button button-full button-rounded uppercase ultrabold take_photo">Cancel</a></div> </md-card-content> </md-card> </md-dialog>',
                    //'<md-dialog> <md-card class="form"> <md-card-content><div class="col-100 {{expenseTypewarning}}"> <strong>Required Field</strong> <em>Select a budget for:</em> <md-select ng-change="parent.validateForm(1,expenseType);" ng-model="expenseType" aria-label="md-option"> <md-option ng-repeat="expType in parent.budgetTypes" value="{{expType.title}}">{{expType.title}}</md-option> </md-select></div><div class="clear"></div><div class="col-100 {{expenseTypewarning}}"> <strong>Required Field</strong> <em>Select an activity:</em> <md-select ng-change="parent.validateForm(5,activityType);" ng-model="activityType" aria-label="md-option"> <md-option ng-repeat="expType in parent.expenseActTypes" value="{{expType.title}}">{{expType.title}}</md-option> </md-select></div><div class="clear"></div><div class="col-100 {{expenseDurationwarning}}"> <strong>Required Field</strong> <em>Select budget duration</em> <md-select ng-change="parent.validateForm(4,expenseDuration);" ng-model="expenseDuration" aria-label="md-option"> <md-option ng-repeat="expDuration in parent.expenseDurations" value="{{expDuration.alias}}">{{expDuration.title}}</md-option> </md-select></div><div class="clear"></div><div class="col-100 {{expenseCostwarning}}"> <strong>Required Field</strong> <em>Amount to budget for:</em> <md-input-container md-no-float="" class="md-list-item-full-width"> <input ng-change="parent.validateForm(2,expenseCost);" ng-model="expenseCost" placeholder=" Cost incurred in KES" type="number"> </md-input-container></div><div class="clear"></div><div class="col-100 {{expenseDescwarning}}"> <strong>Required Field</strong> <em>What are you budgetting for?</em> <md-input-container md-no-float="" class="md-list-item-full-width"> <input ng-change="parent.validateForm(3,expenseDesc);" ng-model="expenseDesc" placeholder="Describe the expense"> </md-input-container></div><div class="clear"></div><div class="col-100"><a href="#" ng-click="parent.submitUploadRecord(); cancel();" data-menu="menu-confirmation" class="button button-full button-rounded button-green uppercase ultrabold take_photo">Submit Record</a><a href="#" ng-click="ok();" data-menu="menu-confirmation" class="button button-full button-rounded uppercase ultrabold take_photo">Cancel</a></div> </md-card-content> </md-card> </md-dialog>',
                    //'<md-card class="form"><a href="#" ng-click="cancel();" data-menu="menu-confirmation" class="button button-full button-rounded button-green uppercase ultrabold take_photo">Submit Record</a></md-card>',

                targetEvent: $event,
                locals: {
                    parent: $scope
                }
            }).then(function(answer) {
                //alert('you submitted - ' + answer);
            }, function() {

            });
        }

// End showAlertDialog.

    //Capture budget form inputs
        
        var expID;
        var expenseType, expenseCost, expenseDesc, expenseDur, expenseActType;

        var mergerPickedBudgetsActivities = function(compBudgetArr,expenseDur,expenseActType,expenseCost){
            var arr = compBudgetArr;
            console.log(arr);

            var holder = {};

            arr.forEach(function (d) {
                if(d.activity==expenseActType){//seive for only the selected activity Type
                    if(holder.hasOwnProperty(d.duration)) {
                       holder[d.duration] = holder[d.duration] + d.actCost;
                    } else {       
                       //holder[d.activity] = [d.actCost,d.duration];
                       holder[d.duration] = d.actCost;
                    }
                }
            });

            var theMergedActBudgets = [];
            console.log('holder');
            console.log(holder);

            for(var prop in holder) {
                //theMergedActBudgets.push({activity: prop, actCost: holder[prop][0], duration: holder[prop][1]});   
                theMergedActBudgets.push({duration: prop, actCost: holder[prop]});   
            }

            console.log('theMergedActBudgets');
            console.log(theMergedActBudgets);

            // For show alert Dialog.
            var inpracticalBudgetAlertDialog = function ($event,expenseDur,expenseActType,warningType) {

                var warnDuration;

                if(expenseDur=='month'){
                    warnDuration = 'weekly';
                } else if (expenseDur=='year'){
                    warnDuration = theMergedActBudgets[theMergedActBudgets.length-1]['duration']+'ly';//'weekly or monthly';
                }

                if(warningType=='less'){
                    if(expenseDur=='month'){
                        warnDuration = 'yealy';
                    } else if (expenseDur=='week'){
                        warnDuration = theMergedActBudgets[theMergedActBudgets.length-1]['duration']+'ly';//'weekly or monthly';
                    }
                }

                $mdDialog.show({
                    controller: 'DialogController',
                    templateUrl: 'confirm-dialog.html',
                    targetEvent: $event,
                    locals: {
                        displayOption: {
                            title: "Oh no :(",
                            content: "The budget amount must be "+warningType+" than the "+warnDuration+" "+expenseActType+" budget of KES "+selectedBudgetAmount+"",
                            ok: "Confirm"
                        }
                    }
                }).then(function () {
                    $scope.dialogResult = "You choose Confirm!"
                });
            }// End showAlertDialog.

            for (var i = 0; i < theMergedActBudgets.length; i++) {

                var selectedBudgetAmount = theMergedActBudgets[i]['actCost'];


                console.log('testststst');
                console.log(expenseDur);
                console.log(expenseCost);
                console.log(theMergedActBudgets[i]['actCost']);
                console.log(theMergedActBudgets[i]['duration']);

                var warnOne, warnTwo,warningType;

                //if(theMergedActBudgets[i]['activity']==expenseActType){
                    if((expenseDur=='month')&&((expenseCost<theMergedActBudgets[i]['actCost'])&&(theMergedActBudgets[i]['duration']=='week'))) {
                        saveBudget = false;
                        warnOne = true;
                        warningType = 'greater';
                        // if(i>theMergedActBudgets.length-2){
                        //     inpracticalBudgetAlertDialog($scope.event,expenseDur,expenseActType);
                        // }
                    }else if((expenseDur=='year')&&((expenseCost<theMergedActBudgets[i]['actCost'])&&((theMergedActBudgets[i]['duration']=='week')||(theMergedActBudgets[i]['duration']=='month')))) {
                        saveBudget = false;
                        warnTwo = true;
                        warningType = 'greater';
                        // if(i>theMergedActBudgets.length-2){
                        //     inpracticalBudgetAlertDialog($scope.event,expenseDur,expenseActType);
                        // }
                    }else if((expenseDur=='month')&&((expenseCost>theMergedActBudgets[i]['actCost'])&&(theMergedActBudgets[i]['duration']=='year'))) {
                        saveBudget = false;
                        warnOne = true;
                        warningType = 'less';
                        // if(i>theMergedActBudgets.length-2){
                        //     inpracticalBudgetAlertDialog($scope.event,expenseDur,expenseActType);
                        // }
                    }else if((expenseDur=='week')&&((expenseCost>theMergedActBudgets[i]['actCost'])&&((theMergedActBudgets[i]['duration']=='month')||(theMergedActBudgets[i]['duration']=='year')))) {
                        saveBudget = false;
                        warnTwo = true;
                        warningType = 'less';
                        // if(i>theMergedActBudgets.length-2){
                        //     inpracticalBudgetAlertDialog($scope.event,expenseDur,expenseActType);
                        // }
                    }


                //}
                if(warnOne){
                    if(i>theMergedActBudgets.length-2){
                        inpracticalBudgetAlertDialog($scope.event,expenseDur,expenseActType,warningType);
                        //warnOne = false;
                    }
                }
                if(warnTwo){
                    if(i>theMergedActBudgets.length-2){
                        inpracticalBudgetAlertDialog($scope.event,expenseDur,expenseActType,warningType);
                        //warnTwo = false;
                    }
                }
                if(!warnTwo && !warnOne){
                    if(i>theMergedActBudgets.length-2){
                        saveBudget = true;
                    }
                }

                if(i>theMergedActBudgets.length-2){
                    warnTwo = false;
                    warnOne = false;
                }

                console.log('saveBudget');
                console.log(saveBudget);

            }


        };

        var theBudgetTest = function(){
            for (var i = 0; i < budgetSummary.length; i++) {
                if(budgetSummary[i]['budgetNameType']==expenseType){
                    var compBudgetArr = budgetSummary[i]['budgetActivities'];
                    mergerPickedBudgetsActivities(compBudgetArr,expenseDur,expenseActType,expenseCost);
                }
            }
        }

        $scope.validateForm = function(formID,value) {

            if((formID==1)&&(value!=='')){
                $scope.expenseTypewarning = '';
                expenseType = value;
                console.log('notEmpty_$scope.expenseType: '+expenseType);
            }

            if((formID==1)&&(value!=='')){
                $scope.expenseTypewarning = '';

                console.error(value);
                var respdata = JSON.parse(value);

                console.error('respdatarespdata__');
                console.error(respdata);

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

                }, function(resp) { // optional
                    console.log('response');
                });

            }



            if((formID==2)&&(value!=='')){
                $scope.expenseCostwarning = '';
                expenseCost = value;
                //console.log('notEmpty_$scope.expenseCost');
            }

            if((formID==3)&&(value!=='')){
                $scope.expenseDescwarning = '';
                expenseDesc = value;
                //console.log('notEmpty_$scope.expenseDesc');
            }

            if((formID==4)&&(value!=='')){
                $scope.expenseDurationwarning = '';
                expenseDur = value;
                //console.log('notEmpty_$scope.expenseDur');
            }

            if((formID==5)&&(value!=='')){
                $scope.expenseActivitywarning = '';
                expenseActType = value;
                //console.log('notEmpty_$scope.expenseDur');
            }

            // for (var i = 0; i < expenseTypesIDs.length; i++) {
            //     if(expenseType===expenseTypesIDs[i]['title']){
            //         expID = expenseTypesIDs[i]['id'];
            //     }
            // }

            //console.log('expID: '+expID);

        }

        //Submit a new budget Record
    $scope.submitUploadRecord = function(item) {

        theBudgetTest();

        if(saveBudget){
            var budgetData = [];
            var budgetSummary = [];

            //console.log($scope.datetimeValue)

            var submitRecord = true;
            $scope.expenseTypewarning = '';
            $scope.expenseNamewarning = '';
            $scope.expenseCostwarning = '';
            $scope.expenseDescwarning = '';
            $scope.uploadDescwarning = '';
            if (!expenseType) {
                $scope.expenseTypewarning = 'blank';
                submitRecord = false;
                //console.log('$scope.expenseType');
            }
            // if (!$scope.expenseName) {
            //  $scope.expenseNamewarning = 'blank';
            //  submitRecord = false;
            //  //console.log('$scope.expenseName');
            // }
            if (!expenseCost) {
                $scope.expenseCostwarning = 'blank';
                submitRecord = false;
                //console.log('$scope.expenseCost');
            }

            // if (!expenseDesc) {
            //     $scope.expenseDescwarning = 'blank';
            //     submitRecord = false;
            //     //console.log('$scope.expenseDesc');
            // }

            if (!expenseActType) {
                $scope.expenseDescwarning = 'blank';
                submitRecord = false;
                //console.log('$scope.expenseDesc');
            }


            if (submitRecord === true) {
                //Post Data using endpoint
                //alert('post')

                var theTimeStamp = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds())-(1000*60*60*3); //add month -(minus) 1

                //console.log(theDateToday);
                
                var theDayExpesesRef = FBBudgetref;//.child(expenseType);
                expensesRef = $firebaseArray(theDayExpesesRef);
                theExpense = {
                    //'time': theTime,
                    //'itemTitle': $scope.expenseName,
                    'itemID': 1,
                    'itemType': expenseType,
                    //'itemDesc': expenseDesc,
                    'itemDur': expenseDur,
                    'itemAct': expenseActType,
                    'itemCost': Number(expenseCost),
                    'ts': theTimeStamp
                }
                dbExpensesData.push(theExpense);

                console.log('dbExpensesData');
                console.log(dbExpensesData);
                console.log('copyBudgetData');
                console.log(copyBudgetData);

                var duplicateCheck = function(){

                    var duplicateBudget = false;

                    var duplicateBudgetDialog = function ($event,dupbudgetType,dupbudgetAct,expenseDur) {
                        $mdDialog.show({
                            controller: 'DialogController',
                            templateUrl: 'confirm-dialog.html',
                            targetEvent: $event,
                            locals: {
                                displayOption: {
                                    title: "Oh no :(",
                                    content: "You have already created a "+expenseDur+"ly budget for "+dupbudgetAct+" in "+dupbudgetType+"!",
                                    ok: "Confirm"
                                }
                            }
                        }).then(function () {
                            $scope.dialogResult = "You choose Confirm!"
                        });
                    }// End showAlertDialog.

                    if (copyBudgetData.length < 1) {

                        console.log('duplicateBudget2: '+duplicateBudget);
                        expensesRef.$add(dbExpensesData[0]);
                        $scope.showAlertDialog($scope.$event);

                    }else{
                        for (var i = 0; i < copyBudgetData.length; i++) {

                            console.error('duplicateBudgetInit');
                            console.error(duplicateBudget);


                            //if(i<(copyBudgetData.length-1)){
                                if((dbExpensesData[0]['itemDur']==copyBudgetData[i]['itemDur'])&&(dbExpensesData[0]['itemType']==copyBudgetData[i]['itemType'])&&(dbExpensesData[0]['itemAct']==copyBudgetData[i]['itemAct'])){
                                    duplicateBudget = true;
                                }
                            //}
                                console.log('samplebudget_Typeee: '+copyBudgetData[i]['itemType']);
                                console.log('samplebudget_Acttt: '+copyBudgetData[i]['itemAct']);
                                console.log('duplicate_Budget: '+duplicateBudget);
                                console.log('copyBudget_Count: '+i+" : "+copyBudgetData.length);


                            if(i==(copyBudgetData.length-1)){
                                console.log('samplebudgetTypeee: '+copyBudgetData[i]['itemType']);
                                console.log('samplebudgetActtt: '+copyBudgetData[i]['itemAct']);
                                console.log('duplicateBudget: '+duplicateBudget);
                                console.log('copyBudgetCount: '+i+" : "+copyBudgetData.length);

                                if(duplicateBudget){
                                    var dupbudgetType = copyBudgetData[i]['itemType'];
                                    var dupbudgetAct = copyBudgetData[i]['itemAct'];
                                    console.log('duplicateBudget1: '+duplicateBudget);
                                    // For show alert Dialog.
                                    $timeout(function() {
                                        duplicateBudgetDialog($scope.event,dupbudgetType,dupbudgetAct,expenseDur);
                                    }, 1000);
                                }else{
                                    console.log('duplicateBudget2: '+duplicateBudget);
                                    expensesRef.$add(dbExpensesData[0]);
                                    $scope.showAlertDialog($scope.$event);
                                }

                                copyBudgetData = [];
                                duplicateBudget = false
                            }

                        }
                    }
                }

                duplicateCheck();

                        // if(item['itemDur']=='week'){
                        //     totalBudget = 0;//totalBudget+item['itemCost'];
                        // }

                for (var i = 0; i < dbExpensesData.length; i++) {
                    //expensesRef.$add(dbExpensesData[i]);
                    //theDayExpesesRef.update(theExpense);

                    // FBref.child(theKey).update({
                    //                         lastDateReceived: latestLoanTime,
                    //                         latestLoanAmount: totalLoanReceived,
                    //                         lastLoan: SentAmount,
                    //                         personalStatement: personalStatement,
                    //                     });



                }
                dbExpensesData = [];

                //Post an expense item

                var theDate = "{date (" + d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + ")}";
            
                // for (var i = 0; i < expenseTypesIDs.length; i++) {
                //     if(expenseType===expenseTypesIDs[i]['title']){
                //         expID = expenseTypesIDs[i]['id'];
                //     }
                // }

                // var postExpenseParams = {
                //         "description":expenseDesc,
                //         "transaction_reference": expID,
                //         "transaction_date": theDate.toString(),
                //         "expense_amount": expenseCost,
                //         "items": [{
                //             "id": expID,
                //             "cost_price": expenseCost
                //         }]
                // };

                //console.log('postExpenseParams');
                //console.log(JSON.stringify(postExpenseParams));
                // setTimeout(function() {
                //     $http({
                //         url: APIBASE_V1 + 'post_expense',
                //         method: "POST",
                //         data: postExpenseParams,
                //         headers: {
                //             'Content-Type': 'application/x-www-form-urlencoded'
                //         }
                //     }).then(function(response) {
                //         //console.log(response);
                //     }, function(response) { // optional
                //         //xhrErrorTracking.response();
                //         //xhrErrorTracking.responseError();
                //         //console.log('responseresponseresponseresponseresponseresponseresponseresponseresponseresponseresponseresponseresponseresponseresponseresponse');
                //     });
                // }, 1000);

                //End Post an expense item

                $scope.expenseCost = "";
                $scope.expenseDesc = "";
                $scope.expenseType = "";
                $scope.showFiles = false;
                //console.log('clearresponseclearresponseclearresponse');

                (function($){
                    $('.expenses input').val("");
                })(jQuery)
            }
        
            budgetDur = 'week';


            currentWkChart();

            $timeout(function() {
                $scope.weekBudgetSummary = 'active';
                $scope.monthBudgetSummary = 'inactive';
                $scope.yearBudgetSummary = 'inactive';

                console.log("AAmonthBudgetSummary "+$scope.monthBudgetSummary);
                console.log("BBweekBudgetSummary "+$scope.weekBudgetSummary);

            }, 3000);


            saveBudget = true;
        }
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
                        content: "Your budget Saved",
                        ok: "Confirm"
                    }
                }
            }).then(function () {
                $scope.dialogResult = "You choose Confirm!"
            });
        }// End showAlertDialog.

    //GENERATE PIE CHARTS COLOR CODES
    /**
     * Converts integer to a hexidecimal code, prepad's single 
     * digit hex codes with 0 to always return a two digit code. 
     * 
     * @param {Integer} i Integer to convert 
     * @returns {String} The hexidecimal code
     */
    function intToHex(i) {
        var hex = parseInt(i).toString(16);
        return (hex.length < 2) ? "0" + hex : hex;
    }   

    /**
     * Return hex color from scalar *value*.
     *
     * @param {float} value Scalar value between 0 and 1
     * @return {String} color
     */
    $scope.olDcolorCode = function(value) {
        // value must be between [0, 510]
        value = Math.min(Math.max(0,(1/value)), 1) * (510);

        var redValue;
        var greenValue;
        if (value < 255) {
            redValue = 255;
            greenValue = Math.sqrt(value) * 16;//40;
            greenValue = Math.round(greenValue);
        } else {
            greenValue = 255;
            value = value - 255;
            redValue = 256 - (value * value / 255)
            redValue = Math.round(redValue);
        }

        return "#" + intToHex(redValue) + intToHex(greenValue) + "00";
    }

    $scope.colorCode = function(value) {
        var percentColors = [
            { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0 } },
            { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
            { pct: 1.0, color: { r: 0x00, g: 0xff, b: 0 } } ];

        var getColorForPercentage = function(pct) {
            for (var i = 1; i < percentColors.length - 1; i++) {
                if (pct < percentColors[i].pct) {
                    break;
                }
            }
            var lower = percentColors[i - 1];
            var upper = percentColors[i];
            var range = upper.pct - lower.pct;
            var rangePct = (pct - lower.pct) / range;
            var pctLower = 1 - rangePct;
            var pctUpper = rangePct;
            var color = {
                r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
                g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
                b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
            };
            return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
            // or output as hex if preferred
        }
        var percentage = value;
        var inverseRatio = (100-percentage);
        return (getColorForPercentage(inverseRatio/100));

    };

    $interval(function(){
        (function($){
            window.randomize = function() {
                $('.ko-progress-circle').each(function(){
                    var progress = $(this).attr('my-progress');
                    $(this).attr('data-progress', Math.floor(progress));
                });
                //$('.ko-progress-circle').attr('data-progress', Math.floor(0));
            }
            setTimeout(window.randomize, 1000);
            $('.ko-progress-circle').click(window.randomize);
        }(jQuery));
    },1000);


}); // End of defaultUserInterface controller.




