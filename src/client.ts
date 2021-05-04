import { EventEmitter } from 'events';
import {
  CallBack,
  Change,
  Client as _Client,
  ClientOptions as _ClientOptions,
  CompareCallback,
  Control,
  createClient as _createClient,
  Error,
  ErrorCallback,
  SearchCallBack,
  SearchCallbackResponse,
  SearchOptions,
} from 'ldapjs';
import { ConnectionOptions } from 'tls';

/**
 * Promisified wrapper around {@see createClient}.
 */
export class Client extends EventEmitter {
  private readonly ldapjs: _Client;

  constructor(options: ClientOptions) {
    super();
    this.ldapjs = _createClient(options);
  }

  get connected() {
    return this.ldapjs.connected;
  }

  bind(dn: string, password: string, controls?: Control | Control[]) {
    return new Promise((resolve, reject) => {
      const cb: CallBack = (error, result) => {
        if (error) {
          reject(error);
        }

        resolve(result);
      };

      if (!controls) {
        this.ldapjs.bind(dn, password, cb);
      } else {
        this.ldapjs.bind(dn, password, controls, cb);
      }
    });
  }

  add(name: string, entry: Record<string, any>, controls?: Control | Control[]) {
    return new Promise<void>((resolve, reject) => {
      const cb: ErrorCallback = (error) => (!error ? resolve() : reject(error));

      if (!controls) {
        this.ldapjs.add(name, entry, cb);
      } else {
        this.ldapjs.add(name, entry, controls, cb);
      }
    });
  }

  compare(name: string, attr: string, value: string, controls?: Control | Control[]) {
    return new Promise<boolean>((resolve, reject) => {
      const cb: CompareCallback = (error: Error | null, matched?: boolean) => {
        !error ? resolve(matched ?? false) : reject(error);
      };

      if (!controls) {
        this.ldapjs.compare(name, attr, value, cb);
      } else {
        this.ldapjs.compare(name, attr, value, controls, cb);
      }
    });
  }

  del(name: string, controls?: Control | Control[]) {
    return new Promise<void>((resolve, reject) => {
      const cb: ErrorCallback = (error) => (!error ? resolve() : reject(error));

      if (!controls) {
        this.ldapjs.del(name, cb);
      } else {
        this.ldapjs.del(name, controls, cb);
      }
    });
  }

  modify(name: string, change: Change | Change[], controls?: Control | Control[]) {
    return new Promise<void>((resolve, reject) => {
      const cb: ErrorCallback = (error) => (!error ? resolve() : reject(error));

      if (!controls) {
        this.ldapjs.modify(name, change, cb);
      } else {
        this.ldapjs.modify(name, change, controls, cb);
      }
    });
  }

  modifyDN(name: string, newName: string, controls?: Control | Control[]) {
    return new Promise<void>((resolve, reject) => {
      const cb: ErrorCallback = (error) => (!error ? resolve() : reject(error));

      if (controls) {
        this.ldapjs.modifyDN(name, newName, cb);
      } else {
        this.ldapjs.modifyDN(name, newName, controls, cb);
      }
    });
  }

  search(
    base: string,
    options: SearchOptions,
    controls?: Control | Control[],
    _bypass?: boolean,
  ): Promise<SearchCallbackResponse> {
    return new Promise<SearchCallbackResponse>((resolve, reject) => {
      const cb: SearchCallBack = (error, result) => (!error ? resolve(result) : reject(error));

      if (!controls) {
        this.ldapjs.search(base, options, cb, _bypass ?? false);
      } else {
        this.ldapjs.search(base, options, controls, cb, _bypass ?? false);
      }
    });
  }

  starttls(options: Record<string, any>, controls?: Control | Control[], _bypass?: boolean): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const cb: CallBack = (error, result) => (!error ? resolve(result) : reject(error));

      if (!controls) {
        this.ldapjs.starttls(options, [], cb, _bypass ?? false); // @types/ldapjs are wrong here
      } else {
        this.ldapjs.starttls(options, controls, cb, _bypass ?? false);
      }
    });
  }

  unbind(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.ldapjs.unbind((error) => {
        !error ? resolve() : reject(error);
      });
    });
  }

  destroy(err?: any): void {
    return this.ldapjs.destroy(err);
  }
}

interface ClientOptions extends _ClientOptions {
  tlsOptions?: ConnectionOptions;
}

export function createClient(options: ClientOptions) {
  return new Client(options);
}
