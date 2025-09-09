import { ChangelogEntry } from '@/types/changelog';
import { createChangelogEntry, createChange, sortChangelogEntries } from '@/lib/changelog-utils';
import { m } from 'motion/react';
import { create } from 'domain';

const rawChangelogData: ChangelogEntry[] = [
  createChangelogEntry(
    'v1.0.0-beta.12',
    '2025. szeptember 09.',
    '2025-09-09T23:00:00Z',
    [
      createChange(
        'feature',
        'Új Dizájn a Beállításokban',
        'Teljesen újragondoltuk a Beállítások menüt, hogy az felhasználóbarátabb és könnyebben navigálható legyen.'
      ),
      createChange(
        'feature',
        'Adminisztrátori gyors műveletek visszaállítása',
        'Visszahoztuk, a gyors műveleteket az adminisztrátori irányítópultra, megújult dizájnnal.'
      ),

    ]
  ),
  createChangelogEntry(
    'v1.0.0-beta.11',
    '2025. szeptember 09.',
    '2025-09-09T10:00:00Z',
    [
      createChange(
        'bugfix',
        'Főoldal átiríányítási folyamat javítása',
        'Javítottuk a hibát, mely a főoldal elérésekor, lejárt tokennel váratlanull átirányította a felhasználókat a bejelentkezési oldalra.'
      ),
      createChange(
        'bugfix',
        'Változások oldal elrendezésének javítása',
        'Javítottuk a változások oldal elrendezését, hogy az jobban alkalmazkodjon a különböző képernyőméretekhez.'
      ),      
      createChange(
        'bugfix',
        'Lábléc elrendezésének javítása',
        'Javítottuk a lábléc elrendezését, hogy az jobban alkalmazkodjon a különböző képernyőméretekhez.'
      ),
    ]
  ),
  createChangelogEntry(
    'v1.0.0-beta.10',
    '2025. szeptember 02.',
    '2025-09-02T10:00:00Z',
    [
      createChange(
        'bugfix',
        'Hibás felhasználói adatok megjelenítésének javítása',
        'Javítottuk a hibát, mely minden tanulót egy évfolyammal feljebb helyezett a tanév kezdete után.'
      ),
      createChange(
        'bugfix',
        'Hiányzó profilképek megjelenítése a beosztások részleteinél',
        'Javítottunk egy hibát, mely nem jelenítette meg a profilképeket a beosztások részleteinél.'
      ),
      createChange(
        'improvement',
        '"Aktív" kitűző eltávolítva a forgatásokkal kapcsolatosan',
        'Eltávolítottuk az "Aktív" kitűzőt a forgatásokkal kapcsolatosan.'
      ),
      createChange(
        'bugfix',
        'Automatikus irányítópult átirányítás javítása',
        'Megoldottuk azt a hibát, amely minden oldalfrissítéskor automatikusan átirányította a felhasználót az irányítópultra, függetlenül attól, hogy melyik aloldalon volt.'
      ),
      createChange(
        'improvement',
        'Átrendeztük a widgeteket az adminisztrátori irányítópulton',
        'Mostantól a widgetek más elrendezésben jelennek meg az adminisztrátori irányítópulton.'
      ),
      createChange(
        'feature',
        'Újraterveztük a Stáb menüpontot',
        'Mostantól a Stáb menüpont új dizájnnal és elrendezéssel rendelkezik.'
      ),
      createChange(
        'bugfix',
        'Időzónakezelés javítása - Távollét menü',
        'Javítottuk a hibát, mely nem engedett új távollétet rögzíteni, mivel hiba volt az időzónakezelésben.'
      ),
      createChange(
        'bugfix',
        'Mobilnézet térkitöltés javítása',
        'Eltűntettünk egy felesleges térkitöltést a képernyő legalján mobilnézetben.'
      ),
      createChange(
        'improvement',
        'Naptár mobilnézetének újragondolása',
        'Újraterveztük a Naptár menüt a mobilnézet észben tartásával.'
      ),
    ]
  ),
  createChangelogEntry(
    'v1.0.0-beta.9',
    '2025. augusztus 27.',
    '2025-08-27T10:00:00Z',
    [
      createChange(
        'bugfix',
        'Admininsztrátori Osztályfőnök előnézet kritikus hibájának javítása',
        'Javítottuk a hibát, mely az adminisztrátorok automatikus kijelentkezését okozta, amikor meg akarták tekinteni az igazolások menüt az osztályfőnöki szerepkör előnézetében.'
      ),
      createChange(
        'improvement',
        'Szerepkör váltás folyamatának fejlesztése',
        'Mostantól szerepkörök váltásánál az oldal automatikusan átirányítja a felhasználókat az adott szerepkör irányítópultjára.'
      ),
      createChange(
        'improvement',
        'Új, időpont mezők a Távollétkezelésben',
        'Mostantól új időpont mezők érhetők el a Távollétkezelésben, lehetővé téve a pontosabb időpontok megadását.'
      ),
      createChange(
        'improvement',
        'Dizájn apróbb módosításai a Távollétkezelőben',
        'Apróbb módosításokat hajtottunk végre a Távollétkezelő dizájnján, hogy az felhasználóbarátabb legyen.'
      ),
      createChange(
        'feature',
        'Diák előnézet osztályfőnökök számára',
        'Mostantól az osztályfőnökök számára is elérhető a Diák szerepkör előnézete.'
      ),
      createChange(
        'feature',
        'Új mező a Beosztás modellben: Stáb',
        'Mostantól hozzá lehet stábot rendelni a Beosztás modellhez.'
      ),
    ]
  ),
  createChangelogEntry(
    'v1.0.0-beta.8',
    '2025. augusztus 25.',
    '2025-08-25T22:45:00Z',
    [
      createChange(
        'removed',
        'Első Lépések Widget eltávolítva',
        'Az első lépések widget eltávolításra került a felhasználói felületről, az útmutató mostantól csak a Segítség menüpontban érhető el.'
      ),
      createChange(
        'bugfix',
        'Profil rekord importálás javítása',
        'Javítottuk a profil rekord importálásának folyamatát, hogy az zökkenőmentesebbé váljon.'
      ),
      createChange(
        'security',
        'Jelszó titkosítási hiba javítása',
        'Javítottuk a hibát, mely nem titkosította a jelszavakat az admin felületen történő manuális megadásnál.'
      ),
      createChange(
        'improvement',
        'Vezetéknév és keresztnév mezők felcserélése Admin felületen',
        'Felcseréltük a felhasználói modell adminisztrációs nézetében a vezetéknév és keresztnév mezőket.'
      ),
      createChange(
        'bugfix',
        'ThemeContext hiba javítása a changelog oldalon',
        'Javítottunk egy furcsa hibát, mely a Témakezelő teljes meghibásodását okozta, ha a felhasználók közvetlenül megnyitották a Változások oldalt.'
      ),
    ]
  ),
  createChangelogEntry(
    'v1.0.0-beta.7',
    '2025. augusztus 25.',
    '2025-08-25T13:00:00Z',
    [
      createChange(
        'bugfix',
        'Memória túlterhelési hiba javítása',
        'Több felhasználó importálása, különösen a jelszavak titkosítása rendkívül sok memóriát emésztett fel, ezt optimalizáltuk.'
      ),
      createChange(
        'improvement',
        'Egérmutató beállítások javítása',
        'Javítottuk a felhasználói felület egérmutató beállításait, hogy azok jobban alkalmazkodjanak a különböző interakciókhoz.'
      ),
      createChange(
        'feature',
        'Új dizájn a Távollétkezelőben',
        'Teljesen újragondoltuk a Távollétkezelő dizájnját.'
      ),
      createChange(
        'feature',
        'Rendszer áttekintés',
        'Hozzáadtuk a Rendszer áttekintés widgetet az admin irányítópulthoz, ahol megtekinthetik a legfontosabb fix és dinamikus változókat az adminisztrátorok'
      ),
      createChange(
        'bugfix',
        'Stáb oldal - aktivitás indikátorok',
        'A stáb oldalon található aktivitás indikátorok mostantól valósan tükrözik a felhasználók aktivitását.'
      ),
      createChange(
        'feature',
        'Húsvéti tojás',
        'Elrejtettünk az oldalon egy Easter-egget. Jó keresgélést!'
      ),
      createChange(
        'improvement',
        'Kijelölés témaszínnel',
        'A kijelölés mostantól a témához illeszkedő színekkel jelenik meg.'
      ),
      createChange(
        'feature',
        'Operációs rendszerek integrációja',
        'Mostantól az operációs rendszerek ismert és természetesen kezelhető, beépített dátum és időválasztó mezőit használjuk, így az ismerős és kényelmesebb lesz. Gecko alapú böngészők, mint a Firefox és a Zen nem támogatottak.'
      ),
      createChange(
        'improvement',
        'Vezeték- és keresztnevek helyes megjelenítése',
        'A vezetéknév és keresztnév mostantól megfelelő sorrendben jelenik meg a teljes felhasználói felületen.'
      ),
    ]
  ),
  createChangelogEntry(
    'v1.0.0-beta.6',
    '2025. augusztus 25.',
    '2025-08-25T10:30:00Z',
    [
      createChange(
        'feature',
        'Kapcsolattartó kontextus mező hozzáadása',
        'Új kontextus mező hozzáadása a kapcsolattartók számára az "Új forgatás" menüben. A kontextus most vertikálisan jelenik meg a név és a kapcsolattartási adatok között a jobb olvashatóság érdekében.'
      ),
      createChange(
        'improvement',
        'ContactPersonSchema frissítése',
        'A ContactPersonSchema interfész frissítése a context opcionális mezővel a rugalmasabb adatkezelés érdekében.'
      ),
      createChange(
        'improvement',
        'Combobox megjelenítés javítása',
        'A kapcsolattartók combobox-ában a kontextus információ most strukturáltabban jelenik meg, külön sorban a névtől és a kapcsolattartási adatoktól.'
      ),
      createChange(
        'improvement',
        'ComboBox keresés-kiválasztás fejlesztése',
        'A ComboBoxokban mostantól lehet a billentyűzet nyilaival navigálni a lehetőségek között, valamint a legrelevánsabb találatot az Enter billentyű megnyomásával lehet kiválasztani. Az Esc billentyű bezárja a legördülő menüt.'
      ),
      createChange(
        'removed',
        'Bejelentkezési instrukciók eltávolítása az útmutatókból',
        'Eltávolítottuk a bejelentkezési instrukciókat az útmutatókból, mivel az útmutatók, kizárólag a sikeres bejelentkezés után érhetők el, így ez az információ feleslegessé vált.'
      ),
      createChange(
        'improvement',
        'Távollétkezelő reszponzivitásának növelése',
        'Apróbb módosításokat hajtottunk végre a Távollétkezelő felület reszponzivitásával kapcsolatban, így mostantól annak kellemsebb mobilon a használata.'
      ),
      createChange(
        'feature',
        'Élesítés ellenőrzése gyorsgomb hozzáadása a lábléchez',
        'Hozzáadtunk egy Élesítés ellenőrzése gyorsgombot a lábléchez, amely lehetővé teszi a fejlesztők és az üzemeltetők számára a gyors hozzáférést az élesítési folyamatokhoz.'
      ),
      createChange(
        'feature',
        'Üzenőfal kezelés a felhasználói felületen',
        'Mostantól lehet az üzenőfal közleményeit a felhasználói felületen kezelni.',
      ),
      createChange(
        'feature',
        'Fejlett Markdown Támogatás az Üzenőfalon',
        'Az üzenőfal mostantól támogatja a fejlett Markdown funkciókat, beleértve a táblázatokat, kódrészleteket, matematikai kifejezéseket és emoji-kat is.',
      ),      
      createChange(
        'bugfix',
        'Furcsa hiba javítása az üzenőfalon',
        'Javítottunk egy rendkívül furcsa hibát amely az Új Közlemény gomb véletlenszerű helyeken történő felbukkanását okozta.',
      ),
      createChange(
        'feature',
        'Changelog - Megosztás',
        'Mostantól lehetőség van a változások megosztására, a megosztási link másolásával. Ezen link közvetlenül az adott változásra mutat.',
      ),
      createChange(
        'feature',
        'Rendszer felkészítése profilképek kezelésére',
        'Felkészítettük a rendszert profilképek fogadására, implementáltunk egy egyedi, semleges profilképkezelő rendszert helykitöltő gyanánt.',
      ),
      createChange(
        'improvement',
        'Dizájn egységesítése',
        'Egységesítettük a menük dizájnjának főbb elemeit',
      ),
      createChange(
        'improvement',
        '/admin átirányítás',
        'A /admin útvonal mostantól automatikusan átirányít a megfelelő adminisztrációs felületre.',
      ),
      createChange(
        'bugfix',
        'Admin felület: Szövegek javítása',
        'Az admin felületen a Profil modelre történő hivatkozások hibásak voltak.',
      ),
      createChange(
        'improvement',
        'Távollétkezelő dizájnjának apróbb módosításai',
        'Apróbb módosításokat hajtottunk végre a Távollétkezelő dizájnján, hogy az felhasználóbarátabb legyen számítógépes felületen is.',
      ),
    ]
  ),
  createChangelogEntry(
    'v1.0.0-beta.5',
    '2025. augusztus 25.',
    '2025-08-25T01:48:56Z',
    [
      createChange(
        'feature',
        'Változások oldal hozzáadása',
        'Új változások oldal a változások nyomon követésére a változások dátumával és típusával.'
      ),
      createChange(
        'bugfix',
        'Hibás link javítása a navigációs menüben',
        'A távollétkezelési menü további lehetőségei között a Szerkesztés adatbázisban link hibás címre mutatott.'
      ),
      createChange(
        'bugfix',
        'Napi rövidítések javítása a naptárban',
        'Javítottuk a hét napjainak rövidítését, így elkerülve a jövőbeli félreértéseket és hibákat.'
      ),
      createChange(
        "bugfix",
        'Véletlenszerű automatikus kijelentkezés javítása',
        'Javítottuk azt a hibát, amely véletlenszerűen kijelentkeztette a felhasználókat, amikor Új forgatást akartak létrehozni'
      ),
      createChange(
        'improvement',
        'Oldalsó menü dizájnjának fejlesztése',
        'A közelmúltbeli módosítások az oldalsó menün a dizájn javítását igényelték.'
      ),
      createChange(
        'removed',
        'Jelszó beállítási link eltávolítása',
        'Eltávolítottuk a jelszó beállítási linket a bejelentkezési űrlapból.'
      ),
      createChange(
        'improvement',
        'Süti tájékoztató hozzáadása a bejelentkezési űrlaphoz',
        'Hozzáadtuk a süti tájékoztatót a bejelentkezési űrlaphoz.'
      ),
      createChange(
        'feature',
        'Speed Insights integráció',
        'Vercel Speed Insights hozzáadása a teljesítmény monitorozásához és fejlesztői szerepkörök frissítése.'
      ),
      createChange(
        'improvement',
        'Bejelentkezések megfelelő regisztrálása',
        'A bejelentkezéseket a rendszer eddig csak az Adminisztárciós felületre történő belépéskor regisztrálta. Mostantól a felhasználói felületre történő belépéskor is naplózva lesznek. (Kizárólag a legutolsó bejelentkezés)',
      ),
    ]
  ),
  createChangelogEntry(
    'v1.0.0.-beta.4',
    '2025. augusztus 24.',
    '2025-08-24T12:00:00Z',
    [
      createChange(
        'feature',
        'Átigazolás modell létrehozása',
        'Létrehoztuk az Átigazolás modellt, mely automatikusan rögzíti a stábok közti mozgásokat a visszakereshetőség érdekében.'
      ),
    ]
  ),
  createChangelogEntry(
    'v1.0.0-beta.3',
    '2025. augusztus 22.',
    '2025-08-22T13:51:42Z',
    [
      createChange(
        'improvement',
        'Token kezelés és átirányítási logika javítása',
        'Továbbfejlesztettük a hitelesítési token kezelését és az automatikus átirányítások logikáját.'
      ),
      createChange(
        'improvement',
        'Kijelentkezési gomb áthelyezése',
        'A kijelentkezési gomb mostantól a menüben található a jobb hozzáférhetőség érdekében.'
      ),
      createChange(
        'feature',
        'Előnézeti mód',
        'Új előnézeti funkció hozzáadása az alkalmazáshoz.'
      ),
      createChange(
        'improvement',
        'Első lépések widget eltávolítása',
        'Az első lépések widget eltávolítása a tanuló nézetből a tisztább felhasználói élmény érdekében.'
      )
    ]
  ),
  createChangelogEntry(
    'v1.0.0-beta.2',
    'HelloZTV - Beta élesítés',
    '2025-08-20T02:02:01Z',
    [
      createChange(
        'feature',
        'Élesítés',
        'A rendszer 2025. augusztus 20-án éles üzembe lépett.'
      ),
      createChange(
        'improvement',
        'Témakontext továbbfejlesztése',
        'A témakontext mostantól támogatja a téma mód kezelését továbbfejlesztett funkciókkal.'
      ),
      createChange(
        'improvement',
        'Token kezelés optimalizálása',
        'Javítottuk a token kezelést különböző komponensekben strukturált paraméterekkel.'
      ),
      createChange(
        'bugfix',
        'Paraméter kezelés javítása',
        'Kijavítottuk a paraméterek kezelését a forgatási részletek komponensben.'
      ),
      createChange(
        'improvement',
        'Hitelesítési ellenőrzés optimalizálása',
        'Az engedélyezési ellenőrzés mostantól az adatok betöltése után történik a tanuló hiányzások oldalon.'
      ),
      createChange(
        'feature',
        'Jelszavak importálásának lehetősége',
        'Mostantól az adminisztátorok a Felhasználói rekordok importálásánál a jelszó mezőt is kitölthetik. Ez eddig biztonsági okokból nem volt jelen a rendszerben, illetve mert egy FirstLogin rendszer is üzemelt. Ez ki lett kapcsolva.'
      )
    ]
  ),
  createChangelogEntry(
    'v1.0.0-beta.1',
    '2025. augusztus 15.',
    '2025-08-15T09:00:00Z',
    [
      createChange(
        'bugfix',
        'ESLint konfiguráció továbbfejlesztése',
        'További szabályok hozzáadása a jobb kódminőség és hibakezelés érdekében. Ennek elmulasztása a rendszer élesítését akadályozta.'
      ),
    ]
  )
];

// Export sorted changelog data (newest first)
export const changelogData = sortChangelogEntries(rawChangelogData);
