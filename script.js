document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("products")) {
    localStorage.setItem("products", JSON.stringify([]));
  }
  loadCustomers();
  loadProducts();
  loadTodos();
});

// برآورد هزینه
function calcCableCost() {
  let total = 0;
  for (let i = 1; i <= 14; i++) {
    total += Number(document.getElementById(`cost${i}`).value) || 0;
  }
  let suggestedPrice = total + total * 0.25;
  let profit = suggestedPrice - total;
  document.getElementById("result").innerText = `هزینه: ${total} | قیمت پیشنهادی: ${suggestedPrice} | سود: ${profit}`;
}

// مشتری‌ها
function addCustomer() {
  let c = {
    name: document.getElementById("customerFullName").value,
    type: document.getElementById("customerType").value,
    phone: document.getElementById("customerPhone").value,
    address: document.getElementById("customerAddress").value,
    debt: document.getElementById("customerDebt").value
  };
  if (!c.name) {
    alert("نام را وارد کنید");
    return;
  }
  let customers = JSON.parse(localStorage.getItem("customers") || "[]");
  customers.push(c);
  localStorage.setItem("customers", JSON.stringify(customers));
  loadCustomers();
  document.getElementById("customerFullName").value = "";
  document.getElementById("customerType").value = "خریدار";
  document.getElementById("customerPhone").value = "";
  document.getElementById("customerAddress").value = "";
  document.getElementById("customerDebt").value = "";
}

function loadCustomers() {
  let list = document.getElementById("customerList");
  list.innerHTML = "";
  let customers = JSON.parse(localStorage.getItem("customers") || "[]");
  customers.forEach((c, i) => {
    let li = document.createElement("li");
    li.className = "card";
    li.innerHTML = `
      <p><strong>نام: </strong> ${c.name}</p>
      <p><strong>نوع: </strong> ${c.type}</p>
      <p><strong>شماره تماس: </strong> ${c.phone}</p>
      <p><strong>آدرس: </strong> ${c.address}</p>
      <p><strong>بدهی: </strong> ${c.debt} تومان</p>
      <button onclick="deleteCustomer(${i})">❌</button>
    `;
    list.appendChild(li);
  });
}

function deleteCustomer(i) {
  let customers = JSON.parse(localStorage.getItem("customers") || "[]");
  customers.splice(i, 1);
  localStorage.setItem("customers", JSON.stringify(customers));
  loadCustomers();
}

document.getElementById("addCustomerBtn").addEventListener("click", addCustomer);

// انبار
function addProduct() {
  let p = {
    name: productName.value,
    count: Number(productCount.value),
    price: Number(productPrice.value)
  };
  let products = JSON.parse(localStorage.getItem("products") || "[]");
  products.push(p);
  localStorage.setItem("products", JSON.stringify(products));
  loadProducts();
}

function loadProducts() {
  let list = document.getElementById("productList");
  list.innerHTML = "";
  let products = JSON.parse(localStorage.getItem("products") || "[]");
  products.forEach((p, i) => {
    let li = document.createElement("li");
    li.className = "card";
    li.innerHTML = `
      <p><strong>نام کالا: </strong> ${p.name}</p>
      <p><strong>تعداد: </strong> ${p.count}</p>
      <p><strong>قیمت خرید: </strong> ${p.price} تومان</p>
      <button onclick="deleteProduct(${i})">❌ حذف</button>
    `;
    list.appendChild(li);
  });
}

function deleteProduct(i) {
  let products = JSON.parse(localStorage.getItem("products") || "[]");
  products.splice(i, 1);
  localStorage.setItem("products", JSON.stringify(products));
  loadProducts();
}

// تودو لیست
function addTodo() {
  let t = { task: todoTask.value, date: todoDate.value };
  let todos = JSON.parse(localStorage.getItem("todos") || "[]");
  todos.push(t);
  localStorage.setItem("todos", JSON.stringify(todos));
  loadTodos();
}

function loadTodos() {
  let list = document.getElementById("todoList");
  list.innerHTML = "";
  let todos = JSON.parse(localStorage.getItem("todos") || "[]");
  todos.forEach((t, i) => {
    let li = document.createElement("li");
    li.className = "card";
    li.innerHTML = `
      <p><strong>کار: </strong> ${t.task}</p>
      <p><strong>تاریخ: </strong> ${t.date}</p>
      <button class="todoButton" onclick="deleteTodo(${i})">انجام شد</button>
    `;
    list.appendChild(li);
  });
}

function deleteTodo(i) {
  let todos = JSON.parse(localStorage.getItem("todos") || "[]");
  todos.splice(i, 1);
  localStorage.setItem("todos", JSON.stringify(todos));
  loadTodos();
}

// فاکتور
function addInvoiceRow() {
  let products = JSON.parse(localStorage.getItem("products") || "[]");
  let options = products.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
  let tr = document.createElement("tr");
  tr.innerHTML = `
    <td><select>${options}</select></td>
    <td><input type="number" min="1" value="1"></td>
    <td><input type="number" min="0" value="0"></td>
    <td>0</td>
    <td><button class="remove-btn" onclick="this.parentElement.parentElement.remove(); calcInvoice()">❌</button></td>
  `;
  invoiceTable.tBodies[0].appendChild(tr);
  calcInvoice();
}

function calcInvoice() {
  let total = 0, profit = 0;
  let products = JSON.parse(localStorage.getItem("products") || "[]");
  invoiceTable.querySelectorAll("tbody tr").forEach(row => {
    let name = row.cells[0].querySelector("select").value;
    let count = +row.cells[1].querySelector("input").value;
    let sellPrice = +row.cells[2].querySelector("input").value;
    let buyPrice = products.find(p => p.name === name)?.price || 0;
    let totalRow = count * sellPrice;
    row.cells[3].innerText = totalRow;
    total += totalRow;
    profit += (sellPrice - buyPrice) * count;
  });
  totalAmount.innerText = `جمع کل: ${total} تومان`;
  totalProfit.innerText = `سود: ${profit} تومان`;
}

function finalizeInvoice() {
  let products = JSON.parse(localStorage.getItem("products") || "[]");
  invoiceTable.querySelectorAll("tbody tr").forEach(row => {
    let name = row.cells[0].querySelector("select").value;
    let count = +row.cells[1].querySelector("input").value;
    let p = products.find(p => p.name === name);
    p.count -= count;
  });
  localStorage.setItem("products", JSON.stringify(products));
  alert("فاکتور ثبت شد و موجودی به‌روز شد.");
  loadProducts();
  invoiceTable.tBodies[0].innerHTML = "";
  totalAmount.innerText = "";
  totalProfit.innerText = "";
}

async function downloadInvoicePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  // بارگذاری فونت فارسی
  const fontUrl = "https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/ttf/Vazirmatn-Regular.ttf";
  const fontRes = await fetch(fontUrl);
  const fontData = await fontRes.arrayBuffer();
  const fontBase64 = btoa(String.fromCharCode(...new Uint8Array(fontData)));
  doc.addFileToVFS("Vazirmatn.ttf", fontBase64);
  doc.addFont("Vazirmatn.ttf", "Vazir", "normal");
  doc.setFont("Vazir");

  // بارگذاری لوگو
  const imageBlob = await fetch("Image.png").then(r => r.blob());
  const reader = new FileReader();
  reader.readAsDataURL(imageBlob);

  // بعد از بارگذاری کامل تصویر
  reader.onloadend = () => {
    const imgBase64 = reader.result;
    const imgWidth = 40;
    const imgX = (210 - imgWidth) / 2;

    doc.addImage(imgBase64, 'PNG', imgX, 10, imgWidth, 40);
    doc.setFontSize(16);
    doc.text("فاکتور فروش", 105, 40, { align: "center" });

    // حالا ادامه فاکتور
    drawInvoiceContent(doc);
  };
}


function drawInvoiceContent(doc) {
  const date = new Date().toLocaleDateString("fa-IR");
  const invoiceNumber = Math.floor(10000 + Math.random() * 90000);
  const buyerName = document.getElementById("buyerName").value || "بی‌نام";
  const buyerPhone = document.getElementById("buyerPhone").value || "-";
  const buyerAddress = document.getElementById("buyerAddress").value || "-";

  doc.setFontSize(11);
  doc.text(`خریدار: ${buyerName}`, 200 - 10, 65, { align: "right" });
  doc.text(`آدرس خریدار: ${buyerAddress}`, 200 - 10, 72, { align: "right" });
  doc.text(`تلفن خریدار: ${buyerPhone}`, 200 - 10, 79, { align: "right" });

  doc.text(`فروشنده: رامکو`, 200 - 140, 65, { align: "right" });
  doc.text(`آدرس: تهران`, 200 - 140, 72, { align: "right" });
  doc.text(`تلفن: 091230222`, 200 - 140, 79, { align: "right" });
  doc.text(`تاریخ: ${date}`, 200 - 10, 86, { align: "right" });
  doc.text(`شماره فاکتور: ${invoiceNumber}`, 200 - 140, 86, { align: "right" });

  const rows = [];
  let total = 0;
  invoiceTable.querySelectorAll("tbody tr").forEach((row, index) => {
    const name = row.cells[0].querySelector("select").value;
    const count = +row.cells[1].querySelector("input").value;
    const price = +row.cells[2].querySelector("input").value;
    const sum = count * price;
    total += sum;
    rows.push([`${index + 1}`, name, count, price.toLocaleString(), sum.toLocaleString()]);
  });

  doc.autoTable({
    startY: 95,
    head: [['جمع کل', 'قیمت (تومان)', 'تعداد', 'نام کالا', 'ردیف']],
    body: rows.map(r => [r[4], r[3], r[2], r[1], r[0]]),
    styles: { font: 'Vazir', halign: 'right', textDirection: 'rtl' },
    headStyles: { fillColor: [200, 0, 0], halign: 'right' },
    margin: { right: 10, left: 10 }
  });

  const y = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.text(`جمع کل: ${total.toLocaleString()} تومان`, 200 - 10, y, { align: "right" });
  doc.text(`جمع کل به ریال: ${(total * 10).toLocaleString()} ریال`, 200 - 10, y + 8, { align: "right" });
  doc.text(`شماره کارت: 00223234920`, 200 - 10, y + 18, { align: "right" });

  doc.save("invoice.pdf");
}

// سوییچ تب‌ها
function showSection(id) {
  document.querySelectorAll("section").forEach(s => s.style.display = "none");
  document.getElementById(id).style.display = "block";
}
