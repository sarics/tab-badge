import { h } from 'hyperapp';

const getTargetValue = ({ type, value }) => {
  switch (type) {
    case 'number':
      return parseInt(value, 10);
    default:
      return value;
  }
};

const FormControl = ({ type, id, value, options, onChange }) => {
  const handleChange = e => {
    const { name } = e.target;
    const newValue = getTargetValue(e.target);

    if (newValue !== value) onChange({ name, value: newValue });
  };

  if (['text', 'number'].includes(type)) {
    const handleKeyup = e => {
      if (e.target.type === 'number' && !e.target.value) {
        e.target.value = value;
      } else {
        handleChange(e);
      }
    };

    return (
      <div class="control">
        <input
          type={type}
          id={id}
          class="input"
          name={id}
          value={value}
          onkeyup={handleKeyup}
          onchange={handleChange}
        />
      </div>
    );
  }

  if (type === 'select') {
    return (
      <div class="control">
        <div class="select is-fullwidth">
          <select id={id} name={id} value={value} onchange={handleChange}>
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
