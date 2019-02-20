import drawBadge from './drawBadge';

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

const getFaviconImg = dataUrl =>
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

const getFaviconUrl = (img, badgeNum, options) => {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;

  const ctx = canvas.getContext('2d');

  if (img) ctx.drawImage(img, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
  drawBadge(ctx, badgeNum, options);

  let url;
  try {
    url = canvas.toDataURL();
  } catch (err) {
    // console.error(err);
  }

  return url;
};

// init

const setBadgeFavicon = (img, badgeNum, options) => {
  const linkElem = getLinkElem();
  const favIconUrl = getFaviconUrl(img, badgeNum, options);
  linkElem.href = favIconUrl;

  clearIconLinkElems();
  if (!linkElem.parentElement) document.head.appendChild(linkElem);

  browser.runtime.sendMessage({ type: 'SET_END', favIconUrl });
};

const unsetBadgeFavicon = () => {
  const linkElem = getLinkElem();
  const hadLinkElem = !!linkElem.parentElement;

  if (hadLinkElem) document.head.removeChild(linkElem);
  resetIconLinkElems();

  browser.runtime.sendMessage({ type: 'UNSET_END', hadLinkElem });
};

browser.runtime
  .sendMessage({ type: 'START' })
  .then(({ favIconUrl, badgeNum, options }) => {
    if (badgeNum) {
      getFaviconImg(favIconUrl).then(img => {
        setBadgeFavicon(img, badgeNum, options);
      });
    } else {
      unsetBadgeFavicon();
    }
  });
