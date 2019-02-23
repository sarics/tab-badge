import getBadgeCanvas from '../utils/getBadgeCanvas';
import logError from '../utils/logError';

const ICON_LINKS_HREF_DATA_KEY = 'scsTabBadgeOrigHref';
const LINK_ELEM_ID = 'scs-tab-badge-favicon';
const CANVAS_SIZE = 16;

const getLinkElem = () => {
  const selfLinkElem = document.getElementById(LINK_ELEM_ID);
  if (selfLinkElem) return selfLinkElem;

  const linkElem = document.createElement('link');
  linkElem.id = LINK_ELEM_ID;
  linkElem.rel = 'icon';
  linkElem.type = 'image/png';
  linkElem.sizes = '16x16';

  return linkElem;
};

const getIconLinkElems = () => {
  const linkElems = document.head.querySelectorAll('link[rel*="icon"]');
  return Array.from(linkElems).filter(
    linkElem =>
      linkElem.id !== LINK_ELEM_ID &&
      Array.from(linkElem.relList).includes('icon'),
  );
};
const clearIconLinkElems = () => {
  getIconLinkElems().forEach(linkElem => {
    if (linkElem.dataset[ICON_LINKS_HREF_DATA_KEY]) {
      return;
    }

    const { href } = linkElem;
    /* eslint-disable no-param-reassign */
    linkElem.dataset[ICON_LINKS_HREF_DATA_KEY] = href;
    linkElem.href = '';
    /* eslint-enable no-param-reassign */
  });
};
const resetIconLinkElems = () => {
  getIconLinkElems().forEach(linkElem => {
    if (!linkElem.dataset[ICON_LINKS_HREF_DATA_KEY]) {
      return;
    }

    const href = linkElem.dataset[ICON_LINKS_HREF_DATA_KEY];
    /* eslint-disable no-param-reassign */
    delete linkElem.dataset[ICON_LINKS_HREF_DATA_KEY];
    linkElem.href = href;
    /* eslint-enable no-param-reassign */
  });
};

const getFavIconImg = dataUrl =>
  new Promise(resolve => {
    if (!dataUrl) {
      resolve();
      return;
    }

    const handleError = () => resolve();
    const handleImgLoad = e => resolve(e.target);

    const img = new Image();
    img.addEventListener('load', handleImgLoad);
    img.addEventListener('error', handleError);
    img.src = dataUrl;
  });

const getBadgeFavIconUrl = ({ favIconUrl, badgeNum, options }) => {
  if (!badgeNum) return Promise.reject();

  return getFavIconImg(favIconUrl).then(img => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;

    if (img) ctx.drawImage(img, 0, 0, CANVAS_SIZE, CANVAS_SIZE);

    const badgeCanvas = getBadgeCanvas(badgeNum, options);
    ctx.drawImage(
      badgeCanvas,
      CANVAS_SIZE - badgeCanvas.width,
      CANVAS_SIZE - badgeCanvas.height,
    );

    return canvas.toDataURL();
  });
};

// init

const setBadgeFavIcon = favIconUrl => {
  const linkElem = getLinkElem();
  linkElem.href = favIconUrl;

  clearIconLinkElems();
  if (!linkElem.parentElement) document.head.appendChild(linkElem);

  browser.runtime.sendMessage({ type: 'SET_END', favIconUrl });
};

const unsetBadgeFavIcon = err => {
  logError(err);

  const linkElem = getLinkElem();
  const hadLinkElem = !!linkElem.parentElement;

  if (hadLinkElem) document.head.removeChild(linkElem);
  resetIconLinkElems();

  browser.runtime.sendMessage({ type: 'UNSET_END', hadLinkElem });
};

browser.runtime
  .sendMessage({ type: 'START' })
  .then(getBadgeFavIconUrl)
  .then(setBadgeFavIcon)
  .catch(unsetBadgeFavIcon);
