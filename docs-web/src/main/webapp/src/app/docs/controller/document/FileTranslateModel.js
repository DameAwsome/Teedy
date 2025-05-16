'use strict';

angular.module('docs').controller('FileTranslateModal', function($scope, $uibModalInstance, Restangular, file) {
    $scope.acceptedLanguages = [
      { code: 'EN', name: '英语' },
      { code: 'ZH', name: '简体中文' },
      { code: 'ZH-TW', name: '繁體中文' },
      { code: 'DE', name: '德语' },
      { code: 'FR', name: '法语' },
      { code: 'ES', name: '西班牙语' },
      { code: 'IT', name: '意大利语' },
      { code: 'RU', name: '俄语' }
    ];
    $scope.targetLanguage = 'ZH-CN';
    $scope.isTranslating = false;
    $scope.translatedContent = '';
    $scope.errorMsg = '';
  
    $scope.translate = function() {
      $scope.isTranslating = true;
      $scope.errorMsg = '';
      $scope.translatedContent = '';
      Restangular.one('file', file.id).post('translate', { targetLanguage: $scope.targetLanguage })
        .then(function(resp) {
          $scope.translatedContent = resp.translatedContent;
        })
        .catch(function(err) {
          $scope.errorMsg = (err.data && err.data.message) || '翻译失败';
        })
        .finally(function() {
          $scope.isTranslating = false;
        });
    };
  
    $scope.close = function() {
      $uibModalInstance.close();
    };
  });