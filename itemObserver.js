function getChromeStorage(key) {
  return new Promise((resolve) => {
    chrome.storage.local.get(null, (data) => {
      resolve(data[key]);
    });
  });
}

function setChromeStorage(key, value) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }, () => {
      resolve();
    });
  });
}

// content.js
function modifyShopNames() {
  // 取得 localStorage 中的 orders
  // getChromeStorage('orders').then((ordersArray) => {
  //   if(!ordersArray) {
  //     return;
  //   }

  //   const titleElements = document.querySelectorAll('div.title.text-primary-color');
      
  //   titleElements.forEach(element => {
  //     const originalText = element.textContent.trim();
  //     const matchedOrder = ordersArray.find(order => originalText.includes(order.storeName));
  //     if (matchedOrder && !originalText.includes('(已吃過)')) {
  //       element.textContent = `${originalText} (已吃過)`;
  //       element.style.color = 'red';
  //     }
  //   });
  // });
}

// 監聽 DOM 變化，以處理動態加載的內容
const itemObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length) {
      console.log("mutation added nodes");
      modifyShopNames();
    }
  });
});

// 開始觀察
itemObserver.observe(document.body, {
  childList: true,
  subtree: true
});

// 初始執行一次
modifyShopNames();