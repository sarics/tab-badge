import {
  STYLE_ROUND_BG_TEXT,
  STYLE_RECT_BG_TEXT,
  STYLE_BORDERED_TEXT,
} from '../constants/badgeStyles';

const getBadgeSize = (ctx, badgeNum, { style, fontSize }) => {
  const height = fontSize + 1;
  const BADGE_PADDING_X = 2;

  const text = ctx.measureText(badgeNum);
  const textWidth = Math.round(text.width);

  switch (style) {
    case STYLE_ROUND_BG_TEXT:
      return {
        width: Math.max(textWidth + BADGE_PADDING_X * 2, height),
        height,
      };
    case STYLE_RECT_BG_TEXT:
      return {
        width: textWidth + BADGE_PADDING_X * 2,
        height,
      };
    case STYLE_BORDERED_TEXT:
      return {
        width: textWidth + 2,
        height,
      };
    default:
      return {
        width: 0,
        height: 0,
      };
  }
};

const drawRoundBgText = (ctx, badgeNum, { width, height }) => {
  const badgeRadius = height / 2;

  const leftArcX = badgeRadius;
  const rightArcX = width - badgeRadius;
  const arcY = badgeRadius;

  const rectX = badgeRadius;
  const rectY = 0;
  const rectWidth = width - badgeRadius * 2;
  const rectHeight = height;

  const textX = width / 2;
  const textY = height - 2;

  ctx.fillStyle = 'red';

  // left arc
  ctx.moveTo(leftArcX, arcY);
  ctx.arc(leftArcX, arcY, badgeRadius, -Math.PI / 2, Math.PI / 2, true);
  ctx.fill();

  // right arc
  ctx.moveTo(rightArcX, arcY);
  ctx.arc(rightArcX, arcY, badgeRadius, -Math.PI / 2, Math.PI / 2, false);
  ctx.fill();

  if (rectWidth > 0) {
    // rect between arcs
    ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
  }

  ctx.fillStyle = 'white';

  // text
  ctx.fillText(badgeNum, textX, textY);
};

const drawRectBgText = (ctx, badgeNum, { width, height }) => {
  const rectX = 0;
  const rectY = 0;
  const rectWidth = width;
  const rectHeight = height;

  const textX = width / 2;
  const textY = height - 2;

  ctx.fillStyle = 'red';

  // rect
  ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

  ctx.fillStyle = 'white';

  // text
  ctx.fillText(badgeNum, textX, textY);
};

const drawBorderedText = (ctx, badgeNum, { width, height }) => {
  const TEXT_BORDER = 1;

  const textX = width / 2;
  const textY = height - 1;

  ctx.fillStyle = 'white';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
  ctx.shadowBlur = 1;

  [[1, 0], [0, -1], [-1, 0], [0, 1]].forEach(([x, y]) => {
    ctx.shadowOffsetX = x * TEXT_BORDER;
    ctx.shadowOffsetY = y * TEXT_BORDER;
    ctx.fillText(badgeNum, textX, textY);
  });
};

const drawBadge = (ctx, badgeNum, { style }, sizes) => {
  switch (style) {
    case STYLE_ROUND_BG_TEXT:
      return drawRoundBgText(ctx, badgeNum, sizes);
    case STYLE_RECT_BG_TEXT:
      return drawRectBgText(ctx, badgeNum, sizes);
    case STYLE_BORDERED_TEXT:
      return drawBorderedText(ctx, badgeNum, sizes);
    default:
      return undefined;
  }
};

export default (badgeNum, options) => {
  const { fontSize } = options;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  ctx.font = `bold ${fontSize}px sans-serif`;

  const { width, height } = getBadgeSize(ctx, badgeNum, options);
  canvas.width = width;
  canvas.height = height;

  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.textAlign = 'center';

  drawBadge(ctx, badgeNum, options, { width, height });

  return canvas;
};
