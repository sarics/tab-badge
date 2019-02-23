import { h } from 'hyperapp';

import './Badge.scss';

import getBadgeCanvas from '../../utils/getBadgeCanvas';

const Badge = ({ badgeNum, options }) => {
  const badgeCanvas = getBadgeCanvas(badgeNum, options);
  const badgeUrl = badgeCanvas.toDataURL();

  return (
    <div class="badge-container">
      <img class="badge" src={badgeUrl} />
    </div>
  );
};

export default Badge;
