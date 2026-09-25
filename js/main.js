// =========================================================
// Sztuka Lasu — skrypty strony
// =========================================================

// Przełączanie motywu nocny / dzienny.
//
// Pierwsze ustawienie motywu dzieje się w małym skrypcie w <head>
// pliku index.html — tam, żeby strona nie mignęła złymi kolorami.
// Ten plik odpowiada tylko za reakcję na kliknięcie przycisku.

(function () {
  'use strict';

  // <html> — na nim siedzi atrybut data-theme sterujący kolorami.
  var elementHtml = document.documentElement;
  var przycisk = document.getElementById('przelacznik-motywu');

  // Gdyby przycisku nie było (np. na innej podstronie), kończymy
  // bez błędu w konsoli.
  if (!przycisk) {
    return;
  }

  var KLUCZ_ZAPISU = 'motyw';

  // Etykieta zawsze opisuje to, co się stanie PO kliknięciu.
  function aktualizujEtykiete(motyw) {
    przycisk.setAttribute(
      'aria-label',
      motyw === 'dark' ? 'Włącz motyw dzienny' : 'Włącz motyw nocny'
    );
  }

  function ustawMotyw(motyw) {
    elementHtml.setAttribute('data-theme', motyw);
    aktualizujEtykiete(motyw);

    // Zapamiętujemy wybór, żeby przetrwał zamknięcie przeglądarki.
    try {
      localStorage.setItem(KLUCZ_ZAPISU, motyw);
    } catch (blad) {
      // Tryb prywatny lub zablokowane dane stron — motyw zadziała
      // do końca wizyty, tylko nie zostanie zapamiętany.
    }
  }

  // Motyw jest już ustawiony przez skrypt z <head> — tutaj tylko
  // dopasowujemy etykietę przycisku do stanu startowego.
  aktualizujEtykiete(elementHtml.getAttribute('data-theme'));

  przycisk.addEventListener('click', function () {
    var obecny = elementHtml.getAttribute('data-theme');
    ustawMotyw(obecny === 'dark' ? 'light' : 'dark');
  });
})();
