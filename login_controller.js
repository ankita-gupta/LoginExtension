/**
 * Created by shivika on 9/12/15.
 */
angular.module("loginApp",['ngMaterial','restangular','ngCookies','LocalStorageModule']).config(function(RestangularProvider){
    //RestangularProvider.setBaseUrl('http://cas.ckiller.com:8000/api/rest/');
    RestangularProvider.setBaseUrl('http://');
    RestangularProvider.setRequestSuffix('/?format=json');
    RestangularProvider.setDefaultHttpFields({cache: false,withCredentials: true});
    RestangularProvider.addResponseInterceptor(function (data, operation, what, url, response, deferred) {
        var extractedData;
        if (operation === "getList") {
            extractedData = data.results;
            if (data.count != null) {
                extractedData.meta = data.count;
            }
            if(data.next){
                extractedData.next = data.next
            }
            if(data.previous){
                extractedData.previous = data.previous
            }

            if(data.admin_submissions){
                extractedData.admin_submissions = data.admin_submissions
            }

            if(data.admin_recruits){
                extractedData.admin_recruits = data.admin_recruits
            }

            if (data.filters != null) {
                extractedData.filter = data.filters;
            }
        } else {
            extractedData = data;
        }
        return extractedData;
    });
})
    .controller('login_controller',function($scope,Restangular,$http,$mdDialog,$mdMedia,$rootScope,$cookies,localStorageService){
        $scope.user = {};
        $scope.id = 100;
        $scope.log_user = false
        $scope.image = false
        $scope.abc = "sadfds"
        $scope.title =
            $scope.shot = false
        if (localStorageService.get('token')) {
            $http.defaults.headers.common.Authorization = 'Token ' + localStorageService.get('token');
            $http.defaults.headers.common["X-CSRFToken"] = localStorageService.get('X-CSRFToken');
            var auth = this;
            auth.authenticated = true;
            $scope.log_user = true
            $scope.image = false
            $scope.url = localStorageService.get('finalBaseUrl');
            $scope.view_userUrl = $scope.url + "rest-auth/user"
            console.log($scope.view_userUrl,"user")
            $scope.view_Project = $scope.url + "project/by_consultant"
            $scope.view_timesheeturl = $scope.url + "timesheet/by_project"
            Restangular.one($scope.view_userUrl).get().then(function (result) {
                console.log(result, "------>user")
                console.log(result.id)
                Restangular.all($scope.view_Project).getList({user_id: result.id}).then(function (project) {
                    $scope.project = project;
                    console.log(project,"------------>project tile")
                })
            })
        }
        $scope.update = function(title) {
            console.log($scope.item ,  "each")


        }
        $scope.show_timesheet = function(){
            alert($scope.title_model);
            $scope.url = localStorageService.get('finalBaseUrl');
            $scope.view_timesheeturl = $scope.url + "timesheet/by_project"
            Restangular.all($scope.view_timesheeturl).getList({project_id: $scope.title.id}).then(function (timesheet) {
                console.log(timesheet, "-------->timesheet")
                $scope.timesheet = timesheet;
            })
        }
        $scope.login = function() {
            data = {username: $scope.user.name, password: $scope.user.password}
            $rootScope.url = $scope.domain
            $scope.finalBaseUrl = $rootScope.url + ".ckiller.com:8000/api/rest/"
            localStorageService.set('finalBaseUrl',$scope.finalBaseUrl);
            console.log($scope.finalBaseUrl,"--->baseurl")
            $scope.loginUrl = $scope.finalBaseUrl + "rest-auth/login"
            console.log($scope.loginUrl,"--->login")
            Restangular.all($scope.loginUrl).post(data).then(function (r) {
                var auth = this;
                if (r) {
                    $scope.log_user = true
                    $rootScope.res_key = r.key
                    $http.defaults.headers.common.Authorization = 'Token ' + $rootScope.res_key;
                    localStorageService.set('token',$rootScope.res_key);

                    //chrome.cookies.getAll({}, function (cookie) {
                    //    console.log(cookie.length);
                    //    for(i=0;i<cookie.length;i++){
                    //        console.log(JSON.stringify(cookie[i]));
                    //    }
                    localUrl = 'http://' + $rootScope.url + ".ckiller.com/"
                    chrome.cookies.get({ url: localUrl, name: 'csrftoken' },
                        function (cookie) {
                            if (cookie) {
                                console.log(cookie.value,"yyeeepiiieeeee");
                                $rootScope.res_token = cookie.value
                                console.log($rootScope.res_token)
                                localStorageService.set('X-CSRFToken',$rootScope.res_token);
                                $http.defaults.headers.common["X-CSRFToken"] = $rootScope.res_token
                            }
                            else {
                                console.log('Can\'t get cookie! Check the name!');
                            }
                        });

                    //    console.log(JSON.stringify(cookie[0].value))
                    //    $rootScope.res_token = cookie[0].value
                    //    console.log($rootScope.res_token)
                    //    localStorageService.set('X-CSRFToken',$rootScope.res_token);
                    //    $http.defaults.headers.common["X-CSRFToken"] = $rootScope.res_token
                    //});
                    if ($scope.log_user == true) {



                        $scope.url = localStorageService.get('finalBaseUrl');
                        $scope.view_userUrl = $scope.url + "rest-auth/user"
                        console.log($scope.view_userUrl,"user")
                        $scope.view_Project = $scope.url + "project/by_consultant"
                        $scope.view_timesheeturl = $scope.url + "timesheet/by_project"
                        Restangular.one($scope.view_userUrl).get().then(function (result) {
                            console.log(result,"------>user")
                            console.log(result.id)
                            Restangular.all($scope.view_Project).getList({user_id:result.id}).then(function(project){
                                console.log(JSON.stringify(project),"------------>project")
                                Restangular.all($scope.view_timesheeturl).getList({project_id:project[0].id}).then(function(timesheet){
                                    console.log(timesheet,"-------->timesheet")
                                    $scope.timesheet = timesheet;
                                })

                            })
                        })









                        //$scope.url = localStorageService.get('finalBaseUrl');
                        //$scope.view_timesheetUrl = $scope.url + "timesheet"
                        //console.log($scope.view_timesheetUrl,"viewtimesheet")
                        //Restangular.one($scope.view_timesheetUrl).get().then(function (result) {
                        //    console.log(result, "<<<<<<user")
                        //    $scope.timesheet = result.results
                        //    console.log($scope.timesheet, "aaaaa")
                        //    //if($scope.timesheet.length == 0)
                        //    //{
                        //    //    $scope.url = localStorageService.get('finalBaseUrl');
                        //    //    $scope.logoutUrl = $scope.url + "rest-auth/logout"
                        //    //    console.log($scope.logoutUrl,"logout")
                        //    //    Restangular.all($scope.logoutUrl).post().then(function(path){
                        //    //        delete $http.defaults.headers.common.Authorization;
                        //    //        localStorageService.clearAll();
                        //    //        auth.authenticated = false;
                        //    //    })
                        //    //}
                        //})
                    }
                }
            })
        }
        $scope.logout = function(){
            $scope.log_user = true;
            $scope.image = true;
            $mdDialog.show({
                controller: 'LogoutController',
                templateUrl: "logout.html",
                controllerAs:'vm',
                parent: angular.element(document.body),
                clickOutsideToClose:true,
                fullscreen: $mdMedia('sm')
            });
        }
        $scope.screenshot = function(time){
            $scope.retVal=confirm("Screenshot of the current active screen will be uploaded.Click ok to continue.")
            if($scope.retVal == true){
                $scope.shot = true
                abc = chrome.tabs.captureVisibleTab(null, null, function(dataUrl) {
                    document.getElementById('scid').src = dataUrl;
                    data = {id: time.id, image: dataUrl}
                    $scope.url = localStorageService.get('finalBaseUrl');
                    $scope.view_timesheet_updateUrl = $scope.url + "timesheet/update_timesheet"
                    console.log($scope.view_timesheet_updateUrl,"timesheetupdate")
                    Restangular.all($scope.view_timesheet_updateUrl).post(data).then(function(path){
                        $scope.image = false
                        var index = $scope.timesheet.indexOf(time);
                        $scope.timesheet.splice(index, 1);
                        time.is_timesheet_uploaded = true;
                        $scope.timesheet.unshift(time);

                        //$mdDialog.show({
                        //    controller: 'DialogController',
                        //    templateUrl: "screenshot.html",
                        //    controllerAs:'vm',
                        //    parent: angular.element(document.body),
                        //    clickOutsideToClose:true,
                        //    fullscreen: $mdMedia('sm')
                        //});
                    })
                });
            }
            else{
                $scope.image = false
                //$mdDialog.show({
                //    controller: 'cancelController',
                //    templateUrl: "logout.html",
                //    controllerAs:'vm',
                //    parent: angular.element(document.body),
                //    clickOutsideToClose:true,
                //    fullscreen: $mdMedia('sm')
                //});
            }
        }
    })
    //.controller('DialogController',function ($mdDialog,Restangular,$rootScope,$http,localStorageService) {
    //    var vm = this;
    //    vm.image = true
    //    vm.cancel = function() {
    //        $mdDialog.cancel();
    //    }
    //    //vm.url = localStorageService.get('finalBaseUrl');
    //    //vm.logoutUrl = vm.url + "rest-auth/logout"
    //    //console.log(vm.logoutUrl,"logout")
    //    //Restangular.all(vm.logoutUrl).post().then(function(path){
    //    //    delete $http.defaults.headers.common.Authorization;
    //    //    localStorageService.clearAll();
    //    //    auth.authenticated = false;
    //    //})
    //})
    //.controller('cancelController', function ($mdDialog,Restangular,$rootScope,$http,localStorageService) {
    //    var vm = this;
    //vm.url = localStorageService.get('finalBaseUrl');
    //vm.logoutUrl = vm.url + "rest-auth/logout"
    //console.log(vm.logoutUrl,"logout")
    //Restangular.all(vm.logoutUrl).post().then(function(path){
    //    delete $http.defaults.headers.common.Authorization;
    //    localStorageService.clearAll();
    //    auth.authenticated = false;
    //})
    //})
    .controller("LogoutController",function($mdDialog,Restangular,$rootScope,$http,localStorageService){
        var vm = this;
        vm.url = localStorageService.get('finalBaseUrl');
        vm.logoutUrl = vm.url + "rest-auth/logout"
        console.log(vm.logoutUrl,"logout")
        Restangular.all(vm.logoutUrl).post().then(function(path){
            delete $http.defaults.headers.common.Authorization;
            localStorageService.clearAll();
            auth.authenticated = false;
        })
    })