# sztukalasu.pl

## Czym jest ten projekt

Strona-galeria rzeźb w drewnie autorstwa mamy właściciela projektu.

To **nie jest sklep**. To wirtualna wystawa w klimacie paryskiej galerii sztuki:
spokojna, z dużą ilością przestrzeni, gdzie prace mają się bronić same.

### Motyw przewodni: drugie życie drewna

Rzeźby powstają z odłamków i gałęzi zebranych w lesie — z drewna spisanego na
stratę, które dostaje drugie życie. Ten motyw jest osią całej narracji strony
i powinien wracać w tekstach, nazewnictwie i tonie.

### Metryka drewna

Każda rzeźba ma swoją **metrykę drewna**: gatunek drewna oraz pochodzenie
fragmentu. To element wyróżniający galerię — traktować jak pełnoprawną część
prezentacji dzieła, nie jak drobny dopisek.

### Zamówienia

Przez **formularz prośby o wycenę**. Bez koszyka, bez cen w kafelkach, bez
płatności online. Formularz obsługuje Netlify Forms.

## Technologia

- Czysty **HTML**, **CSS** i odrobina **JavaScriptu**.
- **Bez frameworków** (bez Reacta, Vue, Bootstrapa, Tailwinda, npm, systemów budowania).
- Hosting: **Netlify** (formularze przez Netlify Forms).
- Domena: **Hostinger** (DNS wskazuje na Netlify).
- Język strony: **polski** (`<html lang="pl">`, polskie nazwy w treści).

## Struktura plików

```
index.html        strona główna
css/style.css     wygląd
js/main.js        interakcje
images/           zdjęcia rzeźb
```

## Decyzje projektowe

### Motywy kolorystyczne

Dwa motywy przełączane atrybutem `data-theme` na `<html>`:

| Rola             | nocny (`dark`) | dzienny (`light`) |
|------------------|----------------|-------------------|
| tło              | `#13110f`      | `#e8e2d8`         |
| tło drugie       | `#1b1815`      | `#ded6ca`         |
| tekst            | `#efe7dc`      | `#1f1a15`         |
| tekst przygaszony| `#b5a896`      | `#5b5046`         |
| linie            | `#2a2520`      | `#cfc6b9`         |
| akcent (mosiądz) | `#c8a25a`      | `#6f521f`         |

- Wartości atrybutu to `dark` / `light` (a nie `nocny` / `dzienny`), żeby
  pasowały do nazewnictwa `prefers-color-scheme` w przeglądarkach.
- Kolory żyją wyłącznie jako zmienne CSS w `css/style.css`
  (`--tlo`, `--tekst`, `--akcent` itd.). **Nie wpisywać kolorów na sztywno
  w regułach CSS** — zepsułoby to przełączanie motywu.
- Motyw nocny jest domyślny (`:root`). Motyw dzienny jest zdefiniowany
  dwa razy: dla `:root[data-theme="light"]` (wybór użytkownika) oraz
  w `@media (prefers-color-scheme: light)` jako zabezpieczenie na wypadek
  niedziałającego JavaScriptu.

### Wybór motywu

Kolejność decydowania: **wybór zapisany w `localStorage`** (klucz `motyw`),
a przy pierwszej wizycie **ustawienie systemowe** `prefers-color-scheme`.

Mały skrypt w `<head>` pliku `index.html` ustawia motyw przed
wyrenderowaniem strony — dzięki temu nie widać mignięcia złymi kolorami.
Ten skrypt musi zostać inline w `<head>`; przeniesienie go do pliku
zewnętrznego przywróci mignięcie. `js/main.js` obsługuje tylko kliknięcie
przycisku.

### Typografia

- Nagłówki i logo: **Cormorant Garamond** (szeryfowy, klimat galerii).
- Tekst i menu: **Manrope** (bezszeryfowy, czytelny).
- Ładowane z Google Fonts w `<head>`, dostępne przez zmienne
  `--font-naglowki` i `--font-tekst`.

### Nazewnictwo klas CSS

Klasy po polsku, w konwencji blok i element: `.naglowek`,
`.naglowek__wnetrze`, `.menu`, `.przelacznik-motywu`. Podwójne
podkreślenie `__` oznacza element należący do bloku.

### Dostępność

- Przycisk motywu ma `aria-label` aktualizowany przez JavaScript
  (opisuje, co się stanie po kliknięciu). Ikony SVG mają `aria-hidden="true"`.
- Obwódki `:focus-visible` (widoczne przy nawigacji klawiszem Tab)
  zostają — nie usuwać.

### Sekcje strony i kotwice

`#wystawa`, `#metryka-drewna`, `#artystka`, `#zamowienia` — linki w menu
już na nie wskazują, same sekcje powstaną później.

### Zdjęcia zależne od motywu

Wzorzec: w HTML stoją **obie** wersje (`<figure>` z własnym zdjęciem,
opisem `alt` i podpisem), a CSS chowa niepasującą przez `display: none`
w regułach zależnych od `data-theme`. Bez dodatkowego JavaScriptu.

Dlaczego tak, a nie podmiana `src` skryptem: podpis i `alt` też się
zmieniają, więc muszą być zwykłym tekstem w HTML — inaczej czytniki
ekranu i wyszukiwarki ich nie zobaczą. `display: none` usuwa ukrytą
figurę również z drzewa dostępności, więc nie ma podwójnych odczytów.

Koszt: przeglądarka pobiera oba zdjęcia. Przy dwóch pracach to do
przyjęcia; gdyby wzorzec trafił w wiele miejsc, trzeba to przemyśleć.

### Proporcje zdjęć

`.praca img` ma stałą ramkę `aspect-ratio: 3 / 4` (na telefonie `4 / 5`)
i `object-fit: cover`. Powód: zdjęcia prac mają różne proporcje, a bez
stałej ramki układ strony podskakuje przy zmianie motywu. Skutek uboczny
— lekkie przycięcie kadru.

### Opisy alt

Piszemy je po obejrzeniu zdjęcia, opisując **co widać na rzeźbie**
(materiał, forma, detal, tło) — nie powtarzamy tytułu z podpisu,
bo czytnik ekranu przeczytałby go dwa razy.

### Punkty łamania układu (breakpointy)

- `max-width: 768px` — hero przechodzi na jedną kolumnę, zdjęcie ląduje
  nad tekstem (`order: -1`).
- `max-width: 720px` — nagłówek przenosi menu do osobnego wiersza.

Rozmiary tekstu skalują się przez `clamp()`, więc w większości wypadków
nie trzeba dopisywać nowych breakpointów.

### Katalog prac

`images/prace.json` to źródło danych o pracach (tytuł roboczy, cykl,
ścieżki do zdjęcia i miniatury). Pola metryki drewna są na razie puste —
do uzupełnienia razem z mamą. Foldery: `duze/` (do 1600 px) i
`miniatury/` (do 600 px) w katalogu każdego cyklu.

## Jak ze mną pracować

Właściciel projektu jest **początkującym** w programowaniu webowym.

- **Tłumacz, co robisz i dlaczego, zanim wprowadzisz zmiany.**
- Wyjaśniaj pojęcia techniczne prostym językiem przy pierwszym użyciu.
- Preferuj proste, czytelne rozwiązania nad sprytne i zwięzłe.
- Nie dokładaj narzędzi ani zależności bez wyraźnej potrzeby i zgody.
- Komentarze w kodzie po polsku.
