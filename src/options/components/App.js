import { h } from 'hyperapp';

import {
  STYLE_BORDERED_TEXT,
  STYLE_ROUND_BG_TEXT,
  STYLE_RECT_BG_TEXT,
} from '../../constants/badgeStyles';

import FormField from './FormField';

const OPTIONS = [
  {
    key: 'style',
    label: 'Style',
    type: 'select',
    options: [
      {
        value: STYLE_BORDERED_TEXT,
        label: 'Bordered',
      },
      {
        value: STYLE_ROUND_BG_TEXT,
        label: 'Rounded background',
      },
      {
        value: STYLE_RECT_BG_TEXT,
        label: 'Rectangular background',
      },
    ],
  },
  {
    key: 'fontSize',
    label: 'Font size',
    type: 'number',
  },
];

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
