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

const sendTabData = tabId =>
  new Promise((resolve, reject) => {
    const tabData = tabsData[tabId];
    const sentTabData = sentTabsData[tabId] || {};

    if (
      !tabData ||
      (tabData.badgeNum === sentTabData.badgeNum &&
        tabData.favIconUrl === sentTabData.favIconUrl)
    ) {
      return reject();
    }

    sentTabsData[tabId] = { ...tabData };
    return resolve(tabData);
  });

const clearTabData = tabId => {
  tabsData[tabId] = undefined;
  sentTabsData[tabId] = undefined;
  tabsBadgeFavIcons[tabId] = undefined;
};

tabs.onUpdated.addListener((tabId, changeInfo, tabInfo) => {
  if (tabId === tabs.TAB_ID_NONE) return;

  if (changeInfo.status === 'loading') clearTabData(tabId);

  const tabData = tabsData[tabId] || {};
  const newTabData = { ...tabData };

  if (
    changeInfo.favIconUrl &&
    changeInfo.favIconUrl !== tabsBadgeFavIcons[tabId]
  ) {
    newTabData.favIconUrl = tabInfo.favIconUrl;
  }

  if (changeInfo.title) {
    newTabData.badgeNum = getBadgeNum(changeInfo.title);
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

runtime.onMessage.addListener((message, sender) => {
  const tabId = sender.tab.id;

  if (message.type === 'START') {
    return sendTabData(tabId);
  }

  if (message.type === 'END') {
    tabsBadgeFavIcons[tabId] = message.favIconUrl;
  }

  return false;
});
