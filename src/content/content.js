(function TabBadge() {
  const ICON_LINKS_HREF_DATA_KEY = 'scsTabBadgeOrigHref';
  const LINK_ELEM_ID = 'scs-tab-badge-favicon';
  const CANVAS_SIZE = 16;
  const STYLE_ROUND_BG_TEXT = 'STYLE_ROUND_BG_TEXT';
  const STYLE_RECT_BG_TEXT = 'STYLE_RECT_BG_TEXT';
  const STYLE_BORDERED_TEXT = 'STYLE_BORDERED_TEXT';

  // TODO make these configurable
  const FONT_SIZE = 9;

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

  const drawRoundBgText = (ctx, badgeNum) => {
    const BADGE_RADIUS = (FONT_SIZE + 1) / 2;
    const BADGE_PADDING_X = 2;

    ctx.font = `bold ${FONT_SIZE}px sans-serif`;
    ctx.textAlign = 'center';

    const text = ctx.measureText(badgeNum);
    const textWidth = Math.round(text.width);

    const leftArcX = Math.min(
      CANVAS_SIZE - BADGE_RADIUS,
      CANVAS_SIZE - textWidth - BADGE_PADDING_X * 2 + BADGE_RADIUS,
    );
    const rightArcX = CANVAS_SIZE - BADGE_RADIUS;
    const arcY = CANVAS_SIZE - BADGE_RADIUS;

    const rectX = leftArcX;
    const rectY = CANVAS_SIZE - BADGE_RADIUS * 2;
    const rectWidth = rightArcX - leftArcX;
    const rectHeight = BADGE_RADIUS * 2;

    const textX = leftArcX + rectWidth / 2;
    const textY = CANVAS_SIZE - 2;

    ctx.fillStyle = 'red';

    // left arc
    ctx.moveTo(leftArcX, arcY);
    ctx.arc(leftArcX, arcY, BADGE_RADIUS, -Math.PI / 2, Math.PI / 2, true);
    ctx.fill();

    // right arc
    ctx.moveTo(rightArcX, arcY);
    ctx.arc(rightArcX, arcY, BADGE_RADIUS, -Math.PI / 2, Math.PI / 2, false);
    ctx.fill();

    // rect between arcs
    ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

    ctx.fillStyle = 'white';

    // text
    ctx.fillText(badgeNum, textX, textY);
  };

  const drawRectBgText = (ctx, badgeNum) => {
    const BADGE_HEIGHT = FONT_SIZE + 1;
    const BADGE_PADDING_X = 1;

    ctx.font = `bold ${FONT_SIZE}px sans-serif`;
    ctx.textAlign = 'right';

    const text = ctx.measureText(badgeNum);
    const textWidth = Math.round(text.width);

    const rectX = CANVAS_SIZE - BADGE_PADDING_X * 2 - textWidth;
    const rectY = CANVAS_SIZE - BADGE_HEIGHT;
    const rectWidth = BADGE_PADDING_X * 2 + textWidth;
    const rectHeight = BADGE_HEIGHT;

    const textX = CANVAS_SIZE - BADGE_PADDING_X;
    const textY = CANVAS_SIZE - 2;

    ctx.fillStyle = 'red';

    // rect
    ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

    ctx.fillStyle = 'white';

    // text
    ctx.fillText(badgeNum, textX, textY);
  };

  const drawBorderedText = (ctx, badgeNum) => {
    const TEXT_BORDER = 1;

    const textX = CANVAS_SIZE - TEXT_BORDER;
    const textY = CANVAS_SIZE - TEXT_BORDER;

    ctx.fillStyle = 'white';
    ctx.font = `${FONT_SIZE}px sans-serif`;
    ctx.textAlign = 'right';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
    ctx.shadowBlur = 1;

    [[1, 0], [0, -1], [-1, 0], [0, 1]].forEach(([x, y]) => {
      ctx.shadowOffsetX = x * TEXT_BORDER;
      ctx.shadowOffsetY = y * TEXT_BORDER;
      ctx.fillText(badgeNum, textX, textY);
    });

    ctx.shadowColor = 'rgba(0, 0, 0, 0)';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  };

  const drawBadge = (ctx, badgeNum, options) => {
    switch (options.style) {
      case STYLE_ROUND_BG_TEXT:
        return drawRoundBgText(ctx, badgeNum);
      case STYLE_RECT_BG_TEXT:
        return drawRectBgText(ctx, badgeNum);
      case STYLE_BORDERED_TEXT:
        return drawBorderedText(ctx, badgeNum);
      default:
        return undefined;
    }
  };

  const getFaviconUrl = (img, badgeNum, options) => {
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;

    const ctx = canvas.getContext('2d');

    if (img) ctx.drawImage(img, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
    if (badgeNum) drawBadge(ctx, badgeNum, options);

    let url;
    try {
      url = canvas.toDataURL();
    } catch (err) {
      console.error(err);
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
})();
