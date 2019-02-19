const { storage } = browser;

export default {
  setOption: ({ name, value }) => (state, actions) =>
    storage.local.set({ [name]: value }).then(() => {
      actions.set({ name, value });
    }),

  set: ({ name, value }) => state => ({ ...state, [name]: value }),
};
