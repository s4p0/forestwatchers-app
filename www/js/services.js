(function() {
    'use strict';

    angular.module('myApp.services', [])
    // .factory('cordovaReady', [
    //     function() {
    //         return function(fn) {
    //             var queue = [],
    //                 impl = function() {
    //                     queue.push([].slice.call(arguments));
    //                 };

    //             document.addEventListener('deviceready', function() {
    //                 queue.forEach(function(args) {
    //                     fn.apply(this, args);
    //                 });
    //                 impl = fn;
    //             }, false);

    //             return function() {
    //                 return impl.apply(this, arguments);
    //             };
    //         };
    //     }
    // ])
    .factory('geolocation', function($rootScope, /* cordovaReady, */ $q) {
        return {
            getCurrentPosition: function() {
                var options = {
                    'maximumAge': 3000,
                    'timeout': 10000,
                    'enableHighAccuracy': true
                };
                var deferred = $q.defer();

                navigator.geolocation.getCurrentPosition(
                    function success(values) {
                        deferred.resolve({
                            'location': values,
                            'options': options
                        });
                    },
                    function failed(error) {
                        deferred.reject(error);
                    },
                    options);
                return deferred.promise;
            }
        };
    })
        .factory('mediaCaptureAbstract', function($rootScope, $q) {
            return {
                'abstractCapture': function(captureType, options) {
                    console.log('initiating abstractCapture: ' + JSON.stringify(arguments));
                    var deferred = $q.defer();
                    try {
                        var func = navigator.device.capture[captureType];
                        func.call(null, function success(values) {
                                console.log('abstractCapture resolved to: ' + JSON.stringify(values));
                                deferred.resolve(values);
                            },
                            function failed(error) {
                                console.log('abstractCapture rejected to: ' + JSON.stringify(error));
                                deferred.reject(error);
                            },
                            options);
                    } catch (ex) {
                        console.log('abstractCapture rejected to exp: ' + JSON.stringify(ex));
                        deferred.reject(ex);
                    }
                    console.log('abstractCapture promised ');
                    return deferred.promise;
                }
            };
        })
        .factory('mediaCapture', function($rootScope, mediaCaptureAbstract) {
            return {
                'captureAudio': function(options) {
                    var _options = options || {
                        'limit': 1, // Upper limit of sound clips user can record. Value must be equal or greater than 1.
                        'duration': 0 // Maximum duration of a single sound clip in seconds.
                    };
                    return mediaCaptureAbstract.abstractCapture('captureAudio', _options);
                },
                'captureImage': function(options) {
                    var _options = options || {
                        'limit': 1 //  Value must be equal or greater than 1
                    };
                    console.log('capturing');
                    return mediaCaptureAbstract.abstractCapture('captureImage', _options);
                },
                'captureVideo': function(options) {
                    var _options = options || {
                        'limit': 1, // Upper limit of sound clips user can record. Value must be equal or greater than 1.
                        'duration': 0 // Maximum duration of a single sound clip in seconds.
                    };
                    return mediaCaptureAbstract.abstractCapture('captureVideo', _options);
                },
                'getFormatData': function() {
                    return mediaCaptureAbstract.abstractCapture('getFormatData');
                }

            };
        })
        .factory('localFileReader', function($rootScope, $q) {
            return {
                'fileRead': function(returnType, filePath) {
                    console.log('init fileRead : ' + JSON.stringify({
                        'returnType': returnType,
                        'filePath': filePath
                    }));

                    // defer var to return data
                    // as soon as deferred or rejected
                    var result = $q.defer();

                    // failed async method
                    function fail(error) {
                        console.log('fail: ');
                        result.reject(error);
                    }

                    // success window.requestFileSystem method
                    function gotFS(fileSystem) {
                        console.log(' gotFS : ');
                        fileSystem.root.getFile(filePath, {
                            create: true,
                            exclusive: false
                        }, readFileEntry, fail);
                    }


                    function readFileEntry(fileEntry) {
                        console.log('readFileEntry');
                        fileEntry.file(readData, fail);
                    }

                    function readData(file) {
                        console.log('readData');
                        var fileReader = new FileReader();
                        fileReader.onloadstart = function() {
                            console.log('fileReader started');
                        };
                        fileReader.onloadend = function(evt) {
                            console.log('fileReader loaded');
                            result.resolve(evt.target.result);
                        };
                        fileReader.readAsDataURL(file);
                    }

                    // get access to FileSystem
                    window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0, gotFS, fail);


                    console.log('fileRead promised');
                    return result.promise;
                }
            };
        })
        .factory('localFile', function($rootScope, $q, localFileReader) {
            return {
                'readToData': function(filePath) {
                    console.log('readToData: ' + JSON.stringify(filePath));
                    return localFileReader.fileRead('readAsDataURL', filePath);
                },
                'readToText': function(filePath) {
                    console.log('readToText: ' + JSON.stringify(filePath));
                    return localFileReader.fileRead('readAsText', filePath);
                },
            };
        });

})();