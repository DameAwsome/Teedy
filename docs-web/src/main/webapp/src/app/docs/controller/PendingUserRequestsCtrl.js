'use strict';

angular.module('docs')
  .controller('PendingRegistrationsCtrl', function($scope, Restangular, $translate, $dialog) {
    $scope.pendingList = [];
    $scope.alertMessage = null;

    // 初始化加载注册请求
    const init = function() {
      fetchPendingRequests();
    };

    // 获取待处理注册列表
    function fetchPendingRequests() {
      Restangular
        .all('user')
        .one('register_request')
        .get()
        .then(function(response) {
          $scope.pendingList = response.requests || [];
          $scope.alertMessage = null;
        })
        .catch(function(error) {
          console.error('无法加载注册请求:', error);
          $scope.alertMessage = $translate.instant('error.load_registration_requests');
        });
    }

    // 统一确认弹窗
    function confirmAction(titleKey, messageKey, onConfirm) {
      const buttons = [
        { result: 'cancel', label: $translate.instant('cancel') },
        { result: 'confirm', label: $translate.instant('ok'), cssClass: 'btn-success' }
      ];
      $dialog.messageBox($translate.instant(titleKey), $translate.instant(messageKey), buttons)
        .result.then(function(choice) {
          if (choice === 'confirm') {
            onConfirm();
          }
        });
    }

    // 执行审批操作
    $scope.handleApproval = function(id) {
      confirmAction('confirm.approve.title', 'confirm.approve.message', function() {
        Restangular
          .all('user')
          .one('register_request', id)
          .all('approve')
          .post()
          .then(fetchPendingRequests)
          .catch(function(err) {
            console.warn('审批失败:', err);
            $scope.alertMessage = $translate.instant('error.approve_failed');
          });
      });
    };

    // 执行拒绝操作
    $scope.handleRejection = function(id) {
      confirmAction('confirm.reject.title', 'confirm.reject.message', function() {
        Restangular
          .all('user')
          .one('register_request', id)
          .all('reject')
          .post()
          .then(fetchPendingRequests)
          .catch(function(err) {
            console.warn('拒绝失败:', err);
            $scope.alertMessage = $translate.instant('error.reject_failed');
          });
      });
    };

    // 执行初始化
    init();
  });
