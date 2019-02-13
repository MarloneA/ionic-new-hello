// Controller of dashboard.
appControllers.controller('dashboardv2Ctrl', function(APIBASE, $firebaseArray, $mdDialog, $firebaseObject, $scope, $rootScope, $timeout, $http, $filter, $q, $interval, $state, $stateParams, $ionicHistory) {

    //alert(111222);

    //$scope.isAnimated is the variable that use for receive object data from state params.
    //For enable/disable row animation.
    $scope.isAnimated =  $stateParams.isAnimated;

    // navigateTo is for navigate to other page 
    // by using targetPage to be the destination state. 
    // Parameter :  
    // stateNames = target state to go.
    $scope.navigateTo = function (stateName) {
        $timeout(function () {
            if ($ionicHistory.currentStateName() != stateName) {
                $ionicHistory.nextViewOptions({
                    disableAnimate: false,
                    disableBack: true
                });
                $state.go(stateName);
            }
        }, ($scope.isAnimated  ? 300 : 0));
    }; // End of navigateTo.

    // goToSetting is for navigate to Dashboard Setting page
    $scope.goToSetting = function () {
        $state.go("app.dashboardSetting");
    };// End goToSetting.

    //GetSum of any array
    function getSum(total, num) {
        return total + Number(num);
    }

    //Dashboard Custom code

        //Adjust home page chart height

        function resizeChart() {
            //var windowWFun = $interval(function() {
                var windowW = $('.the-dashboard.donor md-card.chartjs md-card-content').innerWidth();
                var windowH = $('.the-dashboard.donor md-card.chartjs md-card-content').innerHeight();
                console.log('windowH: '+windowH);

                $scope.calcChartH = function(){
                    //return ((295/360)*windowW)-60;
                    return (windowH*0.75)-100;
                }
                if(windowH>10){
                    //$interval.cancel(windowWFun);
                }
            //}, 100);
        }

        resizeChart();

        $(window).resize(function(){
            resizeChart();
        });



        //Adjust home page chart height

        var FBSalesref = firebase.database().ref().child('income'+company_id);
        var FBrefDisbursements = firebase.database().ref().child('dailyDisbursements');
        var FBrefPayments = firebase.database().ref().child('dailyPayments');
        var salesRef;
        var theSale;
        var dbSalesData = [];
        var FBExpensesref = firebase.database().ref().child('donorexpenses'+company_id);
        var theExpense;
        var dbExpensesData = [];
        var d = new Date();
        var theDateToday = (d.getDate() + 0) + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
        //$timeout(function(){
        // Add comma to output
        //-------------------------------------------------------------------//
        var chartBGcolor = '#497cc9';

        var theSummaryChart = function (weeksData) {



            /*
                    new Chart('myChart', {
                          type: 'bar',
                          data: {
                              labels: ["Business Exp (" + totalBusinessExpPercent + "%)", "Personal Exp (" + totalPersonalExpPercent + "%)", "Stock Exp (" + totalStockExpPercent + "%)"],
                              //labels: ["B (" + totalBusinessExpPercent + "%)", "P (" + totalPersonalExpPercent + "%)", "S (" + totalStockExpPercent + "%)"],
                              datasets: [{
                                  label: 'WeeklyInit',
                                  //data: [12, 19, 3, 5, 2, 3],
                                  data: [totalBusinessExpenses, totalPersonalExpenses, totalStockExpenses],
                                  backgroundColor: [
                                      'rgba(255, 99, 132, 0.2)',
                                      'rgba(54, 162, 235, 0.2)',
                                      'rgba(255, 206, 86, 0.2)'
                                  ],
                                  borderColor: [
                                      'rgba(255,99,132,1)',
                                      'rgba(54, 162, 235, 1)',
                                      'rgba(255, 206, 86, 1)'
                                  ],
                                  borderWidth: 1
                              }]
                          },
                          options: {
                              scales: {
                                  yAxes: [{
                                      ticks: {
                                          beginAtZero:true
                                      },
                                        gridLines: {
                                          display:false
                                        }
                                  }],
                                  xAxes: [{
                                        gridLines: {
                                          display:false
                                        },            
                                        ticks: {
                                            fontSize: 7
                                        }
                                  }]
                              },
                              maintainAspectRatio: false,
                                legend: {
                                    display: false,
                                }
                          }
                    });
            */

            //alert(111);


            //Get Weekly summary of the sales
            /*
                var date = "16-10-2018";
                var theDay = Number(((date).split("-"))[0]);
                var theMonth = Number(((date).split("-"))[1]);
                var theYear = Number(((date).split("-"))[2]);

                 var theTimeStamp = Date.UTC(theYear, theMonth-1, theDay, 0, 0, 0)-(1000*60*60*3); //add month -(minus) 1
                                                        

                console.log(theTimeStamp);
                // Create a new JavaScript Date object based on the timestamp
                // multiplied by 1000 so that the argument is in milliseconds, not seconds.
                var date = new Date(theTimeStamp);
                console.log(String(date).split(" ")[0]);
            */

            var monthsIndex = 13;
            var allYearWeeks = [];
            var halfWeeks = 0;
            var weekCount = 0;
            var alterStart,alterEnd,alterMonth;

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

            console.warn(allYearWeeks);

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

                var d = new Date();

                var weekNumber = d.getWeek();

                if(dayNumber===6){
                    weekNumber = weekNumber+1;
                }
                return weekNumber;
            };

            console.error('getCurrentWkNo: '+getCurrentWkNo());

            var thisWeekRange = allYearWeeks[(getCurrentWkNo()-1)];
            console.log('thisWeekRange');
            console.log(thisWeekRange);



            var theFirstWeekDate = thisWeekRange['start']['date'];
            var theLastWeekDate = thisWeekRange['end']['date'];
            var theFirstDayWeekMonth = thisWeekRange['start']['month'];
            var theLastDayWeekMonth = thisWeekRange['end']['month'];

            var weeklyRevenue = [0,0,0,0,0,0,0];
            var oddWeeklyRevenue = [];
            var oddWeeklyRevObj = [];

            console.log('weeksData');
            console.log(weeksData);

            weeksData.forEach(function(item, index) {


                //for (var i = 0; i < weeksData.length+1; i++) {


                console.log('theDaytheDaytheDaytheDaytheDay');
                console.log(item);

                var theDayKeyFun = function(object) {
                    return Object.keys(object)[0];
                };
                var pickDate = theDayKeyFun(item);

                var theDay = Number(((pickDate).split("-"))[0]);
                var theMonth = Number(((pickDate).split("-"))[1]);

                console.log('theDay: '+theDay);
                console.log('thetheFirstWeekDateDay: '+theFirstWeekDate);
                console.log('theMonth: '+theMonth);
                console.log('theFirstDayWeekMonth: '+theFirstDayWeekMonth);
                console.log('theLastDayWeekMonth: '+theLastDayWeekMonth);
                console.log('theLastWeekDate: '+theLastWeekDate);



                //if((theDay >= (theFirstWeekDate) && theMonth == (theFirstDayWeekMonth+1)) && (theDay <= (theLastWeekDate) && theMonth <= (theLastDayWeekMonth+1))){
                if((theDay >= (theFirstWeekDate) && theMonth == (theFirstDayWeekMonth+1))){

                    console.log('condition_mettttt: '+(theDay-theFirstWeekDate));

                    var dayRevenue = item;
                    console.log('dayRevenue: ');
                    console.log(dayRevenue);
                    var totalRevenue = 0;

                    for (var k = 0; k < dayRevenue[pickDate].length; k++) {
                        console.log(dayRevenue[pickDate][k]['itemCost'])

                        if(typeof(dayRevenue[pickDate][k]['itemCost']) === 'undefined'){
                            totalRevenue = Number(totalRevenue) + Number(dayRevenue[pickDate][k]['itemSellPrice']);
                        }else{ 
                            console.log('blankday')
                            console.log('blankday: '+dayRevenue[pickDate][k]['itemCost']);

                            totalRevenue = Number(totalRevenue) + Number(dayRevenue[pickDate][k]['itemCost']);
                        }

                        console.error('totalRevenue');

                       console.error(totalRevenue);

                    }

                    console.log('dayRevenue');
                    console.log(dayRevenue);
                    console.log('totalRevenue');
                    console.log(totalRevenue);
                    console.log(JSON.stringify(dayRevenue));

                    weeklyRevenue[theDay-theFirstWeekDate] = (totalRevenue);

                    console.warn('theFirstWeekDate'+": "+(theFirstWeekDate));
                    console.warn('theDay'+": "+(theDay));
                    console.warn('diff'+": "+(theDay-theFirstWeekDate));

                    var futureDays;
                    var presentMth = d.getMonth();

                    console.warn('presentMth: '+presentMth);
                    console.warn('theFirstDayWeekMonth: '+theFirstDayWeekMonth);

                    // if(presentMth===theFirstDayWeekMonth){
                    //     futureDays = d.getDate()-theFirstWeekDate;
                    // }else{
                    //     futureDays = d.getDate()+(theLastWeekDate-theFirstWeekDate);
                    //     console.log('futureDaysDiff: '+(theLastWeekDate-d.getDate()));
                    // }

                    futureDays = d.getDay()-0;

                    console.warn('futureDays: '+futureDays);            

                    var lastMthFutDys = 7-(futureDays);
                    var nxtMthFutDys = 0;

                    console.log('futureDaysfutureDaysfutureDays');
                    console.log(futureDays);
                }

                if((theDay <= (theFirstWeekDate) && (theMonth-1) == (theFirstDayWeekMonth+1))){

                    console.log('condition_met_theLastWeekDate:' +(theLastWeekDate));
                    console.log('condition_met_theFirstWeekDate:' +(theFirstWeekDate));
                    console.log('condition_met_theDay:' +(theDay));

                    var dayRevenue = item;
                    console.log('dayRevenue: ');
                    console.log(dayRevenue);
                    var totalRevenue = 0;

                    for (var k = 0; k < dayRevenue[pickDate].length; k++) {
                        console.log(dayRevenue[pickDate][k]['itemCost'])

                        if(typeof(dayRevenue[pickDate][k]['itemCost']) === 'undefined'){
                            totalRevenue = Number(totalRevenue) + Number(dayRevenue[pickDate][k]['itemSellPrice']);
                        }else{ 
                            totalRevenue = Number(totalRevenue) + Number(dayRevenue[pickDate][k]['itemCost']);
                        }

                        console.error('totalRevenue');

                        console.error(totalRevenue);

                    }

                    console.log('dayRevenue');
                    console.log(dayRevenue);
                    console.log('totalRevenue');
                    console.log(totalRevenue);
                    console.log(JSON.stringify(dayRevenue));

                    //oddWeeklyRevenue[(theLastWeekDate-theDay)] = (totalRevenue);

                    console.error('theDayWk: '+theDay)
                    console.error('theLastDayWk: '+theLastWeekDate)

                    oddWeeklyRevenue.push(totalRevenue);

                    oddWeeklyRevObj.push({
                        'totalRevenue':totalRevenue,
                        'theDay':6-(theLastWeekDate-theDay)
                    });

                    console.warn('oddWeeklyRevenue11111: '+" : "+((theLastWeekDate-theDay))+" : "+oddWeeklyRevenue);

                    console.warn('theFirstWeekDate'+": "+(theFirstWeekDate));
                    console.warn('theDay'+": "+(theDay));
                    console.warn('diff'+": "+(theDay-theFirstWeekDate));

                    var futureDays;
                    var presentMth = d.getMonth();

                    console.warn('presentMth: '+presentMth);
                    console.warn('theFirstDayWeekMonth: '+theFirstDayWeekMonth);

                    // if(presentMth===theFirstDayWeekMonth){
                    //     futureDays = d.getDate()-theFirstWeekDate;
                    // }else{
                    //     futureDays = d.getDate()+(theLastWeekDate-theFirstWeekDate);
                    //     console.log('futureDaysDiff: '+(theLastWeekDate-d.getDate()));
                    // }

                    futureDays = d.getDay()-0;

                    console.warn('futureDays: '+futureDays);            

                    var lastMthFutDys = 7-(futureDays);
                    var nxtMthFutDys = 0;



                    console.error('futureDays: '+futureDays);




                    console.log('futureDaysfutureDaysfutureDays');
                    console.log(futureDays);
                }

                futureDays = d.getDay()-0;

                console.log('cooool: '+(d.getDay()));

                for (var i = 0; i < (6-(futureDays)); i++) {
                    weeklyRevenue[(futureDays+1)+i] = null;
                } 

                console.error('futureDays: '+futureDays);

            });

            console.log('theLastWeekDate');
            console.log(theLastWeekDate);
            console.log('theLastDayWeekMonth');
            console.log(theLastDayWeekMonth);
            console.log('weeklyRevenue');
            console.log(weeklyRevenue);
            console.log('oddWeeklyRevenue');
            console.log(oddWeeklyRevenue);

            function arrSwap(arr){
              
              var temp = 0;
              
              if (arr.length < 2){
                return arr;
              }else{
                temp = arr[0];
                arr[0] = arr[arr.length-1];
                arr[arr.length-1] = temp;
              }
              
              return arr;
              
            }

            var greyZoneWeekRev = (oddWeeklyRevenue);//arrSwap(oddWeeklyRevenue)

            console.log('greyZoneWeekRev');
            console.log(greyZoneWeekRev);
            console.log(weeklyRevenue);

            if(greyZoneWeekRev.length>0){
                var oddDayIdx = d.getDay();

                for (var i = 0; i < greyZoneWeekRev.length; i++) {
                    var greyIdx = oddWeeklyRevObj[i]['theDay'];
                    weeklyRevenue[greyIdx] = greyZoneWeekRev[i];
                }
            }

            var weeksTotalSales = weeklyRevenue.reduce(getSum);

            console.error('weeksTotalSales: '+weeksTotalSales);

            $scope.weeklyStats = weeksTotalSales;

            //End Get Weekly summary of the sales

            var options = {
                maintainAspectRatio: false,
                spanGaps: false,
                elements: {
                    line: {
                        tension: 0.35
                    }
                },
                plugins: {
                    filler: {
                        propagate: false
                    }
                },
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
                legend: {
                    display: false,
                }
            };

            console.log('weeklyRevenueFinal: '+weeklyRevenue);

            new Chart('chartLinev2', {
                type: 'bar',
                //type: 'pie',
                //type: 'line',
                data: {
                    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                    datasets: [{
                        backgroundColor: chartBGcolor,
                        borderColor: chartBGcolor,
                        data: weeklyRevenue,
                        label: 'KES',
                        fill: false
                    }]
                },
                options: Chart.helpers.merge(options, {
                    title: {
                        text: "weeklysummary",
                        display: false
                    }
                })
            });
            // eslint-disable-next-line no-unused-vars
            function toggleSmooth(btn) {
                Chart.helpers.each(Chart.instances, function(chart) {
                    chart.options.elements.line.tension = 0.00001;
                    chart.update();
                });
            }
            // eslint-disable-next-line no-unused-vars
            function randomize() {
                Chart.helpers.each(Chart.instances, function(chart) {
                    chart.data.datasets.forEach(function(dataset) {
                        dataset.data = [108.68, 60.17, 71.09, -34.25, -8.93, -57.89, 50.97, 9.01];
                    });
                    chart.update();
                });
            }
        }


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
        $scope.checkStatus = true;
        //$scope.activateSell = false;
        //$scope.theQuatity = 10;

        //getYears();
        //}]);
        //app.controller('ExpenseCtrl', ['APIBASE', '$scope', '$rootScope', '$timeout', '$http', '$filter', '$q', '$interval', function(APIBASE, $scope, $rootScope, $timeout, $http, $filter, $q, $interval) {
        //The DATA Sources

        //End of Purchase Items

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
                    arrayOfDaySales.push(saleData);
                }
            }
            dailySales = arrayOfDaySales;
            console.log('dailySalesAAAAAAA');
            console.log(dailySales);


            theSummaryChart(dailySales);
            $scope.weekRevSummary = 'active';

            $scope.todayStats = dayTotalSales;
            $timeout(function() {
                $scope.todayStats = dayTotalSales;
            }, 3000);

            $scope.theSummaryChartRev = function () {
                chartBGcolor = '#2980b9';
                $scope.weekExpSummary = 'inactive';
                $scope.weekRevSummary = 'active';
                theSummaryChart(dailySales);
                $scope.todayStats = dayTotalSales;//dayTotalExpenses;
            }

            var theSummaryChartRev = function () {
                chartBGcolor = '#2980b9';
                $scope.weekExpSummary = 'inactive';
                $scope.weekRevSummary = 'active';
                theSummaryChart(dailySales);
                $scope.todayStats = dayTotalSales;//dayTotalExpenses;
            }

            theSummaryChartRev();

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
                    theDayTotals = theDayTotals + Number(theDayArray[k]['itemSellPrice']);
                    itemSoldCount = itemSoldCount+1;// + theDayArray[k]['quantity'];
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
                //console.log('dayTotalSales: ' + dayTotalSales);
                $scope.monthlySales = dailySales;
                $scope.dailyTotalSales = dayTotalSales;
            }, 1000);


            // $(document).ready(function() {
            //     'use strict'
            //     //(function($){
            //     //Toggle Box

            //     $('[data-toggle-box]').parent().removeClass("active");

            //     setTimeout(function() {
            //         $('[data-toggle-box]').on('click', function() {
            //             $(this).parent().toggleClass("active");
            //             var toggle_box = $(this).data('toggle-box');
            //             if ($('#' + toggle_box).is(":visible")) {
            //                 $('#' + toggle_box).slideUp(2500);
            //             } else {
            //                 $("[id^='box']").slideUp(2500);
            //                 $('#' + toggle_box).slideDown(2500);
            //             }
            //         });
            //     }, 3000);
            //     //})(jQuery);
            // });
            
            // (function($){
            //     //Make sure week tabs are loaded before running currentWkChart()
            //     var showWksTabChart = setInterval(function(){
            //         var showWksTab = $('#dashboard-content.the-dashboard.donor md-card');
            //         console.log("GoTabsRecentAAAA: "+showWksTab.length);

            //         if(showWksTab.length>0){

            //             console.log("GoTabsRecent: "+showWksTab.length);

            //             setTimeout(function() {
            //                 var exeCount = 0;

            //                 $('.the-dashboard.donor [data-toggle-box]').unbind('click');

            //                 $('.the-dashboard.donor [data-toggle-box]').on('click', function() {
                                
            //                     $(this).parent().toggleClass("active");
            //                     var toggle_box = $(this).data('toggle-box');
                                
            //                     console.error('toggleclicked: '+toggle_box+' : '+'exeCount: '+exeCount);
            //                     if(exeCount<1){
            //                         if ($('.the-dashboard.donor #' + toggle_box).is(":visible")) {
            //                             $('.the-dashboard.donor #' + toggle_box).slideUp(250);
            //                             console.log('isvisible');
            //                         } else {
            //                             $(".the-dashboard.donor [id^='box']").slideUp(250);
            //                             $('.the-dashboard.donor #' + toggle_box).slideDown(250);
            //                             console.log('notvisible');
            //                         }
            //                     }
            //                     exeCount++;
            //                     //setTimeout(function() {
            //                         exeCount = 0;
            //                     //}, 1000);

            //                 });
            //             }, 2000);

            //             clearInterval(showWksTabChart);
            //         }
            //     },1000);
            // })(jQuery);

        })




        $timeout(function() {
            FBSalesref.orderByKey().on("value", function(snapshot) {

                /*Update Transactions list*/
                var salesAndExpense = dailyExpenses.concat(dailySales);

                console.log('ssalesAndExpense');
                console.log(salesAndExpense);

                $scope.salesAndExpense = sortbydate(salesAndExpense);
                
                // (function($){
                //     //Make sure week tabs are loaded before running currentWkChart()
                //     var showWksTabChart = setInterval(function(){
                //         var showWksTab = $('#dashboard-content.the-dashboard.donor md-card');
                //         console.log("GoTabsRecentAAAA: "+showWksTab.length);

                //         if(showWksTab.length>0){

                //             console.log("GoTabsRecent: "+showWksTab.length);

                //             setTimeout(function() {
                //                 var exeCount = 0;

                //                 $('.the-dashboard.donor [data-toggle-box]').unbind('click');

                //                 $('.the-dashboard.donor [data-toggle-box]').on('click', function() {
                                    
                //                     $(this).parent().toggleClass("active");
                //                     var toggle_box = $(this).data('toggle-box');
                                    
                //                     console.error('toggleclicked: '+toggle_box+' : '+'exeCount: '+exeCount);
                //                     if(exeCount<1){
                //                         if ($('.the-dashboard.donor #' + toggle_box).is(":visible")) {
                //                             $('.the-dashboard.donor #' + toggle_box).slideUp(250);
                //                             console.log('isvisible');
                //                         } else {
                //                             $(".the-dashboard.donor [id^='box']").slideUp(250);
                //                             $('.the-dashboard.donor #' + toggle_box).slideDown(250);
                //                             console.log('notvisible');
                //                         }
                //                     }
                //                     exeCount++;
                //                     //setTimeout(function() {
                //                         exeCount = 0;
                //                     //}, 1000);

                //                 });
                //             }, 2000);

                //             clearInterval(showWksTabChart);
                //         }
                //     },1000);
                // })(jQuery);

                /*End Update Transactions list*/
            });
        }, 5000);





        //}
        //End of Manage sales records
        //Manage Expense records
        //Manage Expense records
        //{
        $scope.aa = 45000 * 7;
        $scope.getExpenseKey = function(object) {
            return Object.keys(object)[0];
        };

        //sort by date
        function sortbydate(info) {
            info.sort(function(a, b){
              var aa = (Object.keys(a)[0]).split('-').reverse().join(),
                  bb = (Object.keys(b)[0]).split('-').reverse().join();
              return aa > bb ? -1 : (aa < bb ? 1 : 0);
              });
            return info;
        }

        //end sort by date

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
                            console.log(theDataArray);
                        }
                    }
                    returnData[key] = theDataArray;
                    var expenseData = {};

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

                    expenseData[newDateKey] = theDataArray;
                    arrayOfDayExpenses.push(expenseData);
                }
            }
            dailyExpenses = arrayOfDayExpenses;
            console.log('dailyExpensesAAAAAAA');
            console.log(dailyExpenses);
            console.log('dailySalesAAAAA');
            console.log(dailySales);

            var salesAndExpense = dailyExpenses.concat(dailySales);
            $scope.salesAndExpense = sortbydate(salesAndExpense);

            console.log('$scope.salesAndExpense');
            console.log($scope.salesAndExpense);

            $scope.theSummaryChartExp = function () {
                chartBGcolor = '#ac1a01';
                $scope.weekExpSummary = 'active';
                $scope.weekRevSummary = 'inactive';
                theSummaryChart(dailyExpenses);

                $scope.todayStats = dayTotalExpenses;
            }

            var theSummaryChartRev = function () {
                chartBGcolor = '#2980b9';
                $scope.weekExpSummary = 'inactive';
                $scope.weekRevSummary = 'active';
                theSummaryChart(dailySales);
                $scope.todayStats = dayTotalSales;//dayTotalExpenses;
            }

            theSummaryChartRev();

            console.log(JSON.stringify(dailyExpenses));
            for (var i = 0; i < dailyExpenses.length; i++) {
                var theDayKeyFun = function(object) {
                    return Object.keys(object)[0];
                };
                var theDayKey = theDayKeyFun(dailyExpenses[i]);
                var theDayArray = dailyExpenses[i][theDayKey];
                var theDayTotals = 0;
                for (var k = 0; k < theDayArray.length; k++) {
                    theDayTotals = theDayTotals + Number(theDayArray[k]['itemCost']);
                    console.log('theDayKeyaaaaa');
                    console.log(theDayKey);
                    console.log(theDateToday);
                    if (theDayKey === theDateToday) {
                        dayTotalExpenses = dayTotalExpenses + theDayArray[k]['itemCost'];
                    }
                }
                dailyExpenses[i]['dayTotal'] = theDayTotals;
                dailyExpenses[i]['expCount'] = (dailyExpenses[i][theDayKey]).length;//dailyExpenses.length;
            }
            monthlyExpenses = dailyExpenses;
            //{
            var totalExpenses = 0;
            var totalBusinessExpenses = 0;
            var totalPersonalExpenses = 0;
            var totalStockExpenses = 0;
            for (var i = 0; i < monthlyExpenses.length; i++) {
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
            $scope.totalExpenses = addCommas(totalExpenses.toFixed(0));
            var expPieChart = function() {
                var canvas = document.getElementById("expensePieChart");
                var ctx = canvas.getContext('2d');
                // Global Options:
                Chart.defaults.global.defaultFontColor = 'black';
                Chart.defaults.global.defaultFontSize = 16;
                var data = {
                    labels: ["Business Expense111 - " + (totalBusinessExpenses / totalExpenses * 100).toFixed(0) + "%", "Personal Expense - " + (totalPersonalExpenses / totalExpenses * 100).toFixed(0) + "%", "Stock Expense - " + (totalStockExpenses / totalExpenses * 100).toFixed(0) + "%"],
                    datasets: [{
                        fill: true,
                        backgroundColor: ['#ffa500', '#3366cc', '#dc3912'],
                        data: [totalBusinessExpenses, totalPersonalExpenses, totalStockExpenses],
                        // Notice the borderColor 
                        borderColor: ['#ffa500', '#3366cc', '#dc3912'],
                        borderWidth: [2, 2, 2]
                    }]
                };
                // Notice the rotation from the documentation.
                var options = {
                    title: {
                        display: true,
                        text: 'Types of Payments',
                        position: 'top'
                    }
                };
                // Chart declaration:
                var myBarChart = new Chart(ctx, {
                    type: 'pie',
                    data: data,
                    options: options
                });
            }
            $scope.weeklyBarCharts = function(period) {
                //alert(period);
                if (typeof period == 'undefined') {
                    period = "week3";
                }
                var lowerDate;
                var upperDate;
                totalBusinessExpenses = 0;
                totalPersonalExpenses = 0;
                totalStockExpenses = 0;
                totalExpenses = 0;
                //Rewrite the algorithm for accurately calculating the repective weeks in day
                if (period === "week1") {
                    lowerDate = 0;
                    upperDate = 7;
                }
                if (period === "week2") {
                    lowerDate = 7;
                    upperDate = 14;
                }
                if (period === "week3") {
                    lowerDate = 14;
                    upperDate = 21;
                }
                if (period === "week4") {
                    lowerDate = 21;
                    upperDate = 28;
                }
                for (var i = 0; i < monthlyExpenses.length; i++) {
                    var theDay = Number(((monthlyExpenses[i]['day']).split("-"))[0]);
                    if (theDay > lowerDate && theDay < (upperDate + 1)) {
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
                // Section 1 Chart 1
                var chart1 = new Chartist.Bar('#chart-1', {
                    // add labels
                    labels: ["Business Expense5555 - " + Math.round(totalBusinessExpenses / totalExpenses * 100) + "%", "Personal Expense - " + Math.round(totalPersonalExpenses / totalExpenses * 100) + "%", "Stock Expense - " + Math.round(totalStockExpenses / totalExpenses * 100) + "%"],
                    // add data
                    series: [
                        [totalBusinessExpenses, totalPersonalExpenses, totalStockExpenses]
                    ]
                }, {
                    // distance between bars
                    seriesBarDistance: 10,
                    // width: '100%',
                    height: '300px',
                    // chart padding
                    chartPadding: {
                        top: 30,
                        right: 20,
                        bottom: 20,
                        left: 10
                    }
                });
                // List charts
                var charts = [chart1];
                // Get length
                var numberofcharts = charts.length;
                // Loop through charts
                for (var i = 0; i < numberofcharts; i++) {
                    // Animate on draw
                    charts[i].on('draw', function(data) {
                        if (data.type === 'bar') {
                            data.element.animate({
                                y2: {
                                    dur: 1000,
                                    from: data.y1,
                                    to: data.y2,
                                    easing: Chartist.Svg.Easing.easeOutQuint
                                },
                                opacity: {
                                    dur: 1000,
                                    from: 0,
                                    to: 1,
                                    easing: Chartist.Svg.Easing.easeOutQuint
                                }
                            });
                        }
                    });
                }
            };
            $scope.monthlyBarCharts = function() {
                // Section 2 Chart 2
                var chart2 = new Chartist.Bar('#chart-2', {
                    // add labels
                    labels: ["Business Expense - " + Math.round(totalBusinessExpenses / totalExpenses * 100) + "%", "Personal Expense - " + Math.round(totalPersonalExpenses / totalExpenses * 100) + "%", "Stock Expense - " + Math.round(totalStockExpenses / totalExpenses * 100) + "%"],
                    // add data
                    series: [
                        [totalBusinessExpenses, totalPersonalExpenses, totalStockExpenses]
                    ]
                }, {
                    // distance between bars
                    seriesBarDistance: 10,
                    // width: '100%',
                    height: '300px',
                    // chart padding
                    chartPadding: {
                        top: 30,
                        right: 20,
                        bottom: 20,
                        left: 10
                    }
                });
                // List charts
                var charts = [chart2];
                // Get length
                var numberofcharts = charts.length;
                // Loop through charts
                for (var i = 0; i < numberofcharts; i++) {
                    // Animate on draw
                    charts[i].on('draw', function(data) {
                        if (data.type === 'bar') {
                            data.element.animate({
                                y2: {
                                    dur: 1000,
                                    from: data.y1,
                                    to: data.y2,
                                    easing: Chartist.Svg.Easing.easeOutQuint
                                },
                                opacity: {
                                    dur: 1000,
                                    from: 0,
                                    to: 1,
                                    easing: Chartist.Svg.Easing.easeOutQuint
                                }
                            });
                        }
                    });
                }
            };
            $scope.yearlyBarCharts = function() {
                // Section 2 Chart 2
                var chart3 = new Chartist.Bar('#chart-3', {
                    // add labels
                    labels: ["Business Expense - " + Math.round(totalBusinessExpenses / totalExpenses * 100) + "%", "Personal Expense - " + Math.round(totalPersonalExpenses / totalExpenses * 100) + "%", "Stock Expense - " + Math.round(totalStockExpenses / totalExpenses * 100) + "%"],
                    // add data
                    series: [
                        [totalBusinessExpenses, totalPersonalExpenses, totalStockExpenses]
                    ]
                }, {
                    // distance between bars
                    seriesBarDistance: 10,
                    // width: '100%',
                    height: '300px',
                    // chart padding
                    chartPadding: {
                        top: 30,
                        right: 20,
                        bottom: 20,
                        left: 10
                    }
                }); // List charts
                var charts = [chart3];
                // Get length
                var numberofcharts = charts.length;
                // Loop through charts
                for (var i = 0; i < numberofcharts; i++) {
                    // Animate on draw
                    charts[i].on('draw', function(data) {
                        if (data.type === 'bar') {
                            data.element.animate({
                                y2: {
                                    dur: 1000,
                                    from: data.y1,
                                    to: data.y2,
                                    easing: Chartist.Svg.Easing.easeOutQuint
                                },
                                opacity: {
                                    dur: 1000,
                                    from: 0,
                                    to: 1,
                                    easing: Chartist.Svg.Easing.easeOutQuint
                                }
                            });
                        }
                    });
                }
            }
            $scope.initWeeklyBarCharts = function() {
                setTimeout(function() {
                    $scope.weeklyBarCharts();
                    //expPieChart();
                }, 4000);
            };
            //}
            $interval(function() {
                //console.log('dayTotalExpenses: ' + dayTotalExpenses);
                $scope.theMonthlyExpenses = dailyExpenses;
                $rootScope.dailyTotalExpenses = dayTotalExpenses;
            }, 1000);
            $(document).ready(function() {
                'use strict'
                //(function($){
                //Toggle Box
                // setTimeout(function() {
                //  $('[data-toggle-box]').on('click', function() {
                //      $(this).parent().toggleClass("active");
                //      var toggle_box = $(this).data('toggle-box');
                //      if ($('#' + toggle_box).is(":visible")) {
                //          $('#' + toggle_box).slideUp(250);
                //      } else {
                //          $("[id^='box']").slideUp(250);
                //          $('#' + toggle_box).slideDown(250);
                //      }
                //  });
                // }, 3000);
                //})(jQuery);
            });

        })
        //}
        //End of Manage expense records
        //End of Manage expense records
        //$scope.monthlyExpenses = monthlyExpenses;
        //Get current month and year
        var currentMonth = (new Date().getMonth()) + 1;
        switch (currentMonth) {
            case 1:
                theCurrentMth = "January";
                break;
            case 2:
                theCurrentMth = "February";
                break;
            case 3:
                theCurrentMth = "March";
                break;
            case 4:
                theCurrentMth = "April";
                break;
            case 5:
                theCurrentMth = "May";
                break;
            case 6:
                theCurrentMth = "June";
                break;
            case 7:
                theCurrentMth = "July";
                break;
            case 8:
                theCurrentMth = "August";
                break;
            case 9:
                theCurrentMth = "September";
                break;
            case 10:
                theCurrentMth = "October";
                break;
            case 11:
                theCurrentMth = "November";
                break;
            case 12:
                theCurrentMth = "December";
                break;
        }
        $scope.theCurrentMth = theCurrentMth;

        //$scope.totalExpenses = addCommas(totalExpenses.toFixed(0));
        var expPieChart = function() {
            var canvas = document.getElementById("expensePieChart");
            var ctx = canvas.getContext('2d');
            // Global Options:
            Chart.defaults.global.defaultFontColor = 'black';
            Chart.defaults.global.defaultFontSize = 16;
            var data = {
                labels: ["Business Expense - " + (totalBusinessExpenses / totalExpenses * 100).toFixed(0) + "%", "Personal Expense - " + (totalPersonalExpenses / totalExpenses * 100).toFixed(0) + "%", "Stock Expense - " + (totalStockExpenses / totalExpenses * 100).toFixed(0) + "%"],
                datasets: [{
                    fill: true,
                    backgroundColor: ['#ffa500', '#3366cc', '#dc3912'],
                    data: [totalBusinessExpenses, totalPersonalExpenses, totalStockExpenses],
                    // Notice the borderColor 
                    borderColor: ['#ffa500', '#3366cc', '#dc3912'],
                    borderWidth: [2, 2, 2]
                }]
            };
            // Notice the rotation from the documentation.
            var options = {
                title: {
                    display: true,
                    text: 'Types of Payments',
                    position: 'top'
                }
            };
            // Chart declaration:
            var myBarChart = new Chart(ctx, {
                type: 'pie',
                data: data,
                options: options
            });
        }
        $scope.weeklyBarCharts = function(period) {
            //alert('period');
            if (typeof period == 'undefined') {
                period = "week1";
            }
            var lowerDate;
            var upperDate;
            totalBusinessExpenses = 0;
            totalPersonalExpenses = 0;
            totalStockExpenses = 0;
            totalExpenses = 0;
            //Rewrite the algorithm for accurately calculating the repective weeks in day
            if (period === "week1") {
                lowerDate = 0;
                upperDate = 7;
            }
            if (period === "week2") {
                lowerDate = 7;
                upperDate = 14;
            }
            if (period === "week3") {
                lowerDate = 14;
                upperDate = 21;
            }
            if (period === "week4") {
                lowerDate = 21;
                upperDate = 28;
            }
            for (var i = 0; i < monthlyExpenses.length; i++) {
                var theDay = Number(((monthlyExpenses[i]['day']).split("-"))[0]);
                if (theDay > lowerDate && theDay < (upperDate + 1)) {
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
            // Section 1 Chart 1
            var chart1 = new Chartist.Bar('#chart-1', {
                // add labels
                labels: ["Business Expensewww - " + Math.round(totalBusinessExpenses / totalExpenses * 100) + "%", "Personal Expense - " + Math.round(totalPersonalExpenses / totalExpenses * 100) + "%", "Stock Expense - " + Math.round(totalStockExpenses / totalExpenses * 100) + "%"],
                // add data
                series: [
                    [totalBusinessExpenses, totalPersonalExpenses, totalStockExpenses]
                ]
            }, {
                // distance between bars
                seriesBarDistance: 10,
                // width: '100%',
                height: '300px',
                // chart padding
                chartPadding: {
                    top: 30,
                    right: 20,
                    bottom: 20,
                    left: 10
                }
            });
            // List charts
            var charts = [chart1];
            // Get length
            var numberofcharts = charts.length;
            // Loop through charts
            for (var i = 0; i < numberofcharts; i++) {
                // Animate on draw
                charts[i].on('draw', function(data) {
                    if (data.type === 'bar') {
                        data.element.animate({
                            y2: {
                                dur: 1000,
                                from: data.y1,
                                to: data.y2,
                                easing: Chartist.Svg.Easing.easeOutQuint
                            },
                            opacity: {
                                dur: 1000,
                                from: 0,
                                to: 1,
                                easing: Chartist.Svg.Easing.easeOutQuint
                            }
                        });
                    }
                });
            }
        };
        $scope.monthlyBarCharts = function() {
            // Section 2 Chart 2
            var chart2 = new Chartist.Bar('#chart-2', {
                // add labels
                labels: ["Business Expenseaaa - " + Math.round(totalBusinessExpenses / totalExpenses * 100) + "%", "Personal Expense - " + Math.round(totalPersonalExpenses / totalExpenses * 100) + "%", "Stock Expense - " + Math.round(totalStockExpenses / totalExpenses * 100) + "%"],
                // add data
                series: [
                    [totalBusinessExpenses, totalPersonalExpenses, totalStockExpenses]
                ]
            }, {
                // distance between bars
                seriesBarDistance: 10,
                // width: '100%',
                height: '300px',
                // chart padding
                chartPadding: {
                    top: 30,
                    right: 20,
                    bottom: 20,
                    left: 10
                }
            });
            // List charts
            var charts = [chart2];
            // Get length
            var numberofcharts = charts.length;
            // Loop through charts
            for (var i = 0; i < numberofcharts; i++) {
                // Animate on draw
                charts[i].on('draw', function(data) {
                    if (data.type === 'bar') {
                        data.element.animate({
                            y2: {
                                dur: 1000,
                                from: data.y1,
                                to: data.y2,
                                easing: Chartist.Svg.Easing.easeOutQuint
                            },
                            opacity: {
                                dur: 1000,
                                from: 0,
                                to: 1,
                                easing: Chartist.Svg.Easing.easeOutQuint
                            }
                        });
                    }
                });
            }
        };
        $scope.yearlyBarCharts = function() {
            // Section 2 Chart 2
            var chart3 = new Chartist.Bar('#chart-3', {
                // add labels
                labels: ["Business Expenseqqqq - " + Math.round(totalBusinessExpenses / totalExpenses * 100) + "%", "Personal Expense - " + Math.round(totalPersonalExpenses / totalExpenses * 100) + "%", "Stock Expense - " + Math.round(totalStockExpenses / totalExpenses * 100) + "%"],
                // add data
                series: [
                    [totalBusinessExpenses, totalPersonalExpenses, totalStockExpenses]
                ]
            }, {
                // distance between bars
                seriesBarDistance: 10,
                // width: '100%',
                height: '300px',
                // chart padding
                chartPadding: {
                    top: 30,
                    right: 20,
                    bottom: 20,
                    left: 10
                }
            }); // List charts
            var charts = [chart3];
            // Get length
            var numberofcharts = charts.length;
            // Loop through charts
            for (var i = 0; i < numberofcharts; i++) {
                // Animate on draw
                charts[i].on('draw', function(data) {
                    if (data.type === 'bar') {
                        data.element.animate({
                            y2: {
                                dur: 1000,
                                from: data.y1,
                                to: data.y2,
                                easing: Chartist.Svg.Easing.easeOutQuint
                            },
                            opacity: {
                                dur: 1000,
                                from: 0,
                                to: 1,
                                easing: Chartist.Svg.Easing.easeOutQuint
                            }
                        });
                    }
                });
            }
        }
        $scope.initWeeklyBarCharts = function() {
            //alert(111);
            setTimeout(function() {
                $scope.weeklyBarCharts();
                //expPieChart();
            }, 4000);
        };
        //},4000);

        //Add new items to the stock list
        function myPicDialogController($scope, $mdDialog, parent) {
            $scope.parent = parent;
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.ok = function() {
                $mdDialog.hide();
            };
        }

        $scope.attachedPic = function($event,imgUrl) {
            $mdDialog.show({
                controller: myPicDialogController,
                template:
                    // '<md-dialog md-theme="mytheme">' +
                    // '  <md-dialog-content>'+
                    //      '<div class="test"><p>TOTAL: KES {{parent.totalSaleAmount}}</p></div>'+
                    //         '<div class="md-actions" layout="row"><a class="md-primary-color dialog-action-btn ng-binding" ng-click="cancel()" tabindex="0">Close</a><a class="md-primary-color dialog-action-btn ng-binding" ng-click="ok()" tabindex="0">Confirm</a></div>'
                    //      +
                    //   '  </md-dialog-content>' +
                    //   '</md-dialog>',
                    '<md-dialog> <md-card class="form attached_pic"> <md-card-content><div class="col-100"><img src="'+imgUrl+'"/><a href="#" ng-click="ok();" data-menu="menu-confirmation" class="button button-full button-rounded uppercase ultrabold take_photo">Cancel</a></div> </md-card-content> </md-card> </md-dialog>',
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

        $scope.incomeAttachedPic = function($event,imgUrl) {
            $mdDialog.show({
                controller: myPicDialogController,
                template:
                    // '<md-dialog md-theme="mytheme">' +
                    // '  <md-dialog-content>'+
                    //      '<div class="test"><p>TOTAL: KES {{parent.totalSaleAmount}}</p></div>'+
                    //         '<div class="md-actions" layout="row"><a class="md-primary-color dialog-action-btn ng-binding" ng-click="cancel()" tabindex="0">Close</a><a class="md-primary-color dialog-action-btn ng-binding" ng-click="ok()" tabindex="0">Confirm</a></div>'
                    //      +
                    //   '  </md-dialog-content>' +
                    //   '</md-dialog>',
                    '<md-dialog> <md-card class="form attached_pic"> <md-card-content><div class="col-100"><img src="'+imgUrl+'"/><a href="#" ng-click="ok();" data-menu="menu-confirmation" class="button button-full button-rounded uppercase ultrabold take_photo">Cancel</a></div> </md-card-content> </md-card> </md-dialog>',
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


    //End Dashboard Custom Code

}); // End of dashboard controller.

// Controller of Dashboard Setting.
appControllers.controller('dashboardSettingCtrl', function ($scope, $state,$ionicHistory,$ionicViewSwitcher) {

    // navigateTo is for navigate to other page
    // by using targetPage to be the destination state.
    // Parameter :
    // stateNames = target state to go.
    // objectData = Object data will send to destination state.
    $scope.navigateTo = function (stateName,objectData) {
            if ($ionicHistory.currentStateName() != stateName) {
                $ionicHistory.nextViewOptions({
                    disableAnimate: false,
                    disableBack: true
                });

                //Next view animate will display in back direction
                $ionicViewSwitcher.nextDirection('back');

                $state.go(stateName, {
                    isAnimated: objectData,
                });
            }
    }; // End of navigateTo.
}); // End of Dashboard Setting controller.