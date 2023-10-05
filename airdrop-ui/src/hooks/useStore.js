import { createStore } from "../store";

function getterNameToStateName(name) {
  let newName = name.replace("get", "");
  return newName[0].toLowerCase() + newName.slice(1);
}

console.log("useStore.js: createStore()");
const store = createStore();

export default function useStore(...args) {
  const out = {};

  args.forEach((arg) => {
    if (store[arg] === undefined) {
      throw new Error(`store.${arg} is undefined`);
    }
    if (typeof store[arg] === "function") {
      if (arg.indexOf("get") === 0) {
        out[getterNameToStateName(arg)] = store[arg](store.state);
      } else {
        out[arg] = (...args) => store[arg](store, ...args);
      }
    }
  });

  return out;
}
