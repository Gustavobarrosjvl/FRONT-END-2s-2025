  //FUNÇÕES DE CARRINHO
  function carregarCarrinho() {
    const cart = JSON.parse(localStorage.getItem("carrinho")) || [];
    const container = document.getElementById("cart-items");
    container.innerHTML = "";

    if (cart.length === 0) {
      container.innerHTML = "<p class='text-muted'>Seu carrinho está vazio.</p>";
      atualizarTotais();
      return;
    }

    cart.forEach((item, index) => {
      const div = document.createElement("div");
      div.classList.add("cart-item");
      div.innerHTML = `
        <img src="${item.img}" alt="${item.nome}">
        <div class="item-info">
          <h5>${item.nome}</h5>
          <p>R$ ${item.preco.toFixed(2)}</p>
        </div>
        <div class="item-actions">
          <div class="qty-controls">
            <button onclick="alterarQtd(${index}, -1)">-</button>
            <span>${item.qtd}</span>
            <button onclick="alterarQtd(${index}, 1)">+</button>
          </div>
          <p class="mt-2 fw-semibold">R$ ${(item.qtd * item.preco).toFixed(2)}</p>
        </div>
      `;
      container.appendChild(div);
    });

    atualizarTotais();
  }

  function alterarQtd(index, delta) {
    const cart = JSON.parse(localStorage.getItem("carrinho")) || [];
    cart[index].qtd += delta;
    if (cart[index].qtd <= 0) cart.splice(index, 1);
    localStorage.setItem("carrinho", JSON.stringify(cart));
    carregarCarrinho();
  }

  function atualizarTotais() {
    const cart = JSON.parse(localStorage.getItem("carrinho")) || [];
    let subtotal = 0;
    cart.forEach(item => subtotal += item.qtd * item.preco);

    document.getElementById("subtotal").innerText = `R$ ${subtotal.toFixed(2)}`;
    document.getElementById("total").innerText = `R$ ${subtotal.toFixed(2)}`;
  }

    function finalizarCompra() {
      carregarCarrinho();
      window.location.href = "checkout.html"; 
    }

  function continuarComprando() {
    window.location.href = "../index.html";
  }

  window.onload = carregarCarrinho;

//FUNÇÕES DE PRODUTO

  // Produto base
  const produtoDorflex = {
    id: 1,
    nome: "Dorflex Analgésico e Relaxante Muscular",
    preco: 18.99,
    img: "../assets/img/dorflex/dorflex.png"
  };

  // --- BOTÃO ADICIONAR AO CARRINHO ---
  const btnCarrinho = document.getElementById("btnAddCarrinho");
  const caixaConfirmacao = document.getElementById("caixaConfirmacao");

  btnCarrinho.addEventListener("click", () => {
    const qtd = parseInt(document.querySelector(".quantidade input")?.value || 1);
    const produto = { ...produtoDorflex, qtd };

    // Salva no localStorage
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const existente = carrinho.find(p => p.id === produto.id);

    if (existente) {
      existente.qtd += qtd;
    } else {
      carrinho.push(produto);
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));

    // Exibe a confirmação personalizada
    const caixa = document.getElementById("caixaConfirmacao");
    caixa.innerHTML = `
      <div class="conteudo">
        <p>Produto adicionado ao carrinho!</p>
        <div class="botoes">
          <button class="btn-carrinho">Ir para o carrinho</button>
          <button class="btn-continuar">Continuar comprando</button>
        </div>
      </div>
    `;
    caixa.style.display = "flex";

    // Botões da confirmação
    caixa.querySelector(".btn-carrinho").addEventListener("click", () => {
      window.location.href = "carrinho.html";
    });

    caixa.querySelector(".btn-continuar").addEventListener("click", () => {
      caixa.style.display = "none";
    });
  });

  function fecharConfirmacao() {
    caixaConfirmacao.style.display = "none";
  }

  // --- CONTROLE DE QUANTIDADE ---
  const btnMenos = document.querySelector(".quantidade button:first-child");
  const btnMais = document.querySelector(".quantidade button:last-child");
  const inputQtd = document.querySelector(".quantidade input");

  if (btnMenos && btnMais && inputQtd) {
    btnMenos.addEventListener("click", () => {
      let valor = parseInt(inputQtd.value);
      if (valor > 1) inputQtd.value = valor - 1;
    });

    btnMais.addEventListener("click", () => {
      let valor = parseInt(inputQtd.value);
      inputQtd.value = valor + 1;
    });
  }

  // --- GALERIA DE MINIATURAS ---
  const miniaturas = document.querySelectorAll(".galeria img");
  const imgPrincipal = document.querySelector(".imagem-principal img");

  miniaturas.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      imgPrincipal.src = thumb.src;
    });
  });

  // --- SIMULAÇÃO DE CÁLCULO DE FRETE ---
  const btnFrete = document.querySelector(".frete-input button");
  const inputCep = document.querySelector(".frete-input input");

  if (btnFrete && inputCep) {
    btnFrete.addEventListener("click", () => {
      const cep = inputCep.value.trim();
      const infoFrete = document.querySelector(".info-frete");

      if (cep.length >= 8) {
        if (infoFrete) {
          infoFrete.innerHTML = `<p class="text-success mt-2">Frete para <strong>${cep}</strong>: R$ 9,90 (3 a 5 dias úteis)</p>`;
        } else {
          alert(`Frete para ${cep} calculado: R$ 9,90 (3 a 5 dias úteis)`);
        }
      } else {
        alert("Por favor, digite um CEP válido.");
      }
    });
  }