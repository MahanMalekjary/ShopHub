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
    name: customerName.value,
    phone: customerPhone.value,
    count: customerCount.value,
    debt: customerDebt.value
  };
  let customers = JSON.parse(localStorage.getItem("customers") || "[]");
  customers.push(c);
  localStorage.setItem("customers", JSON.stringify(customers));
  loadCustomers();
}

function loadCustomers() {
  let list = customerList;
  list.innerHTML = "";
  let customers = JSON.parse(localStorage.getItem("customers") || "[]");
  customers.forEach((c, i) => {
    let li = document.createElement("li");
    li.innerHTML = `${c.name} | ${c.phone} | ${c.count} | ${c.debt}
      <button onclick="deleteCustomer(${i})">❌</button>`;
    list.appendChild(li);
  });
}

function deleteCustomer(i) {
  let customers = JSON.parse(localStorage.getItem("customers") || "[]");
  customers.splice(i, 1);
  localStorage.setItem("customers", JSON.stringify(customers));
  loadCustomers();
}

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

function downloadInvoicePDF() {
  const { jsPDF } = window.jspdf;
  let doc = new jsPDF();
  doc.setFont("Vazir");
  doc.setFontSize(14);
  doc.text("فاکتور فروش RAMCO", 105, 15, null, null, "center");
  doc.autoTable({
    html: "#invoiceTable",
    startY: 30,
    styles: { font: "Vazir", halign: 'center' }
  });
  doc.save("invoice.pdf");
}

// سوییچ تب‌ها
function showSection(id) {
  document.querySelectorAll("section").forEach(s => s.style.display = "none");
  document.getElementById(id).style.display = "block";
}
