import { Response } from '@angular/http';
import { Observable } from 'rxjs';

/*
  Generated class for the BaseProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/

const extractError = (error: Response | any): string => {
    //Em um aplicativo do mundo real, podemos usar uma infra-estrutura de log remoto
    let errMsg: string;

    //Estrutura condicional tratamento de erro
    if (error instanceof Response) {
        const body = error.json() || '';
        const err = body.error || JSON.stringify(body);
        errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
        errMsg = error.message ? error.message : error.toString();
    }

    console.error(errMsg);
    return errMsg;
}

export abstract class BaseProvider {

    //Mensagem de erro quando a "Promise" for rejeitada
    protected handlePromiseError(error: Response | any): Promise<string> {
        return Promise.reject(extractError(error));
    }

    //Mensagem de erro quando a "Observable" for rejeitado
    protected handleObservableError(error: Response | any): Observable<any> {
        return Observable.throw(extractError(error));
    }

}
