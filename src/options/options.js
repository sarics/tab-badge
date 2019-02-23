import { h, app } from 'hyperapp';

import './options.scss';

import OPTIONS from '../constants/options';

import actions from './actions';
import App from './components/App';

const { storage } = browser;

const run = options => {
  const state = {
    fields: OPTIONS,
    options,
  };

  const view = () => <App />;

  app(state, actions, view, document.getElementById('main'));
};

storage.local.get().then(run);
