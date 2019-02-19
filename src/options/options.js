import { app } from 'hyperapp';

import actions from './actions';
import App from './components/App';

const { storage } = browser;

const run = options => {
  const state = { ...options };

  app(state, actions, App, document.getElementById('main'));
};

storage.local.get().then(run);
