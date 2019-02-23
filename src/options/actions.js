const { storage } = browser;

export default {
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
};
