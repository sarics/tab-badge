import { h } from 'hyperapp';

const FormField = ({ label, labelFor }, children) => (
  <div class="field is-horizontal">
    <div class="field-label is-normal">
      {label && (
        <label for={labelFor} class="label">
          {label}
        </label>
      )}
    </div>

    <div class="field-body">
      <div class="field is-narrow">{children}</div>
    </div>
  </div>
);

export default FormField;
