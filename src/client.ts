import { EventEmitter } from 'events';
import {
  Change,
  Client as _Client,
  ClientOptions as _ClientOptions,
  Control,
  createClient as _createClient,
  Error,
  SearchCallbackResponse,
  SearchOptions,
} from 'ldapjs';
import { ConnectionOptions } from 'tls';

/**
 * Promisified wrapper around {@see createClient}.
 */
class Client extends EventEmitter {
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
      this.ldapjs.bind(dn, password, controls, (error, result) => {
        if (error) {
          reject(error);
        }

        resolve(result);
      });
    });
  }

  add(name: string, entry: Record<string, any>, controls?: Control | Control[]) {
    return new Promise<void>((resolve, reject) => {
      this.ldapjs.add(name, entry, controls, (error) => {
        !error ? resolve() : reject(error);
      });
    });
  }

  compare(name: string, attr: string, value: string, controls?: Control | Control[]) {
    return new Promise<boolean>((resolve, reject) => {
      this.ldapjs.compare(name, attr, value, controls, (error: Error | null, matched?: boolean) => {
        !error ? resolve(matched ?? false) : reject(error);
      });
    });
  }

  del(name: string, controls?: Control | Control[]) {
    return new Promise<void>((resolve, reject) => {
      this.ldapjs.del(name, controls, (error) => {
        !error ? resolve() : reject(error);
      });
    });
  }

  modify(name: string, change: Change | Change[], controls?: Control | Control[]) {
    return new Promise<void>((resolve, reject) => {
      this.ldapjs.modify(name, change, controls, (error) => {
        !error ? resolve() : reject(error);
      });
    });
  }

  modifyDN(name: string, newName: string, controls?: Control | Control[]) {
    return new Promise<void>((resolve, reject) => {
      this.ldapjs.modifyDN(name, newName, controls, (error) => {
        !error ? resolve() : reject(error);
      });
    });
  }

  search(
    base: string,
    options: SearchOptions,
    controls?: Control | Control[],
    _bypass?: boolean,
  ): Promise<SearchCallbackResponse> {
    return new Promise<SearchCallbackResponse>((resolve, reject) => {
      this.ldapjs.search(
        base,
        options,
        controls,
        (error, result) => {
          !error ? resolve(result) : reject(error);
        },
        _bypass ?? false,
      );
    });
  }

  starttls(options: Record<string, any>, controls?: Control | Control[], _bypass?: boolean): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.ldapjs.starttls(
        options,
        controls,
        (error, result) => {
          !error ? resolve(result) : reject(error);
        },
        _bypass ?? false,
      );
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
