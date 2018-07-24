// @flow
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
const noop = () => null;
// todo noop uses in one place only.
// todo maybe we should replace this?

/**
 * EntityStore Class.
 */
export class EntityStore {
  injected = false;
  // todo For what we need realReducer?
  realReducer = <State>(state: State): State => state || null;
  reducers = {};
  mainPath = [];
  basePathSettersMap: { [string]: (string | Array<string>) => void } = {};

  name = this.generateName();

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

    return this.realReducer(state, action);
  };
  sagas = [];

  /**
   * Set base path.
   *
   * @param {string|Array} path - Path or array of paths.
   * @returns {ComposeStore} This instance for chains.
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
        setBaseSelectorPath([...path, name]);
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
   * @returns {ComposeStore} This instance for chains.
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
   * @returns {EntityStore} This instance for chains.
   */
  inject({
    name = this.generateName(),
    reducer,
    sagas,
    setBaseSelectorPath,
    setInjected = noop,
  }: *) {
    if (Object.prototype.hasOwnProperty.call(this.reducers, name)) {
      throw new Error(`Specified name is not unique. Name is "${name}"`);
    }

    setInjected();

    this.reducers[name] = reducer;
    this.sagas.push(...sagas);

    setBaseSelectorPath([...this.mainPath, name]);

    this.realReducer = combineReducers(this.reducers);

    return this;
  }

  /**
   * Generate name from id.
   *
   * @returns {string} Name.
   */
  generateName() {
    // todo maybe it should be static
    return `entity-${id++}`;
  }
}
