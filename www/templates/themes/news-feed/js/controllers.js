// Controller of defaultUserInterface.
appControllers.controller('recordPurchasesCtrl', function(APIBASE, APIBASE_V1, $mdDialog, $mdBottomSheet, $mdToast, $mdDialog, $firebaseArray, $firebaseObject, $scope, $rootScope, $timeout, $http, $filter, $q, $interval, $state, $stateParams, $ionicHistory) {
        var company_id = localStorage.getItem('company_id');
        var FBSalesref = firebase.database().ref().child('sales'+company_id);;
        var FBProdsref = firebase.database().ref().child('products'+company_id);
        var FBrefDisbursements = firebase.database().ref().child('dailyDisbursements');
        var FBrefPayments = firebase.database().ref().child('dailyPayments');
        var salesRef;
        var theSale;
        var dbSalesData = [];
        var FBExpensesref = firebase.database().ref().child('expenses'+company_id);
        var theExpense;
        var dbExpensesData = [];
        var d = new Date();
        var theDateToday = (d.getDate() + 0) + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
        var company_id = localStorage.getItem("company_id");

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

        //var endPointUrl = 'https://portal.epesibooks.com/acc/api_v1/'+'get_sale_items?company_id='+company_id;

        //FB Data Source
        FBProdsref.orderByKey().on("value", function(snapshot) {
            
            var saleItems = snapshot.val();

            var prodsData = [];

            var p = snapshot.val();;

            for (var key in p) {
                if (p.hasOwnProperty(key)) {
                    console.log(key + " -> " + p[key]);
                    prodsData.push(p[key]);
                }
            }

            saleItems = prodsData;

            //var saleItems = resp.data;
            console.log('saleItemssaleItems'+ typeof saleItems);
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
                if(item.counter==false){
                    count--; 
                }
                if (count < 1) {
                    count = 1;
                }
                item.count = count;
                $scope.item = item;
            };
            $scope.addCount = function(item) {

                console.error('itemCounter');
                console.error(item.counter);
                console.error(item.counter);

                if (typeof item.count === "undefined") {
                    item.count = 1;
                }
                var count = item.count;
                if(item.counter==false){
                    count++; 
                }
                if (count > item.in_stock) {
                    count = item.in_stock;
                }
                item.count = count;
                $scope.item = item;
            };
            $scope.enableCounter = function(item,outOfStock) {
                //$scope.activateSell = false;
                if (item.selected === true) {
                    item.counter = true;//true;
                } else {
                    item.counter = false;
                    if(outOfStock==true){
                        item.counter = true;
                    }
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
                        d = new Date();
                        var theTime = d.getHours() + ":" + d.getMinutes();
                        var theDaySalesRef = FBSalesref.child(theDateToday);
                        var theTimeStamp = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds())-(1000*60*60*3); //add month -(minus) 1
              

                        salesRef = $firebaseArray(theDaySalesRef);
                        theSale = {
                            'time': theTime,
                            'itemTitle': (item.title).toString(),
                            'itemID': (item.id).toString(),
                            'quantity': Number(item.count),
                            'itemSellPrice': Number(item.sell_price) * Number(item.count),
                            'ts': theTimeStamp
                        }
                        dbSalesData.push(theSale);
                        checkedItems.push({
                            "id": (item.id).toString(),
                            "amount": (item.sell_price).toString(),
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
                var theDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
                var theTimeStamp = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds())-(1000*60*60*3); //add month -(minus) 1
              
                var itemCount = 1;
                var postSaleParams = {
                    "transaction_reference": theTimeStamp,
                    "customer_id": 1,
                    "transaction_date": theDate.toString(),
                    "due_date": theDate.toString(),
                    "total": (totalSaleAmount).toString(),
                    "items": checkedItems,
                };

                console.error('postSaleParamspostSaleParamspostSaleParams');

                console.log(JSON.stringify(postSaleParams));

                console.log(checkedItems);

                $scope.confirmCheckOut = function() {
                    console.log('dbSalesData');
                    console.log(dbSalesData);

                    for (var i = 0; i < dbSalesData.length; i++) {
                        salesRef.$add(dbSalesData[i]);
                        var orderQty = Number(dbSalesData[i]['quantity']);
                        console.log('itemIDitemIDitemIDitemID');
                        console.log(dbSalesData[i]);

                        FBProdsref.orderByChild("id").equalTo(Number(dbSalesData[i]['itemID'])).on("child_added", function(snapshot) {
                            var returnData = snapshot.val();
                            console.error('returnDataaa');
                            console.error(returnData);
                            console.log(returnData.in_stock);

                            var stockLevel = returnData.in_stock;

                            var theKey = snapshot.key;
                            console.log(snapshot.key + " : " + theKey);

                            var newStockCount = stockLevel-orderQty;

                            if(newStockCount<0){
                                newStockCount = 0;
                            }

                            FBProdsref.child(theKey).update({
                                in_stock: newStockCount
                            });

                        });
                    }

                    dbSalesData = [];
                    setTimeout(function() {
                        $http({
                            url: APIBASE_V1 + 'post_sale?company_id='+company_id,
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

        //Portal Data Source
        /*
            $http.get(APIBASE+'get_items?company_id='+company_id).then(function(resp) {
                console.log('resp.dataresp.dataresp.data');
                console.log(JSON.stringify(resp.data));

                var saleItems = resp.data;
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
                                "amount": (item.sell_price).toString(),
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
                    var theDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
                    var theTimeStamp = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds())-(1000*60*60*3); //add month -(minus) 1
                  
                    var itemCount = 1;
                    var postSaleParams = {
                        "transaction_reference": theTimeStamp,
                        "customer_id": 1,
                        "transaction_date": theDate.toString(),
                        "due_date": theDate.toString(),
                        "total": (totalSaleAmount).toString(),
                        "items": checkedItems,
                    };

                    console.error('postSaleParamspostSaleParamspostSaleParams');

                    console.log(JSON.stringify(postSaleParams));

                    console.log(checkedItems);

                    $scope.confirmCheckOut = function() {
                        console.log('dbSalesData');
                        console.log(dbSalesData);

                        for (var i = 0; i < dbSalesData.length; i++) {
                            salesRef.$add(dbSalesData[i]);
                            var orderQty = Number(dbSalesData[i]['quantity']);
                            console.log('itemIDitemIDitemIDitemID');
                            console.log(dbSalesData[i]);

                            FBProdsref.orderByChild("id").equalTo(Number(dbSalesData[i]['itemID'])).on("child_added", function(snapshot) {
                                var returnData = snapshot.val();
                                console.error('returnDataaa');
                                console.error(returnData);
                                console.log(returnData.in_stock);

                                var stockLevel = returnData.in_stock;

                                var theKey = snapshot.key;
                                console.log(snapshot.key + " : " + theKey);

                                FBProdsref.child(theKey).update({
                                    in_stock: stockLevel-orderQty
                                });

                            });
                        }

                        dbSalesData = [];
                        setTimeout(function() {
                            $http({
                                url: APIBASE_V1 + 'post_sale?company_id='+company_id,
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
        */

        //getYears();
        //}]);
        //app.controller('ExpenseCtrl', ['APIBASE', '$scope', '$rootScope', '$timeout', '$http', '$filter', '$q', '$interval', function(APIBASE, $scope, $rootScope, $timeout, $http, $filter, $q, $interval) {
        //The DATA Sources

        //Purchase Items

        //$http.get(APIBASE + 'GetItems').then(function(resp) {});
        //End of Purchase Items
        //Expense Items

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
            $scope.ok = function() {
                $mdDialog.hide();
            }
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
                    '<div class="confirmsale bottom-0"><h1 class="uppercase ultrabold bottom-0">CONFIRM SALE</h1><h6 class="uppercase ultrabold bottom-0">ENTER CASH RECEIVED</h6><div class="page-login-field"><input ng-model="parent.cashReceived" type="number" placeholder="KES"> <em>(required)</em></div><h6 class="uppercase ultrabold bottom-0">TOTAL: KES {{parent.totalSaleAmount}}</h6><h6 class="uppercase ultrabold bottom-0">CHANGE: KES {{(parent.cashReceived-parent.totalSaleAmount > 0) ? parent.cashReceived-parent.totalSaleAmount:"0";}}</h6><div class="sale_item_list" style=""><table class="table-borders-light" width="100%"><tbody width="100%"><tr width="100%"><th class="bg-night-dark" width="50%">Items</th><th class="bg-night-dark" width="20%">Price</th><th class="bg-night-dark" width="10%">Qty</th><th class="bg-night-dark" width="20%">Total</th></tr><tr ng-repeat="item in parent.clientReceipt"><td class="bg-night-light">{{item.title}}</td><td class="bg-night-light">{{item.amount}}</td><td class="bg-night-light">{{item.quantity}}</td><td class="bg-night-light">{{item.quantity*item.amount}}</td></tr></tbody></table></div><a href="#" ng-click="ok();" class="md-raised md-button md-default-theme btn-danger">CANCEL</a><a href="#" ng-click="parent.confirmCheckOut(); cancel();" class="md-raised md-button md-default-theme">CONFIRM</a></div>'
                      + '  </md-dialog-content>' +
                      '</md-dialog>',

                targetEvent: $event,
                locals: {
                    parent: $scope
                }
            }).then(function(answer) {
              console.log('you submitted - ' + answer);
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

// End showAlertDialog.


    // For show alert Dialog.
    $scope.showAlertDialog = function ($event) {
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: 'confirm-dialog.html',
            targetEvent: $event,
            locals: {
                displayOption: {
                    title: "Alert dialog !!",
                    content: "This is alert dialog content.",
                    ok: "Confirm"
                }
            }
        }).then(function () {
            $scope.dialogResult = "You choose Confirm!"
        });
    }// End showAlertDialog.

}); // End of defaultUserInterface controller.