import countBundle from "./count-bundle";

function createStore() {
  const bundles = [countBundle];

  const store = {
    state: {},
  };

  bundles.forEach((bundle) => {
    store.state[bundle.name] = bundle.state;

    Object.keys(bundle).forEach((key) => {
      if (key === "name" || key === "state") {
        return;
      }

      // getters
      if (key.indexOf("get") === 0) {
        store[key] = function () {
          return bundle[key](store.state);
        };
        return;
      }

      // setters
      store[key] = function () {
        const args = [store].concat(Array.from(arguments));
        console.log(args);
        const newState = bundle[key].apply(null, args);
        console.log(newState);
        store.state[bundle.name] = Object.assign(
          {},
          store.state[bundle.name],
          newState
        );
        console.log(store.state);
      };
    });
  });

  return store;
}

export { createStore };
