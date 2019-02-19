import { h } from 'hyperapp';

const getTargetValue = ({ type, value }) => {
  switch (type) {
    case 'number':
      return parseInt(value, 10);
    default:
      return value;
  }
};

const handleChange = onChange => e => {
  const { name } = e.target;
  const value = getTargetValue(e.target);

  onChange({ name, value });
};

const FormControl = ({ type, id, value, options, onChange }) => {
  if (['text', 'number'].includes(type)) {
    return (
      <div class="control" onchange={handleChange(onChange)}>
        <input type={type} id={id} class="input" name={id} value={value} />
      </div>
    );
  }

  if (type === 'select') {
    return (
      <div class="control">
        <div class="select is-fullwidth">
          <select
            id={id}
            name={id}
            value={value}
            onchange={handleChange(onChange)}
          >
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  return null;
};

export default FormControl;
