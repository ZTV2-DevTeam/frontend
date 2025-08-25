import { ChangelogEntry } from '@/types/changelog';
import { createChangelogEntry, createChange, sortChangelogEntries } from '@/lib/changelog-utils';

const rawChangelogData: ChangelogEntry[] = [
  createChangelogEntry(
    'v1.0.0-beta.4',
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
      )
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
    'v1.0.0.-beta.3',
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
    'v1.0.0-beta.2',
    '2025. augusztus 20.',
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
