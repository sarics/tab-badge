import { h } from 'hyperapp';

import OPTIONS from '../../constants/options';

import FormField from './FormField';

const App = (state, actions) => (
  <div>
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Options</h1>
          <h2 class="subtitle">Tab Badge</h2>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        {OPTIONS.map(({ key, ...optCfg }) => (
          <FormField
            key={key}
            value={state[key]}
            onChange={actions.setOption}
            {...optCfg}
          />
        ))}
      </div>
    </section>
  </div>
);

export default App;
