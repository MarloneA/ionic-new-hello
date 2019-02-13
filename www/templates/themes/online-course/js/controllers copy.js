appControllers.controller('incomeReportCtrl', function(APIBASE, $firebaseArray, $firebaseObject, $scope, $rootScope, $timeout, $http, $filter, $q, $interval, $state, $stateParams, $ionicHistory, $ionicScrollDelegate, $location) {

    var FBSalesref = firebase.database().ref().child('income'+company_id);
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

    var bestOne, bestTwo, bestThree;
    var bestOne, bestTwo, bestThree;
    var bestPrices = [];
    var bestLabels = [];


    var bestPriceOne = 0;//result[0]['itemSellPrice']
    //var bestPriceTwo = 0;//result[1]['itemSellPrice']

    //$timeout(function(){
    // Add comma to output
    //-------------------------------------------------------------------//

    var salesRef;
    var theSale;
    var dbSalesData = [];
    var monthlyExpenses = [];
    var FBExpensesref = firebase.database().ref().child('expenses'+company_id);
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
    var currentWkChart, currentMthChart, currentYrChart;

    var theDateToday = (d.getDate() + 0) + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();

   //Adjust page chart height

    function resizeChart() {
        var windowW = $('md-card.chartjs md-card-content').innerWidth();
        var windowH = $('md-card.chartjs md-card-content').innerHeight();
        console.log('windowH: '+windowH);

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
            $location.hash('inc-active-tab-pill-button');
            $ionicScrollDelegate.anchorScroll(true);



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
            //$scope.activeWeek = 'active-tab-pill-button';
            return 'active-tab-pill-button';
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

        //alert(111)
        //$scope.weeklyBarCharts = function(startDate,endDate,fromMonth,toMonth) {

            
                        // if (theDay > (startDate - 1) && theDay < (endDate + 1) && theMonth > (fromMonth - 1) && theMonth < (toMonth + 1)) {
                            // console.log(theDay);
                            // totalExpenses = totalExpenses + monthlyExpenses[i]['amount'];
                            // if (monthlyExpenses[i]['expType'] === 'Business Expense') {
                            //  totalBusinessExpenses = totalBusinessExpenses + monthlyExpenses[i]['amount'];
                            // }
                            // if (monthlyExpenses[i]['expType'] === 'Personal Expense') {
                            //  totalPersonalExpenses = totalPersonalExpenses + monthlyExpenses[i]['amount'];
                            // }
                            // if (monthlyExpenses[i]['expType'] === 'COGS') {
                            //  totalStockExpenses = totalStockExpenses + monthlyExpenses[i]['amount'];
                            // }
                        // }



            //}

            //compileTopSales();

        //};






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

        (function($){
            console.log('mthCount_Testststststssttst');
            $('#dashboard-content.expense-report md-card .md-actions a').click(function(){
                $('#dashboard-content.expense-report md-card .md-actions a').removeClass('active-tab-pill');
                $(this).addClass('active-tab-pill');
            });
        })(jQuery)

        currentWkNo = weekNumber;

        console.log(typeof weekCount+" weekCount__ "+typeof weekNumber);

        if(mthCount == d.getMonth()){
            console.log(mthCount+" weekCount__ "+weekNumber);
            //$scope.activeWeek = 'active-tab-pill-button';
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

        (function($){
            console.log('mthCount_Testststststssttst');
            $('#dashboard-content.expense-report md-card .md-actions a').click(function(){
                $('#dashboard-content.expense-report md-card .md-actions a').removeClass('active-tab-pill');
                $(this).addClass('active-tab-pill');
            });
        })(jQuery)

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

    $scope.getKey = function(object) {
        return Object.keys(object)[0];
    };
    var dayTotalSales = 0;
    var salesChartData = [];
    var dailySales; // = $firebaseArray(FBSalesref);
    FBSalesref.orderByKey().on("value", function(snapshot) {
        salesChartData = [];
        bestPrices = [];

        var returnData = snapshot.val();
        console.log('returnDatareturnDatareturnDatareturnData');

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


        for (var i = 0; i < dailySales.length; i++) {
            var theDayKeyFun = function(object) {
                return Object.keys(object)[0];
            };
            var theDayKey = theDayKeyFun(dailySales[i]);
            var theDayArray = dailySales[i][theDayKey];
            var theDayTotals = 0;
            var itemSoldCount = 0;
            for (var k = 0; k < theDayArray.length; k++) {
                theDayTotals = Number(theDayTotals) + Number(theDayArray[k]['itemSellPrice']);
                itemSoldCount++;// = itemSoldCount + theDayArray[k]['quantity'];
                console.log('theDayKey');
                console.log('theDayTotals');
                console.log(theDayTotals);
                console.log(theDayKey);
                console.log(theDateToday);

                //create data for charts
                salesChartData.push({
                    'day':theDayKey,
                    'itemSellPrice':Number(theDayArray[k]['itemSellPrice']),
                    'quantity':theDayArray[k]['quantity'],
                    'itemID':theDayArray[k]['itemID'],
                    'itemTitle':theDayArray[k]['itemTitle']
                });

                if (theDayKey === theDateToday) {
                    dayTotalSales = dayTotalSales + Number(theDayArray[k]['itemSellPrice']);
                }
            }
            dailySales[i]['dayTotal'] = theDayTotals;
            dailySales[i]['itemCount'] = itemSoldCount; //theDayArray.length;
        }


        console.log('salesChartDatasalesChartDatasalesChartDatasalesChartData');
        console.log(salesChartData);

        console.log(JSON.stringify(salesChartData));
        console.log('dailySalesAAAAAAA');
        console.log(dailySales);
        console.log(JSON.stringify(dailySales));

        //PROCESS CHART DATA

        $scope.weeklyBarCharts = function(startDate,endDate,fromMonth,toMonth) {

            //alert(1)
            bestPrices = [];
            bestLabels = [];

            var compiledSales = [];
            var allItemIDs = [];
            var uniqueItemIDs = [];

            //function compileTopSales(){
                //Array of all sold items IDs
                for (var i = 0; i < salesChartData.length; i++) {
                    allItemIDs.push(salesChartData[i]['itemID']);
                }

                //Remove duplicate item IDs
                $.each(allItemIDs, function(i, el){
                    if($.inArray(el, uniqueItemIDs) === -1) uniqueItemIDs.push(el);
                });

                console.log(uniqueItemIDs);

                //Merge all similar sales by itemIDs






                    for (var i = 0; i < salesChartData.length; i++) {

                        var theItemID = salesChartData[i]['itemID'];
                        var theItemTitle = salesChartData[i]['itemTitle'];
                        var theItemSellPrice = salesChartData[i]['itemSellPrice'];
                        var theDay = Number(((salesChartData[i]['day']).split("-"))[0]);
                        var theMonth = Number(((salesChartData[i]['day']).split("-"))[1])-1;
                        var theYear = Number(((salesChartData[i]['day']).split("-"))[2]);


                        console.log('theDay'+' : '+'startDate'+' : '+'endDate'+' : '+'fromMonth'+' : '+'toMonth');
                        console.log(theDay+' : '+startDate+' : '+endDate+' : '+fromMonth+' : '+toMonth);
                        if((theMonth==fromMonth)&&(theMonth==toMonth)){
                            if (theDay > (startDate - 1) && theDay < (endDate + 1)) {
                                console.log(theDay);
                                compiledSales.push(salesChartData[i]);
                                console.error(111);
                            }
                        }else{
                            if(theMonth === fromMonth){
                                if (theDay > (startDate - 1)) {
                                    console.log(theDay);
                                    compiledSales.push(salesChartData[i]);
                                    console.error(222);
                                }
                            }
                            if(theMonth === toMonth){
                                if (theDay < (endDate + 1)) {
                                    console.log(theDay);
                                    compiledSales.push(salesChartData[i]);
                                    console.error(333);
                                }
                            }
                        }

                    }

                    console.log('compiledSalescompiledSalescompiledSalescompiledSales');
                    console.log(compiledSales);

                    var arr = compiledSales;

                    var result = [];
                    arr.forEach(function(a) {
                        var theItem_Title = a.itemTitle;
                        var maxWordCount = 10;
                        var excerpt = function() {
                            if (theItem_Title.length > maxWordCount) {
                                return theItem_Title.substr(0, maxWordCount) + '.';
                            }
                            return theItem_Title;
                        };

                        if (!this[a.itemID]) {
                            this[a.itemID] = {
                                itemID: a.itemID,
                                itemTitle: excerpt(),
                                itemSellPrice: 0
                            };
                            result.push(this[a.itemID]);
                        }
                        this[a.itemID].itemSellPrice += a.itemSellPrice;
                    }, Object.create(null));
                    console.log(result);

                    function compare(a,b) {
                      if (a.itemSellPrice < b.itemSellPrice)
                        return -1;
                      if (a.itemSellPrice > b.itemSellPrice)
                        return 1;
                      return 0;
                    }

                    result.sort(compare);

                    console.log(result);


                    if(result.length<1){

                        bestOne = 0;
                        //bestTwo = 0;
                        bestThree = 0;

                        bestPriceOne = 0;//result[0]['itemSellPrice']
                        //bestPriceTwo = 0;//result[1]['itemSellPrice']
                    } else {

                        bestOne = result[result.length-1]['itemTitle'];
                        //bestTwo = result[result.length-2]['itemTitle'];
                        //bestThree = result[result.length-3]['itemTitle'];

                        for (var i = 0; i < result.length; i++) {
                            bestLabels.push(result[i]['itemTitle']);
                        }
                        
                        for (var i = 0; i < result.length; i++) {
                            bestPrices.push(result[i]['itemSellPrice']);
                        }

                        bestPriceOne = result[result.length-1]['itemSellPrice']
                        //bestPriceTwo = result[result.length-2]['itemSellPrice']
                    }


                    //alert(result[2]['itemSellPrice']);
                    /*
                        // Section 1 Chart 1
                        var chart1 = new Chartist.Bar('#chart-1', {
                            // add labels
                            labels: ["1: " + bestOne + "", "2: " + bestTwo + ""],
                            // add data
                            series: [
                                [bestPriceOne, bestPriceTwo]
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


                    function randomize() {
                        Chart.helpers.each(Chart.instances, function(chart) {
                            console.log('chartchartchartchart');
                            console.log(chart.data.datasets[0].label);

                            var theChartLabel = chart.data.datasets[0].label;

                      
                            

                            chart.data.datasets.forEach(function(dataset) {
                                if(theChartLabel === 'WeeklyInit'){
                                    console.log(dataset);
                                    //chart.config.data.labels = ["Business(" + totalBusinessExpPercent + "%)", "Personal(" + totalPersonalExpPercent + "%)", "Stock(" + totalStockExpPercent + "%)"];
                                    //dataset.data = [totalBusinessExpenses, totalPersonalExpenses, totalStockExpenses];
                                    //dataset.data = [bestPriceOne, bestPriceTwo];

                                    var tempDataset = [];
                                    var tempDataLabels = [];

                                    for (var i = 0; i < bestPrices.length; i++) {
                                        tempDataset.push(bestPrices[i]);
                                    }

                                    for (var i = 0; i < bestLabels.length; i++) {
                                        tempDataLabels.push(bestLabels[i]);
                                    }

                                    chart.config.data.labels = tempDataLabels;//["1: " + bestOne + "", "2: " + bestTwo + ""];
                                    dataset.data = tempDataset;
                                    
                                    //dataset.labels = ["Business(" + totalBusinessExpPercent + "%)", "Personal(" + totalPersonalExpPercent + "%)", "Stock(" + totalStockExpPercent + "%)"];
                
                                    //dataset.data = [108.68,60.17,71.09,-34.25,-8.93,-57.89,50.97,9.01];
                                }

                            });

                            chart.update();
                        });
                    }
                    randomize();


                        // if (theDay > (startDate - 1) && theDay < (endDate + 1) && theMonth > (fromMonth - 1) && theMonth < (toMonth + 1)) {
                            // console.log(theDay);
                            // totalExpenses = totalExpenses + monthlyExpenses[i]['amount'];
                            // if (monthlyExpenses[i]['expType'] === 'Business Expense') {
                            //  totalBusinessExpenses = totalBusinessExpenses + monthlyExpenses[i]['amount'];
                            // }
                            // if (monthlyExpenses[i]['expType'] === 'Personal Expense') {
                            //  totalPersonalExpenses = totalPersonalExpenses + monthlyExpenses[i]['amount'];
                            // }
                            // if (monthlyExpenses[i]['expType'] === 'COGS') {
                            //  totalStockExpenses = totalStockExpenses + monthlyExpenses[i]['amount'];
                            // }
                        // }



            //}

            //compileTopSales();

        };

        monthlyExpenses = salesChartData;

        //Automatically display chart of the current week
        currentWkChart = function(){
            var weekData = allYearWeeks[currentWkNo-1];
            var startDate = weekData.start.date;
            var endDate = weekData.end.date;
            var fromMonth = weekData.start.month;
            var toMonth = weekData.end.month;

            var currentWeekBarCharts = function(startDate,endDate,fromMonth,toMonth) {

                console.log(startDate+' : '+endDate+' : '+fromMonth+' : '+toMonth);

                bestPrices = [];
                bestLabels = [];

                var compiledSales = [];
                var allItemIDs = [];
                var uniqueItemIDs = [];

                //function compileTopSales(){
                //Array of all sold items IDs
                for (var i = 0; i < salesChartData.length; i++) {
                    allItemIDs.push(salesChartData[i]['itemID']);
                }

                //Remove duplicate item IDs
                $.each(allItemIDs, function(i, el){
                    if($.inArray(el, uniqueItemIDs) === -1) uniqueItemIDs.push(el);
                });

                console.log(uniqueItemIDs);

                //Merge all similar sales by itemIDs






                    for (var i = 0; i < salesChartData.length; i++) {

                        var theItemID = salesChartData[i]['itemID'];
                        var theItemTitle = salesChartData[i]['itemTitle'];
                        var theItemSellPrice = salesChartData[i]['itemSellPrice'];
                        var theDay = Number(((salesChartData[i]['day']).split("-"))[0]);
                        var theMonth = Number(((salesChartData[i]['day']).split("-"))[1])-1;
                        var theYear = Number(((salesChartData[i]['day']).split("-"))[2]);

                        console.log('theDay'+' : '+'startDate'+' : '+'endDate'+' : '+'fromMonth'+' : '+'toMonth');
                        console.log(theDay+' : '+startDate+' : '+endDate+' : '+fromMonth+' : '+toMonth);
                        if((theMonth==fromMonth)&&(theMonth==toMonth)){
                            if (theDay > (startDate - 1) && theDay < (endDate + 1)) {
                                console.log(theDay);
                                compiledSales.push(salesChartData[i]);
                            }
                        }else{
                            if(theMonth === fromMonth){
                                if (theDay > (startDate - 1)) {
                                    console.log(theDay);
                                    compiledSales.push(salesChartData[i]);
                                }
                            }
                            if(theMonth === toMonth){
                                if (theDay < (endDate + 1)) {
                                    console.log(theDay);
                                    compiledSales.push(salesChartData[i]);
                                }
                            }
                        }

                    }

                    console.log('compiledSalescompiledSalescompiledSalescompiledSales');
                    console.log(compiledSales);

                    var arr = compiledSales;

                    var result = [];
                    arr.forEach(function(a) {
                        var theItem_Title = a.itemTitle;
                        var maxWordCount = 10;
                        var excerpt = function() {
                            if (theItem_Title.length > maxWordCount) {
                                return theItem_Title.substr(0, maxWordCount) + '.';
                            }
                            return theItem_Title;
                        };

                        if (!this[a.itemID]) {
                            this[a.itemID] = {
                                itemID: a.itemID,
                                itemTitle: excerpt(),
                                itemSellPrice: 0
                            };
                            result.push(this[a.itemID]);
                        }
                        this[a.itemID].itemSellPrice += a.itemSellPrice;
                    }, Object.create(null));
                    console.log(result);

                    function compare(a,b) {
                      if (a.itemSellPrice < b.itemSellPrice)
                        return -1;
                      if (a.itemSellPrice > b.itemSellPrice)
                        return 1;
                      return 0;
                    }

                    result.sort(compare);

                    console.log(result);

                    if(result.length<1){
                        bestOne = 0;
                        //bestTwo = 0;
                        bestThree = 0;

                        bestPriceOne = 0;//result[0]['itemSellPrice']
                        //bestPriceTwo = 0;//result[1]['itemSellPrice']
                    } else {
                        for (var i = 0; i < result.length; i++) {
                            bestLabels.push(result[i]['itemTitle']);
                        }
                        
                        for (var i = 0; i < result.length; i++) {
                            bestPrices.push(result[i]['itemSellPrice']);
                        }

                        console.log('bestPricesbestPricesbestPricesbestPrices');
                        console.log(bestPrices);

                        bestOne = result[result.length-1]['itemTitle'];
                        //bestTwo = result[result.length-2]['itemTitle'];
                        //bestThree = result[result.length-3]['itemTitle'];

                        bestPriceOne = result[result.length-1]['itemSellPrice']
                        //bestPriceTwo = result[result.length-2]['itemSellPrice']
                    }


                    //alert(result[2]['itemSellPrice']);

                    // Section 1 Chart 1
                    /*
                        var chart1 = new Chartist.Bar('#chart-1', {
                            // add labels
                            labels: ["1: " + bestOne + "", "2: " + bestTwo + ""],
                            // add data
                            series: [
                                [bestPriceOne, bestPriceTwo]
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

                    var tempDataset = [];
                    var tempDataLabels = [];

                    for (var i = 0; i < bestPrices.length; i++) {
                        tempDataset.push(bestPrices[i]);
                    }

                    for (var i = 0; i < bestLabels.length; i++) {
                        tempDataLabels.push(bestLabels[i]);
                    }

                    var bgColors = ['#f54525',
                                    '#2980b9',
                                    '#66bbbb',
                                    '#aa6643',
                                    '#444466',
                                    '#fd9c00',
                                    '#497cc8'];

                    new Chart('myChartRev', {
                          type: 'bar',
                          data: {
                              //labels: ["Business(" + totalBusinessExpPercent + "%)", "Personal(" + totalPersonalExpPercent + "%)", "Stock(" + totalStockExpPercent + "%)"],
                              labels: tempDataLabels,//["1: " + bestOne + "", "2: " + bestTwo + ""],
                              //labels: ["B (" + totalBusinessExpPercent + "%)", "P (" + totalPersonalExpPercent + "%)", "S (" + totalStockExpPercent + "%)"],
                              datasets: [{
                                  label: 'WeeklyInit',
                                  //data: [12, 19, 3, 5, 2, 3],
                                  //data: [totalBusinessExpenses, totalPersonalExpenses, totalStockExpenses],
                                  data: tempDataset,//[bestPriceOne, bestPriceTwo],
                                  backgroundColor: bgColors,
                                  borderColor: bgColors,
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
                                            fontSize: 9
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

                // (function($){
                //     var weekTabW = $(".charts #tab-pill-week .tab-pill-titles a.active-tab-pill-button").outerWidth();

                //     $('.charts #tab-pill-week .tab-pill-titles').animate({
                //         scrollLeft: ($(".charts #tab-pill-week .tab-pill-titles a.active-tab-pill-button").offset().left)-($(window).width()/2)+(weekTabW/2)
                //      }, 2000);
                // })(jQuery)

            },1000);

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


        $scope.weeklyBarChartsss = function(startDate,endDate,fromMonth,toMonth) {

            console.log(startDate+' : '+endDate+' : '+fromMonth+' : '+toMonth)

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

                if (theDay > (startDate - 1) && theDay < (endDate + 1) && theMonth > (fromMonth - 1) && theMonth < (toMonth + 1)) {
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

            // Section 1 Chart 1
            var chart1 = new Chartist.Bar('#chart-1', {
                // add labels
                labels: ["1: " + bestOne + "", "2: " + bestTwo + ""],
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

        //Automatically display chart of the current month
        //Automatically display chart of the current month
        currentMthChart = function(){
            var mthData = yearData[currentMthNo];
            var fromMonth = mthData.mthCount;
            var toMonth = mthData.mthCount;

            var currentMonthBarCharts = function(fromMonth,toMonth) {

                console.log(fromMonth+' : '+toMonth)

                bestPrices = [];
                bestLabels = [];

                var compiledSales = [];
                var allItemIDs = [];
                var uniqueItemIDs = [];

                //function compileTopSales(){
                //Array of all sold items IDs
                for (var i = 0; i < salesChartData.length; i++) {
                    allItemIDs.push(salesChartData[i]['itemID']);
                }

                //Remove duplicate item IDs
                $.each(allItemIDs, function(i, el){
                    if($.inArray(el, uniqueItemIDs) === -1) uniqueItemIDs.push(el);
                });

                console.log(uniqueItemIDs);

                //Merge all similar sales by itemIDs

                    for (var i = 0; i < salesChartData.length; i++) {

                        var theItemID = salesChartData[i]['itemID'];
                        var theItemTitle = salesChartData[i]['itemTitle'];
                        var theItemSellPrice = salesChartData[i]['itemSellPrice'];
                        var theDay = Number(((salesChartData[i]['day']).split("-"))[0]);
                        var theMonth = Number(((salesChartData[i]['day']).split("-"))[1])-1;
                        var theYear = Number(((salesChartData[i]['day']).split("-"))[2]);

                        if (theMonth > (fromMonth - 1) && theMonth < (toMonth + 1)) {
                            compiledSales.push(salesChartData[i]);
                        }

                    }

                    console.log('compiledSalescompiledSalescompiledSalescompiledSales');
                    console.log(compiledSales);

                    var arr = compiledSales;

                    var result = [];
                    arr.forEach(function(a) {
                        var theItem_Title = a.itemTitle;
                        var maxWordCount = 10;
                        var excerpt = function() {
                            if (theItem_Title.length > maxWordCount) {
                                return theItem_Title.substr(0, maxWordCount) + '.';
                            }
                            return theItem_Title;
                        };

                        if (!this[a.itemID]) {
                            this[a.itemID] = {
                                itemID: a.itemID,
                                itemTitle: excerpt(),
                                itemSellPrice: 0
                            };
                            result.push(this[a.itemID]);
                        }
                        this[a.itemID].itemSellPrice += a.itemSellPrice;
                    }, Object.create(null));
                    console.log(result);

                    function compare(a,b) {
                      if (a.itemSellPrice < b.itemSellPrice)
                        return -1;
                      if (a.itemSellPrice > b.itemSellPrice)
                        return 1;
                      return 0;
                    }

                    result.sort(compare);

                    console.log(result);



                    if(result.length<1){
                        bestOne = 0;
                        //bestTwo = 0;
                        bestThree = 0;

                        bestPriceOne = 0;//result[0]['itemSellPrice']
                        //bestPriceTwo = 0;//result[1]['itemSellPrice']
                    } else {
                        bestOne = result[result.length-1]['itemTitle'];
                        //bestTwo = result[result.length-2]['itemTitle'];
                        //bestThree = result[result.length-3]['itemTitle'];

                        for (var i = 0; i < result.length; i++) {
                            bestLabels.push(result[i]['itemTitle']);
                        }

                        for (var i = 0; i < result.length; i++) {
                            bestPrices.push(result[i]['itemSellPrice']);
                        }

                        bestPriceOne = result[result.length-1]['itemSellPrice']
                        //bestPriceTwo = result[result.length-2]['itemSellPrice']
                    }

                    function randomizeMonthly() {
                        Chart.helpers.each(Chart.instances, function(chart) {
                            console.log('chartchartchartchart');
                            console.log(chart.data.datasets[0].label);

                            var theChartLabel = chart.data.datasets[0].label;

                            chart.data.datasets.forEach(function(dataset) {
                                if(theChartLabel === 'WeeklyInit'){
                                    console.log(dataset);

                                    //dataset.data = [108.68,60.17,71.09,-34.25,-8.93,-57.89,50.97,9.01];
                                    var tempDataset = [];
                                    var tempDataLabels = [];

                                    for (var i = 0; i < bestPrices.length; i++) {
                                        tempDataset.push(bestPrices[i]);
                                    }

                                    for (var i = 0; i < bestLabels.length; i++) {
                                        tempDataLabels.push(bestLabels[i]);
                                    }

                                    chart.config.data.labels = tempDataLabels;//["1: " + bestOne + "", "2: " + bestTwo + ""];
                                    dataset.data = tempDataset;
                                }

                            });

                            chart.update();
                        });
                    }
                    randomizeMonthly();
            };

            $timeout(function(){
                currentMonthBarCharts(fromMonth,toMonth);

                // (function($){
                //     var weekTabW = $(".charts #tab-pill-week .tab-pill-titles a.active-tab-pill-button").outerWidth();

                //     $('.charts #tab-pill-week .tab-pill-titles').animate({
                //         scrollLeft: ($(".charts #tab-pill-week .tab-pill-titles a.active-tab-pill-button").offset().left)-($(window).width()/2)+(weekTabW/2)
                //      }, 2000);
                // })(jQuery)

            },1000);

        }

        $scope.theMonthlyBarCharts = function(fromMonth,toMonth) {

            console.log(fromMonth+' : '+toMonth)

            bestPrices = [];
            bestLabels = [];

            var currentMonthBarCharts = function(fromMonth,toMonth) {

                console.log(fromMonth+' : '+toMonth)

                var compiledSales = [];
                var allItemIDs = [];
                var uniqueItemIDs = [];

                //function compileTopSales(){
                //Array of all sold items IDs
                for (var i = 0; i < salesChartData.length; i++) {
                    allItemIDs.push(salesChartData[i]['itemID']);
                }

                //Remove duplicate item IDs
                $.each(allItemIDs, function(i, el){
                    if($.inArray(el, uniqueItemIDs) === -1) uniqueItemIDs.push(el);
                });

                console.log(uniqueItemIDs);

                //Merge all similar sales by itemIDs

                    for (var i = 0; i < salesChartData.length; i++) {

                        var theItemID = salesChartData[i]['itemID'];
                        var theItemTitle = salesChartData[i]['itemTitle'];
                        var theItemSellPrice = salesChartData[i]['itemSellPrice'];
                        var theDay = Number(((salesChartData[i]['day']).split("-"))[0]);
                        var theMonth = Number(((salesChartData[i]['day']).split("-"))[1])-1;
                        var theYear = Number(((salesChartData[i]['day']).split("-"))[2]);

                        if (theMonth > (fromMonth - 1) && theMonth < (toMonth + 1)) {
                            compiledSales.push(salesChartData[i]);
                        }

                    }

                    console.log('compiledSalescompiledSalescompiledSalescompiledSales');
                    console.log(compiledSales);

                    var arr = compiledSales;

                    var result = [];
                    arr.forEach(function(a) {
                        var theItem_Title = a.itemTitle;
                        var maxWordCount = 10;
                        var excerpt = function() {
                            if (theItem_Title.length > maxWordCount) {
                                return theItem_Title.substr(0, maxWordCount) + '.';
                            }
                            return theItem_Title;
                        };

                        if (!this[a.itemID]) {
                            this[a.itemID] = {
                                itemID: a.itemID,
                                itemTitle: excerpt(),
                                itemSellPrice: 0
                            };
                            result.push(this[a.itemID]);
                        }
                        this[a.itemID].itemSellPrice += a.itemSellPrice;
                    }, Object.create(null));
                    console.log(result);

                    function compare(a,b) {
                      if (a.itemSellPrice < b.itemSellPrice)
                        return -1;
                      if (a.itemSellPrice > b.itemSellPrice)
                        return 1;
                      return 0;
                    }

                    result.sort(compare);

                    console.log(result);

                    if(result.length<1){
                        bestOne = 0;
                        //bestTwo = 0;
                        bestThree = 0;

                        bestPriceOne = 0;//result[0]['itemSellPrice']
                        //bestPriceTwo = 0;//result[1]['itemSellPrice']
                    } else {
                        bestOne = result[result.length-1]['itemTitle'];
                        //bestTwo = result[result.length-2]['itemTitle'];
                        //bestThree = result[result.length-3]['itemTitle'];

                        for (var i = 0; i < result.length; i++) {
                            bestLabels.push(result[i]['itemTitle']);
                        }

                        for (var i = 0; i < result.length; i++) {
                            bestPrices.push(result[i]['itemSellPrice']);
                        }

                        bestPriceOne = result[result.length-1]['itemSellPrice']
                        //bestPriceTwo = result[result.length-2]['itemSellPrice']
                    }

                    function randomizeMonthly() {
                        Chart.helpers.each(Chart.instances, function(chart) {
                            console.log('chartchartchartchart');
                            console.log(chart.data.datasets[0].label);

                            var theChartLabel = chart.data.datasets[0].label;

                      
                            

                            chart.data.datasets.forEach(function(dataset) {
                                if(theChartLabel === 'WeeklyInit'){
                                    console.log(dataset);
                                    //chart.config.data.labels = ["Business(" + totalBusinessExpPercent + "%)", "Personal(" + totalPersonalExpPercent + "%)", "Stock(" + totalStockExpPercent + "%)"];
                                    //dataset.data = [108.68,60.17,71.09,-34.25,-8.93,-57.89,50.97,9.01];
                                    var tempDataset = [];
                                    var tempDataLabels = [];

                                    for (var i = 0; i < bestPrices.length; i++) {
                                        tempDataset.push(bestPrices[i]);
                                    }

                                    for (var i = 0; i < bestLabels.length; i++) {
                                        tempDataLabels.push(bestLabels[i]);
                                    }

                                    chart.config.data.labels = tempDataLabels;//["1: " + bestOne + "", "2: " + bestTwo + ""];
                                    dataset.data = tempDataset;// [bestPriceOne, bestPriceTwo];

                                    //dataset.labels = ["Business(" + totalBusinessExpPercent + "%)", "Personal(" + totalPersonalExpPercent + "%)", "Stock(" + totalStockExpPercent + "%)"];
                
                                    //dataset.data = [108.68,60.17,71.09,-34.25,-8.93,-57.89,50.97,9.01];
                                }

                            });

                            chart.update();
                        });
                    }
                    randomizeMonthly();
            };

            $timeout(function(){
                currentMonthBarCharts(fromMonth,toMonth);

                // (function($){
                //     var weekTabW = $(".charts #tab-pill-week .tab-pill-titles a.active-tab-pill-button").outerWidth();

                //     $('.charts #tab-pill-week .tab-pill-titles').animate({
                //         scrollLeft: ($(".charts #tab-pill-week .tab-pill-titles a.active-tab-pill-button").offset().left)-($(window).width()/2)+(weekTabW/2)
                //      }, 2000);
                // })(jQuery)

            },1000);

        };

        $scope.monthlyBarCharts = function() {

            $scope.tabs_weeks = false;
            $scope.tabs_months = true;
            $scope.tabs_years = false;

            // Section 2 Chart 2
            //Automatically display chart of the current month
            mthTabClicks++;

            console.error('mthTabClicks: '+mthTabClicks);

            $timeout(function(){
                console.log('8888');
                $location.hash('inc-active-tab-pill-button-month');
                $ionicScrollDelegate.anchorScroll(true);

                //Make sure month tabs are loaded before running currentMthChart()
                var showMntTabChart = setInterval(function(){
                    var showMthTab = $('#dashboard-content md-card .md-actions.months a');
                    console.log("GoTabsA: "+showMthTab.length);

                    if(showMthTab.length>1){

                        console.log("GoTabs: "+showMthTab.length);
                        currentMthChart();

                        clearInterval(showMntTabChart);
                    }
                },1000);

            },0);

        };

        //Draw yearly bar charts


        //Automatically display chart of the current week
        currentYrChart = function(){
            var fromYear = currentYrNo;
            var toYear = currentYrNo;

            var currentYearBarCharts = function(fromYear,toYear) {

                console.log(fromYear+' : '+toYear)

                var compiledSales = [];
                var allItemIDs = [];
                var uniqueItemIDs = [];

                //function compileTopSales(){
                //Array of all sold items IDs
                for (var i = 0; i < salesChartData.length; i++) {
                    allItemIDs.push(salesChartData[i]['itemID']);
                }

                //Remove duplicate item IDs
                $.each(allItemIDs, function(i, el){
                    if($.inArray(el, uniqueItemIDs) === -1) uniqueItemIDs.push(el);
                });

                console.log(uniqueItemIDs);

                //Merge all similar sales by itemIDs

                    for (var i = 0; i < salesChartData.length; i++) {

                        var theItemID = salesChartData[i]['itemID'];
                        var theItemTitle = salesChartData[i]['itemTitle'];
                        var theItemSellPrice = salesChartData[i]['itemSellPrice'];
                        var theDay = Number(((salesChartData[i]['day']).split("-"))[0]);
                        var theMonth = Number(((salesChartData[i]['day']).split("-"))[1])-1;
                        var theYear = Number(((salesChartData[i]['day']).split("-"))[2]);

                        if (theYear > (fromYear - 1) && theYear < (toYear + 1)) {
                            compiledSales.push(salesChartData[i]);
                        }

                    }

                    console.log('compiledSalescompiledSalescompiledSalescompiledSales');
                    console.log(compiledSales);

                    var arr = compiledSales;

                    var result = [];
                    arr.forEach(function(a) {
                        var theItem_Title = a.itemTitle;
                        var maxWordCount = 10;
                        var excerpt = function() {
                            if (theItem_Title.length > maxWordCount) {
                                return theItem_Title.substr(0, maxWordCount) + '.';
                            }
                            return theItem_Title;
                        };

                        if (!this[a.itemID]) {
                            this[a.itemID] = {
                                itemID: a.itemID,
                                itemTitle: excerpt(),
                                itemSellPrice: 0
                            };
                            result.push(this[a.itemID]);
                        }
                        this[a.itemID].itemSellPrice += a.itemSellPrice;
                    }, Object.create(null));
                    console.log(result);

                    function compare(a,b) {
                      if (a.itemSellPrice < b.itemSellPrice)
                        return -1;
                      if (a.itemSellPrice > b.itemSellPrice)
                        return 1;
                      return 0;
                    }

                    result.sort(compare);

                    console.log(result);

                    if(result.length<1){
                        bestOne = 0;
                        //bestTwo = 0;
                        bestThree = 0;

                        bestPriceOne = 0;//result[0]['itemSellPrice']
                        //bestPriceTwo = 0;//result[1]['itemSellPrice']
                    } else {
                        bestOne = result[result.length-1]['itemTitle'];
                        //bestTwo = result[result.length-2]['itemTitle'];
                        //bestThree = result[result.length-3]['itemTitle'];

                        for (var i = 0; i < result.length; i++) {
                            bestLabels.push(result[i]['itemTitle']);
                        }
                        
                        for (var i = 0; i < result.length; i++) {
                            bestPrices.push(result[i]['itemSellPrice']);
                        }

                        bestPriceOne = result[result.length-1]['itemSellPrice']
                        //bestPriceTwo = result[result.length-2]['itemSellPrice']
                    }

                    function randomizeYearly() {
                        Chart.helpers.each(Chart.instances, function(chart) {
                            console.log('chartchartchartchart');
                            console.log(chart.data.datasets[0].label);

                            var theChartLabel = chart.data.datasets[0].label;

                      
                            

                            chart.data.datasets.forEach(function(dataset) {
                                if(theChartLabel === 'WeeklyInit'){
                                    console.log(dataset);
                                    //chart.config.data.labels = ["Business(" + totalBusinessExpPercent + "%)", "Personal(" + totalPersonalExpPercent + "%)", "Stock(" + totalStockExpPercent + "%)"];
                                    chart.config.data.labels = ["1: " + bestOne + "", "2: " + bestTwo + ""];
                                    //dataset.data = [totalBusinessExpenses, totalPersonalExpenses, totalStockExpenses];
                                    dataset.data = [bestPriceOne, bestPriceTwo];
                                    //dataset.labels = ["Business(" + totalBusinessExpPercent + "%)", "Personal(" + totalPersonalExpPercent + "%)", "Stock(" + totalStockExpPercent + "%)"];
                
                                    //dataset.data = [108.68,60.17,71.09,-34.25,-8.93,-57.89,50.97,9.01];
                                }

                            });

                            chart.update();
                        });
                    }
                    randomizeYearly();
            };

            $timeout(function(){
                currentYearBarCharts(fromYear,toYear);

                // (function($){
                //     var weekTabW = $(".charts #tab-pill-week .tab-pill-titles a.active-tab-pill-button").outerWidth();

                //     $('.charts #tab-pill-week .tab-pill-titles').animate({
                //         scrollLeft: ($(".charts #tab-pill-week .tab-pill-titles a.active-tab-pill-button").offset().left)-($(window).width()/2)+(weekTabW/2)
                //      }, 2000);
                // })(jQuery)

            },1000);

        }


        $scope.theYearlyBarCharts = function(fromYear,toYear) {

            console.log(fromYear+' : '+toYear)

            var currentYearBarCharts = function(fromYear,toYear) {

                var compiledSales = [];
                var allItemIDs = [];
                var uniqueItemIDs = [];

                //function compileTopSales(){
                //Array of all sold items IDs
                for (var i = 0; i < salesChartData.length; i++) {
                    allItemIDs.push(salesChartData[i]['itemID']);
                }

                //Remove duplicate item IDs
                $.each(allItemIDs, function(i, el){
                    if($.inArray(el, uniqueItemIDs) === -1) uniqueItemIDs.push(el);
                });

                console.log(uniqueItemIDs);

                //Merge all similar sales by itemIDs

                    for (var i = 0; i < salesChartData.length; i++) {

                        var theItemID = salesChartData[i]['itemID'];
                        var theItemTitle = salesChartData[i]['itemTitle'];
                        var theItemSellPrice = salesChartData[i]['itemSellPrice'];
                        var theDay = Number(((salesChartData[i]['day']).split("-"))[0]);
                        var theMonth = Number(((salesChartData[i]['day']).split("-"))[1])-1;
                        var theYear = Number(((salesChartData[i]['day']).split("-"))[2]);

                        if (theYear > (fromYear - 1) && theYear < (toYear + 1)) {
                            compiledSales.push(salesChartData[i]);
                        }

                    }

                    console.log('compiledSalescompiledSalescompiledSalescompiledSales');
                    console.log(compiledSales);

                    var arr = compiledSales;

                    var result = [];
                    arr.forEach(function(a) {
                        var theItem_Title = a.itemTitle;
                        var maxWordCount = 10;
                        var excerpt = function() {
                            if (theItem_Title.length > maxWordCount) {
                                return theItem_Title.substr(0, maxWordCount) + '.';
                            }
                            return theItem_Title;
                        };

                        if (!this[a.itemID]) {
                            this[a.itemID] = {
                                itemID: a.itemID,
                                itemTitle: excerpt(),
                                itemSellPrice: 0
                            };
                            result.push(this[a.itemID]);
                        }
                        this[a.itemID].itemSellPrice += a.itemSellPrice;
                    }, Object.create(null));
                    console.log(result);

                    function compare(a,b) {
                      if (a.itemSellPrice < b.itemSellPrice)
                        return -1;
                      if (a.itemSellPrice > b.itemSellPrice)
                        return 1;
                      return 0;
                    }

                    result.sort(compare);

                    console.log(result);

                    if(result.length<1){
                        bestOne = 0;
                        //bestTwo = 0;
                        bestThree = 0;

                        bestPriceOne = 0;//result[0]['itemSellPrice']
                        //bestPriceTwo = 0;//result[1]['itemSellPrice']
                    } else {
                        bestOne = result[result.length-1]['itemTitle'];
                        //bestTwo = result[result.length-2]['itemTitle'];
                        //bestThree = result[result.length-3]['itemTitle'];

                        for (var i = 0; i < result.length; i++) {
                            bestLabels.push(result[i]['itemTitle']);
                        }
                        
                        for (var i = 0; i < result.length; i++) {
                            bestPrices.push(result[i]['itemSellPrice']);
                        }

                        bestPriceOne = result[result.length-1]['itemSellPrice']
                        //bestPriceTwo = result[result.length-2]['itemSellPrice']
                    }

                    function randomizeYearly() {
                        Chart.helpers.each(Chart.instances, function(chart) {
                            console.log('chartchartchartchart');
                            console.log(chart.data.datasets[0].label);

                            var theChartLabel = chart.data.datasets[0].label;

                      
                            

                            chart.data.datasets.forEach(function(dataset) {
                                if(theChartLabel === 'WeeklyInit'){
                                    console.log(dataset);
                                    //chart.config.data.labels = ["Business(" + totalBusinessExpPercent + "%)", "Personal(" + totalPersonalExpPercent + "%)", "Stock(" + totalStockExpPercent + "%)"];
                                    chart.config.data.labels = ["1: " + bestOne + "", "2: " + bestTwo + ""];
                                    //dataset.data = [totalBusinessExpenses, totalPersonalExpenses, totalStockExpenses];
                                    dataset.data = [bestPriceOne, bestPriceTwo];
                                    //dataset.labels = ["Business(" + totalBusinessExpPercent + "%)", "Personal(" + totalPersonalExpPercent + "%)", "Stock(" + totalStockExpPercent + "%)"];
                
                                    //dataset.data = [108.68,60.17,71.09,-34.25,-8.93,-57.89,50.97,9.01];
                                }

                            });

                            chart.update();
                        });
                    }
                    randomizeYearly();
            };

            $timeout(function(){
                currentYearBarCharts(fromYear,toYear);

                // (function($){
                //     var weekTabW = $(".charts #tab-pill-week .tab-pill-titles a.active-tab-pill-button").outerWidth();

                //     $('.charts #tab-pill-week .tab-pill-titles').animate({
                //         scrollLeft: ($(".charts #tab-pill-week .tab-pill-titles a.active-tab-pill-button").offset().left)-($(window).width()/2)+(weekTabW/2)
                //      }, 2000);
                // })(jQuery)

            },1000);

        };


        $scope.yearlyBarCharts = function() {

            $scope.tabs_weeks = false;
            $scope.tabs_months = false;
            $scope.tabs_years = true;

            // Section 2 Chart 2
            //Automatically display chart of the current month

            $timeout(function(){
                console.log('8888');
                $location.hash('inc-active-tab-pill-button-year');
                $ionicScrollDelegate.anchorScroll(true);

                //Make sure month tabs are loaded before running currentMthChart()
                var showYrTabChart = setInterval(function(){
                    var showYrTab = $('#dashboard-content md-card .md-actions.years a');
                    console.log("GoTabsA: "+showYrTab.length);

                    if(showYrTab.length>1){

                        console.log("GoTabs: "+showYrTab.length);
                        currentYrChart();

                        clearInterval(showYrTabChart);
                    }
                },1000);

            },0);

        };

        //END PROCESS CHART DATA

        //$scope.monthlySales = dailySales;

        $interval(function() {
            //console.log('dayTotalSales: '' + dayTotalSales);
            $scope.monthlySales = sortbydate(dailySales);
            $scope.dailyTotalSales = dayTotalSales;
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
                var showWksTab = $('#dashboard-content.income-report md-card');
                console.log("GoTabsRecentAAAA: "+showWksTab.length);

                if(showWksTab.length>0){

                    console.log("GoTabsRecent: "+showWksTab.length);

                    setTimeout(function() {
                        var exeCount = 0;

                        $('.income-report [data-toggle-box]').unbind('click');

                        $('.income-report [data-toggle-box]').on('click', function() {
                            
                            $(this).parent().toggleClass("active");
                            var toggle_box = $(this).data('toggle-box');
                            
                            console.error('toggleclicked: '+toggle_box+' : '+'exeCount: '+exeCount);
                            if(exeCount<1){
                                if ($('.income-report #' + toggle_box).is(":visible")) {
                                    $('.income-report #' + toggle_box).slideUp(250);
                                    console.log('isvisible');
                                } else {
                                    $(".income-report [id^='box']").slideUp(250);
                                    $('.income-report #' + toggle_box).slideDown(250);
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

        (function($){
            //Make sure week tabs are loaded before running currentWkChart()
            var showWksTabChart = setInterval(function(){
                var showWksTab = $('#dashboard-content.income-report md-card');
                console.log("GoTabsRecentAAAA: "+showWksTab.length);

                if(showWksTab.length>0){

                    console.log("GoTabsRecent: "+showWksTab.length);

                    setTimeout(function() {
                        var exeCount = 0;

                        $('.income-report [data-toggle-box]').unbind('click');

                        $('.income-report [data-toggle-box]').on('click', function() {
                            
                            $(this).parent().toggleClass("active");
                            var toggle_box = $(this).data('toggle-box');
                            
                            console.error('toggleclicked: '+toggle_box+' : '+'exeCount: '+exeCount);
                            if(exeCount<1){
                                if ($('.income-report #' + toggle_box).is(":visible")) {
                                    $('.income-report #' + toggle_box).slideUp(250);
                                    console.log('isvisible');
                                } else {
                                    $(".income-report [id^='box']").slideUp(250);
                                    $('.income-report #' + toggle_box).slideDown(250);
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