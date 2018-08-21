// @flow
import { combineReducers } from 'redux-immutable';

export type EntityStoreOptions<Reducer: <T>(T, { type: string }) => T, Sagas> = {
  name?: string,
  setBaseSelectorPath: (Array<String>) => void,
  reducer: Reducer,
  sagas: Sagas,
};

let id = 0;

const noop = () => null;

export class EntityStore {
  injected = false;
  realReducer = <State, Action>(state: State, action: Action): State => state || null;
  reducers = {};
  mainPath = [];
  basePathSettersMap: { [string]: (string | Array<string>) => void } = {};

  name = this.generateName();
  reducer = <State, Action>(state: State, action: Action): State => {
    if (!this.realReducer) {
      throw new Error("Initialization failed. Please send bug report to package's authors");
    }

    return this.realReducer(state, action);
  };
  sagas = [];
  setBaseSelectorPath = (path: string | Array<string>) => {
    if (typeof path === 'string') {
      this.mainPath = path.split('.');
    } else if (Array.isArray(path)) {
      this.mainPath = [...path];
    } else {
      throw new Error(`\`path\` should be a string or instance of Array. You passed "${path}"`);
    }

    Object.entries(this.basePathSettersMap).forEach(([name, setBaseSelectorPath]) => {
      if (typeof setBaseSelectorPath !== 'function') {
        throw new Error('setBaseSelectorPath should be a function');
      }
      setBaseSelectorPath([...path, name]);
    });

    return this;
  };
  setInjected() {
    this.injected = true;
  }

  setName(name: string) {
    if (this.injected) {
      throw new Error(`Can't call EntityStore#setName(name) after injecting it.`);
    }
    this.name = name;

    return this;
  }
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

  generateName() {
    return `entity-${id++}`;
  }
}
