// ============================================================
// Classe Parquimetro: concentra as regras de negócio.
// (Sem recursos muito novos do JS, para rodar em qualquer navegador.)
// ============================================================
class Parquimetro {
  constructor(valorInformado) {
    // Tabela de valores em centavos (evita erros de ponto flutuante).
    // Ordenada do maior para o menor. Ajuste conforme o enunciado original.
    this.tabela = [
      { valor: 300, minutos: 120 },
      { valor: 175, minutos: 60 },
      { valor: 100, minutos: 30 }
    ];

    this.centavosInformados = Math.round(valorInformado * 100);
    this.faixa = this.encontrarFaixa();
  }

  // Maior faixa que o valor pago consegue cobrir (ou null).
  encontrarFaixa() {
    for (let i = 0; i < this.tabela.length; i++) {
      if (this.centavosInformados >= this.tabela[i].valor) {
        return this.tabela[i];
      }
    }
    return null;
  }

  valorSuficiente() {
    return this.faixa !== null;
  }

  calcularTempo() {
    return this.valorSuficiente() ? this.faixa.minutos : 0;
  }

  calcularTroco() {
    if (!this.valorSuficiente()) return 0;
    return (this.centavosInformados - this.faixa.valor) / 100;
  }
}

// ============================================================
// Interface (DOM)
// ============================================================
function formatarReal(numero) {
  return numero.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarRelogio(minutos) {
  const h = String(Math.floor(minutos / 60)).padStart(2, "0");
  const m = String(minutos % 60).padStart(2, "0");
  return h + ":" + m;
}

// Aceita "1,75" e "1.75".
function lerValor(texto) {
  const limpo = texto.trim().replace("R$", "").replace(/\s/g, "").replace(",", ".");
  if (limpo === "" || isNaN(Number(limpo))) return NaN;
  return Number(limpo);
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-parquimetro");
  const input = document.getElementById("valor");
  const visor = document.getElementById("visor");
  const tempo = document.getElementById("tempo");
  const mensagem = document.getElementById("mensagem");
  const atalhos = document.querySelectorAll("[data-valor]");

  function mostrar(estado, relogio, texto) {
    visor.className = "visor " + estado;
    tempo.textContent = relogio;
    mensagem.innerHTML = texto;
  }

  function calcular() {
    const valor = lerValor(input.value);

    if (isNaN(valor) || valor < 0) {
      mostrar("erro", "--:--", "Informe um valor válido, como 1,75.");
      return;
    }

    const parquimetro = new Parquimetro(valor);

    if (!parquimetro.valorSuficiente()) {
      mostrar("erro", "--:--", "Valor insuficiente. O mínimo é R$&nbsp;1,00.");
      return;
    }

    const troco = parquimetro.calcularTroco();
    const textoTroco = troco > 0
      ? "Troco: <strong>" + formatarReal(troco) + "</strong>"
      : "Sem troco.";

    mostrar(
      "ok",
      formatarRelogio(parquimetro.calcularTempo()),
      "Você pode ficar <strong>" + parquimetro.calcularTempo() + " minutos</strong>.<br>" + textoTroco
    );
  }

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    calcular();
  });

  atalhos.forEach(function (botao) {
    botao.addEventListener("click", function () {
      input.value = botao.getAttribute("data-valor");
      calcular();
      input.focus();
    });
  });
});
