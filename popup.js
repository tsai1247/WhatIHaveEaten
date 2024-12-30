class Order {
  constructor(array) {
    this.orderNumber = array[0];
    this.orderDate = array[1];
    this.productDetails = array[2];
    const details = array[2].split('-');
    this.mealTime = details[0];
    this.storeName = details[1];
    this.productItem = details[2];
    this.productPrice = array[3];
    this.quantity = array[4];
    this.subtotal = array[5];
    this.discount = array[6];
    this.total = array[7];
    this.remark = array[8];
  }

  calculateTotal() {
    this.subtotal = this.productPrice * this.quantity;
    this.total = this.subtotal - this.discount;
  }

  updateRemark(newRemark) {
    this.remark = newRemark;
  }
}

function getFileContent(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = function(e) {
      const content = e.target.result;
      resolve(content);
    };
    
    reader.onerror = function(e) {
      reject(new Error(`Error reading file: ${e.target.error}`));
    };
    
    reader.readAsText(file);
  });
}

function getOrder(htmlString) {
  // 創建一個臨時的 DOM 解析器
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  
  // 找出所有表格
  const tables = doc.getElementsByTagName('table');
  const tableArrays = [];
  
  // 遍歷每個表格並轉換為二維陣列
  for (const table of tables) {
    const tableArray = [];
    
    // 處理表格行
    const rows = table.rows;
    for (const row of rows) {
      const rowArray = [];
      const cells = row.cells;
      
      // 處理每個儲存格
      for (const cell of cells) {
        // 移除多餘的空白並存入陣列
        rowArray.push(cell.textContent.trim());
      }
      
      tableArray.push(rowArray);
    }
    
    tableArrays.push(tableArray);
  }

  // 轉換為 Order
  const orders = [];
  for (const tableArray of tableArrays) {
    for (let i = 1; i < tableArray.length; i++) {
      const orderArray = tableArray[i];
      const order = new Order(orderArray);
      order.calculateTotal();
      orders.push(order);
    }
  }

  return orders;
}

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

function saveOrder(ordersArrayToAppend) {
  getChromeStorage('orders').then(
    (ordersArray) => {
      ordersArray = ordersArray ?? [];

      ordersArray = ordersArrayToAppend.reduce( 
        (sum, cur) => {
          if(sum.findIndex((element) => element.orderNumber === cur.orderNumber) === -1) {
            sum.push(cur);
          }
          return sum;
        }, ordersArray
      );
      return ordersArray;
    }
  ).then(
    (newOrdersArray) => {
        setChromeStorage('orders', newOrdersArray)
    }
  )
}

document.getElementById('updateOrdersHistory').addEventListener('click', function(_) {
  const fileInput = document.getElementById('fileInput');
  const files = Array.from(fileInput.files);
  Promise.all(files.map((file) => {
    return getFileContent(file).then(
      (htmlString) => {
        return getOrder(htmlString);
      }
    );
  })).then(( newOrdersArray) => {
    const mergedArray = [].concat(...newOrdersArray);
    saveOrder(mergedArray);
    fileInput.value = null;
  });
});


document.getElementById('clearOrdersHistory').addEventListener('click', async function(event) {
  await setChromeStorage('orders', null);
});



document.getElementById('getOrdersHistory').addEventListener('click', async function(event) {
  const orders = await getChromeStorage('orders');
  if(orders) {
  }
  else {
  }
});
