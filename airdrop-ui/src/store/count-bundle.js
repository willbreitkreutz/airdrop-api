export default {
  name: "counter",

  state: {
    count: 0,
  },

  getCount(state) {
    console.log("trying to get count from", state);
    return state.counter.count;
  },

  increment(store) {
    console.log("trying to increment");
    return {
      count: store.state.counter.count + 1,
    };
  },

  decrement(store) {
    return {
      count: store.state.counter.count - 1,
    };
  },
};
