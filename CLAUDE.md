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

| Kotwica | Stan |
|---|---|
| `#wystawa` | gotowa — cztery sale |
| `#metryka` | gotowa — metryka drewna |
| `#artystka` | do zrobienia |
| `#zamowienia` | do zrobienia |

Menu w nagłówku prowadzi do tych kotwic. **Przy dodawaniu sekcji
sprawdzić, czy `id` zgadza się z `href` w menu** — pierwotnie menu
linkowało do `#metryka-drewna`, a sekcja dostała `id="metryka"`.

### Wspólne klasy

Style powtarzające się w wielu sekcjach mają własne, krótkie nazwy
zamiast być kopiowane:

- `.etykieta` — mała etykieta wersalikami w kolorze akcentu.
- `.tytul-sekcji` — `h2` sekcji (Cormorant Garamond, `clamp()`).
- `.przycisk` + `.przycisk--pelny` / `.przycisk--obramowany`.
- `.praca` — zdjęcie pracy z podpisem.
- `.do-uzupelnienia` — tymczasowa wartość w nawiasach kwadratowych.

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

Dwie różne ramki, obie z `object-fit: cover`:

- **hero** (`.praca img`) — `3 / 4`, na telefonie `4 / 5`.
- **karty sal** (`.sala__kadr img`) — `4 / 5` na wszystkich szerokościach.

Powód stałych ramek: zdjęcia prac mają bardzo różne proporcje, a bez
wspólnej ramki karty miałyby różną wysokość, a hero podskakiwałoby przy
zmianie motywu.

Ile traci każda praca na kartach przy kadrze 4:5 (zmierzone):

| Praca | Proporcja pliku | Przycięcie |
|---|---|---|
| Forma z otworami | 0,54 | 33% wysokości |
| Dwa motyle | 0,56 | 30% wysokości |
| Krucyfiks z aureolą | 0,94 | 14% szerokości |
| Koń ze skrzydłami | 0,91 | 12% szerokości |

`object-position` zostaje na `center` dla wszystkich kart — sprawdzone
na zawartości zdjęć:

- **Dwa motyle**: rzeźba zajmuje 21–83% wysokości, a kadr 4:5 pokazuje
  15–85%. Przycięcie zjada wyłącznie czarne tło, nic z pracy.
- **Forma z otworami**: rzeźba wypełnia kadr od 2% do 98%, więc każde
  przycięcie coś zabiera. Środek ciężkości pracy (ważony szerokością
  w kolejnych wierszach) wypada na 47% wysokości, czyli praktycznie
  w centrum — przesunięcie `object-position` w którąkolwiek stronę
  odcięłoby więcej rzeźby, nie mniej.

Przy dodawaniu nowej pracy warto to policzyć ponownie: przycięcie
w procentach to `1 − (proporcja zdjęcia ÷ 0,8)` dla zdjęć smuklejszych
niż ramka i `1 − (0,8 ÷ proporcja zdjęcia)` dla szerszych.

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

### Sekcja "Cztery sale"

`#wystawa` — cztery karty cykli w siatce 4 / 2 / 1 kolumny
(komputer / tablet poniżej 1024 px / telefon poniżej 768 px).
Liczby prac na kartach są zgodne z `images/prace.json`
(Twarze i formy 5, Skrzydła 4, Sacrum 4, Złoto lasu 4) —
przy dodaniu pracy trzeba poprawić obie rzeczy.

Karta to jeden `<a>` obejmujący zdjęcie i podpis, a karty leżą w `<ul>`,
żeby czytnik ekranu zapowiedział listę i jej długość.

Efekt po najechaniu: przybliżenie zdjęcia o 4% (0,7 s) i nazwa cyklu
w kolorze akcentu. Wyłączany przez `@media (prefers-reduced-motion)`.

### Wczytywanie zdjęć

`loading="lazy"` na wszystkich zdjęciach **poniżej pierwszego ekranu**.
Zdjęcia w hero zostają bez tego atrybutu — są widoczne od razu,
a odroczenie ich wczytania opóźniłoby pierwsze wrażenie.

Każde `<img>` ma atrybuty `width` i `height` z prawdziwymi wymiarami
pliku. To nie ustawia rozmiaru na stronie (robi to CSS), tylko pozwala
przeglądarce zarezerwować miejsce i nie przesuwać treści w trakcie
wczytywania.

## Sprawy otwarte

- **Podstrony sal.** Karty w sekcji `#wystawa` prowadzą na razie do `"#"`.
  Do zrobienia: osobne strony cykli (Twarze i formy, Skrzydła, Sacrum,
  Złoto lasu) i podmiana adresów w `index.html`.
- **Metryka w sekcji `#metryka` ma wartości zastępcze.** W `index.html`
  pięć pozycji listy (`Gatunek`, `Znaleziono`, `Czym było`, `Wymiary`,
  `Dostępność`) ma wpisane nawiasy kwadratowe, np. `[GATUNEK DREWNA]`,
  z klasą `do-uzupelnienia`. **Strona nie może trafić do publikacji
  z nawiasami.** Przed wypuszczeniem: wyszukać `do-uzupelnienia`
  w `index.html`, wpisać dane od mamy i usunąć tę klasę (a na koniec
  regułę `.do-uzupelnienia` ze `style.css`).
- **Metryka drewna.** Pola `gatunek_drewna`, `skad_drewno`, `wymiary`,
  `rok`, `dostepnosc`, `opis` w `images/prace.json` są puste —
  do uzupełnienia z mamą.
- **Tytuły prac.** W `prace.json` są tytuły robocze, do zastąpienia
  prawdziwymi.
- **Kadrowanie miniatur.** Ramka 4:5 przycina smukłe prace o ok. 30–33%
  wysokości (patrz tabela w „Proporcje zdjęć"). Tło zdjęć jest na tyle
  puste, że w praktyce ginie głównie ono — ale gdyby przy kolejnych
  pracach okazało się to za dużo, alternatywą jest `object-fit: contain`
  z tłem `--tlo-drugie` (praca w całości, jak passe-partout).

## Jak ze mną pracować

Właściciel projektu jest **początkującym** w programowaniu webowym.

- **Tłumacz, co robisz i dlaczego, zanim wprowadzisz zmiany.**
- Wyjaśniaj pojęcia techniczne prostym językiem przy pierwszym użyciu.
- Preferuj proste, czytelne rozwiązania nad sprytne i zwięzłe.
- Nie dokładaj narzędzi ani zależności bez wyraźnej potrzeby i zgody.
- Komentarze w kodzie po polsku.
