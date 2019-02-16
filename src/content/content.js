(function TabBadge() {
  const CANVAS_SIZE = 16;
  const STYLE_ROUND_BG_TEXT = Symbol('RoundBgText');
  const STYLE_RECT_BG_TEXT = Symbol('RectBgText');
  const STYLE_BORDERED_TEXT = Symbol('BorderedText');

  // TODO make these configurable
  const FONT_SIZE = 9;
  const STYLE = STYLE_RECT_BG_TEXT;

  const linkElem = document.head.querySelector('link[rel*="icon"]');
  if (!linkElem) return;

  const [, badgeNum] = document.title.match(/\(([1-9]\d*\+?)\)/) || [];
  if (!badgeNum) return;

  const drawRoundBgText = ctx => {
    const BADGE_RADIUS = 5;
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

  const drawRectBgText = ctx => {
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

  const drawBorderedText = ctx => {
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

  const drawBadge = ctx => {
    switch (STYLE) {
      case STYLE_ROUND_BG_TEXT:
        return drawRoundBgText(ctx);
      case STYLE_RECT_BG_TEXT:
        return drawRectBgText(ctx);
      case STYLE_BORDERED_TEXT:
        return drawBorderedText(ctx);
      default:
        return undefined;
    }
  };

  const drawFavicon = e => {
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;

    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    ctx.drawImage(e.target, 0, 0, CANVAS_SIZE, CANVAS_SIZE);

    drawBadge(ctx);

    try {
      const url = canvas.toDataURL();
      linkElem.href = url;
    } catch (err) {
      console.error(err);
    }
  };

  browser.runtime
    .sendMessage({ url: linkElem.href })
    .then(dataUrl => {
      const img = new Image();

      img.addEventListener('load', drawFavicon);

      img.src = dataUrl;
    })
    .catch(err => {
      console.error(err);
    });
})();
