import { h } from 'hyperapp';

const getTargetValue = ({ type, value }) => {
  switch (type) {
    case 'number':
      return parseInt(value, 10);
    default:
      return value;
  }
};

const FormControl = ({ type, id, name, value, options, onChange }) => {
  const handleChange = ({ target }) => {
    const newValue = getTargetValue(target);

    if (newValue !== value) onChange({ name: target.name, value: newValue });
  };

  if (type === 'select') {
    return (
      <div class="control">
        <div class="select is-fullwidth">
          <select
            id={id}
            name={name || id}
            value={value}
            onchange={handleChange}
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

  const handleInput = e => {
    if (e.target.value) handleChange(e);
  };

  const handleBlur = e => {
    if (e.target.value) handleChange(e);
    else {
      e.target.value = value;
    }
  };

  return (
    <div class="control">
      <input
        type={type}
        id={id}
        class="input"
        name={name || id}
        value={value}
        oninput={handleInput}
        onblur={handleBlur}
      />
    </div>
  );
};

export default FormControl;
