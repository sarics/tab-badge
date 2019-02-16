(function TabBadge() {
  const CANVAS_SIZE = 32;
  const BADGE_RADIUS = 10;
  const BADGE_PADDING_X = 4;

  const linkElem = document.head.querySelector('link[rel*="icon"]');
  if (!linkElem) return;

  const [, badgeNum] = document.title.match(/\(([1-9]\d*\+?)\)/) || [];
  if (!badgeNum) return;

  const drawBadge = e => {
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;

    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

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
    const textY = CANVAS_SIZE - 9;

    ctx.drawImage(e.target, 0, 0, 32, 32);

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

      img.addEventListener('load', drawBadge);

      img.src = dataUrl;
    })
    .catch(err => {
      console.error(err);
    });
})();
