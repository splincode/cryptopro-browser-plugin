### КриптоПро ЭЦП Browser plug-in

КриптоПро ЭЦП Browser plug-in предназначен для создания и проверки электронной подписи (ЭП)
 на веб-страницах с использованием СКЗИ "КриптоПро CSP".
 
 ____________
 ![alt](https://www.cryptopro.ru/sites/default/files/images/browser_plug-in_.png)
 ____________
 
 КриптоПро ЭЦП Browser plug-in позволяет подписывать различные типы данных:
 
 электронный документ;
 данные веб-формы;
 файл, загруженный с компьютера пользователя;
 текстовое сообщение и т.п.
 С точки зрения бизнес-функций, плагин позволяет использовать ЭП:
 
 на клиентских порталах;
 в системах интернет-банкинга;
 в электронных офисах с доступом через web и т.п.
 Например: В онлайн-банке подтверждение операции по переводу средств усовершенствованной электронной цифровой подписью обеспечит гарантию того, что счетом распорядился владелец в конкретный (подтвержденный) момент времени и сертификат ключа подписи на момент совершения транзакции был действителен.
 
 КриптоПро ЭЦП Browser plug-in позволяет создавать и проверять как обычную электронную подпись, так и усовершенствованную электронную подпись. Поскольку плагин является частью стандарта применения усовершенствованной электронной цифровой подписи, автоматически решаются задачи:
 
 доказательство момента подписи документа и действительности сертификата ключа подписи на этот момент;
 отсутствие необходимости сетевых (онлайн) обращений при проверке подписи;
 архивное хранение электронных документов.
 Создание и проверка подписи происходят на стороне пользователя. При создании подписи с помощью КриптоПро ЭЦП Browser plug-in, электронная подпись может быть либо добавлена к подписываемым данным (присоединенная ЭП), либо создана отдельно (отделенная ЭП).
 
 КриптоПро ЭЦП Browser plug-in распространяется бесплатно.
 
### 1. Инструкция по настройке рабочего окружения

Для работы КриптоПро ЭЦП Browser plug-in необходимо, чтобы в системе был установлен КриптоПро CSP
и предустановлены сертификаты

#### - Linux

1. Данный пакет проверен на Ubuntu 16.04 x64, до установки необходимо убедиться, что установлены пакеты:
lsb lsb-core alien unzip libssl-dev

2. Для установки запустить

```bash
$ cd gost-browser-installer-ubuntu-x64
$ sudo ./install.sh # для удаления sudo ./uninstall.sh
```

3. В Google Chrome необходимо из магазина установить приложение CryptoPro Extension for CAdES Browser Plug-In

4. Устанавливаем корневой сертификат
http://www.cryptopro.ru/certsrv/certnew.cer?ReqID=CACert&Renewal=0&Enc=bin

~/Downloads/certnew.cer - адрес куда был загружен корневой сертификат

```bash
$ /opt/cprocsp/bin/amd64/certmgr -inst -file ~/Downloads/certnew.cer -store uroot
Certmgr 1.0 (c) "CryptoPro",  2007-2010.
program for managing certificates, CRLs and stores

Install:
=============================================================================
1-------
Issuer              : E=support@cryptopro.ru, C=RU, L=Moscow, O=CRYPTO-PRO LLC, CN=CRYPTO-PRO Test Center 2
Subject             : E=support@cryptopro.ru, C=RU, L=Moscow, O=CRYPTO-PRO LLC, CN=CRYPTO-PRO Test Center 2
Serial              : 0x2B6E3351FD6EB2AD48200203CB5BA141
SHA1 Hash           : 0x046255290b0eb1cdd1797d9ab8c81f699e3687f3
SubjKeyID           : 15317cb08d1ade66d7159c4952971724b9017a83
Signature Algorithm : ГОСТ Р 34.11/34.10-2001
PublicKey Algorithm : ГОСТ Р 34.10-2001 (512 bits)
Not valid before    : 05/08/2014  13:44:24 UTC
Not valid after     : 05/08/2019  13:54:03 UTC
PrivateKey Link     : No                  
=============================================================================

[ErrorCode: 0x00000000]

```

5. Установка тестовых сертификатов на компьютер
Заходим по адресу http://www.cryptopro.ru/certsrv/certrqma.asp

![](https://habrastorage.org/web/c56/dd8/ac0/c56dd8ac0f194001ae6f09c20e2367b9.png)

Выполняем все действия и проверям если все успешно

![](https://habrastorage.org/web/8db/534/a43/8db534a43de04e6e951c43b7fafd2e34.png)

6. Проверям количество установленных сертификатов 
```bash
$ /opt/cprocsp/bin/amd64/certmgr -list # у меня всего 2 сертификата
Certmgr 1.0 (c) "CryptoPro",  2007-2010.
program for managing certificates, CRLs and stores

=============================================================================
1-------
Issuer              : E=support@cryptopro.ru, C=RU, L=Moscow, O=CRYPTO-PRO LLC, CN=CRYPTO-PRO Test Center 2
Subject             : E=omaxphp@yandex.ru, CN=TestSertificateName, O=avkcom.ru, L=Москва, S=Московская, C=RU
Serial              : 0x120020173608A80E6F8F75ED5A000000201736
SHA1 Hash           : 0x5b204d0a195caecb50734418a896cc1287d2ddc7
SubjKeyID           : 9bfa13940a3e1911de1f3860e43bc83c6c8a2a3c
Signature Algorithm : ГОСТ Р 34.11/34.10-2001
PublicKey Algorithm : ГОСТ Р 34.10-2001 (512 bits)
Not valid before    : 05/09/2017  15:45:03 UTC
Not valid after     : 05/12/2017  15:55:03 UTC
PrivateKey Link     : Yes                 
Container           : HDIMAGE\\db666fac.000\0101
Provider Name       : Crypto-Pro GOST R 34.10-2001 Cryptographic Service Provider
Provider Info       : ProvType: 75, KeySpec: 1, Flags: 0x0
CA cert URL         : http://testca.cryptopro.ru/CertEnroll/test-ca-2014_CRYPTO-PRO%20Test%20Center%202.crt
OCSP URL            : http://testca.cryptopro.ru/ocsp/ocsp.srf
CDP                 : http://testca.cryptopro.ru/CertEnroll/CRYPTO-PRO%20Test%20Center%202.crl
Extended Key Usage  : 1.3.6.1.5.5.7.3.2
2-------
Issuer              : E=support@cryptopro.ru, C=RU, L=Moscow, O=CRYPTO-PRO LLC, CN=CRYPTO-PRO Test Center 2
Subject             : CN=demo
Serial              : 0x12001BBAC16C00F8252FCDEEE90000001BBAC1
SHA1 Hash           : 0x5e9096b19c17a5ce9eb5f99894ea6de5a7e61bf2
SubjKeyID           : 25f2bcc895f3e3cfff0c31991134ac735442878c
Signature Algorithm : ГОСТ Р 34.11/34.10-2001
PublicKey Algorithm : ГОСТ Р 34.10-2001 (512 bits)
Not valid before    : 27/04/2017  09:40:47 UTC
Not valid after     : 27/07/2017  09:50:47 UTC
PrivateKey Link     : Yes                 
Container           : HDIMAGE\\d35c50fc.000\630D
Provider Name       : Crypto-Pro GOST R 34.10-2001 Cryptographic Service Provider
Provider Info       : ProvType: 75, KeySpec: 1, Flags: 0x0
CA cert URL         : http://testca.cryptopro.ru/CertEnroll/test-ca-2014_CRYPTO-PRO%20Test%20Center%202.crt
OCSP URL            : http://testca.cryptopro.ru/ocsp/ocsp.srf
CDP                 : http://testca.cryptopro.ru/CertEnroll/CRYPTO-PRO%20Test%20Center%202.crl
Extended Key Usage  : 1.3.6.1.5.5.7.3.2
=============================================================================

[ErrorCode: 0x00000000]

```

#### - Windows

1. Для установки запустите .exe файлы из директории gost-browser-installer-win

2. Устанавливаем корневой сертификат
http://www.cryptopro.ru/certsrv/certnew.cer?ReqID=CACert&Renewal=0&Enc=bin

3. Установка тестовых сертификатов на компьютер
Заходим по адресу http://www.cryptopro.ru/certsrv/certrqma.asp

![](https://habrastorage.org/web/c56/dd8/ac0/c56dd8ac0f194001ae6f09c20e2367b9.png)

Выполняем все действия и проверям если все успешно

![](https://habrastorage.org/web/8db/534/a43/8db534a43de04e6e951c43b7fafd2e34.png)

### 2. Запуск примера на чистом JavaScript (только в Chrome)

1. Необходимо запустить локальный веб-сервер (на python или nodejs, etc)
```bash
cd examples
$ python -m CGIHTTPServer
Serving HTTP on 0.0.0.0 port 8000 ...
```

2. Заходите в браузер по адресу http://localhost:8000/

![](https://habrastorage.org/web/c6a/575/4fd/c6a5754fd2eb452a9fd40d5f6e54025e.png)

3. Если все успешно, нажимаете ОК (для разрешения операции работы с сертификатами на вашем компьютере),
 на экране появится список сертификатов


### 3. Сборка проекта на примере веб-компонентов (Angular, TypeScript)

в разработке...