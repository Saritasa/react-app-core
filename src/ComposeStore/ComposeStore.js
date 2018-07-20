// @flow
let id = 0;

/**
 * ComposeStore Class.
 */
export class ComposeStore {
  injected = false;
  children: { [string]: ComposeStore } = {};
  mainPath = [];
  name = this.generateName();
  basePathUpdateListeners = [];

  /**
   * Set base path.
   *
   * @param {string|Array} path - Path or array of paths.
   * @returns {ComposeStore} This instance for chains.
   */
  setBasePath = (path: string | Array<string>) => {
    if (typeof path === 'string') {
      this.mainPath = path.split('.');
    } else if (Array.isArray(path)) {
      this.mainPath = [...path];
    } else {
      throw new Error(
        `\`path\` should be a string or instance of Array. You passed "${path}"`,
      );
    }

    const { children } = this;

    type Entry = [$Keys<typeof children>, $Values<typeof children>];

    const entries: Array<Entry> = (Object.entries(children): any);

    entries.forEach(([name, child]) => {
      child.setBasePath([...this.mainPath, name]);
    });

    this.basePathUpdateListeners.forEach(cb =>
      cb([...this.mainPath, this.name]),
    );

    return this;
  };

  /**
   * Set injected state to true.
   */
  setInjected() {
    // todo maybe it should returns ComposeStore?
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
        `Can't call ComposeStore#setName(name) after injecting it.`,
      );
    }
    this.name = name;

    return this;
  }

  /**
   * Inject store to children.
   *
   * @param {ComposeStore} store - ComposeStore instance.
   * @returns {ComposeStore} This instance for chains.
   */
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

  /**
   * Generate name from id.
   *
   * @returns {string} Name.
   */
  generateName() {
    // todo maybe it should be static
    return `store-${id++}`;
  }

  /**
   * On base path update event. Creates listener.
   *
   * @param {Function} callback - Callback fot listener.
   */
  onBasePathUpdate(callback: Function) {
    // todo maybe it should returns ComposeStore?
    this.basePathUpdateListeners.push(callback);
    callback([...this.mainPath, this.name]);
  }

  /**
   * Remove base path update listener.
   *
   * @param {Function} callback - Callback which need to remove.
   */
  removeBasePathUpdateListener(callback: *) {
    // todo maybe it should returns ComposeStore?
    this.basePathUpdateListeners = this.basePathUpdateListeners.filter(
      cb => cb !== callback,
    );
  }
}
