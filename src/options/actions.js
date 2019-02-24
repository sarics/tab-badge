const { storage } = browser;

export default {
  saveOptions: options => (state, actions) =>
    storage.local.set(options).then(() => {
      actions.setOptions(options);
    }),

  setOptions: options => state => ({
    ...state,
    options: {
      ...state.options,
      ...options,
    },
  }),

  saveOption: ({ name, value }) => (state, actions) =>
    storage.local.set({ [name]: value }).then(() => {
      actions.setOption({ name, value });
    }),

  setOption: ({ name, value }) => state => ({
    ...state,
    options: {
      ...state.options,
      [name]: value,
    },
  }),

  setExampleValue: ({ name, value }) => state => ({
    ...state,
    exampleValues: {
      ...state.exampleValues,
      [name]: value,
    },
  }),
};
