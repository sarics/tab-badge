const { runtime, tabs } = browser;

const MAX_CHARS = 2;

const tabsData = {};
const sentTabsData = {};
const tabsBadgeFavIcons = {};

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

const getBadgeNum = title => {
  const [, titleNum] = title.match(/\((\d+\+?)\)/) || [];
  return titleNum && parseTitleNum(titleNum);
};

const handleStartMessage = tabId => {
  const tabData = tabsData[tabId];
  const sentTabData = sentTabsData[tabId] || {};

  if (
    !tabData ||
    (tabData.badgeNum === sentTabData.badgeNum &&
      tabData.favIconUrl === sentTabData.favIconUrl)
  ) {
    return Promise.reject();
  }

  sentTabsData[tabId] = { ...tabData };
  return Promise.resolve(tabData);
};

const handleSetEndMessage = (tabId, { favIconUrl }) => {
  tabsBadgeFavIcons[tabId] = favIconUrl;

  return false;
};

const handleUnsetEndMessage = (
  tabId,
  { hadLinkElem },
  { favIconUrl, title },
) => {
  tabsBadgeFavIcons[tabId] = undefined;

  if (tabsData[tabId].initial && !hadLinkElem) {
    tabsData[tabId] = {
      favIconUrl,
      badgeNum: getBadgeNum(title),
    };

    tabs.executeScript(tabId, { file: '/content/content.js' });
  }

  return false;
};

const clearTabData = tabId => {
  tabsData[tabId] = undefined;
  sentTabsData[tabId] = undefined;
  tabsBadgeFavIcons[tabId] = undefined;
};

// listeners

runtime.onMessage.addListener((message, { tab }) => {
  const tabId = tab.id;

  switch (message.type) {
    case 'START':
      return handleStartMessage(tabId);
    case 'SET_END':
      return handleSetEndMessage(tabId, message);
    case 'UNSET_END':
      return handleUnsetEndMessage(tabId, message, tab);
    default:
      return false;
  }
});

tabs.onUpdated.addListener((tabId, changeInfo, tabInfo) => {
  if (tabId === tabs.TAB_ID_NONE) return;

  if (changeInfo.status === 'loading') clearTabData(tabId);

  const { initial, ...tabData } = tabsData[tabId] || {};
  const newTabData = { ...tabData };

  if (
    changeInfo.favIconUrl &&
    changeInfo.favIconUrl !== tabsBadgeFavIcons[tabId]
  ) {
    newTabData.favIconUrl = tabInfo.favIconUrl;
  }

  if (initial || changeInfo.title) {
    newTabData.badgeNum = getBadgeNum(tabInfo.title);
  }

  if (
    tabInfo.status === 'complete' &&
    (tabData.badgeNum || newTabData.badgeNum) &&
    (changeInfo.status === 'complete' ||
      tabData.favIconUrl !== newTabData.favIconUrl ||
      tabData.badgeNum !== newTabData.badgeNum)
  ) {
    tabs.executeScript(tabId, { file: '/content/content.js' });
  }

  tabsData[tabId] = newTabData;
});

tabs.onRemoved.addListener(tabId => {
  clearTabData(tabId);
});

// init

tabs.query({ status: 'complete' }).then(allTab => {
  allTab.forEach(({ id, title }) => {
    const badgeNum = getBadgeNum(title);
    if (!badgeNum) return;

    tabsData[id] = {
      initial: true,
      favIconUrl: 'clear',
    };

    tabs.executeScript(id, { file: '/content/content.js' });
  });
});
