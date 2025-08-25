import { ChangelogEntry } from '@/types/changelog';
import { createChangelogEntry, createChange, sortChangelogEntries } from '@/lib/changelog-utils';
import { m } from 'motion/react';
import { create } from 'domain';

const rawChangelogData: ChangelogEntry[] = [
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
        'Változtatások oldal hozzáadása',
        'Új változtatások oldal a változások nyomon követésére a változtatások dátumával és típusával.'
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
