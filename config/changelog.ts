import { ChangelogEntry } from '@/types/changelog';
import { createChangelogEntry, createChange, sortChangelogEntries } from '@/lib/changelog-utils';
import { create } from 'domain';

const rawChangelogData: ChangelogEntry[] = [
  createChangelogEntry(
    'v1.2.3',
    '2025. szeptember 30.',
    '2025-09-30T13:00:00Z',
    [
      createChange(
        'bugfix',
        'Témaszínek világos és sötét mód helytelen betöltésének javítása',
        'Javítottuk a hibát, mely miatt a témaszínek helytelenül töltődtek be. Amennyiben a felhasználó nem azt a témát választotta ki, amelyik a rendszerén be van állítva, az oldal újratöltése után az alkalmazás továbbra is a rendszer beállításait követte.'
      ),
    ]
  ),
  createChangelogEntry(
    'v1.2.2',
    '2025. szeptember 28.',
    '2025-09-28T15:00:00Z',
    [
      createChange(
        'improvement',
        'Élesítés befejezve',
        'A platform élesítése sikeresen befejeződött, a felhasználók mostantól teljes funkcionalitással használhatják az alkalmazást.'
      )
    ]
  ),
  createChangelogEntry(
    'v1.2.1-beta',
    '2025. szeptember 26.',
    '2025-09-26T12:00:00Z',
    [
      createChange(
        'improvement',
        'Forgatások - Összejátszások - Események szeparálása',
        'Különválasztottuk a forgatások, az összejátszások és az események kezelését, mostantól különálló menüpontokban érhetők el a felhasználók számára.'
      ),
      createChange(
        'improvement',
        'Naptár - Egyértelműbb szövegezés',
        'A naptárban található szövegezéseket egyértelműbbé és érthetőbbé tettük a felhasználók számára.'
      ),
      createChange(
        'improvement',
        'Események - Új ikon',
        'Az események mostantól egy új, egyedi ikonnal jelennek meg a naptárban, megkülönböztetve őket a forgatásoktól és összejátszásoktól.'
      ),
      createChange(
        'feature',
        'Távollét Típusok',
        'Mostantól a felhasználók különböző típusú távolléteket rögzíthetnek, mint például Betegség, Személyes okok, vagy Egyéb. Ez segít a távollétek pontosabb nyilvántartásában és automatikus kezelésében.'
      ),
      createChange(
        'feature',
        'Telefonszám módosításának lehetősége a beállításokban',
        'A felhasználók mostantól módosíthatják telefonszámukat a Beállítások menüben, egy újonnan hozzáadott szerkesztési funkció segítségével.'
      ),
      createChange(
        'improvement',
        'Beállítások menü elrendezése',
        'Több módosítást hajtottunk végre a Beállítások menü elrendezésén, hogy az felhasználóbarátabb és könnyebben navigálható legyen.'
      ),
      createChange(
        'improvement',
        'Színkódolt események a naptárban',
        'Az események mostantól színkódolva jelennek meg a naptárban, hogy könnyebben megkülönböztethetők legyenek a különböző típusú események.'
      ),
      createChange(
        'improvement',
        'Verziószám - link a változások oldalra',
        'A verziószám mostantól egy kattintható link, amely a változások oldal adott verziójához navigál.'
      ),
    ]
  ),
  createChangelogEntry(
    'v1.2.0-beta',
    '2025. szeptember 25.',
    '2025-09-25T22:00:00Z',
    [
      createChange(
        'bugfix',
        'Stáb - Osztályfőnök csoportosítás javítása',
        'Az osztályfőnökök a rendszerben tévesen diák címkével jelentek meg. Ezt javítottuk.'
      ),
      createChange(
        'bugfix',
        'Beosztás szerkesztési jogosultságok javítása',
        'Egy jogosultsági hiba miatt, csupán a rendszergazdák tudták szerkeszteni a beosztásokat. Ezt a hibát javítottuk, mostantól a médiatanárok is szerkeszthetik a beosztásokat.'
      ),
    ]
  ),
  createChangelogEntry(
    'v1.1.7-beta',
    '2025. szeptember 25.',
    '2025-09-25T10:00:00Z',
    [
      createChange(
        'improvement',
        'Élesítés - Célegyenes',
        'Az előzetes fejlesztési szakasz véget ért, és az alkalmazás mostantól élesben fut.',
      ),
      createChange(
        'removed',
        'Billentyűparancsok eltávolítva a TeamSwitcher komponensből',
        'A TeamSwitcher komponensből eltávolításra kerültek a billentyűparancsok, mivel valójában nincsenek támogatva.',
      ),
      createChange(
        'improvement',
        'Nagy változások az Igazolások oldalon',
        'Több nagyobb javítást és fejlesztést hajtottunk végre az Igazolások oldalán, hogy az felhasználóbarátabb és hatékonyabb legyen. Ezek a változások magukban foglalják a felület átalakítását, új funkciók hozzáadását, valamint a teljesítmény optimalizálását.'
      ),
      createChange(
        'improvement',
        'Forgatások betöltésének részletei',
        'Mostantól részletes tájékoztatást kapnak a felhasználók a forgatások menü betöltése alatt.'
      ),
    ]
  ),
  createChangelogEntry(
    'v1.1.6-beta',
    '2025. szeptember 24.',
    '2025-09-24T18:00:00Z',
    [
      createChange(
        'feature',
        'Jelszó Módosítása',
        'Mostantól a felhasználók módosíthatják jelszavukat a Beállítások menüben, anélkül, hogy elfelejtették volna azt. Ez a funkció biztonságos és egyszerű módot kínál a jelszó frissítésére.'
      ),
    ]
  ),
  createChangelogEntry(
    'v1.1.5-beta',
    '2025. szeptember 24.',
    '2025-09-24T15:00:00Z',
    [
      createChange(
        'feature',
        'Igazolások menü',
        'Létrehoztuk az Igazolások menüt diákoknak, akik módosításokat végezhetnek el a hiányzásaikon, valamint osztályfőnököknek, akik felülvizsgálhatják és kezelhetik ezeket a módosításokat.'
      ),
    ]
  ),
  createChangelogEntry(
    'v1.1.4-beta',
    '2025. szeptember 23.',
    '2025-09-23T01:00:00Z',
    [
      createChange(
        'feature',
        'Kezdetleges Beosztáskezelő',
        'Bevezettük a kezdetleges Beosztáskezelőt, amely lehetővé teszi a médiatanárok számára, hogy a forgatásokhoz diákokat rendeljenek különböző szerepkörökben. Ez a funkció még fejlesztés alatt áll, és a jövőben további fejlesztéseket és finomításokat tervezünk (Új nézetek, drag-n-drop nézet, fejlett és áttekinthető statisztika).',
      ),
      createChange(
        'feature',
        'Rendszerüzenetek',
        'Bevezettük a Rendszerüzenetek funkciót, amely lehetővé teszi az adminisztrátorok, fejlesztők és üzemeltetők számára, hogy fontos üzeneteket jelenítsenek meg a felhasználói felületen. Ezek az üzenetek lehetnek információk, figyelmeztetések vagy kritikus értesítések, és céljuk, hogy javítsák a felhasználói élményt és tájékoztassák a felhasználókat a rendszer állapotáról vagy fontos eseményekről.',
      ),
    ]
  ),
  createChangelogEntry(
    'v1.1.3-beta',
    '2025. szeptember 22.',
    '2025-09-23T01:00:00Z',
    [
      createChange(
        'integration',
        'Google Maps integráció',
        'Integráltuk a Google Maps szolgáltatást az alkalmazásba, jelenleg egy gyors hozzáférést biztosít a helyszín megtekintéséhez a Google Maps-en keresztül. Elérhető a forgatások részleteinél.',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Google_Maps_icon_%282020%29.svg/256px-Google_Maps_icon_%282020%29.svg.png?20200218211225'
      ),
      createChange(
        'integration',
        'Google Calendar integráció',
        'Mostantól lehetőség van a forgatások eseményeinek gyors hozzáadására a Google Naptárba egy dedikált gomb segítségével. Elérhető a forgatások részleteinél.',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Calendar_icon_%282020%29.svg/512px-Google_Calendar_icon_%282020%29.svg.png?20221106121915'
      ),
    ]
  ),
  createChangelogEntry(
    'v1.1.2-beta',
    '2025. szeptember 22.',
    '2025-09-22T23:00:00Z',
    [
      createChange(
        'feature',
        'Egységes hibakezelés - Toast',
        'Mostantól a hibák egységesen, toast értesítések formájában jelennek meg a felhasználói felületen, a jobb felül sarokban. Ez biztosítja, hogy a felhasználók azonnal értesüljenek a problémákról anélkül, hogy megszakítanák a munkafolyamatukat.'),
      createChange(
        'improvement',
        'Új forgatás form - Hibaüzenetek',
        'Integráltuk az egységes hibakezelést az új forgatás létrehozásának folyamatába.'
      ),
      createChange(
        'improvement',
        'Loading komponens - Új dizájn',
        'Újragondoltuk a betöltő komponens megjelenését'
      ),
      createChange(
        'feature',
        'Tesztfelület létrehozása',
        'Létrehoztunk egy dedikált tesztfelületet, ahol különböző komponensek és funkciók tesztelhetők anélkül, hogy befolyásolnák a fő alkalmazást. Ez megkönnyíti a fejlesztést és a hibakeresést.'
      ),
      createChange(
        'improvement',
        'Globális változások az oldal akadálymentességében',
        'A weboldal akadálymentességi funkciói jelentős fejlesztéseken mentek keresztül, beleértve a billentyűzet navigáció, kontraszt és a képernyőolvasók támogatásának javítását.'
      ),
      createChange(
        'improvement',
        'Fejlett SEO optimalizáció és Open Graph támogatás',
        'Javítottuk a keresőmotor optimalizációt (SEO), hogy a weboldal jobban teljesítsen a keresési eredmények között növelve ezzel az oldal könnyebb elérését például a Google, a Bing és a DuckDuckGo keresőkben. Ezen felül, az Open Graph meta tagek hozzáadásával a megosztott linkek előnézeti képei és leírásai is javultak a közösségi médiában és chatfelületeken.'
      ),
      createChange(
        'feature',
        'Megfelelőségi és biztonsági nyilatkozatok',
        'Létrehoztunk egy új szakaszt a főoldalon, ahol a felhasználók megtekinthetik a szolgáltatásunkkal kapcsolatos megfelelőségi és biztonsági nyilatkozatokat.'
      ),
      createChange(
        'feature',
        '404, 500 és globális hibaoldalak egyedi felületen',
        'A 404-es (Nem található) és 500-as (Belső szerverhiba) hibák mostantól egyedi, felhasználóbarát felületen jelennek meg, amely segít a felhasználóknak megérteni a problémát és javaslatokat kínál a továbblépésre.'
      ),
    ]
  ),
  createChangelogEntry(
    'v1.1.1-beta',
    '2025. szeptember 17.',
    '2025-09-17T08:00:00Z',
    [
      createChange(
        'improvement',
        'Forgatási típusok tisztázása',
        'A korábban "KaCsa Forgatás" néven, hibásan feltüntetett forgatási típus mostantól "KaCsa Összejátszás" néven, a  korábban "Rendes Forgatás" néven feltüntetett típus pedig "KaCsa Forgatás" néven érhető el. Egyszavas kontextusban a "KaCsa", illetve továbbra is a "Rendes" elnevezés használatos.',
      ),
      createChange(
        'removed',
        'KaCsa Összejátszás kiírásának lehetősége eltávolítva',
        'A KaCsa Összejátszás típusú forgatások kiírásának lehetősége eltávolításra került a felhasználói felületről, mivel ezeket az összejátszásokat mostantól kizárólag az adminisztrációs felületen lehet kezelni, a megfelelő jogosultságokkal, importálás lehetőséggel egyetemben.'
      ),
      createChange(
        'improvement',
        'Segítség menü reszponzivitásának javítása',
        'Javítottuk a Segítség menüpont reszponzivitását.'
      ),
    ]
  ),
  createChangelogEntry(
    'v1.1.0-beta',
    '2025. szeptember 16.',
    '2025-09-16T23:00:00Z',
    [
      createChange(
        'improvement',
        'Médiatanár szerepkör megjelenítése',
        'A médiatanár szerepkör mostantól megfelelően jelenik meg a felhasználói felületen.'
      ),
      createChange(
        'improvement',
        'Új forgatás kiírása - Szerepkör alapú típusok',
        'Az új forgatás létrehozásakor, a felhasználók mostantól relevánsabb adatokkal találkozhatnak.'
      ),
      createChange(
        'bugfix',
        'Bejelentkezési hiba javítása',
        'Javítottunk egy kritikus hibát ami senkit sem engedett bejelentkezni',
      ),
      createChange(
        'improvement',
        'Hibás hivatkozás, Riporterek -> Szerkesztők',
        'A Szerkesztő szerepkör mostantól megfelelően jelenik meg a felhasználói felületen. Nem összetévesztendő a Riporter szerepkörrel.',
      ),
      createChange(
        'feature',
        'Új forgatás - Korábban nem rögzített Partnerek és Kapcsolattartók kezelése',
        'Mostantól lehetőség van új forgatások létrehozására olyan partnerekkel és kapcsolattartókkal, akik korábban nem kerültek rögzítésre a rendszerben.'
      ),
      createChange(
        'bugfix',
        'Stáb menü - Biztonságos hozzáférés diákoknak is',
        'Javítottunk egy hibát, mely miatt a diákok nem férhettek hozzá a Stáb menühöz.'
      ),
      createChange(
        'improvement',
        'Overscroll szín a témához igazítva',
        'Az overscroll szín mostantól a kiválasztott témához igazodik, így egységesebb megjelenést biztosítva.'
      ),
      createChange(
        'feature',
        'Konfetti animáció Új Forgatás sikeres létrehozásakor',
        'Mostantól konfetti animáció kíséri az új forgatás sikeres létrehozását.'
      ),
      createChange(
        'feature',
        'Verziószám in-app',
        'Mostantól a verziószám megtekinthető az alkalmazáson belül is, a láblécben.'
      ),
    ]
  ),
  createChangelogEntry(
    'v1.0.13-beta',
    '2025. szeptember 10.',
    '2025-09-10T13:00:00Z',
    [
      createChange(
        'improvement',
        'Forgatások részletezője a naptárban',
        'Az események részleteit mostantól egy részletes dialógusban tekinthetik meg a felhasználók.'
      ),
      createChange(
        'improvement',
        'Események színkódolása',
        'Az események típusaihoz színkódokat rendeltünk, így könnyebben átláthatóak a különböző események.'
      ),
      createChange(
        'bugfix',
        'Kisebb hibák javítása a naptár komponensben',
        'Javítottunk néhány apróbb hibát, amelyek a naptár használhatóságát fejlesztették.'
      ),
      createChange(
        'improvement',
        'Áttekinthetőbb fejléc stílusok a főbb komponensekben',
        'Frissítettük a fejléc stílusokat, hogy azok egységesebbek és esztétikusabbak legyenek a főbb komponensekben.'
      ),
      createChange(
        'improvement',
        'Szerepkörök cimkéinek tisztázása és egységesítése',
        'A szerepkörök címkéit egységesítettük és tisztáztuk, hogy azok jobban tükrözzék a felhasználók valós címeit.'
      ),
    ]
  ),
  
  createChangelogEntry(
    'v1.0.12-beta',
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
    'v1.0.11-beta',
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
    'v1.0.10-beta',
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
    'v1.0.9-beta',
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
    'v1.0.8-beta',
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
    'v1.0.7-beta',
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
    'v1.0.6-beta',
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
    'v1.0.5-beta',
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
    'v1.0.4-beta',
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
    'v1.0.3-beta',
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
    'v1.0.2-beta',
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
      ),
      createChange(
        'improvement',
        'Új Forgatást készíthet - jogosultság helyes alkalmazása',
        'Mostantól csak azok a felhasználók hozhatnak létre új forgatást, akik rendelkeznek a megfelelő jogosultsággal.'
      ),
    ]
  ),
  createChangelogEntry(
    'v1.0.1-beta',
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
