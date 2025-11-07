// ============================
// FUNÇÕES GERAIS DO CARRINHO
// ============================

// Pega o carrinho do localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("carrinho") || "[]");
}

// Salva o carrinho no localStorage
function saveCart(cart) {
  localStorage.setItem("carrinho", JSON.stringify(cart));
}

// Atualiza contador do cabeçalho
function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.qtd, 0);
  const el = document.getElementById("cart-count");
  if (el) el.textContent = count;
}

// ============================
// ADICIONAR AO CARRINHO
// ============================
function addToCart(produto, quantidade = 1) {
  let cart = getCart();
  const existente = cart.find(p => p.id === produto.id);

  if (existente) {
    existente.qtd += quantidade;
  } else {
    cart.push({ ...produto, qtd: quantidade });
  }

  saveCart(cart);
  updateCartCount();
  showConfirmation();
}

// Mostra caixa de confirmação
function showConfirmation() {
  const caixa = document.getElementById("caixaConfirmacao");
  if (!caixa) return;

  caixa.style.display = "flex";

  caixa.querySelector(".btn-carrinho").onclick = () => {
    window.location.href = "carrinho.html";
  };
  caixa.querySelector(".btn-continuar").onclick = () => {
    caixa.style.display = "none";
  };
}

// Fecha confirmação
function closeConfirmation() {
  const caixa = document.getElementById("caixaConfirmacao");
  if (caixa) caixa.style.display = "none";
}

// ============================
// RENDERIZAÇÃO DE PRODUTOS (INDEX)
// ============================
function renderProducts(products) {
  const root = document.getElementById("produtos");
  if (!root) return;

  root.innerHTML = "";
  products.forEach(prod => {
    const div = document.createElement("div");
    div.className = "produto bg-white p-3 rounded shadow-sm text-center";
    div.onclick = () => window.location.href = `produto-${prod.id}.html`;
    div.innerHTML = `
      <img src="${prod.img}" alt="${prod.nome}">
      <h4>${prod.nome}</h4>
      <p>${prod.desc || ""}</p>
      <div class="preco fw-bold">R$ ${prod.preco.toFixed(2)}</div>
    `;
    root.appendChild(div);
  });
}

// ============================
// PÁGINA DO PRODUTO
// ============================
function setupProductPage(produtoAtual) {
  const btnAdd = document.getElementById("btnAddCarrinho");
  const inputQtd = document.querySelector(".quantidade input");
  const btnMais = document.querySelector(".quantidade button:last-child");
  const btnMenos = document.querySelector(".quantidade button:first-child");
  const miniaturas = document.querySelectorAll(".galeria img");
  const imgPrincipal = document.querySelector(".imagem-principal img");

  if (btnAdd && inputQtd) {
    btnAdd.addEventListener("click", () => {
      const qtd = parseInt(inputQtd.value) || 1;
      addToCart(produtoAtual, qtd);
    });
  }

  if (btnMais && btnMenos && inputQtd) {
    btnMais.addEventListener("click", () => {
      inputQtd.value = parseInt(inputQtd.value) + 1;
    });
    btnMenos.addEventListener("click", () => {
      if (parseInt(inputQtd.value) > 1) inputQtd.value = parseInt(inputQtd.value) - 1;
    });
  }

  if (miniaturas && imgPrincipal) {
    miniaturas.forEach(img => {
      img.addEventListener("click", () => {
        imgPrincipal.src = img.src;
      });
    });
  }

  // Simulação de cálculo de frete
  const btnFrete = document.querySelector(".frete-input button");
  const inputCep = document.querySelector(".frete-input input");
  if (btnFrete && inputCep) {
    btnFrete.addEventListener("click", () => {
      const cep = inputCep.value.trim();
      if (cep.length >= 8) {
        alert(`Frete para ${cep} calculado: R$ 9,90 (3 a 5 dias úteis)`);
      } else {
        alert("Por favor, digite um CEP válido.");
      }
    });
  }
}

// ============================
// PÁGINA DO CARRINHO
// ============================
function renderCartPage() {
  const cartList = document.getElementById("cart-items");
  if (!cartList) return;

  const cart = getCart();
  cartList.innerHTML = "";

  if (cart.length === 0) {
    cartList.innerHTML = "<p class='text-muted'>Seu carrinho está vazio 😕</p>";
  } else {
    cart.forEach((item, index) => {
      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <img src="${item.img}" alt="${item.nome}">
        <div class="item-info">
          <h5>${item.nome}</h5>
          <p>R$ ${item.preco.toFixed(2)}</p>
        </div>
        <div class="item-actions">
          <div class="qty-controls">
            <button onclick="changeQuantity(${index}, -1)">-</button>
            <span>${item.qtd}</span>
            <button onclick="changeQuantity(${index}, 1)">+</button>
          </div>
          <p class="mt-2 fw-semibold">R$ ${(item.preco * item.qtd).toFixed(2)}</p>
        </div>
      `;
      cartList.appendChild(div);
    });
  }

  updateCartTotals();
}

// Alterar quantidade no carrinho
function changeQuantity(index, delta) {
  let cart = getCart();
  cart[index].qtd += delta;
  if (cart[index].qtd <= 0) cart.splice(index, 1);
  saveCart(cart);
  renderCartPage();
  updateCartCount();
}

// Atualiza subtotal e total
function updateCartTotals() {
  const cart = getCart();
  let subtotal = 0;
  cart.forEach(item => subtotal += item.qtd * item.preco);
  const subEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");
  if (subEl) subEl.textContent = `R$ ${subtotal.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `R$ ${subtotal.toFixed(2)}`;
}

// Finalizar compra
function finalizePurchase() {
  const cart = getCart();
  if (cart.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }
  alert("Compra finalizada com sucesso! Obrigado por comprar na Farma+ 💙");
  localStorage.removeItem("carrinho");
  renderCartPage();
  updateCartCount();
}

// Continuar comprando
function continueShopping() {
  window.location.href = "index.html";
}

// ============================
// INICIALIZAÇÃO
// ============================
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  if (document.getElementById("produtos")) {
    // Exemplo de produtos index, depois você pode gerar dinamicamente
    const produtosIndex = [
      { id: 1, nome: "Dorflex 36 Comprimidos", desc: "Relaxante muscular", preco: 19.90, img: "assets/img/dorflex/dorflex.png" },
      { id: 2, nome: "Protetor Solar La Roche-Posay", desc: "45ml", preco: 109.99, img: "assets/img/protetorsolar.png" }
    ];
    renderProducts(produtosIndex);
  }

  if (document.getElementById("cart-items")) {
    renderCartPage();
  }

  if (document.querySelector(".produto-detalhe")) {
    const produtoAtual = {
      id: 1,
      nome: "Dorflex Analgésico e Relaxante Muscular",
      preco: 18.99,
      img: "assets/img/dorflex/dorflex.png"
    };
    setupProductPage(produtoAtual);
  }
});