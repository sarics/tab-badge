import { h } from 'hyperapp';

import {
  STYLE_BORDERED_TEXT,
  STYLE_ROUND_BG_TEXT,
  STYLE_RECT_BG_TEXT,
} from '../../constants/badgeStyles';

import FormGroup from './FormGroup';

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
];

const App = (state, actions) => (
  <div>
    {OPTIONS.map(({ key, ...optCfg }) => (
      <FormGroup
        key={key}
        value={state[key]}
        onChange={actions.setOption}
        {...optCfg}
      />
    ))}
  </div>
);

export default App;
