'use strict';

angular.module('docs').controller('PendingUserRequestsCtrl', function($scope, Restangular, $translate, $dialog) {
    $scope.pendingList = [];
    $scope.loadError = null;

    function fetchRequests() {
        Restangular.one('user/register_request').get().then(function(res) {
            $scope.pendingList = res.requests || [];
        }).catch(function(err) {
            console.warn('Failed to load registration requests:', err);
            $scope.loadError = $translate.instant('settings.user.registration_requests.load_error');
        });
    }

    $scope.confirmApprove = function(id) {
        var confirmTitle = $translate.instant('settings.user.registration_requests.approve_confirm_title');
        var confirmText = $translate.instant('settings.user.registration_requests.approve_confirm_message');

        $dialog.messageBox(confirmTitle, confirmText, [
            { result: 'cancel', label: $translate.instant('cancel') },
            { result: 'ok', label: $translate.instant('ok'), cssClass: 'btn-primary' }
        ]).result.then(function(result) {
            if (result === 'ok') {
                Restangular.one('user/register_request', id).one('approve').post()
                    .then(fetchRequests)
                    .catch(function(err) {
                        console.warn('Approve failed:', err);
                        $scope.loadError = $translate.instant('settings.user.registration_requests.approve_error');
                    });
            }
        });
    };

    $scope.confirmReject = function(id) {
        var confirmTitle = $translate.instant('settings.user.registration_requests.reject_confirm_title');
        var confirmText = $translate.instant('settings.user.registration_requests.reject_confirm_message');

        $dialog.messageBox(confirmTitle, confirmText, [
            { result: 'cancel', label: $translate.instant('cancel') },
            { result: 'ok', label: $translate.instant('ok'), cssClass: 'btn-warning' }
        ]).result.then(function(result) {
            if (result === 'ok') {
                Restangular.one('user/register_request', id).one('reject').post()
                    .then(fetchRequests)
                    .catch(function(err) {
                        console.warn('Reject failed:', err);
                        $scope.loadError = $translate.instant('settings.user.registration_requests.reject_error');
                    });
            }
        });
    };

    fetchRequests();
});
