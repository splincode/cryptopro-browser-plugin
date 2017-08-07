import { Promise } from "es6-promise";
const cadesplugin: any = window['cadesplugin'];

export class CryptoProPlugin {

    private pathToFileAPI = "cadesplugin-api.js";
    private pathToChromiumAPI =  "async-crypto.es6.js";
    private pathToFileAPIie =  "sync-crypto.js";
    private cspAPI;
    private isChromium;

    constructor(public _require: string = "js") {
        this.isChromium = this.isChromiumBased();
        let pathToFileLib = (this.isChromium ? this.pathToChromiumAPI : this.pathToFileAPIie);

        this.cspAPI = this.scriptLoader([
            _require + "/" + this.pathToFileAPI,
            _require + "/" + pathToFileLib
        ]);
    }

    /**
    * Подгрузка скриптов
    * @param url
    */
    private scriptLoader(url) {

        if (Array.isArray(url)) {
            let self = this, prom = [];
            url.forEach(function(item) {
                prom.push(self.scriptLoader(item));
            });
            return Promise.all(prom);
        }

        return new Promise(function (resolve, reject) {
            let r = false,
                scripts = document.getElementsByTagName("script"),
                t = scripts[scripts.length - 1],
                s = document.createElement("script");

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

    }

    private isChromiumBased() {
        let retVal_chrome = navigator.userAgent.match(/chrome/i);
        let retVal_chromeframe = navigator.userAgent.match(/chromeframe/i);
        let isOpera = navigator.userAgent.match(/opr/i);
        let isYaBrowser = navigator.userAgent.match(/YaBrowser/i);

        if (retVal_chrome == null) // В Firefox и IE работаем через NPAPI
            return false;
        else {
            // В Chrome и Opera работаем через асинхронную версию
            if (retVal_chrome.length > 0 || isOpera != null ) {
                return true;
            }
        }
        return false;
    }

    /**
     * Инициализация КриптоПро
     * @param resolve
     * @param reject
     */
    public then(resolve, reject) {
        this.cspAPI.then(() => {});
        this.cspAPI.then(() => {
            let csp = window["cadesplugin"];

            if (this.isChromium) {
                csp.then(
                    () => resolve(csp),
                    (error) => reject(error)
                );
            } else {
                window.addEventListener("message", (event) => {
                    if (event.data === "cadesplugin_loaded") {
                        resolve(cadesplugin);
                    } else if (event.data === "cadesplugin_load_error") {
                        reject("cadesplugin_load_error");
                    }
                    resolve(cadesplugin);
                }, false);
                window.postMessage("cadesplugin_echo_request", "*");
            }

        }, reject);

    }

    /**
    * Подписание ЭЦП
     * @param certificateName
     * @param encodeString
    */
    public signature(certificateName, encodeString) {

        return {
            then: (resolve, reject) => {

                if (this.isChromium) {
                    let thenable = window["SignCreate"](certificateName, encodeString);
                    thenable.then((result) => resolve(result), (error) => reject(error));
                } else {
                    try {
                        let result = window["SignCreate"](certificateName, encodeString);
                        if (result === null) reject(result);
                        else resolve(result);
                    } catch (error) {
                        reject(error);
                    }
                }
            }
        };

    }

    /**
     * Получение списка сертифкатов
     */
    public getCertList() {

        if (this.isChromiumBased()) {
            return new Promise(function (resolve, reject) {
                return window["FillCertList_NPAPI"]().then(
                    (certList) => resolve(certList),
                    (error) => reject(error)
                ).catch(function(e) {
                    console.log(e);
                });
            });
        } else {
            return new Promise(function (resolve, reject) {
                setTimeout(() => {
                    let certList = window["FillCertList_NPAPI"]();
                    if (typeof certList === "string") {
                        reject(certList);
                    } else {
                        resolve(certList);
                    }
                }, 1000);
            }).catch(function(e) {
                console.log(e);
            });
        }

    }

}
