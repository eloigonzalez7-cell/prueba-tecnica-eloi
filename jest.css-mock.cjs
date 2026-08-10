/** Proxy so CSS Modules resolve class names to themselves in Jest. */
module.exports = new Proxy(
  {},
  {
    get(_target, key) {
      if (key === "__esModule") {
        return false;
      }
      return String(key);
    },
  },
);
