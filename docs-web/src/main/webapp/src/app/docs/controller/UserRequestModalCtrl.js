'use strict';

angular.module('docs').controller('UserRequestModalCtrl', function($scope, Restangular, $uibModalInstance, $translate, $dialog) {
    $scope.formData = {
        username: '',
        password: '',
        email: ''
    };
    var data = 'username=' + user.username +
        '&password=' + user.password +
        '&email=' + user.email +
        '&storage_quota=' + user.storage_quota;
        var promise = Restangular
        .one('user')
        .one('register_request')
        .customPUT(data, '', {}, { 'Content-Type': 'application/x-www-form-urlencoded' });
    $scope.sendRequest = function () {
        var payload = {
            username: $scope.formData.username,
            password: $scope.formData.password,
            email: $scope.formData.email,
            storage_quota: 100000 * 1000000
        };

        var encoded = Object.keys(payload)
            .map(function (key) {
                return encodeURIComponent(key) + '=' + encodeURIComponent(payload[key]);
            })
            .join('&');

        Restangular
            .one('user/register_request')
            .customPUT(encoded, '', {}, { 'Content-Type': 'application/x-www-form-urlencoded' })
            .then(function () {
                var title = $translate.instant('settings.user.edit.register_request_sent_title');
                var message = $translate.instant('settings.user.edit.register_request_sent_message');
                var buttons = [{ result: 'ok', label: $translate.instant('ok'), cssClass: 'btn-success' }];
                $dialog.messageBox(title, message, buttons);
                $scope.dismiss();
            })
            .catch(function (error) {
                if (error.data.type === 'AlreadyExistingUsername') {
                    var title = $translate.instant('settings.user.edit.edit_user_failed_title');
                    var message = $translate.instant('settings.user.edit.edit_user_failed_message');
                    var buttons = [{ result: 'ok', label: $translate.instant('ok'), cssClass: 'btn-danger' }];
                    $dialog.messageBox(title, message, buttons);
                }
            });
    };

    $scope.dismiss = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
