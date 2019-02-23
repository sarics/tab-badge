import { h } from 'hyperapp';

import OPTIONS from '../../constants/options';

import Badge from './Badge';
import FormField from './FormField';

const App = ({ options }, actions) => (
  <div>
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title is-3">Options</h1>
          <h2 class="subtitle is-5">Tab Badge</h2>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="box">
          <h3 class="title is-4">Example</h3>

          <div class="field is-horizontal">
            <div class="field-label" />

            <div class="field-body">
              <Badge badgeNum={15} options={options} />
            </div>
          </div>

          <hr />

          <h3 class="title is-4">Options</h3>

          {OPTIONS.map(({ key, ...optCfg }) => (
            <FormField
              key={key}
              value={options[key]}
              onChange={actions.saveOption}
              {...optCfg}
            />
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default App;
