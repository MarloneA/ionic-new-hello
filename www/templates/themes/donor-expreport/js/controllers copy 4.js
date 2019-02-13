appControllers.controller('donorExpenseReportCtrl', function(APIBASE, $mdDialog, $firebaseArray, $firebaseObject, $scope, $rootScope, $timeout, $http, $filter, $q, $interval, $state, $stateParams, $ionicHistory, $ionicScrollDelegate, $location) {
    var FBSalesref = firebase.database().ref().child('sales'+company_id);;
    var FBrefDisbursements = firebase.database().ref().child('dailyDisbursements');
    var FBrefPayments = firebase.database().ref().child('dailyPayments');
    var salesRef;
    var theSale;
    var dbSalesData = [];
    var monthlyExpenses = [];
    var FBExpensesref = firebase.database().ref().child('donorexpenses'+company_id);
    var theExpense;
    var dbExpensesData = [];
    var d = new Date();
    var currentWkNo;
    var currentMthNo = d.getMonth();
    var currentYrNo = d.getFullYear();
    var weekNumber;
    var yearData;
    var yearsList = [];
    var mthTabClicks = 0; //Count how many times you click the months tab
    var currentWkChart, currentYrChart;

    var bestPrices = [];
    var bestLabels = [];

    var theDateToday = (d.getDate() + 0) + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
    
    var budgetObjs = localStorage.getItem("compTypes");

    //console.log('budgetTypesbudgetTypesbudgetTypesbudgetTypes');
    console.log('budgetObjs');
    var budgetTypes = JSON.parse(budgetObjs);
    console.log(budgetTypes);

   //Adjust page chart height

    function resizeChart() {
        var windowW = $('md-card.chartjs md-card-content').innerWidth();
        var windowH = $('md-card.chartjs md-card-content').innerHeight();
        console.log('windowHHH: '+windowH);

        $scope.calcChartH = function(){
            //return ((295/360)*windowW)-60;
            return (windowH*0.75)-100;
        }
    }

    resizeChart();

    $(window).resize(function(){
        resizeChart();
    });

    //$timeout(function(){
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
        return str.join('.');
    }


        //sort by date
        function sortbydate(info) {
            info.sort(function(a, b){
              var aa = (Object.keys(a)[0]).split('-').reverse().join(),
                  bb = (Object.keys(b)[0]).split('-').reverse().join();
              return aa > bb ? -1 : (aa < bb ? 1 : 0);
              });
            return info;
        }


        $scope.weeksBarCharts = function(){
            $scope.tabs_weeks = true;
            $scope.tabs_months = false;
            $scope.tabs_years = false;

            $timeout(function(){
                console.log('8888');
                $location.hash('active-tab-pill-button');
                $ionicScrollDelegate.anchorScroll(true);



                //Make sure week tabs are loaded before running currentWkChart()
                var showWksTabChart = setInterval(function(){
                    var showWksTab = $('#dashboard-content md-card .md-actions.weeks a');
                    console.log("GoTabsA: "+showWksTab.length);

                    if(showWksTab.length>0){

                        console.log("GoTabs: "+showWksTab.length);
                        //currentWkChart();

                        clearInterval(showWksTabChart);
                    }
                },0);


            },0);

        }


    //The DATA Sources
    //Sign In to the App

    //Get all the month of the current year

    $scope.getTheMonth = function(monthIndex){
        var theMonthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May',
            'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec', 'Jan'
            ];

        return theMonthNames[monthIndex];
    }

    //Get all the next four years
    var noOfStatsYears = 4;

    for (var i = noOfStatsYears - 1; i >= 0; i--) {
        yearsList.push({'name':currentYrNo-i,'yrCount':i+1});
    }

    console.log('yearsList');
    console.log(yearsList);

    $scope.yearsData = yearsList;

    $scope.getTheYear = function(yearIndex){

        var theYearNames = [currentYrNo-3,currentYrNo-2,currentYrNo-1,currentYrNo];

        return theYearNames[yearIndex];
    }

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

    };

    getCurrentWkNo();

    $scope.getCurrentWk = function(weekCount){

        currentWkNo = weekNumber;

        console.log(typeof weekCount+" weekCount__ "+typeof weekNumber);

        if(weekCount>((monthsIndex-1)*4)){
            (function($){
                console.log('Testststststssttst');
                $('#dashboard-content.expense-report md-card .md-actions a').click(function(){
                    $('#dashboard-content.expense-report md-card .md-actions a').removeClass('active-tab-pill');
                    $(this).addClass('active-tab-pill');
                });
            })(jQuery)
        }

        if(weekCount == weekNumber){
            console.log(weekCount+" weekCount__ "+weekNumber);
            //$scope.activeWeek = 'active-tab-pill-button bg-green-dark';
            return 'active-tab-pill-button';


            console.log(weekCount+" weekCountttt "+weekNumber);

        } else {
            //$scope.activeWeek = 'inactive_week';
            return 'inactive_week';
            console.log(weekCount+" weekCountttt "+weekNumber);
        }
    }

    $scope.futureWk = function(weekCount){

        currentWkNo = weekNumber;

        console.log(typeof weekCount+" weekCount__ "+typeof weekNumber);

        if(weekCount > weekNumber){
            return true;
        }
    }

    $scope.activeDuration = function(weekCount,startDate,endDate,fromMonth,toMonth,clicked){



        var getTheMonth = function(monthIndex){
            var theMonthNames = [
                'Jan', 'Feb', 'Mar', 'Apr', 'May',
                'Jun', 'Jul', 'Aug', 'Sep',
                'Oct', 'Nov', 'Dec', 'Jan'
                ];

            return theMonthNames[monthIndex];
        }

        console.log('weekCount: '+weekCount);
        console.log('weekNumber: '+weekNumber);

        if(weekCount == weekNumber){

            $scope.activePeriod =  {
                                    'startDate':startDate,
                                    'endDate':endDate,
                                    'fromMonth':getTheMonth(fromMonth),
                                    'toMonth':getTheMonth(toMonth)
                                }
        }
        if(clicked === 1){

            $scope.activePeriod =  {
                                    'startDate':startDate,
                                    'endDate':endDate,
                                    'fromMonth':getTheMonth(fromMonth),
                                    'toMonth':getTheMonth(toMonth)
                                }
        }


    };

    //Initiate Fuctions for the months

    $scope.theActiveMonth = function(mthCount,fromMonth,toMonth,clicked){

        var getTheMonth = function(mthCount){
            var theMonthNames = [
                'Jan', 'Feb', 'Mar', 'Apr', 'May',
                'Jun', 'Jul', 'Aug', 'Sep',
                'Oct', 'Nov', 'Dec', 'Jan'
                ];

            return theMonthNames[mthCount];
        }

        console.log('monthCountmonthCount: '+mthCount);
        console.log('d.getMonth(): '+d.getMonth());

        if(mthCount == d.getMonth()){

            $scope.activeMthPeriod =  {
                                    'fromMonth':getTheMonth(fromMonth),
                                    'toMonth':getTheMonth(toMonth)
                                }
        }
        if(clicked === 1){

            $scope.activeMthPeriod =  {
                                    'fromMonth':getTheMonth(fromMonth),
                                    'toMonth':getTheMonth(toMonth)
                                }
        }

    };

    $scope.getCurrentMth = function(mthCount){

        currentWkNo = weekNumber;

        console.log(typeof weekCount+" weekCount__ "+typeof weekNumber);

        if(mthCount == d.getMonth()){
            console.log(mthCount+" weekCount__ "+weekNumber);
            //$scope.activeWeek = 'active-tab-pill-button bg-green-dark';
            return 'active-tab-pill-button-month';
        } else {
            //$scope.activeWeek = 'inactive_week';
            return 'inactive_week';
            console.log(mthCount+" weekCountttt "+weekNumber);
        }
    }

    $scope.futureMth = function(mthCount){
        if(mthCount > d.getMonth()){
            return true;
        }
    }

    //End of Initiate Fuctions for the months

    //Initiate Fuctions for the years

    $scope.theActiveYear = function(mthCount,fromMonth,toMonth,clicked){

        var getTheMonth = function(mthCount){
            var theMonthNames = [
                'Jan', 'Feb', 'Mar', 'Apr', 'May',
                'Jun', 'Jul', 'Aug', 'Sep',
                'Oct', 'Nov', 'Dec', 'Jan'
                ];

            return theMonthNames[mthCount];
        }

        console.log('monthCountmonthCount: '+mthCount);
        console.log('d.getMonth(): '+d.getMonth());

        if(mthCount == d.getMonth()){

            $scope.activeMthPeriod =  {
                                    'fromMonth':getTheMonth(fromMonth),
                                    'toMonth':getTheMonth(toMonth)
                                }
        }
        if(clicked === 1){

            $scope.activeMthPeriod =  {
                                    'fromMonth':getTheMonth(fromMonth),
                                    'toMonth':getTheMonth(toMonth)
                                }
        }

    };

    $scope.getCurrentYr = function(yrName){

        console.log(typeof yrName+" weekCount__ "+typeof d.getFullYear());

        if(yrName == d.getFullYear()){
            console.log(yrName+" weekCount__ "+d.getFullYear());
            //$scope.activeWeek = 'active-tab-pill-button bg-green-dark';
            return 'active-tab-pill-button-year';
        } else {
            //$scope.activeWeek = 'inactive_week';
            return 'inactive_week';
            console.log(yrName+" weekCountttt "+d.getFullYear());
        }
    }

    //End of Initiate Fuctions for the years


    var monthsIndex = 13;
    var allYearWeeks = [];
    var halfWeeks = 0;
    var weekCount = 0;
    var alterStart,alterEnd,alterMonth;

    for (var i = 0; i < monthsIndex; i++) {
        console.log(getWeeksInMonth(i,d.getFullYear()));
    }

    console.warn(allYearWeeks);
    $scope.allWeeks = allYearWeeks;

    $scope.yearData = [{'name':'Jan','mthCount':0,},{'name':'Feb','mthCount':1,},{'name':'Mar','mthCount':2,},{'name':'Apr','mthCount':3,},{'name':'May','mthCount':4,},{'name':'Jun','mthCount':5,},{'name':'Jul','mthCount':6,},{'name':'Aug','mthCount':7,},{'name':'Sep','mthCount':8,},{'name':'Oct','mthCount':9,},{'name':'Nov','mthCount':10,},{'name':'Dec','mthCount':11,}];
    yearData = $scope.yearData;

    $scope.getExpenseKey = function(object) {
        return Object.keys(object)[0];
    };
    var dayTotalExpenses = 0;
    var dailyExpenses; // = $firebaseArray(FBExpensesref);
    FBExpensesref.orderByKey().on("value", function(snapshot) {
        monthlyExpenses = [];
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
        //monthlyExpenses = dailyExpenses;
        //{
        var totalExpenses = 0;

        bestPrices = [];
        bestLabels = [];                
        var compiledSales = [];

        for (var i = 0; i < monthlyExpenses.length; i++) {
            totalExpenses = totalExpenses + monthlyExpenses[i]['amount'];
            compiledSales.push(monthlyExpenses[i]);
        }
        $scope.totalExpenses = addCommas(totalExpenses.toFixed(0));

        //Automatically display chart of the current week

        currentWkChart = function(){
            var weekData = allYearWeeks[currentWkNo-1];
            var startDate = weekData.start.date;
            var endDate = weekData.end.date;
            var fromMonth = weekData.start.month;
            var toMonth = weekData.end.month;        

            bestPrices = [];
            bestLabels = [];                
            var compiledSales = [];

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
                            compiledSales.push(monthlyExpenses[i]);
                        }
                    }else{
                        if(theMonth === fromMonth){
                            if (theDay > (startDate - 1)) {
                                console.log('formulae1: '+theDay);
                                totalExpenses = totalExpenses + monthlyExpenses[i]['amount'];
                                compiledSales.push(monthlyExpenses[i]);
                            }
                        }
                        if(theMonth === toMonth){
                            if (theDay < (endDate + 1)) {
                                console.log('formulae2: '+theDay);
                                totalExpenses = totalExpenses + monthlyExpenses[i]['amount'];
                                compiledSales.push(monthlyExpenses[i]);
                            }
                        }
                    }


                }

                //Merge all similar Expense Types
                var arr = compiledSales;

                var result = [];
                arr.forEach(function(a) {
                    var theItem_Title = a.expType;
                    var maxWordCount = 20;
                    var excerpt = function() {
                        if (theItem_Title.length > maxWordCount) {
                            return theItem_Title.substr(0, maxWordCount) + '.';
                        }
                        return theItem_Title;
                    };

                    if (!this[a.desc]) {
                        this[a.desc] = {
                            desc: a.desc,
                            expType: excerpt(),
                            amount: 0
                        };
                        result.push(this[a.desc]);
                    }
                    this[a.desc].amount += a.amount;
                }, Object.create(null));
                console.log(result);


                for (var i = 0; i < result.length; i++) {
                    bestLabels.push(result[i]['expType']);
                }
                
                for (var i = 0; i < result.length; i++) {
                    bestPrices.push(result[i]['amount']);
                }

                var uniqueLabels = bestLabels.filter(function(item, pos) {
                    return bestLabels.indexOf(item) == pos;
                })

                var uniquePrices = bestPrices.filter(function(item, pos) {
                    return bestPrices.indexOf(item) == pos;
                })
                //End of Merge all similar Expense Types

                new Chart('myChart', {
                      type: 'bar',
                      data: {
                          //labels: ["Busi", "Pers(" + totalPersonalExpPercent + "%)", "Stock(" + totalStockExpPercent + "%)"],
                          labels: uniqueLabels,//["AntenatalCare","PostNatalCare","SelfDelivery","GenderBasedViolence","RapeCases","FamilyPlanning","PrenatalCare"],
                          //labels: ["B (" + totalBusinessExpPercent + "%)", "P (" + totalPersonalExpPercent + "%)", "S (" + totalStockExpPercent + "%)"],
                          datasets: [{
                              label: 'WeeklyInit',
                              //data: [12, 19, 3, 5, 2, 3, 9],

                              data: uniquePrices,//[totalAntenatalCareExpenses, totalPostNatalCareExpenses, totalSelfDeliveryExpenses, totalGenderBasedViolenceExpenses, totalRapeCasesExpenses, totalFamilyPlanningExpenses, totalPrenatalCareExpenses],
                              backgroundColor: [
                                  '#f54525',
                                  '#2980b9',
                                  '#66bbbb',
                                  '#aa6643',
                                  '#444466',
                                  '#fd9c00',
                                  '#497cc8'
                              ],
                              borderColor: [
                                  '#f54525',
                                  '#2980b9',
                                  '#66bbbb',
                                  '#aa6643',
                                  '#444466',
                                  '#fd9c00',
                                  '#497cc8'
                              ],
                              borderWidth: 1
                          }]
                      },
                      options: {
                          scales: {
                              yAxes: [{
                                  ticks: {
                                      beginAtZero:true,
                                      fontSize: 10
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
                                        fontSize: 9,
                                        //maxRotation: 90,
                                        minRotation: 70
                                    }
                              }]
                          },
                          maintainAspectRatio: false,
                            legend: {
                                display: false,
                            }
                      }
                });

            };

            $timeout(function(){
                currentWeekBarCharts(startDate,endDate,fromMonth,toMonth);

                (function($){

                    var weekTabW = $(".tabs_weeks a.active-tab-pill-button").outerWidth();

                        // $('.charts #tab-pill-week .tab-pill-titles').animate({
                        //     scrollLeft: ($(".charts #tab-pill-week .tab-pill-titles a.active-tab-pill-button").offset().left)-($(window).width()/2)+(weekTabW/2)
                        //  }, 2000);


                    var activeWeekOffset = ($(".tabs_weeks a.active-tab-pill-button").offset().left)-($(window).width()/2)+(weekTabW/2);

                    console.log('activeWeekOffsetactiveWeekOffset: '+activeWeekOffset);


                    $timeout(function(){
                        $location.hash('active-tab-pill-button');
                        $ionicScrollDelegate.anchorScroll(true);

                        //$ionicScrollDelegate.$getByHandle('active-tab-pill-button').resize();

                        // $('.tabs_weeks .scroll').animate({  textIndent: 0 }, {
                        //     step: function(ev,fx) {
                        //         //$(this).css('transform','translate3d('+activeWeekOffset+'px, 0px, 0px) scale(1)'); 
                        //         $(this).css('transform','translate3d('+(-(activeWeekOffset))+'px, 0px, 0px) scale(1)'); 
                        //     },
                        //     duration:5000
                        // },'linear');

                    },1000);


                })(jQuery)

            },3000);

        }

        //Make sure week tabs are loaded before running currentWkChart()
        var showWksTabChart = setInterval(function(){
            var showWksTab = $('#dashboard-content md-card .md-actions.weeks a');
            console.log("GoTabsA: "+showWksTab.length);

            if(showWksTab.length>0){

                console.log("GoTabs: "+showWksTab.length);
                currentWkChart();

                clearInterval(showWksTabChart);
            }
        },1000);

        $scope.weeklyBarCharts = function(startDate,endDate,fromMonth,toMonth) {
            //alert(555)
            bestPrices = [];
            bestLabels = [];                
            var compiledSales = [];

            console.log(startDate+' : '+endDate+' : '+fromMonth+' : '+toMonth)

            ////alert('official period');
            console.log('official chart_weekly');

            for (var i = 0; i < monthsIndex.length; i++) {
                monthsIndex[i]
            }

            for (var i = 0; i < monthlyExpenses.length; i++) {

                var theDay = Number(((monthlyExpenses[i]['day']).split("-"))[0]);
                var theMonth = Number(((monthlyExpenses[i]['day']).split("-"))[1])-1;
                var theYear = Number(((monthlyExpenses[i]['day']).split("-"))[2]);

                console.log('theDay'+' : '+'startDate'+' : '+'endDate'+' : '+'fromMonth'+' : '+'toMonth');
                console.log(theDay+' : '+startDate+' : '+endDate+' : '+fromMonth+' : '+toMonth);
                if((theMonth==fromMonth)&&(theMonth==toMonth)){
                    if (theDay > (startDate - 1) && theDay < (endDate + 1)) {
                        console.log(theDay);
                        totalExpenses = totalExpenses + monthlyExpenses[i]['amount'];

                        compiledSales.push(monthlyExpenses[i]);
                    }
                }else{
                    if(theMonth === fromMonth){
                        if (theDay > (startDate - 1)) {
                            console.log(theDay);
                            totalExpenses = totalExpenses + monthlyExpenses[i]['amount'];

                            compiledSales.push(monthlyExpenses[i]);

                        }
                    }
                    if(theMonth === toMonth){
                        if (theDay < (endDate + 1)) {
                            console.log(theDay);
                            totalExpenses = totalExpenses + monthlyExpenses[i]['amount'];

                            compiledSales.push(monthlyExpenses[i]);

                        }
                    }
                }
            }

            console.log('compiledSales');
            console.log(compiledSales);

            //Merge all similar Expense Types
            var arr = compiledSales;

            var result = [];
            arr.forEach(function(a) {
                var theItem_Title = a.expType;
                var maxWordCount = 20;
                var excerpt = function() {
                    if (theItem_Title.length > maxWordCount) {
                        return theItem_Title.substr(0, maxWordCount) + '.';
                    }
                    return theItem_Title;
                };

                if (!this[a.desc]) {
                    this[a.desc] = {
                        desc: a.desc,
                        expType: excerpt(),
                        amount: 0
                    };
                    result.push(this[a.desc]);
                }
                this[a.desc].amount += a.amount;
            }, Object.create(null));
            console.log(result);


            for (var i = 0; i < result.length; i++) {
                bestLabels.push(result[i]['expType']);
            }
            
            for (var i = 0; i < result.length; i++) {
                bestPrices.push(result[i]['amount']);
            }

            var uniqueLabels = bestLabels.filter(function(item, pos) {
                return bestLabels.indexOf(item) == pos;
            })

            var uniquePrices = bestPrices.filter(function(item, pos) {
                return bestPrices.indexOf(item) == pos;
            })
            //End of Merge all similar Expense Types

            console.log(bestLabels);
            console.log(bestPrices);

            function randomize() {
                Chart.helpers.each(Chart.instances, function(chart) {
                    console.log('chartchartchartchart');
                    console.log(chart.data.datasets[0].label);

                    var theChartLabel = chart.data.datasets[0].label;

                    chart.data.datasets.forEach(function(dataset) {
                        if(theChartLabel === 'WeeklyInit'){
                            console.log(dataset);
                            chart.config.data.labels = uniqueLabels;//["AntenatalCare","PostNatalCare","SelfDelivery","GenderBasedViolence","RapeCases","FamilyPlanning","PrenatalCare"];
                            dataset.data = uniquePrices;//[totalAntenatalCareExpenses, totalPostNatalCareExpenses, totalSelfDeliveryExpenses, totalGenderBasedViolenceExpenses, totalRapeCasesExpenses, totalFamilyPlanningExpenses, totalPrenatalCareExpenses];
                            //dataset.labels = ["Business(" + totalBusinessExpPercent + "%)", "Personal(" + totalPersonalExpPercent + "%)", "Stock(" + totalStockExpPercent + "%)"];
        
                            //dataset.data = [108.68,60.17,71.09,-34.25,-8.93,-57.89,50.97,9.01];
                        }

                    });

                    chart.update();
                });
            }
            randomize();

            /*
                // Section 1 Chart 1
                var chart1 = new Chartist.Bar('#chart-1', {
                    // add labels
                    labels: ["Business Expense - " + totalBusinessExpPercent + "%", "Personal Expense - " + totalPersonalExpPercent + "%", "Stock Expense - " + totalStockExpPercent + "%"],
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
            */

            //Auto scroll to the center

            (function($){
                setTimeout(function(){
                    // var weekTabW = $(".charts #tab-pill-week .tab-pill-titles a.active-tab-pill-button").outerWidth();

                    // $('.charts #tab-pill-week .tab-pill-titles').animate({
                    //     scrollLeft: ($(".charts #tab-pill-week .tab-pill-titles a.active-tab-pill-button").offset().left)-($(window).width()/2)+(weekTabW/2)
                    //  }, 2000);
                },2000);
            })(jQuery)

        };

        $scope.theMonthlyBarCharts = function(fromMonth,toMonth) {
            //alert(777);

            bestPrices = [];
            bestLabels = [];                
            var compiledSales = [];

            console.log(fromMonth+' : '+toMonth)


            $('#dashboard-content.expense-report md-card .md-actions a').click(function(){
                $('#dashboard-content.expense-report md-card .md-actions a').removeClass('active-tab-pill');
                $(this).addClass('active-tab-pill');
            });

            ////alert('official period');
            console.log('official chart');


            for (var i = 0; i < monthsIndex.length; i++) {
                monthsIndex[i]
            }

            for (var i = 0; i < monthlyExpenses.length; i++) {
                var theDay = Number(((monthlyExpenses[i]['day']).split("-"))[0]);
                var theMonth = Number(((monthlyExpenses[i]['day']).split("-"))[1])-1;

                if (theMonth > (fromMonth - 1) && theMonth < (toMonth + 1)) {
                    console.log(theDay);
                    totalExpenses = totalExpenses + monthlyExpenses[i]['amount'];
                    compiledSales.push(monthlyExpenses[i]);
                }
            }


            //Merge all similar Expense Types
            var arr = compiledSales;

            var result = [];
            arr.forEach(function(a) {
                var theItem_Title = a.expType;
                var maxWordCount = 20;
                var excerpt = function() {
                    if (theItem_Title.length > maxWordCount) {
                        return theItem_Title.substr(0, maxWordCount) + '.';
                    }
                    return theItem_Title;
                };

                if (!this[a.desc]) {
                    this[a.desc] = {
                        desc: a.desc,
                        expType: excerpt(),
                        amount: 0
                    };
                    result.push(this[a.desc]);
                }
                this[a.desc].amount += a.amount;
            }, Object.create(null));
            console.log(result);

            
            for (var i = 0; i < result.length; i++) {
                bestLabels.push(result[i]['expType']);
            }
            
            for (var i = 0; i < result.length; i++) {
                bestPrices.push(result[i]['amount']);
            }

            var uniqueLabels = bestLabels.filter(function(item, pos) {
                return bestLabels.indexOf(item) == pos;
            })

            var uniquePrices = bestPrices.filter(function(item, pos) {
                return bestPrices.indexOf(item) == pos;
            })
            //End of Merge all similar Expense Types


            function randomizeMonthly() {
                Chart.helpers.each(Chart.instances, function(chart) {
                    console.log('chartchartchartchart');
                    console.log(chart.data.datasets[0].label);

                    var theChartLabel = chart.data.datasets[0].label;

                    chart.data.datasets.forEach(function(dataset) {
                        if(theChartLabel === 'WeeklyInit'){
                            console.log(dataset);
                            chart.config.data.labels = uniqueLabels;//["AntenatalCare","PostNatalCare","SelfDelivery","GenderBasedViolence","RapeCases","FamilyPlanning","PrenatalCare"];
                            dataset.data = uniquePrices;//[totalAntenatalCareExpenses, totalPostNatalCareExpenses, totalSelfDeliveryExpenses, totalGenderBasedViolenceExpenses, totalRapeCasesExpenses, totalFamilyPlanningExpenses, totalPrenatalCareExpenses];
                            //dataset.labels = ["Business(" + totalBusinessExpPercent + "%)", "Personal(" + totalPersonalExpPercent + "%)", "Stock(" + totalStockExpPercent + "%)"];
                            //dataset.data = [108.68,60.17,71.09,-34.25,-8.93,-57.89,50.97,9.01];
                        }

                    });

                    chart.update();
                });
            }
            randomizeMonthly();

            //Auto scroll to the center

            (function($){
                setTimeout(function(){
                    // var weekTabW = $(".charts #tab-pill-week .tab-pill-titles a.active-tab-pill-button").outerWidth();

                    // $('.charts #tab-pill-week .tab-pill-titles').animate({
                    //     scrollLeft: ($(".charts #tab-pill-week .tab-pill-titles a.active-tab-pill-button").offset().left)-($(window).width()/2)+(weekTabW/2)
                    //  }, 2000);
                },2000);
            })(jQuery)

        };

        $scope.monthlyBarCharts = function() {
            // Section 2 Chart 2
            //Automatically display chart of the current month

            $scope.tabs_weeks = false;
            $scope.tabs_months = true;
            $scope.tabs_years = false;

            mthTabClicks++;

            console.error('mthTabClicks: '+mthTabClicks);

            var currentMthChart = function(){
                var mthData = yearData[currentMthNo];
                var fromMonth = mthData.mthCount;
                var toMonth = mthData.mthCount; 

                bestPrices = [];
                bestLabels = [];                
                var compiledSales = [];

                var currentMonthBarCharts = function(fromMonth,toMonth) {

                    console.log(fromMonth+' : '+toMonth)

                    ////alert('official period');
                    console.log('official chart');

                    for (var i = 0; i < monthsIndex.length; i++) {
                        monthsIndex[i]
                    }

                    for (var i = 0; i < monthlyExpenses.length; i++) {
                        var theDay = Number(((monthlyExpenses[i]['day']).split("-"))[0]);
                        var theMonth = Number(((monthlyExpenses[i]['day']).split("-"))[1])-1;

                        if (theMonth > (fromMonth - 1) && theMonth < (toMonth + 1)) {
                            console.log(theDay);
                            totalExpenses = totalExpenses + monthlyExpenses[i]['amount'];
                            compiledSales.push(monthlyExpenses[i]);
                        }
                    }


                    //Merge all similar Expense Types
                    var arr = compiledSales;

                    var result = [];
                    arr.forEach(function(a) {
                        var theItem_Title = a.expType;
                        var maxWordCount = 20;
                        var excerpt = function() {
                            if (theItem_Title.length > maxWordCount) {
                                return theItem_Title.substr(0, maxWordCount) + '.';
                            }
                            return theItem_Title;
                        };

                        if (!this[a.desc]) {
                            this[a.desc] = {
                                desc: a.desc,
                                expType: excerpt(),
                                amount: 0
                            };
                            result.push(this[a.desc]);
                        }
                        this[a.desc].amount += a.amount;
                    }, Object.create(null));
                    console.log(result);

                    
                    for (var i = 0; i < result.length; i++) {
                        bestLabels.push(result[i]['expType']);
                    }
                    
                    for (var i = 0; i < result.length; i++) {
                        bestPrices.push(result[i]['amount']);
                    }

                    var uniqueLabels = bestLabels.filter(function(item, pos) {
                        return bestLabels.indexOf(item) == pos;
                    })

                    var uniquePrices = bestPrices.filter(function(item, pos) {
                        return bestPrices.indexOf(item) == pos;
                    })
                    //End of Merge all similar Expense Types


                    function randomizeMonthly() {
                        Chart.helpers.each(Chart.instances, function(chart) {
                            console.log('chartchartchartchart');
                            console.log(chart.data.datasets[0].label);

                            var theChartLabel = chart.data.datasets[0].label;

                      
                            

                            chart.data.datasets.forEach(function(dataset) {
                                if(theChartLabel === 'WeeklyInit'){
                                    console.log(dataset);
                                    chart.config.data.labels = uniqueLabels;//["AntenatalCare","PostNatalCare","SelfDelivery","GenderBasedViolence","RapeCases","FamilyPlanning","PrenatalCare"];
                                    dataset.data = uniquePrices;//[totalAntenatalCareExpenses, totalPostNatalCareExpenses, totalSelfDeliveryExpenses, totalGenderBasedViolenceExpenses, totalRapeCasesExpenses, totalFamilyPlanningExpenses, totalPrenatalCareExpenses];
                                    //dataset.labels = ["Business(" + totalBusinessExpPercent + "%)", "Personal(" + totalPersonalExpPercent + "%)", "Stock(" + totalStockExpPercent + "%)"];
                
                                    //dataset.data = [108.68,60.17,71.09,-34.25,-8.93,-57.89,50.97,9.01];
                                }

                            });

                            chart.update();
                        });
                    }
                    randomizeMonthly();

                    //Auto scroll to the center

                    (function($){
                        setTimeout(function(){
                            // var weekTabW = $(".charts #tab-pill-week .tab-pill-titles a.active-tab-pill-button").outerWidth();

                            // $('.charts #tab-pill-week .tab-pill-titles').animate({
                            //     scrollLeft: ($(".charts #tab-pill-week .tab-pill-titles a.active-tab-pill-button").offset().left)-($(window).width()/2)+(weekTabW/2)
                            //  }, 2000);
                        },2000);
                    })(jQuery)

                };

                $timeout(function(){
                    currentMonthBarCharts(fromMonth,toMonth);

                    (function($){
                        if(mthTabClicks<2){
                            var monthTabW = $(".charts #tab-pill-month .tab-pill-titles a.active-tab-pill-button").outerWidth();

                            /*
                                $('.charts #tab-pill-month .tab-pill-titles').animate({
                                    scrollLeft: ($(".charts #tab-pill-month .tab-pill-titles a.active-tab-pill-button").offset().left)-($(window).width()/2)+(monthTabW/2)
                                 }, 1000);
                             */
                        
                            var activeWeekOffset = ($(".tabs_weeks a.active-tab-pill-button").offset().left)-($(window).width()/2)+(monthTabW/2);

                            console.log('activeWeekOffsetactiveWeekOffset: '+activeWeekOffset);


                            $('.tabs_weeks .scroll').animate({  textIndent: 0 }, {
                                step: function(activeWeekOffset,fx) {
                                  $(this).css('-webkit-transform','translate3d('+activeWeekOffset+'px, 0px, 0px) scale(1)'); 
                                },
                                duration:'slow'
                            },'ease-in-out');
                        }
                    })(jQuery)

                },3000);

            }

            currentMthChart();


            $timeout(function(){
                console.log('8888');
                $location.hash('active-tab-pill-button-month');
                $ionicScrollDelegate.anchorScroll(true);
            },1000);

        };

        //Draw yearly bar charts

        $scope.theYearlyBarCharts = function(fromYear,toYear) {

            $('#dashboard-content.expense-report md-card .md-actions a').click(function(){
                $('#dashboard-content.expense-report md-card .md-actions a').removeClass('active-tab-pill');
                $(this).addClass('active-tab-pill');
            });

            console.log(fromYear+' : '+toYear)

            ////alert('official period');
            console.log('official chart toYear');
                           
            bestPrices = [];
            bestLabels = [];                
            var compiledSales = [];

            for (var i = 0; i < monthlyExpenses.length; i++) {
                var theDay = Number(((monthlyExpenses[i]['day']).split("-"))[0]);
                var theMonth = Number(((monthlyExpenses[i]['day']).split("-"))[1])-1;
                var theYear = Number(((monthlyExpenses[i]['day']).split("-"))[2]);

                console.warn(theYear);

                if (theYear > (fromYear - 1) && theYear < (toYear + 1)) {
                    console.log(theDay);
                    totalExpenses = totalExpenses + monthlyExpenses[i]['amount'];
                    compiledSales.push(monthlyExpenses[i]);
                }
            }

            //Auto scroll to the center

            //Merge all similar Expense Types
            var arr = compiledSales;

            var result = [];
            arr.forEach(function(a) {
                var theItem_Title = a.expType;
                var maxWordCount = 20;
                var excerpt = function() {
                    if (theItem_Title.length > maxWordCount) {
                        return theItem_Title.substr(0, maxWordCount) + '.';
                    }
                    return theItem_Title;
                };

                if (!this[a.desc]) {
                    this[a.desc] = {
                        desc: a.desc,
                        expType: excerpt(),
                        amount: 0
                    };
                    result.push(this[a.desc]);
                }
                this[a.desc].amount += a.amount;
            }, Object.create(null));
            console.log(result);

            
            for (var i = 0; i < result.length; i++) {
                bestLabels.push(result[i]['expType']);
            }
            
            for (var i = 0; i < result.length; i++) {
                bestPrices.push(result[i]['amount']);
            }

            var uniqueLabels = bestLabels.filter(function(item, pos) {
                return bestLabels.indexOf(item) == pos;
            })

            var uniquePrices = bestPrices.filter(function(item, pos) {
                return bestPrices.indexOf(item) == pos;
            })

            //End of Merge all similar Expense Types

            function randomizeYearly() {

                //alert(111);

                Chart.helpers.each(Chart.instances, function(chart) {
                    console.log('chartchartchartchart');
                    console.log(chart.data.datasets[0].label);

                    var theChartLabel = chart.data.datasets[0].label;

                    chart.data.datasets.forEach(function(dataset) {
                        if(theChartLabel === 'WeeklyInit'){
                            console.log(dataset);
                            chart.config.data.labels = uniqueLabels;//["AntenatalCare","PostNatalCare","SelfDelivery","GenderBasedViolence","RapeCases","FamilyPlanning","PrenatalCare"];
                            dataset.data = uniquePrices;//[totalAntenatalCareExpenses, totalPostNatalCareExpenses, totalSelfDeliveryExpenses, totalGenderBasedViolenceExpenses, totalRapeCasesExpenses, totalFamilyPlanningExpenses, totalPrenatalCareExpenses];
                            //dataset.labels = ["Business(" + totalBusinessExpPercent + "%)", "Personal(" + totalPersonalExpPercent + "%)", "Stock(" + totalStockExpPercent + "%)"];
        
                            //dataset.data = [108.68,60.17,71.09,-34.25,-8.93,-57.89,50.97,9.01];
                        }

                    });

                    chart.update();
                });
            }
            randomizeYearly();

            (function($){
                setTimeout(function(){
                    // var weekTabW = $(".charts #tab-pill-week .tab-pill-titles a.active-tab-pill-button").outerWidth();

                    // $('.charts #tab-pill-week .tab-pill-titles').animate({
                    //     scrollLeft: ($(".charts #tab-pill-week .tab-pill-titles a.active-tab-pill-button").offset().left)-($(window).width()/2)+(weekTabW/2)
                    //  }, 2000);
                },2000);
            })(jQuery)

        };

        $scope.yearlyBarCharts = function() {


            $scope.tabs_weeks = false;
            $scope.tabs_months = false;
            $scope.tabs_years = true;

            // Section 2 Chart 2
            //Automatically display chart of the current month
            currentYrChart = function(){
                //var yrData = yearData[currentMthNo];
                var fromYear = currentYrNo;
                var toYear = currentYrNo;    

                bestPrices = [];
                bestLabels = [];                
                var compiledSales = [];

                var currentYearBarCharts = function(fromYear,toYear) {

                    console.log(fromYear+' : '+toYear)

                    ////alert('official period');
                    console.log('official chart toYear');

                    for (var i = 0; i < monthlyExpenses.length; i++) {
                        var theDay = Number(((monthlyExpenses[i]['day']).split("-"))[0]);
                        var theMonth = Number(((monthlyExpenses[i]['day']).split("-"))[1])-1;
                        var theYear = Number(((monthlyExpenses[i]['day']).split("-"))[2]);

                        console.warn(theYear);

                        if (theYear > (fromYear - 1) && theYear < (toYear + 1)) {
                            console.log(theDay);
                            totalExpenses = totalExpenses + monthlyExpenses[i]['amount'];
                            compiledSales.push(monthlyExpenses[i]);
                        }
                    }

                    //Auto scroll to the center
                    //Merge all similar Expense Types
                    var arr = compiledSales;

                    var result = [];
                    arr.forEach(function(a) {
                        var theItem_Title = a.expType;
                        var maxWordCount = 20;
                        var excerpt = function() {
                            if (theItem_Title.length > maxWordCount) {
                                return theItem_Title.substr(0, maxWordCount) + '.';
                            }
                            return theItem_Title;
                        };

                        if (!this[a.desc]) {
                            this[a.desc] = {
                                desc: a.desc,
                                expType: excerpt(),
                                amount: 0
                            };
                            result.push(this[a.desc]);
                        }
                        this[a.desc].amount += a.amount;
                    }, Object.create(null));
                    console.log(result);

                    
                    for (var i = 0; i < result.length; i++) {
                        bestLabels.push(result[i]['expType']);
                    }
                    
                    for (var i = 0; i < result.length; i++) {
                        bestPrices.push(result[i]['amount']);
                    }

                    var uniqueLabels = bestLabels.filter(function(item, pos) {
                        return bestLabels.indexOf(item) == pos;
                    })

                    var uniquePrices = bestPrices.filter(function(item, pos) {
                        return bestPrices.indexOf(item) == pos;
                    })

                    //End of Merge all similar Expense Types

                    function randomizeYearly() {
                        Chart.helpers.each(Chart.instances, function(chart) {
                            console.log('chartchartchartchart');
                            console.log(chart.data.datasets[0].label);

                            var theChartLabel = chart.data.datasets[0].label;

                            chart.data.datasets.forEach(function(dataset) {
                                if(theChartLabel === 'WeeklyInit'){
                                    console.log(dataset);
                                    chart.config.data.labels = uniqueLabels;//["AntenatalCare","PostNatalCare","SelfDelivery","GenderBasedViolence","RapeCases","FamilyPlanning","PrenatalCare"];
                                    dataset.data = uniquePrices;//[totalAntenatalCareExpenses, totalPostNatalCareExpenses, totalSelfDeliveryExpenses, totalGenderBasedViolenceExpenses, totalRapeCasesExpenses, totalFamilyPlanningExpenses, totalPrenatalCareExpenses];
                                    //dataset.labels = ["Business(" + totalBusinessExpPercent + "%)", "Personal(" + totalPersonalExpPercent + "%)", "Stock(" + totalStockExpPercent + "%)"];
                
                                    //dataset.data = [108.68,60.17,71.09,-34.25,-8.93,-57.89,50.97,9.01];
                                }

                            });

                            chart.update();
                        });
                    }
                    randomizeYearly();

                    (function($){
                        setTimeout(function(){
                            // var weekTabW = $(".charts #tab-pill-week .tab-pill-titles a.active-tab-pill-button").outerWidth();

                            // $('.charts #tab-pill-week .tab-pill-titles').animate({
                            //     scrollLeft: ($(".charts #tab-pill-week .tab-pill-titles a.active-tab-pill-button").offset().left)-($(window).width()/2)+(weekTabW/2)
                            //  }, 2000);
                        },2000);
                    })(jQuery)

                };

                $timeout(function(){
                    currentYearBarCharts(fromYear,toYear);

                },3000);

            }

            currentYrChart();

            $timeout(function(){
                console.log('8888');
                $location.hash('active-tab-pill-button-year');
                $ionicScrollDelegate.anchorScroll(true);
            },1000);
        };

        //}
        $interval(function() {
            //console.log('dayTotalExpenses: ' + dayTotalExpenses);
            $scope.theMonthlyExpenses = sortbydate(dailyExpenses);
            $rootScope.dailyTotalExpenses = dayTotalExpenses;
        }, 1000);

        // $(document).ready(function() {
        //     'use strict'
        //     //(function($){
        //     //Toggle Box
        //     setTimeout(function() {
        //         $('[data-toggle-box]').on('click', function() {
        //             $(this).parent().toggleClass("active");
        //             var toggle_box = $(this).data('toggle-box');
        //             if ($('#' + toggle_box).is(":visible")) {
        //                 $('#' + toggle_box).slideUp(250);
        //             } else {
        //                 $("[id^='box']").slideUp(250);
        //                 $('#' + toggle_box).slideDown(250);
        //             }
        //         });
        //     }, 3000);
        //     //})(jQuery);
        // });

        (function($){
            //Make sure week tabs are loaded before running currentWkChart()
            var showWksTabChart = setInterval(function(){
                var showWksTab = $('#dashboard-content.the-revenue-expense md-card');
                console.log("GoTabsRecentAAAA: "+showWksTab.length);

                if(showWksTab.length>0){

                    console.log("GoTabsRecent: "+showWksTab.length);

                    setTimeout(function() {
                        var exeCount = 0;

                        $('.the-revenue-expense [data-toggle-box]').unbind('click');

                        $('.the-revenue-expense [data-toggle-box]').on('click', function() {
                            
                            $(this).parent().toggleClass("active");
                            var toggle_box = $(this).data('toggle-box');
                            
                            console.error('toggleclicked: '+toggle_box+' : '+'exeCount: '+exeCount);
                            if(exeCount<1){
                                if ($('.the-revenue-expense #' + toggle_box).is(":visible")) {
                                    $('.the-revenue-expense #' + toggle_box).slideUp(250);
                                    console.log('isvisible');
                                } else {
                                    $(".the-revenue-expense [id^='box']").slideUp(250);
                                    $('.the-revenue-expense #' + toggle_box).slideDown(250);
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

    })
    //}
    $scope.initWeeklyBarCharts = function() {
        ////alert(222)
        setTimeout(function() {
            console.log('monthlyExpenses');
            console.log(monthlyExpenses);
            console.log(JSON.stringify(monthlyExpenses));
            $scope.weeklyBarCharts();
            //expPieChart();
        }, 15000);
    };
    //End of Manage expense records
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

    var errorArrays = [];

    setInterval(function(){
        window.onerror = function(error) {
            console.log('detect____error');
            console.log(error);
            errorArrays.push(error);
            $scope.errorArrays = errorArrays;
        };
    },1);

});


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
