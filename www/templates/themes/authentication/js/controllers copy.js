// Controller of defaultUserInterface.
appControllers.controller('authTheUser', function(APIBASE, APIBASE_V1, $mdDialog, $mdBottomSheet, $mdToast, $mdDialog, $firebaseArray, $firebaseObject, $scope, $rootScope, $timeout, $http, $filter, $q, $interval, $state, $stateParams, $ionicHistory) {

    var userTypeRef = firebase.database().ref().child('userType');
    $scope.login_loader = false;
    $scope.authStatus = false;

    $scope.authData = function(username,password){

        $scope.login_loader = true;

        console.log(username);
        console.log(password);

        var auth_Dt = {
            'user_name':username,
            'password':password
        }

        setTimeout(function() {

                                    /*
                                        if(username && password==123){
                                            $scope.login_loader = false;
                                            $scope.authStatus = false;

                                            // localStorage.setItem('company_id',response.data.data.company_id);
                                            // console.log('company_id: '+response.data.data.company_id)
                                            //localStorage.setItem('company_id',486);


                                            

                                            // console.error('responseaaaaa');
                                            // console.log(response);
                                            // console.log(JSON.stringify(response));


                                            //var theUser = response.data.data.company_type_alias;//['data']['project_type_id'];
                                            //var theUser = response.data.data.project_type_id;//['data']['project_type_id'];

                                            var theUser;

                                            if(username=='admin'){
                                                theUser = 'for_profit';//'non_profit';
                                            }

                                            if(username=='admin_donor'){
                                                theUser = 'non_profit';//'non_profit';
                                            }

                                            if(theUser=='for_profit'){
                                                $state.go('app.dashboard', {});
                                            } else {
                                                $state.go('app.dashboardv2', {});
                                            }

                                            userTypeRef.set(theUser);

                                            console.log(theUser);

                                            localStorage.setItem("userType", theUser);
                                        }
                                    */


                $http({
                    //url: 'https://pwc.scopicafrica.com/pwc/api_v1/app_login',
                    url: 'https://portal.epesibooks.com/acc/api_v1/app_login',
                    method: "POST",
                    data: auth_Dt,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(function(response) {
                    console.log(response);

                    if(response.data.message == "Invalid Credentials. Kindly input some valid credentials"){
                        $scope.msg = 'Invalid Credentials';
                        console.error('Invalid Credentials')
                        $scope.login_loader = false;
                        $scope.authStatus = true;
                    }else{


                        $scope.login_loader = false;
                        $scope.authStatus = false;

                        localStorage.setItem('company_id',response.data.data.company_id);
                        console.log('company_id: '+response.data.data.company_id)

                        console.error('responseaaaaa');
                        console.log(response);
                        console.log(JSON.stringify(response));


                        var theUser = response.data.data.company_type_alias;//['data']['project_type_id'];
                        //var theUser = response.data.data.project_type_id;//['data']['project_type_id'];

                        //var theUser = 'for_profit';//'non_profit';

                        if(theUser=='for_profit'){
                            $state.go('app.dashboard', {});
                        } else {
                            $state.go('app.dashboardv2', {});
                            //get_components
                            var company_id = localStorage.getItem('company_id');
                    
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
                                var compTypes = resp.data;
                                localStorage.setItem("compTypes", (JSON.stringify(compTypes)));

                            }, function(resp) { // optional
                                console.log('response');
                            });

                        }

                        userTypeRef.set(theUser);

                        console.log(theUser);

                        localStorage.setItem("userType", theUser);

                    }

               


                }, function(response) { // optional
                    //xhrErrorTracking.response();
                    //xhrErrorTracking.responseError();
                    console.log(response);
                });
                 
            
            //$scope.activateSell = true;
        }, 1000);
    }
    
}); // End of defaultUserInterface controller.