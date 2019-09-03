/**
 * Class that generates unique keys for React components and tags that need it.
 */
class KeyGenerator {
  /**
   * constructor for KeyGenerator class.
   */
  constructor() {
    this.uniqueKey = Math.floor(Math.random() * Math.floor(9999999999999999));
  }

  /**
   * Getter for unique keys.
   * @return {number} - the unique key.
   */
  get uniqueKey() {
    this.uniqueKey = this._uniqueKey + 1;
    return this._uniqueKey;
  }

  /**
   * Setter for the unique key.
   * This method is only used by the constructor.
   * @param {number} key - key to set the key to.
   */
  set uniqueKey(key) {
    this._uniqueKey = key;
  }
}

export default KeyGenerator;
