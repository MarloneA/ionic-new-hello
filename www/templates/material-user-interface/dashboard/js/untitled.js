        //Sales Weekly Chart
        var dayTotalProfits = 0;
        var dailyProfits; // = $firebaseArray(FBSalesref);

        FBSalesref.orderByKey().once("value", function(snapshottwo) {

            (function() {
                var returnData = returnSalesData;

                //FBExpensesref.orderByKey().once("value", function(snapshottwo) {
                    var returnDataTwo = snapshottwo.val();

                    $.extend( true, returnData, returnExpensesData );

                    console.log('returnData111returnDatareturnData');
                    console.log(returnData);

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

                            var theDay = Number((key.split("-"))[0]);
                            var theMonth = Number((key.split("-"))[1]);
                            var theYear = Number((key.split("-"))[2]);

                            if(theDay<10){
                                theDay = 0+''+theDay;
                            }

                            if(theMonth<10){
                                theMonth = 0+''+theMonth;
                            }

                            var newDateKey = theDay+"-"+theMonth+"-"+theYear;

                            console.log('newDateKeynewDateKeynewDateKeynewDateKey');
                            console.log(newDateKey);

                            saleData[newDateKey] = theDataArray;

                            console.error('saleDatasaleDatasaleData111');
                            console.error(saleData);

                            arrayOfDaySales.push(saleData);
                        }
                    }
                    dailyProfits = arrayOfDaySales;
                    console.log('dailyProfitsAAAAAAA');
                    console.log(dailyProfits);


                    theSummaryChart(dailyProfits);
                    $scope.weekRevSummary = 'active';

                    $scope.todayStats = dayTotalProfits;
                    $timeout(function() {
                        $scope.todayStats = dayTotalProfits;
                    }, 3000);

                    $scope.theSummaryChartProfit = function () {
                        chartBGcolor = 'pink';

                        $scope.weekExpSummary = 'inactive';
                        $scope.weekRevSummary = 'active';
                        $scope.weekPurSummary = 'inactive';

                        theSummaryChart(dailyProfits);
                        $scope.todayStats = dayTotalProfits;//dayTotalExpenses;
                    }

                    console.log(JSON.stringify(dailyProfits));
                    for (var i = 0; i < dailyProfits.length; i++) {
                        var theDayKeyFun = function(object) {
                            return Object.keys(object)[0];
                        };
                        var theDayKey = theDayKeyFun(dailyProfits[i]);
                        var theDayArray = dailyProfits[i][theDayKey];
                        var theDayTotals = 0;
                        var itemSoldCount = 0;
                        for (var k = 0; k < theDayArray.length; k++) {
                            theDayTotals = theDayTotals + theDayArray[k]['itemSellPrice'];
                            itemSoldCount = itemSoldCount + theDayArray[k]['quantity'];
                            console.log('theDayKey');
                            console.log(theDayKey);
                            console.log(theDateToday);
                            if (theDayKey === theDateToday) {
                                dayTotalProfits = dayTotalProfits + theDayArray[k]['itemSellPrice'];
                            }
                        }
                        dailyProfits[i]['dayTotal'] = theDayTotals;
                        dailyProfits[i]['itemCount'] = itemSoldCount; //theDayArray.length;
                    }
                    //$scope.monthlySales = dailyProfits;
                    $interval(function() {
                        //console.log('dayTotalProfits: ' + dayTotalProfits);
                        $scope.monthlySales = dailyProfits;
                        $scope.dailyTotalSales = dayTotalProfits;
                    }, 1000);

                    (function($){
                        //Make sure week tabs are loaded before running currentWkChart()
                        var showWksTabChart = setInterval(function(){
                            var showWksTab = $('#dashboard-content.the-dashboard md-card');
                            //console.log("GoTabsRecentAAAA: "+showWksTab.length);

                            if(showWksTab.length>0){

                                console.log("GoTabsRecent: "+showWksTab.length);

                                setTimeout(function() {
                                    var exeCount = 0;

                                    $('.the-dashboard [data-toggle-box]').unbind('click');

                                    $('.the-dashboard [data-toggle-box]').on('click', function() {
                                        
                                        $(this).parent().toggleClass("active");
                                        var toggle_box = $(this).data('toggle-box');
                                        
                                        console.error('toggleclicked: '+toggle_box+' : '+'exeCount: '+exeCount);
                                        if(exeCount<1){
                                            if ($('.the-dashboard #' + toggle_box).is(":visible")) {
                                                $('.the-dashboard #' + toggle_box).slideUp(250);
                                                console.log('isvisible');
                                            } else {
                                                $(".the-dashboard [id^='box']").slideUp(250);
                                                $('.the-dashboard #' + toggle_box).slideDown(250);
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


                //});

            })

        });

        //End of sales Weekly Chart