
How use:

```

// polyfills.ts
import {CryptoProPlugin} from "./app/plugins/cryptopro";
window["CryptoProPlugin"] = CryptoProPlugin;

// app.component.ts

interface CertList {
    value: string;
    text: string;
}

class AppComponent {

  private crypto;
  
  ngOnInit() {
    const crypto = this.crypto = new CryptoProPlugin();
    
    crypto.then(() => {
      crypto.getCertList().then((certList: CertList) => {
          
          console.log(certList);
                  
      }, (error) => console.error(error));
    }, (error) => console.error(error));
    
  }


}

```

Примечание: файлы async-crypto.es6.js или sync-crypto.js должны успешно подключаться (проверить по Network), лежат относительно в директории js (в конструктор CryptoProPlugin можно передавать директорию где лежат эти файлы)