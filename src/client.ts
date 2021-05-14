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

// noinspection JSUnusedGlobalSymbols

/**
 * Promisified wrapper around {@see createClient}.
 */
export class Client implements EventEmitter {
  private readonly ldapjs: _Client;

  constructor(options: ClientOptions) {
    this.ldapjs = _createClient(options);
  }

  // EventEmitter
  addListener(event: string | symbol, listener: (...args: any[]) => void): this {
    this.ldapjs.addListener(event, listener);
    return this;
  }

  on(event: string | symbol, listener: (...args: any[]) => void): this {
    this.ldapjs.on(event, listener);
    return this;
  }

  once(event: string | symbol, listener: (...args: any[]) => void): this {
    this.ldapjs.once(event, listener);
    return this;
  }

  removeListener(event: string | symbol, listener: (...args: any[]) => void): this {
    this.ldapjs.removeListener(event, listener);
    return this;
  }

  off(event: string | symbol, listener: (...args: any[]) => void): this {
    this.ldapjs.off(event, listener);
    return this;
  }

  removeAllListeners(event?: string | symbol): this {
    this.ldapjs.removeAllListeners(event);
    return this;
  }

  setMaxListeners(n: number): this {
    this.ldapjs.setMaxListeners(n);
    return this;
  }

  getMaxListeners(): number {
    return this.ldapjs.getMaxListeners();
  }

  listeners(event: string | symbol): Function[] {
    return this.ldapjs.listeners(event);
  }

  rawListeners(event: string | symbol): Function[] {
    return this.ldapjs.rawListeners(event);
  }

  emit(event: string | symbol, ...args: any[]): boolean {
    return this.ldapjs.emit(event, ...args);
  }

  listenerCount(event: string | symbol): number {
    return this.ldapjs.listenerCount(event);
  }

  prependListener(event: string | symbol, listener: (...args: any[]) => void): this {
    this.ldapjs.prependListener(event, listener);
    return this;
  }

  prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this {
    this.ldapjs.prependListener(event, listener);
    return this;
  }

  eventNames(): (string | symbol)[] {
    return this.ldapjs.eventNames();
  }

  // ldapjs
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

export interface ClientOptions extends _ClientOptions {
  tlsOptions?: ConnectionOptions;
}

export function createClient(options: ClientOptions) {
  return new Client(options);
}
