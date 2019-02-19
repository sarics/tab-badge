import { h } from 'hyperapp';

import FormControl from './FormControl';

const FormField = ({ key, label, ...props }) => (
  <div class="field is-horizontal">
    <div class="field-label is-normal">
      <label for={key} class="label">
        {label}
      </label>
    </div>

    <div class="field-body">
      <div class="field is-narrow">
        <FormControl id={key} {...props} />
      </div>
    </div>
  </div>
);

export default FormField;
