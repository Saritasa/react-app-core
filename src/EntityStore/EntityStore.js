// @flow
import * as Immutable from 'immutable';
import { combineReducers } from 'redux-immutable';

export type EntityStoreOptions<
  Reducer: <T>(T, { type: string }) => T,
  Sagas,
> = {
  name?: string,
  setBaseSelectorPath: (Array<String>) => void,
  reducer: Reducer,
  sagas: Sagas,
};

let id = 0;

/**
 * Noop function.
 *
 * @returns {null} Just returns null.
 */
const noop = (...rest) => null;
// todo noop uses in one place only.
// todo maybe we should replace this?

const NO_STATE = Immutable.fromJS({});

/**
 * EntityStore Class.
 */
export class EntityStore {
  /**
   * Generate name from id.
   *
   * @returns {string} Name.
   */
  static generateName() {
    return `entity-${id++}`;
  }

  injected = false;
  /**
   * Is used to allow lazy-loading reducers and prevent creating function every time.
   *
   * @param state
   * @param action
   * @returns {State|null}
   */
  realReducer = <State>(state: State = NO_STATE, action: *): State => state;
  reducers = {};
  mainPath = [];
  basePathSettersMap: { [string]: (string | Array<string>) => void } = {};
  deepInjectListeners = [];

  name = EntityStore.generateName();

  /**
   * Reducer.
   *
   * @param {Object} state - React state.
   * @param {Object} action - Redux action.
   * @returns {State} State.
   */
  reducer = <State, Action>(state: State, action: Action): State => {
    if (!this.realReducer) {
      throw new Error(
        "Initialization failed. Please send bug report to package's authors",
      );
    }

    if (state === NO_STATE) {
      return this.realReducer(void 0, action);
    }

    return this.realReducer(state, action);
  };
  sagas = [];

  /**
   * Set base path.
   *
   * @param {string|Array} path - Path or array of paths.
   *
   * @returns {this} This instance for chains.
   */
  setBaseSelectorPath = (path: string | Array<string>) => {
    if (typeof path === 'string') {
      this.mainPath = path.split('.');
    } else if (Array.isArray(path)) {
      this.mainPath = [...path];
    } else {
      throw new Error(
        `\`path\` should be a string or instance of Array. You passed "${path}"`,
      );
    }

    Object.entries(this.basePathSettersMap).forEach(
      ([name, setBaseSelectorPath]) => {
        if (typeof setBaseSelectorPath !== 'function') {
          throw new Error('setBaseSelectorPath should be a function');
        }
        setBaseSelectorPath([...this.mainPath, name]);
      },
    );

    return this;
  };

  /**
   * Set injected state to true.
   */
  setInjected() {
    this.injected = true;
  }

  /**
   * Set name.
   *
   * @param {string} name - New name.
   *
   * @returns {EntityStore} This instance for chains.
   */
  setName(name: string) {
    if (this.injected) {
      throw new Error(
        `Can't call EntityStore#setName(name) after injecting it.`,
      );
    }
    this.name = name;

    return this;
  }

  /**
   * Inject store to children.
   *
   * @param {string} name - Name.
   * @param {Function} reducer - Reducer function.
   * @param {Array} sagas - Array of sagas.
   * @param {Function} setBaseSelectorPath - Function setBaseSelectorPath.
   * @param {Function} setInjected - Function setInjected.
   * @param {Function} subscribeToSagaAppending - Function to allow parent know if new sagas created.
   * @returns {EntityStore} This instance for chains.
   */
  inject({
    name = EntityStore.generateName(),
    reducer,
    sagas,
    setBaseSelectorPath,
    setInjected = noop,
    subscribeToSagaAppending = noop,
  }: *) {
    if (Object.prototype.hasOwnProperty.call(this.reducers, name)) {
      throw new Error(`Specified name is not unique. Name is "${name}"`);
    }

    setInjected();

    this.reducers[name] = reducer;

    sagas.forEach(saga => {
      this.sagas.push(saga);
      this.subscribersToSagaAppending.forEach(callback => callback(saga));
    });

    setBaseSelectorPath([...this.mainPath, name]);

    subscribeToSagaAppending(saga => {
      this.sagas.push(saga);
      this.subscribersToSagaAppending.forEach(callback => callback(saga));
    });

    this.realReducer = combineReducers(this.reducers);

    this.deepInjectListeners.forEach(listener => listener(name));

    return this;
  }

  onDeepInject(callback: string => void) {
    this.deepInjectListeners.push(callback);
  }

  subscribersToSagaAppending: Array<(*) => void> = [];

  subscribeToSagaAppending = (callback: *) => {
    this.subscribersToSagaAppending.push(callback);
  };
}
