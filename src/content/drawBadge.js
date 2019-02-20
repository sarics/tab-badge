import {
  STYLE_ROUND_BG_TEXT,
  STYLE_RECT_BG_TEXT,
  STYLE_BORDERED_TEXT,
} from '../constants/badgeStyles';

const CANVAS_SIZE = 16;

const drawRoundBgText = (ctx, badgeNum, { fontSize }) => {
  const BADGE_RADIUS = (fontSize + 1) / 2;
  const BADGE_PADDING_X = 2;

  ctx.font = `bold ${fontSize}px sans-serif`;
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

const drawRectBgText = (ctx, badgeNum, { fontSize }) => {
  const BADGE_HEIGHT = fontSize + 1;
  const BADGE_PADDING_X = 1;

  ctx.font = `bold ${fontSize}px sans-serif`;
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

const drawBorderedText = (ctx, badgeNum, { fontSize }) => {
  const TEXT_BORDER = 1;

  const textX = CANVAS_SIZE - TEXT_BORDER;
  const textY = CANVAS_SIZE - TEXT_BORDER;

  ctx.fillStyle = 'white';
  ctx.font = `${fontSize}px sans-serif`;
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

export default (ctx, badgeNum, options) => {
  switch (options.style) {
    case STYLE_ROUND_BG_TEXT:
      return drawRoundBgText(ctx, badgeNum, options);
    case STYLE_RECT_BG_TEXT:
      return drawRectBgText(ctx, badgeNum, options);
    case STYLE_BORDERED_TEXT:
      return drawBorderedText(ctx, badgeNum, options);
    default:
      return undefined;
  }
};
