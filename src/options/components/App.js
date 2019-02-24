import { h } from 'hyperapp';

import Badge from './Badge';
import FormField from './FormField';
import FormControl from './FormControl';

const handleResetClick = (fields, setOptions) => () => {
  const defaultOptions = fields.reduce(
    (opts, { key, defaultValue }) => ({
      ...opts,
      [key]: defaultValue,
    }),
    {},
  );

  setOptions(defaultOptions);
};

const App = () => ({ fields, options, exampleValues }, actions) => (
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

          <FormField>
            <Badge badgeNum={exampleValues.badgeNum} options={options} />
          </FormField>

          <FormField label="Badge number" labelFor="badgeNum">
            <FormControl
              type="number"
              id="badgeNum"
              value={exampleValues.badgeNum}
              onChange={actions.setExampleValue}
            />
          </FormField>

          <hr />

          <h3 class="title is-4">Options</h3>

          {fields.map(({ key, label, ...field }) => (
            <FormField key={key} label={label} labelFor={key}>
              <FormControl
                id={key}
                value={options[key]}
                onChange={actions.saveOption}
                {...field}
              />
            </FormField>
          ))}

          <FormField>
            <button
              class="button is-primary"
              onclick={handleResetClick(fields, actions.setOptions)}
            >
              Reset to defaults
            </button>
          </FormField>
        </div>
      </div>
    </section>
  </div>
);

export default App;
