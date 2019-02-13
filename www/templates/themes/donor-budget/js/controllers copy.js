// Controller of defaultUserInterface.
appControllers.controller('budgetCtrl', function(APIBASE, APIBASE_V1, $mdDialog, $mdBottomSheet, $mdToast, $mdDialog, $firebaseArray, $firebaseObject, $scope, $rootScope, $timeout, $http, $filter, $q, $interval, $state, $stateParams, $ionicHistory, FileUploader) {


   //Default value of input number.

   console.log(111111111111);

   //CUSTOM CODE

        var FBSalesref = firebase.database().ref().child('sales'+company_id);;
        var FBrefDisbursements = firebase.database().ref().child('dailyDisbursements');
        var FBrefPayments = firebase.database().ref().child('dailyPayments');
        var salesRef;
        var theSale;
        var dbSalesData = [];
        var monthlyExpenses = [];
        var FBExpensesref = firebase.database().ref().child('expenses'+company_id);
        var FBBudgetref = firebase.database().ref().child('budget');
        var theExpense;
        var dbExpensesData = [];
        var d = new Date();
        var theDateToday = (d.getDate() + 0) + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
        var expenseTypesIDs;

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

        //Get Expense Type to budget for

        $http({
            url: APIBASE_V1+'get_expense_items',
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

        //Get budget durations
        $scope.expenseDurations = [{
            alias: "week",
            description: "week",
            title: "Weekly"
        },{
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
            console.log(username);
            console.log(password);
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
            console.log(username);
            console.log(password);
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
            console.log(username);
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
                console.log(response.data);
                localStorage.setItem("username", username);
                localStorage.setItem("password", password);
            }, function(response) { // optional
                console.log('failed login');
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
            console.log('resp.dataresp.dataresp.data');
            console.log(JSON.stringify(resp.data));

            var saleItems = resp.data;
            console.log('saleItemssaleItems');
            console.log(JSON.stringify(saleItems));

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
                console.log(item.selected);
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

                        console.log(JSON.stringify(receiptArray));
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

                console.error('postSaleParamspostSaleParamspostSaleParams');

                console.log(JSON.stringify(postSaleParams));

                console.log(checkedItems);

                $scope.confirmCheckOut = function() {
                    console.log('dbSalesData');
                    console.log(dbSalesData);
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
                            console.log(response);
                        }, function(response) { // optional
                            //xhrErrorTracking.response();
                            //xhrErrorTracking.responseError();
                            console.log(response);
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
                console.log(itemsSold);
                console.log(item);
                $scope.theItem = item;
                //Post Sales
                //var d = new Date();
                var theDate = "{date (" + d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + ")}";
                var itemCount = 1;
                console.log(theDate.toString());
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
                console.log(JSON.stringify(postSaleParams));
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
                        console.log(response);
                    }, function(response) { // optional
                        //xhrErrorTracking.response();
                        //xhrErrorTracking.responseError();
                        console.log(response);
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
        $http({
            url: APIBASE + 'GetItems',
            method: "POST",
            data: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function(response) {
            console.log(response.data);
            $scope.expenseItems = response.data;
            $scope.itemExpenseDetails = function(item) {
                console.log(item);
                $scope.theItem = item;
                //Post Sales
                //var d = new Date();
                var theDate = "{date (" + d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + ")}";
                var itemCount = 1;
                console.log(theDate.toString());
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
                console.log(JSON.stringify(postExpenseParams));
                setTimeout(function() {
                    $http({
                        url: APIBASE + 'post_expense',
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
            }
        }, function(response) { // optional
            console.log('response');
        });
        //Purchase Items
        var purchaseParams = {
            "item_type_id": "25"
        }
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
            console.log(filteredPurchaseItems);
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
                console.log(item.selected);
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
                        console.log(JSON.stringify(purchaseReceiptArray));
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
                console.log(JSON.stringify(postPurchaseParams));
                console.log(purchaseCheckedItems);
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
                            console.log(response);
                        }, function(response) { // optional
                            ////xhrErrorTracking.response();
                            ////xhrErrorTracking.responseError();
                            console.log(response);
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
            console.log('response');
        });
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
            console.log(resp.data);
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
                console.log(item.selected);
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
                        console.log(JSON.stringify(expenseReceiptArray));
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
                console.log(expenseCheckedItems);
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
                            console.log(response);
                        }, function(response) { // optional
                            ////xhrErrorTracking.response();
                            ////xhrErrorTracking.responseError();
                            console.log(response);
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
            console.log('response');
        });
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
            console.log('sales report data');
            console.log(totalSales);
            console.log($scope.salesData);
        }, function(resp) { // optional
            console.log('response');
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
            console.log('totalPurchases report data');
            console.log(totalPurchases);
        }, function(resp) { // optional
            console.log('response');
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
            console.log('returnDatareturnDatareturnDatareturnData');
            console.log(JSON.stringify(testData));
            console.log(JSON.stringify(returnData));
            //returnData = testData;
            var arrayOfDaySales = [];
            var objCounts = 0;
            for (var key in returnData) {
                if (returnData.hasOwnProperty(key)) {
                    objCounts++;
                    console.log(objCounts);
                    var theDataValue = returnData[key];
                    console.log(key + " ->>> " + theDataValue + " count: " + objCounts);
                    var theDataArray = [];
                    for (var dataKey in theDataValue) {
                        if (theDataValue.hasOwnProperty(dataKey)) {
                            theDataArray.push(theDataValue[dataKey]);
                            console.log(dataKey + " -> " + theDataValue[dataKey]);
                            console.log(theDataArray);
                        }
                    }
                    returnData[key] = theDataArray;
                    var saleData = {};
                    saleData[key] = theDataArray;
                    arrayOfDaySales.push(saleData);
                }
            }
            dailySales = arrayOfDaySales;
            console.log('dailySalesAAAAAAA');
            console.log(dailySales);

            $scope.todayStats = dayTotalSales;
            $timeout(function() {
                $scope.todayStats = dayTotalSales;
            }, 3000);

            console.log(JSON.stringify(dailySales));
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
                    console.log('theDayKey');
                    console.log(theDayKey);
                    console.log(theDateToday);
                    if (theDayKey === theDateToday) {
                        dayTotalSales = dayTotalSales + theDayArray[k]['itemSellPrice'];
                    }
                }
                dailySales[i]['dayTotal'] = theDayTotals;
                dailySales[i]['itemCount'] = itemSoldCount; //theDayArray.length;
            }
            //$scope.monthlySales = dailySales;
            $interval(function() {
                //console.log('dayTotalSales: '' + dayTotalSales);
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
        var budgetSummary = [];

        FBBudgetref.orderByKey().on("value", function(snapshot) {

            var returnData = snapshot.val();
            console.log('budgetreturnData');
            console.log(returnData);

            var p = returnData;

            for (var key in p) {
                if (p.hasOwnProperty(key)) {
                    console.log(key + " -> " + p[key]);
                    budgetData.push(p[key]);
                }
            }

            //var budgetTypes = localStorage.getItem("compTypes");
            var budgetTypes = [{"id":21,"alias":"Business Expense","item_code":"00100","item_type_id":26,"title":"Business Expense","description":"Transport","cost_price":20000,"sell_price":0,"in_stock":0,"photo_1":null,"photo_2":null,"photo_3":null},{"id":22,"alias":"Personal Expense","item_code":"00100","item_type_id":26,"title":"Personal Expense","description":"Transport","cost_price":20000,"sell_price":0,"in_stock":0,"photo_1":null,"photo_2":null,"photo_3":null},{"id":23,"alias":"COGS","item_code":"00100","item_type_id":26,"title":"Stock Expense","description":"Employee Payroll","cost_price":20000,"sell_price":0,"in_stock":0,"photo_1":null,"photo_2":null,"photo_3":null}];//$scope.expenseTypes;

            console.log('budgetTypesbudgetTypesbudgetTypesbudgetTypes');
            console.log(budgetTypes);

            setTimeout(function() {
                for (var i = 0; i < budgetTypes.length; i++) {

                    var totalBudget = 0;//total weekly Budget NB: if budget duration is year, divide ans/52 weeks

                    budgetData.forEach(function(item) {
                        if(item['itemType'] == budgetTypes[i]['alias']){
                            if(item['itemDur']=='week'){
                                totalBudget = totalBudget+item['itemCost'];
                            }
                            if(item['itemDur']=='month'){
                                totalBudget = totalBudget+(item['itemCost']/4);
                            }
                            if(item['itemDur']=='year'){
                                totalBudget = totalBudget+(item['itemCost']/52);
                            }

                        }
                    });

                    budgetSummary.push({
                        'budgetType':budgetTypes[i]['alias'],
                        'budgetTotal':totalBudget
                    });

                }


                console.log('budgetDatabudgetDatabudgetData');
                console.log(budgetData);
                console.log(budgetTypes);
                console.log('budgetSummary');
                console.log(budgetSummary);



                $scope.weekBudgetSummary = 'active';

                var dayTotalExpenses = 0;
                var dailyExpenses; // = $firebaseArray(FBExpensesref);
                FBExpensesref.orderByKey().on("value", function(snapshot) {
                    var returnData = snapshot.val();
                    console.log('returnDatareturnDatareturnDatareturnData');
                    console.log(JSON.stringify(returnData));
                    //returnData = testData;
                    var arrayOfDayExpenses = [];
                    var objCounts = 0;
                    for (var key in returnData) {
                        if (returnData.hasOwnProperty(key)) {
                            objCounts++;
                            console.log(objCounts);
                            var theDataValue = returnData[key];
                            console.log(key + " ->>>>>>>> " + theDataValue + " count: " + objCounts);
                            var theDataArray = [];
                            for (var dataKey in theDataValue) {
                                if (theDataValue.hasOwnProperty(dataKey)) {
                                    theDataArray.push(theDataValue[dataKey]);
                                    console.log(dataKey + " -> " + theDataValue[dataKey]);
                                    monthlyExpenses.push({
                                        'day': key,
                                        'expType': theDataValue[dataKey]['itemType'],
                                        'time': theDataValue[dataKey]['time'],
                                        'amount': theDataValue[dataKey]['itemCost'],
                                        'desc': theDataValue[dataKey]['itemDesc'],
                                    });
                                    console.log(theDataArray);
                                }
                            }
                            console.log('monthlyExpensesmonthlyExpensesmonthlyExpensesmonthlyExpensesmonthlyExpenses');
                            console.log(monthlyExpenses);
                            returnData[key] = theDataArray;
                            var expenseData = {};
                            expenseData[key] = theDataArray;
                            arrayOfDayExpenses.push(expenseData);
                        }
                    }
                    dailyExpenses = arrayOfDayExpenses;
                    console.log('dailyExpensesAAAAAAA');
                    console.log(dailyExpenses);
                    console.log(JSON.stringify(dailyExpenses));
                    for (var i = 0; i < dailyExpenses.length; i++) {
                        var theDayKeyFun = function(object) {
                            return Object.keys(object)[0];
                        };
                        var theDayKey = theDayKeyFun(dailyExpenses[i]);
                        var theDayArray = dailyExpenses[i][theDayKey];
                        var theDayTotals = 0;
                        for (var k = 0; k < theDayArray.length; k++) {
                            theDayTotals = theDayTotals + theDayArray[k]['itemCost'];
                            console.log('theDayKeyaaaaa');
                            console.log(theDayKey);
                            console.log(theDateToday);
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
                    var currentWkChart, currentMthChart, currentYrChart;

                    $scope.yearData = [{'name':'Jan','mthCount':0,},{'name':'Feb','mthCount':1,},{'name':'Mar','mthCount':2,},{'name':'Apr','mthCount':3,},{'name':'May','mthCount':4,},{'name':'Jun','mthCount':5,},{'name':'Jul','mthCount':6,},{'name':'Aug','mthCount':7,},{'name':'Sep','mthCount':8,},{'name':'Oct','mthCount':9,},{'name':'Nov','mthCount':10,},{'name':'Dec','mthCount':11,}];
                    yearData = $scope.yearData;

                    function getCurrentWkNo(){
                        var dayNumber;
                        Date.prototype.getWeek = function () {
                            var target  = new Date(this.valueOf());
                            console.log(target);
                            var dayNr   = ((this.getDay() + 6) % 7);
                            dayNumber = dayNr;
                            console.log('dayNr: '+dayNr);
                            target.setDate(target.getDate() - dayNr + 3);
                            var firstThursday = (target.valueOf());
                            console.log('firstThursday');
                            console.log(firstThursday);
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
                            console.error(firstDate);
                            console.error(lastDate);
                            console.error(":"+numDays);
                       
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
                                    console.log(typeof endMonthDate+"--------"+ typeof end);

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
                        console.log(getWeeksInMonth(i,d.getFullYear()));
                    }

                    //Automatically display chart of the current week
                    currentWkChart = function(){


                        console.log('allYearWeeksallYearWeeksallYearWeeksallYearWeeks');
                        console.log(allYearWeeks);

                        currentWkNo = weekNumber;
                        var weekData = allYearWeeks[currentWkNo-1];
                        var startDate = weekData.start.date;
                        var endDate = weekData.end.date;
                        var fromMonth = weekData.start.month;
                        var toMonth = weekData.end.month;

                        var currentWeekBarCharts = function(startDate,endDate,fromMonth,toMonth) {

                            console.log(startDate+' : '+endDate+' : '+fromMonth+' : '+toMonth)

                            ////alert('official period');
                            console.log('official chart');
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

                            for (var i = 0; i < monthsIndex.length; i++) {
                                monthsIndex[i]
                            }

                            for (var i = 0; i < monthlyExpenses.length; i++) {
                                var theDay = Number(((monthlyExpenses[i]['day']).split("-"))[0]);
                                var theMonth = Number(((monthlyExpenses[i]['day']).split("-"))[1])-1;

                                console.log('theDay: '+theDay);

                                if((theMonth==fromMonth)&&(theMonth==toMonth)){
                                    if (theDay > (startDate - 1) && theDay < (endDate + 1)) {
                                        console.log(theDay);
                                        totalExpenses = totalExpenses + monthlyExpenses[i]['amount'];
                                        if (monthlyExpenses[i]['expType'] === 'Business Expense') {
                                            totalBusinessExpenses = totalBusinessExpenses + monthlyExpenses[i]['amount'];
                                        }
                                        if (monthlyExpenses[i]['expType'] === 'Personal Expense') {
                                            totalPersonalExpenses = totalPersonalExpenses + monthlyExpenses[i]['amount'];
                                        }
                                        if (monthlyExpenses[i]['expType'] === 'COGS') {
                                            totalStockExpenses = totalStockExpenses + monthlyExpenses[i]['amount'];
                                        }
                                    }
                                }else{
                                    if(theMonth === fromMonth){
                                        if (theDay > (startDate - 1)) {
                                            console.log('formulae1: '+theDay);
                                            totalExpenses = totalExpenses + monthlyExpenses[i]['amount'];
                                            if (monthlyExpenses[i]['expType'] === 'Business Expense') {
                                                totalBusinessExpenses = totalBusinessExpenses + monthlyExpenses[i]['amount'];
                                            }
                                            if (monthlyExpenses[i]['expType'] === 'Personal Expense') {
                                                totalPersonalExpenses = totalPersonalExpenses + monthlyExpenses[i]['amount'];
                                            }
                                            if (monthlyExpenses[i]['expType'] === 'COGS') {
                                                totalStockExpenses = totalStockExpenses + monthlyExpenses[i]['amount'];
                                            }
                                        }
                                    }
                                    if(theMonth === toMonth){
                                        if (theDay < (endDate + 1)) {
                                            console.log('formulae2: '+theDay);
                                            totalExpenses = totalExpenses + monthlyExpenses[i]['amount'];
                                            if (monthlyExpenses[i]['expType'] === 'Business Expense') {
                                                totalBusinessExpenses = totalBusinessExpenses + monthlyExpenses[i]['amount'];
                                            }
                                            if (monthlyExpenses[i]['expType'] === 'Personal Expense') {
                                                totalPersonalExpenses = totalPersonalExpenses + monthlyExpenses[i]['amount'];
                                            }
                                            if (monthlyExpenses[i]['expType'] === 'COGS') {
                                                totalStockExpenses = totalStockExpenses + monthlyExpenses[i]['amount'];
                                            }
                                        }
                                    }
                                }
                            }
                            console.log('totalBusinessExpenses');
                            console.log(totalBusinessExpenses);
                            console.error('init_budgetSummary');
                            console.error(budgetSummary);

                            for (var i = 0; i < budgetSummary.length; i++) {

                                if(budgetSummary[i]['budgetType'] == 'Business Expense'){
                                    budgetSummary[i]['budgetRatio'] = totalBusinessExpenses/(budgetSummary[i]['budgetTotal']);
                                    budgetSummary[i]['budgetSpent'] = totalBusinessExpenses;
                                    budgetSummary[i]['budgetSum'] = (budgetSummary[i]['budgetTotal']);
                                    console.log('budgetSummarybudgetSummarybudgetSummary');
                                    console.log(budgetSummary);
                                }
                                if(budgetSummary[i]['budgetType'] == 'Personal Expense'){
                                    budgetSummary[i]['budgetRatio'] = totalPersonalExpenses/(budgetSummary[i]['budgetTotal']);                                
                                    budgetSummary[i]['budgetSpent'] = totalPersonalExpenses;
                                    budgetSummary[i]['budgetSum'] = (budgetSummary[i]['budgetTotal']);
                                }
                                if(budgetSummary[i]['budgetType'] == 'COGS'){
                                    budgetSummary[i]['budgetRatio'] = totalStockExpenses/(budgetSummary[i]['budgetTotal']);
                                    budgetSummary[i]['budgetSpent'] = totalStockExpenses;
                                    budgetSummary[i]['budgetSum'] = (budgetSummary[i]['budgetTotal']);
                                }

                                //if(i>(budgetSummary.length-2)){
                                    $scope.budgetitems = budgetSummary;

                                    console.log('$scope.budgetitems');
                                    console.log(budgetSummary);
                                //}

                            }


                            // Section 1 Chart 1
                            var totalBusinessExpPercent = Math.round(totalBusinessExpenses / totalExpenses * 100);
                            var totalPersonalExpPercent = Math.round(totalPersonalExpenses / totalExpenses * 100);
                            var totalStockExpPercent = Math.round(totalStockExpenses / totalExpenses * 100);


                            console.log('totalBusinessExpPercent');
                            console.log(totalBusinessExpPercent);

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

                        $timeout(function(){
                            currentWeekBarCharts(startDate,endDate,fromMonth,toMonth);
                        },3000);

                    }

                    currentMthChart = function(){
                        var mthData = yearData[currentMthNo];
                        var fromMonth = mthData.mthCount;
                        var toMonth = mthData.mthCount;

                        var currentMonthBarCharts = function(fromMonth,toMonth) {

                            console.log(fromMonth+' : '+toMonth)

                            ////alert('official period');
                            console.log('official chart');

                            totalBusinessExpenses = 0;
                            totalPersonalExpenses = 0;
                            totalStockExpenses = 0;
                            totalExpenses = 0;

                            for (var i = 0; i < monthsIndex.length; i++) {
                                monthsIndex[i]
                            }

                            for (var i = 0; i < monthlyExpenses.length; i++) {
                                var theDay = Number(((monthlyExpenses[i]['day']).split("-"))[0]);
                                var theMonth = Number(((monthlyExpenses[i]['day']).split("-"))[1])-1;

                                if (theMonth > (fromMonth - 1) && theMonth < (toMonth + 1)) {
                                    console.log(theDay);
                                    totalExpenses = totalExpenses + monthlyExpenses[i]['amount'];
                                    if (monthlyExpenses[i]['expType'] === 'Business Expense') {
                                        totalBusinessExpenses = totalBusinessExpenses + monthlyExpenses[i]['amount'];
                                    }
                                    if (monthlyExpenses[i]['expType'] === 'Personal Expense') {
                                        totalPersonalExpenses = totalPersonalExpenses + monthlyExpenses[i]['amount'];
                                    }
                                    if (monthlyExpenses[i]['expType'] === 'COGS') {
                                        totalStockExpenses = totalStockExpenses + monthlyExpenses[i]['amount'];
                                    }
                                }
                            }
                            console.log('totalBusinessExpenses');
                            console.log(totalBusinessExpenses);

                            for (var i = 0; i < budgetSummary.length; i++) {

                                if(budgetSummary[i]['budgetType'] == 'Business Expense'){
                                    budgetSummary[i]['budgetRatio'] = totalBusinessExpenses/(budgetSummary[i]['budgetTotal']*4);                                
                                    budgetSummary[i]['budgetSpent'] = totalBusinessExpenses;
                                    budgetSummary[i]['budgetSum'] = (budgetSummary[i]['budgetTotal']*4);
                                    console.log('budgetSummarybudgetSummarybudgetSummaryMonth');
                                    console.log(budgetSummary);
                                }
                                if(budgetSummary[i]['budgetType'] == 'Personal Expense'){
                                    budgetSummary[i]['budgetRatio'] = totalPersonalExpenses/(budgetSummary[i]['budgetTotal']*4);
                                    budgetSummary[i]['budgetSpent'] = totalPersonalExpenses;
                                    budgetSummary[i]['budgetSum'] = (budgetSummary[i]['budgetTotal']*4);
                                }
                                if(budgetSummary[i]['budgetType'] == 'COGS'){
                                    budgetSummary[i]['budgetRatio'] = totalStockExpenses/(budgetSummary[i]['budgetTotal']*4);
                                    budgetSummary[i]['budgetSpent'] = totalStockExpenses;
                                    budgetSummary[i]['budgetSum'] = (budgetSummary[i]['budgetTotal']*4);
                                }

                                if(i>(budgetSummary.length-2)){
                                    $scope.budgetitems = budgetSummary;

                                    console.log('$scope.budgetitems');
                                    console.log(budgetSummary);
                                }

                            }

                            var totalBusinessExpPercent = Math.round(totalBusinessExpenses / totalExpenses * 100);
                            var totalPersonalExpPercent = Math.round(totalPersonalExpenses / totalExpenses * 100);
                            var totalStockExpPercent = Math.round(totalStockExpenses / totalExpenses * 100);


                            console.log('totalBusinessExpPercent');
                            console.log(totalBusinessExpPercent);

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

                        $timeout(function(){
                            currentMonthBarCharts(fromMonth,toMonth);
                        },500);

                    }

                    currentYrChart = function(){
                        //var yrData = yearData[currentMthNo];
                        var fromYear = currentYrNo;
                        var toYear = currentYrNo;

                        var currentYearBarCharts = function(fromYear,toYear) {

                            console.log(fromYear+' : '+toYear)

                            ////alert('official period');
                            console.log('official chart toYear');

                            totalBusinessExpenses = 0;
                            totalPersonalExpenses = 0;
                            totalStockExpenses = 0;
                            totalExpenses = 0;

                            for (var i = 0; i < monthlyExpenses.length; i++) {
                                var theDay = Number(((monthlyExpenses[i]['day']).split("-"))[0]);
                                var theMonth = Number(((monthlyExpenses[i]['day']).split("-"))[1])-1;
                                var theYear = Number(((monthlyExpenses[i]['day']).split("-"))[2]);

                                console.warn(theYear);

                                if (theYear > (fromYear - 1) && theYear < (toYear + 1)) {
                                    console.log(theDay);
                                    totalExpenses = totalExpenses + monthlyExpenses[i]['amount'];
                                    if (monthlyExpenses[i]['expType'] === 'Business Expense') {
                                        totalBusinessExpenses = totalBusinessExpenses + monthlyExpenses[i]['amount'];
                                    }
                                    if (monthlyExpenses[i]['expType'] === 'Personal Expense') {
                                        totalPersonalExpenses = totalPersonalExpenses + monthlyExpenses[i]['amount'];
                                    }
                                    if (monthlyExpenses[i]['expType'] === 'COGS') {
                                        totalStockExpenses = totalStockExpenses + monthlyExpenses[i]['amount'];
                                    }
                                }
                            }
                            console.log('totalBusinessExpenses');
                            console.log(totalBusinessExpenses);

                            for (var i = 0; i < budgetSummary.length; i++) {

                                if(budgetSummary[i]['budgetType'] == 'Business Expense'){
                                    budgetSummary[i]['budgetRatio'] = totalBusinessExpenses/(budgetSummary[i]['budgetTotal']*52);
                                    budgetSummary[i]['budgetSpent'] = totalBusinessExpenses;
                                    budgetSummary[i]['budgetSum'] = (budgetSummary[i]['budgetTotal'])*52;
                                    console.log('budgetSummarybudgetSummarybudgetSummaryYear');
                                    console.log(budgetSummary);
                                }
                                if(budgetSummary[i]['budgetType'] == 'Personal Expense'){
                                    budgetSummary[i]['budgetRatio'] = totalPersonalExpenses/(budgetSummary[i]['budgetTotal']*52);
                                    budgetSummary[i]['budgetSpent'] = totalPersonalExpenses;
                                    budgetSummary[i]['budgetSum'] = (budgetSummary[i]['budgetTotal'])*52;
                                }
                                if(budgetSummary[i]['budgetType'] == 'COGS'){
                                    budgetSummary[i]['budgetRatio'] = totalStockExpenses/(budgetSummary[i]['budgetTotal']*52);
                                    budgetSummary[i]['budgetSpent'] = totalStockExpenses;
                                    budgetSummary[i]['budgetSum'] = (budgetSummary[i]['budgetTotal'])*52;
                                }

                                if(i>(budgetSummary.length-2)){
                                    $scope.budgetitems = budgetSummary;

                                    console.log('$scope.budgetitems');
                                    console.log(budgetSummary);
                                }

                            }

                            var totalBusinessExpPercent = Math.round(totalBusinessExpenses / totalExpenses * 100);
                            var totalPersonalExpPercent = Math.round(totalPersonalExpenses / totalExpenses * 100);
                            var totalStockExpPercent = Math.round(totalStockExpenses / totalExpenses * 100);


                            console.log('totalBusinessExpPercent');
                            console.log(totalBusinessExpPercent);

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

                        $timeout(function(){
                            currentYearBarCharts(fromYear,toYear);
                        },500);

                    }



                    //load weeks data by default
                    
                    currentWkChart();
                    $timeout(function() {
                        currentWkChart();
                    }, 1000);
                    $timeout(function() {
                        currentWkChart();
                    }, 2000);

                    $timeout(function() {
                        currentWkChart();
                    }, 3000);

                    $scope.thebudgetWk = function(){

                        

                        currentWkChart();
                        $scope.weekBudgetSummary = 'active';
                        $scope.monthBudgetSummary = 'inactive';
                        $scope.yearBudgetSummary = 'inactive';
                    };

                    $scope.thebudgetMth = function(){

                        currentMthChart();
                        $scope.weekBudgetSummary = 'inactive';
                        $scope.monthBudgetSummary = 'active';
                        $scope.yearBudgetSummary = 'inactive';

                    };

                    $scope.thebudgetYr = function(){

                        currentYrChart();
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
                    '<md-dialog><md-card class="form"> <md-card-content><div class="col-100 {{expenseTypewarning}}"> <strong>Required Field</strong> <em>Select a budget for:</em> <md-select ng-change="parent.validateForm(1,expenseType);" ng-model="expenseType" aria-label="md-option"> <md-option ng-repeat="expType in parent.expenseTypes" value="{{expType.alias}}">{{expType.title}}</md-option> </md-select></div><div class="clear"></div><div class="col-100 {{expenseDurationwarning}}"> <strong>Required Field</strong> <em>Select budget duration</em> <md-select ng-change="parent.validateForm(4,expenseDuration);" ng-model="expenseDuration" aria-label="md-option"> <md-option ng-repeat="expDuration in parent.expenseDurations" value="{{expDuration.alias}}">{{expDuration.title}}</md-option> </md-select></div><div class="clear"></div><div class="col-100 {{expenseCostwarning}}"> <strong>Required Field</strong> <em>Amount to budget for:</em> <md-input-container md-no-float="" class="md-list-item-full-width"> <input ng-change="parent.validateForm(2,expenseCost);" ng-model="expenseCost" placeholder=" Cost incurred in KES" type="number"> </md-input-container></div><div class="clear"></div><div class="col-100 {{expenseDescwarning}}"> <strong>Required Field</strong> <em>What are you budgetting for?</em> <md-input-container md-no-float="" class="md-list-item-full-width"> <input ng-change="parent.validateForm(3,expenseDesc);" ng-model="expenseDesc" placeholder="Describe the expense"> </md-input-container></div><div class="clear"></div><div class="col-100"><a href="#" ng-click="parent.submitUploadRecord(); cancel();" data-menu="menu-confirmation" class="button button-full button-rounded button-green uppercase ultrabold take_photo">Submit Record</a></div></md-card-content> </md-card></md-dialog>',
                    //'<md-card class="form"><a href="#" ng-click="cancel();" data-menu="menu-confirmation" class="button button-full button-rounded button-green uppercase ultrabold take_photo">Submit Record</a></md-card>',

                targetEvent: $event,
                locals: {
                    parent: $scope
                }
            }).then(function(answer) {
              alert('you submitted - ' + answer);
            }, function() {

            });
        }

// End showAlertDialog.

    //Capture budget form inputs
        
        var expID;
        var expenseType, expenseCost, expenseDesc, expenseDur;

        $scope.validateForm = function(formID,value,expID) {

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
                $scope.expenseDurationwarning = '';
                expenseDur = value;
                console.log('notEmpty_$scope.expenseDur');
            }

            for (var i = 0; i < expenseTypesIDs.length; i++) {
                if(expenseType===expenseTypesIDs[i]['alias']){
                    expID = expenseTypesIDs[i]['id'];
                }
            }

            console.log('expID: '+expID);

        }

        //Submit Upload Record
        $scope.submitUploadRecord = function(item) {

            budgetSummary = [];

            console.log($scope.datetimeValue)

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

            if (submitRecord === true) {
                //Post Data using endpoint
                //alert('post')

                var theTimeStamp = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds())-(1000*60*60*3); //add month -(minus) 1

                console.log(theDateToday);
                
                var theDayExpesesRef = FBBudgetref;//.child(expenseType);
                expensesRef = $firebaseArray(theDayExpesesRef);
                theExpense = {
                    //'time': theTime,
                    //'itemTitle': $scope.expenseName,
                    'itemID': 1,
                    'itemType': expenseType,
                    'itemDesc': expenseDesc,
                    'itemDur': expenseDur,
                    'itemCost': Number(expenseCost),
                    'ts': theTimeStamp
                }
                dbExpensesData.push(theExpense);

                console.log('dbExpensesData');
                console.log(dbExpensesData);

                for (var i = 0; i < dbExpensesData.length; i++) {
                    expensesRef.$add(dbExpensesData[i]);
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
            
                for (var i = 0; i < expenseTypesIDs.length; i++) {
                    if(expenseType===expenseTypesIDs[i]['alias']){
                        expID = expenseTypesIDs[i]['id'];
                    }
                }

                var postExpenseParams = {
                        "description":expenseDesc,
                        "transaction_reference": expID,
                        "transaction_date": theDate.toString(),
                        "expense_amount": expenseCost,
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
                $scope.expenseType = "";
                $scope.showFiles = false;
                console.log('clearresponseclearresponseclearresponse');

                (function($){
                    $('.expenses input').val("");
                })(jQuery)
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
    $scope.colorCode = function(value) {
        // value must be between [0, 510]
        value = Math.min(Math.max(0,(1/value)), 1) * (510);

        var redValue;
        var greenValue;
        if (value < 255) {
            redValue = 255;
            greenValue = Math.sqrt(value) * 40;
            greenValue = Math.round(greenValue);
        } else {
            greenValue = 255;
            value = value - 255;
            redValue = 256 - (value * value / 255)
            redValue = Math.round(redValue);
        }

        return "#" + intToHex(redValue) + intToHex(greenValue) + "00";
    }


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




