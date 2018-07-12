// @flow
let id = 0;

export class ComposeStore {
  injected = false;
  children: { [string]: ComposeStore } = {};
  mainPath = [];
  name = this.generateName();
  basePathUpdateListeners = [];

  setBasePath = (path: string | Array<string>) => {
    if (typeof path === 'string') {
      this.mainPath = path.split('.');
    } else if (Array.isArray(path)) {
      this.mainPath = [...path];
    } else {
      throw new Error(`\`path\` should be a string or instance of Array. You passed "${path}"`);
    }

    const { children } = this;

    type Entry = [$Keys<typeof children>, $Values<typeof children>];

    const entries: Array<Entry> = (Object.entries(children): any);

    entries.forEach(([name, child]) => {
      child.setBasePath([...this.mainPath, name]);
    });

    this.basePathUpdateListeners
      .forEach(cb => cb([...this.mainPath, this.name]));

    return this;
  };

  setInjected() {
    this.injected = true;
  }

  setName(name: string) {
    if (this.injected) {
      throw new Error(`Can't call ComposeStore#setName(name) after injecting it.`);
    }
    this.name = name;

    return this;
  }

  inject(store: ComposeStore) {
    const { name = this.generateName() } = store;

    store.setName(name);

    if (Object.prototype.hasOwnProperty.call(this.children, name)) {
      throw new Error(`Specified name is not unique. Name is "${name}"`);
    }

    store.setInjected();

    this.children[name] = store;

    store.setBasePath([...this.mainPath, name]);

    return this;
  }

  generateName() {
    return `store-${id++}`;
  }

  onBasePathUpdate(callback: *) {
    this.basePathUpdateListeners.push(callback);
    callback([...this.mainPath, this.name]);
  }

  removeBasePathUpdateListener(callback: *) {
    this.basePathUpdateListeners = this.basePathUpdateListeners.filter(cb => cb !== callback);
  }
}
