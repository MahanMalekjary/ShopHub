document.addEventListener("DOMContentLoaded", () => {
if (!localStorage.getItem("products")) {
localStorage.setItem("products", JSON.stringify([]));
}
loadCustomers();
loadProducts();
loadTodos();
});

// بخش برآورد هزینه
function calcCableCost() {
let total = 0;
for (let i = 1; i <= 14; i++) {
total += Number(document.getElementById(`cost${i}`).value) || 0;
}
let suggestedPrice = total + total * 0.25;
let profit = suggestedPrice - total;
document.getElementById("result").innerText = `هزینه: ${total} | قیمت پیشنهادی: ${suggestedPrice} | سود: ${profit}`;
}

// مدیریت مشتری‌ها
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
li.innerHTML = `
${c.name} | ${c.type} | ${c.phone} | ${c.address} | بدهی: ${c.debt} تومان
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

// مدیریت انبار
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
let list = productList;
list.innerHTML = "";
let products = JSON.parse(localStorage.getItem("products") || "[]");
products.forEach((p, i) => {
let li = document.createElement("li");
li.innerHTML = `${p.name} | ${p.count} | ${p.price}
<button onclick="deleteProduct(${i})">❌</button>`;
list.appendChild(li);
});
}

function deleteProduct(i) {
let products = JSON.parse(localStorage.getItem("products") || "[]");
products.splice(i, 1);
localStorage.setItem("products", JSON.stringify(products));
loadProducts();
}

// تودولیست
function addTodo() {
let t = { task: todoTask.value, date: todoDate.value };
let todos = JSON.parse(localStorage.getItem("todos") || "[]");
todos.push(t);
localStorage.setItem("todos", JSON.stringify(todos));
loadTodos();
}

function loadTodos() {
let list = todoList;
list.innerHTML = "";
let todos = JSON.parse(localStorage.getItem("todos") || "[]");
todos.forEach((t, i) => {
let li = document.createElement("li");
li.innerHTML = `${t.task} | ${t.date}
<button onclick="deleteTodo(${i})">❌</button>`;
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
if (count > products.find(p => p.name === name).count) count = products.find(p => p.name === name).count;
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
const response = await fetch(fontUrl);
const fontData = await response.arrayBuffer();
const fontBase64 = btoa(String.fromCharCode(...new Uint8Array(fontData)));

doc.addFileToVFS("Vazirmatn.ttf", fontBase64);
doc.addFont("Vazirmatn.ttf", "Vazir", "normal");
doc.setFont("Vazir");

// تاریخ شمسی
const toPersianDate = () => {
const d = new Date();
const y = d.toLocaleDateString("fa-IR").split("/")[0];
const m = d.toLocaleDateString("fa-IR").split("/")[1].padStart(2, "0");
const day = d.toLocaleDateString("fa-IR").split("/")[2].padStart(2, "0");
return `${y}/${m}/${day}`;
};

const invoiceNumber = Math.floor(10000 + Math.random() * 90000);
const date = toPersianDate();

const buyerName = document.getElementById("buyerName").value || "بی‌نام";
const buyerPhone = document.getElementById("buyerPhone").value || "-";
const buyerAddress = document.getElementById("buyerAddress").value || "-";

doc.setFontSize(14);
doc.text("فاکتور فروش رامکو", 200 - 105, 15, { align: "center" });

// مشخصات
doc.setFontSize(11);
doc.text(`خریدار: ${buyerName}`, 200 - 10, 30, { align: "right" });
doc.text(`آدرس خریدار: ${buyerAddress}`, 200 - 10, 37, { align: "right" });
doc.text(`تلفن خریدار: ${buyerPhone}`, 200 - 10, 44, { align: "right" });

doc.text(`فروشنده: رامکو`, 200 - 140, 30, { align: "right" });
doc.text(`آدرس: تهران`, 200 - 140, 37, { align: "right" });
doc.text(`تلفن: 091230222`, 200 - 140, 44, { align: "right" });
doc.text(`تاریخ: ${date}`, 200 - 10, 51, { align: "right" });
doc.text(`شماره فاکتور: ${invoiceNumber}`, 200 - 140, 51, { align: "right" });

// جدول
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
startY: 60,
head: [['جمع کل', 'قیمت (تومان)', 'تعداد', 'نام کالا', 'ردیف']],
body: rows.map(r => [r[4], r[3], r[2], r[1], r[0]]),
styles: {
font: 'Vazir',
halign: 'right', // محتوا راست‌چین
textDirection: 'rtl'
},
headStyles: {
fillColor: [200, 0, 0],
halign: 'right' // عنوان ستون‌ها هم راست‌چین
},
margin: { right: 10, left: 10 }
});

let finalY = doc.lastAutoTable.finalY || 90;
doc.text(`جمع کل: ${total.toLocaleString()} تومان`, 200 - 10, finalY + 15, { align: "right" });
doc.text(`جمع کل به ریال: ${(total * 10).toLocaleString()} ریال`, 200 - 10, finalY + 22, { align: "right" });
doc.text(`شماره کارت: 00223234920`, 200 - 10, finalY + 32, { align: "right" });

doc.save("invoice.pdf");
}

// نمایش تب‌ها
function showSection(id) {
document.querySelectorAll("section").forEach(s => s.style.display = "none");
document.getElementById(id).style.display = "block";
};
