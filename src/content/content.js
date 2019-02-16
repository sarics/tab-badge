(function TabBadge(document, browser) {
  const CANVAS_SIZE = 16;
  const STYLE_ROUND_BG_TEXT = Symbol('RoundBgText');
  const STYLE_RECT_BG_TEXT = Symbol('RectBgText');
  const STYLE_BORDERED_TEXT = Symbol('BorderedText');

  // TODO make these configurable
  const MAX_CHARS = 2;
  const FONT_SIZE = 9;
  const STYLE = STYLE_ROUND_BG_TEXT;

  const createLinkElem = () => {
    const linkElem = document.createElement('link');
    linkElem.rel = 'icon';
    linkElem.type = 'image/png';

    document.head.appendChild(linkElem);

    return linkElem;
  };

  const getLinkElem = () => {
    const linkElems = Array.from(
      document.head.querySelectorAll('link[rel*="icon"]'),
    ).filter(linkElem => Array.from(linkElem.relList).includes('icon'));

    if (!linkElems.length) return createLinkElem();
    if (linkElems.length === 1) return linkElems[0];

    const linkElemsBySize = linkElems.reduce((lEBS, linkElem) => {
      if (!linkElem.sizes.length) return lEBS.concat([[16, linkElem]]);

      const linkElemBySizes = Array.from(linkElem.sizes).map(size => [
        parseInt(size, 10),
        linkElem,
      ]);
      return lEBS.concat(linkElemBySizes);
    }, []);

    const [, linkElemSize16] =
      linkElemsBySize.find(([size]) => size === 16) || [];
    if (linkElemSize16) return linkElemSize16;

    const [[, linkElem]] = linkElemsBySize.sort(
      ([aSize], [bSize]) => aSize - bSize,
    );
    return linkElem;
  };

  const getFaviconImg = url =>
    new Promise(resolve => {
      if (!url) {
        resolve();
        return;
      }

      const handleError = () => resolve();
      const handleImgLoad = e => resolve(e.target);

      const createImg = dataUrl => {
        const img = new Image();
        img.addEventListener('load', handleImgLoad);
        img.addEventListener('error', handleError);
        img.src = dataUrl;
      };

      browser.runtime
        .sendMessage({ url })
        .then(createImg)
        .catch(handleError);
    });

  const parseTitleNum = numStr => {
    const num = parseInt(numStr, 10);
    if (Number.isNaN(num) || num === 0) return undefined;

    const hasPlus = numStr.endsWith('+');
    const maxPlusNum = 10 ** (MAX_CHARS - 1) - 1;
    const maxNum = hasPlus ? maxPlusNum : 10 ** MAX_CHARS - 1;

    if (num > maxNum) return `${maxPlusNum}+`;
    if (hasPlus) return `${num}+`;
    return num.toString();
  };

  const getBadgeNum = titleElem => {
    const [, titleNum] = titleElem.innerText.match(/\((\d+\+?)\)/) || [];
    return titleNum && parseTitleNum(titleNum);
  };

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
    ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
    ctx.shadowBlur = 1;
    ctx.font = `${FONT_SIZE}px sans-serif`;
    ctx.textAlign = 'right';

    [[1, 0], [0, -1], [-1, 0], [0, 1]].forEach(([x, y]) => {
      ctx.shadowOffsetX = x * TEXT_BORDER;
      ctx.shadowOffsetY = y * TEXT_BORDER;
      ctx.fillText(badgeNum, textX, textY);
    });
  };

  const drawBadge = (ctx, badgeNum) => {
    switch (STYLE) {
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

  const setFaviconBadge = (linkElem, titleElem, canvas, img) => {
    const ctx = canvas.getContext('2d');
    const badgeNum = getBadgeNum(titleElem);

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.beginPath();

    if (img) ctx.drawImage(img, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
    if (badgeNum) drawBadge(ctx, badgeNum);

    try {
      const url = canvas.toDataURL();
      linkElem.href = url; // eslint-disable-line no-param-reassign
    } catch (err) {
      console.error(err);
    }
  };

  // init

  const linkElem = getLinkElem();
  const titleElem = document.head.querySelector('title');
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;

  document.body.appendChild(canvas);

  const start = img => {
    setFaviconBadge(linkElem, titleElem, canvas, img);

    const titleObserver = new MutationObserver(() => {
      setFaviconBadge(linkElem, titleElem, canvas, img);
    });

    titleObserver.observe(titleElem, {
      childList: true,
    });
  };

  getFaviconImg(linkElem.href).then(start);
})(document, browser);
