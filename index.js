define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Promise = require("es6-promise").Promise;
    var CryptoProPlugin = (function () {
        function CryptoProPlugin(_require) {
            if (_require === void 0) { _require = "js"; }
            this._require = _require;
            this.pathToFileAPI = "cadesplugin-api.js";
            this.pathToChromiumAPI = "async-crypto.es6.js";
            this.pathToFileAPIie = "sync-crypto.js";
            this.isChromium = this.isChromiumBased();
            var pathToFileLib = (this.isChromium ? this.pathToChromiumAPI : this.pathToFileAPIie);
            this.cspAPI = this.scriptLoader([
                _require + "/" + this.pathToFileAPI,
                _require + "/" + pathToFileLib
            ]);
        }
        /**
        * Подгрузка скриптов
        * @param url
        */
        CryptoProPlugin.prototype.scriptLoader = function (url) {
            if (Array.isArray(url)) {
                var self_1 = this, prom_1 = [];
                url.forEach(function (item) {
                    prom_1.push(self_1.scriptLoader(item));
                });
                return Promise.all(prom_1);
            }
            return new Promise(function (resolve, reject) {
                var r = false, scripts = document.getElementsByTagName("script"), t = scripts[scripts.length - 1], s = document.createElement("script");
                s.type = "text/javascript";
                s.src = url;
                s.defer = true;
                s["onload"] = s["onreadystatechange"] = function () {
                    if (!r && (!this.readyState || this.readyState === "complete")) {
                        r = true;
                        resolve(this);
                    }
                };
                s.onerror = s.onabort = reject;
                t.parentNode.insertBefore(s, t.nextSibling);
            });
        };
        CryptoProPlugin.prototype.isChromiumBased = function () {
            var retVal_chrome = navigator.userAgent.match(/chrome/i);
            var retVal_chromeframe = navigator.userAgent.match(/chromeframe/i);
            var isOpera = navigator.userAgent.match(/opr/i);
            var isYaBrowser = navigator.userAgent.match(/YaBrowser/i);
            if (retVal_chrome == null)
                return false;
            else {
                // В Chrome и Opera работаем через асинхронную версию
                if (retVal_chrome.length > 0 || isOpera != null) {
                    return true;
                }
            }
            return false;
        };
        /**
         * Инициализация КриптоПро
         * @param resolve
         * @param reject
         */
        CryptoProPlugin.prototype.then = function (resolve, reject) {
            var _this = this;
            // cadeplugin_api
            this.cspAPI.then(function () { });
            // webkitcrypto || ie
            this.cspAPI.then(function () {
                var csp = window["cadesplugin"];
                if (_this.isChromium) {
                    csp.then(function () { return resolve(csp); }, function (error) { return reject(error); });
                }
                else {
                    window.postMessage("cadesplugin_echo_request", "*");
                    window.addEventListener("message", function (event) {
                        if (event.data === "cadesplugin_loaded") {
                            resolve(cadesplugin);
                        }
                        else if (event.data === "cadesplugin_load_error") {
                            reject("cadesplugin_load_error");
                        }
                        resolve(cadesplugin);
                    }, false);
                }
            }, reject);
        };
        /**
        * Подписание ЭЦП
         * @param certificateName
         * @param encodeString
        */
        CryptoProPlugin.prototype.signature = function (certificateName, encodeString) {
            var _this = this;
            return {
                then: function (resolve, reject) {
                    if (_this.isChromium) {
                        var thenable = window["SignCreate"](certificateName, encodeString);
                        thenable.then(function (result) { return resolve(result); }, function (error) { return reject(error); });
                    }
                    else {
                        try {
                            var result = window["SignCreate"](certificateName, encodeString);
                            if (result === null)
                                reject(result);
                            else
                                resolve(result);
                        }
                        catch (error) {
                            reject(error);
                        }
                    }
                }
            };
        };
        /**
         * Получение списка сертифкатов
         */
        CryptoProPlugin.prototype.getCertList = function () {
            if (this.isChromiumBased()) {
                return new Promise(function (resolve, reject) {
                    window["FillCertList_NPAPI"]().then(function (certList) { return resolve(certList); }, function (error) { return reject(error); });
                });
            }
            else {
                return new Promise(function (resolve, reject) {
                    setTimeout(function () {
                        var certList = window["FillCertList_NPAPI"]();
                        if (typeof certList === "string")
                            reject(certList);
                        else
                            resolve(certList);
                    }, 1000);
                });
            }
        };
        return CryptoProPlugin;
    }());
    exports.CryptoProPlugin = CryptoProPlugin;
});
