let CADESCOM_CADES_X_LONG_TYPE_1 = 0x5d;
let CAPICOM_CURRENT_USER_STORE = 2;
let CAPICOM_MY_STORE = "My";
let CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED = 2;
let CAPICOM_CERTIFICATE_FIND_SUBJECT_NAME = 1;

function GetErrorMessage(e) {
    let err = e.message;
    if (!err) {
        err = e;
    } else if (e.number) {
        err += " (" + e.number + ")";
    }
    return err;
}

function SignCreate(certSubjectName, dataToSign) {

    let oCertificate;
    let oSigner;
    let oSignedData;
    let sSignedMessage;

    let oStore = cadesplugin.CreateObject("CAPICOM.Store");
    oStore.Open(CAPICOM_CURRENT_USER_STORE, CAPICOM_MY_STORE, CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED);

    let oCertificates = oStore.Certificates.Find(CAPICOM_CERTIFICATE_FIND_SUBJECT_NAME, certSubjectName);

    try {

        if (oCertificates.Count == 0) {
            return "Certificate not found: " + certSubjectName;
        }

        oCertificate = oCertificates.Item(1);
        oSigner = cadesplugin.CreateObject("CAdESCOM.CPSigner");
        oSigner.Certificate = oCertificate;
        oSigner.TSAAddress = "http://testca.cryptopro.ru/tsp/";

        oSignedData = cadesplugin.CreateObject("CAdESCOM.CadesSignedData");
        oSignedData.Content = dataToSign;

        sSignedMessage = oSignedData.SignCades(oSigner, CADESCOM_CADES_X_LONG_TYPE_1);

    } catch (err) {
        return "Failed to create signature. Error: " + GetErrorMessage(err);
    }

    oStore.Close();
    return sSignedMessage;
}

function FillCertList_NPAPI() {

    let certList = [];
    let dateObj = new Date();
    let count = 0;
    let text;
    let certCnt;
    let oStore;
    let cert;

    try {
        oStore = cadesplugin.CreateObject("CAdESCOM.Store");
        oStore.Open();
    } catch (ex) {
        return "Ошибка при открытии хранилища: " + GetErrorMessage(ex);
    }

    try {
        certCnt = oStore.Certificates.Count;
        if (certCnt == 0) {
            return certList;
        }

    } catch (ex) {

        let message = GetErrorMessage(ex);
        if ("Cannot find object or property. (0x80092004)" == message ||
            "oStore.Certificates is undefined" == message ||
            "Объект или свойство не найдено. (0x80092004)" == message) {
            oStore.Close();
            return message;
        }
    }

    for (let i = 1; i <= certCnt; i++) {

        try {
            cert = oStore.Certificates.Item(i);
        } catch (ex) {
            return "Ошибка при перечислении сертификатов: " + GetErrorMessage(ex);
        }

        try {

            if (dateObj < cert.ValidToDate && cert.HasPrivateKey() && cert.IsValid().Result) {
                let issuedBy = cert.GetInfo(1);
                issuedBy = issuedBy || "";
                let certObj = new CertificateObj(cert);
                text = certObj.GetCertString();

                certList.push({
                    'value': text.replace(/^cn=([^;]+);.+/i, '$1'),
                    'text': text.replace("CN=", "") + " " + issuedBy
                });

                count++;

            } else { continue; }
        } catch (ex) {
            return "Ошибка при получении свойства SubjectName: " + GetErrorMessage(ex);
        }
    }

    oStore.Close();
    return certList;
}

function CertificateObj(certObj) {
    this.cert = certObj;
    this.certFromDate = new Date(this.cert.ValidFromDate);
    this.certTillDate = new Date(this.cert.ValidToDate);
}

CertificateObj.prototype.check = function (digit) {
    return (digit < 10) ? "0" + digit : digit;
}

CertificateObj.prototype.extract = function (from, what) {
    let certName = "";
    let begin = from.indexOf(what);

    if (begin >= 0) {
        let end = from.indexOf(', ', begin);
        certName = (end < 0) ? from.substr(begin) : from.substr(begin, end - begin);
    }

    return certName;
}

CertificateObj.prototype.DateTimePutTogether = function (certDate) {
    return this.check(certDate.getUTCDate()) + "." + this.check(certDate.getMonth() + 1) + "." + certDate.getFullYear() + " " +
        this.check(certDate.getUTCHours()) + ":" + this.check(certDate.getUTCMinutes()) + ":" + this.check(certDate.getUTCSeconds());
}

CertificateObj.prototype.GetCertString = function () {
    return this.extract(this.cert.SubjectName, 'CN=') + "; Выдан: " + this.GetCertFromDate();
}

CertificateObj.prototype.GetCertFromDate = function () {
    return this.DateTimePutTogether(this.certFromDate);
}

CertificateObj.prototype.GetCertTillDate = function () {
    return this.DateTimePutTogether(this.certTillDate);
}

CertificateObj.prototype.GetPubKeyAlgorithm = function () {
    return this.cert.PublicKey().Algorithm.FriendlyName;
}

CertificateObj.prototype.GetCertName = function () {
    return this.extract(this.cert.SubjectName, 'CN=');
}

CertificateObj.prototype.GetIssuer = function () {
    return this.extract(this.cert.IssuerName, 'CN=');
}

CertificateObj.prototype.GetPrivateKeyProviderName = function () {
    return this.cert.PrivateKey.ProviderName;
}
