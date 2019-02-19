import { h } from 'hyperapp';

import FormControl from './FormControl';

const FormGroup = ({ key, label, ...props }) => (
  <div class="form-group">
    <div class="form-label">
      <label for={key}>{label}</label>
    </div>

    <div>
      <FormControl id={key} {...props} />
    </div>
  </div>
);

export default FormGroup;
