import { h } from 'hyperapp';

const FormControl = ({ type, id, value, options, onChange }) => {
  const handleChange = e => {
    onChange(e.target);
  };

  if (type === 'select') {
    return (
      <select id={id} name={id} value={value} onchange={handleChange}>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  return null;
};

export default FormControl;
