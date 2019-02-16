const dataUrls = {};

const toDataURL = url =>
  new Promise((resolve, reject) => {
    if (dataUrls[url]) {
      resolve(dataUrls[url]);
      return;
    }

    const handleReaderLoad = e => {
      dataUrls[url] = e.target.result;
      resolve(dataUrls[url]);
    };

    const handleReqLoad = e => {
      const fileReader = new FileReader();
      fileReader.addEventListener('load', handleReaderLoad);
      fileReader.addEventListener('error', reject);
      fileReader.readAsDataURL(e.target.response);
    };

    const httpRequest = new XMLHttpRequest();
    httpRequest.addEventListener('load', handleReqLoad);
    httpRequest.addEventListener('error', reject);
    httpRequest.open('GET', url);
    httpRequest.responseType = 'blob';
    httpRequest.send();
  });

browser.runtime.onMessage.addListener(message => toDataURL(message.url));
