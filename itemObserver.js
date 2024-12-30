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
  // if find a item with class="ordered-items", return
  if(document.querySelector('.ordered-items-modal')) {
    return;
  }

  // 取得 localStorage 中的 orders
  getChromeStorage('orders').then((ordersArray) => {
    if(!ordersArray) {
      return;
    }
    // find product title class="Product-title
    const productTitle = document.querySelector('h1.Product-title');
    if (!productTitle) {
      return;
    }

    // get all orders in ordersArray where shopName is productTitle.innerText
    const orders = ordersArray.filter((order) => productTitle.innerText.indexOf(order.storeName) !== -1);
    // if orders is not empty
    if(orders.length) {
      // create an info icon button
      const infoButton = document.createElement('button');
      infoButton.innerHTML = 'ℹ️';
      infoButton.style.fontSize = '1em';
      infoButton.style.background = 'none';
      infoButton.style.border = 'none';
      infoButton.style.cursor = 'pointer';
      infoButton.style.position = 'relative';

      // create a modal
      const modal = document.createElement('div');
      modal.classList.add('ordered-items-modal');
      modal.style.position = 'fixed';
      modal.style.top = '50%';
      modal.style.left = '50%';
      modal.style.transform = 'translate(-50%, -50%)';
      modal.style.background = '#fff';
      modal.style.border = '1px solid #ccc';
      modal.style.padding = '20px';
      modal.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
      modal.style.display = 'none';
      modal.style.zIndex = '1000';
      modal.innerHTML = `
        <h3 style="font-size: 1.5em; color: #333; margin-bottom: 10px;">已點過訂單</h3>
        <ul style="list-style-type: none; padding: 0;">
          ${orders.map((order) => `<li style="padding: 5px 0; border-bottom: 1px solid #ccc;">${order.productItem}</li>`).join('')}
        </ul>
        <button id="closeModal" style="margin-top: 10px; padding: 5px 10px; background: #007bff; color: #fff; border: none; cursor: pointer;">Close</button>
      `;

      // show modal on button click
      infoButton.addEventListener('click', () => {
        modal.style.display = 'block';
      });

      // hide modal on close button click
      modal.querySelector('#closeModal').addEventListener('click', () => {
        modal.style.display = 'none';
      });

      // append button and modal to the product title
      if(document.querySelector('.ordered-items-modal')) {
        return;
      }
      productTitle.appendChild(infoButton);
      document.body.appendChild(modal);

      // add a label to the button "show history"
      const label = document.createElement('span');
      label.innerHTML = 'Show history';
      label.style.fontSize = '0.6em';
      label.style.color = '#999';
      label.style.marginLeft = '0px';
      productTitle.appendChild(label);
      
    }
  });
}

// 監聽 DOM 變化，以處理動態加載的內容
const itemObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length) {
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