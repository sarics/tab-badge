const getOptionsConfig = () =>
  browser.runtime.getBackgroundPage().then(bgWindow => bgWindow.OPTIONS);

const getOptions = () => browser.storage.local.get();

const getOptionsFormControlElem = (type, id, value, options) => {
  if (type === 'select') {
    const controlElem = document.createElement('select');
    controlElem.id = id;
    controlElem.className = 'browser-style';

    options.forEach(opt => {
      const optionElem = document.createElement('option');
      optionElem.value = opt.value;
      optionElem.textContent = opt.label;
      optionElem.selected = opt.value === value;

      controlElem.appendChild(optionElem);
    });

    return controlElem;
  }

  return undefined;
};

const handleOptionChange = key => e => {
  const { value } = e.target;

  browser.storage.local.set({ [key]: value });
};

const buildOptionsForm = (optionsConfig, options) => {
  const mainElem = document.getElementById('main');

  optionsConfig.forEach(({ key, label, type, ...rest }) => {
    const formGroupElem = document.createElement('div');

    const labelElem = document.createElement('label');
    labelElem.htmlFor = key;
    labelElem.textContent = `${label}:`;
    formGroupElem.appendChild(labelElem);

    const controlWrapperElem = document.createElement('div');
    controlWrapperElem.className = 'browser-style';

    const controlElem = getOptionsFormControlElem(
      type,
      key,
      options[key],
      rest.options,
    );
    controlElem.addEventListener('change', handleOptionChange(key));

    controlWrapperElem.appendChild(controlElem);
    formGroupElem.appendChild(controlWrapperElem);

    mainElem.appendChild(formGroupElem);
  });
};

Promise.all([getOptionsConfig(), getOptions()]).then(
  ([optionsConfig, options]) => {
    buildOptionsForm(optionsConfig, options);
  },
);
