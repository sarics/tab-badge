import {
  STYLE_BORDERED_TEXT,
  STYLE_ROUND_BG_TEXT,
  STYLE_RECT_BG_TEXT,
} from './badgeStyles';

export default [
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
    defaultValue: STYLE_BORDERED_TEXT,
  },
  {
    key: 'fontSize',
    label: 'Font size',
    type: 'number',
    defaultValue: 9,
  },
];
