# Elfelejtett Jelszó Funkció Dokumentáció

## Áttekintés

Az elfelejtett jelszó funkció lehetővé teszi a felhasználók számára, hogy visszaállítsák jelszavukat, ha elfelejtették azt. A rendszer email-alapú token verifikációt használ a biztonságos jelszó visszaállításhoz.

## Működési folyamat

### 1. Elfelejtett jelszó kérése
- **URL**: `/elfelejtett_jelszo`
- **Komponens**: `ForgotPasswordForm`
- **Funkció**: A felhasználó megadja az email címét
- **API endpoint**: `POST /api/forgot-password`
- **Request body**: `{ email: string }`

### 2. Backend feldolgozás
A backend az alábbi lépéseket hajtja végre:
- Ellenőrzi, hogy létezik-e felhasználó a megadott email címmel
- Generál egy egyedi, biztonságos tokent (általában UUID vagy hash)
- Elmenti a tokent az adatbázisban lejárati idővel (pl. 1 óra)
- Email küldése a felhasználónak a reset linkkel

### 3. Email tartalom
Az email tartalmazza:
- A visszaállítási linket: `URL/elfelejtett_jelszo/[token]`
- Instrukciók a jelszó visszaállításához
- Figyelmeztetés a link lejárati idejéről

### 4. Jelszó visszaállítás
- **URL**: `/elfelejtett_jelszo/[token]`
- **Komponens**: `ResetPasswordForm`
- **Funkciók**:
  - Token validáció az oldal betöltésekor
  - Új jelszó beállítása (kétszeri megadással)
  - Jelszó erősség ellenőrzés
- **API endpoints**:
  - `GET /api/verify-reset-token/[token]` - Token validáció
  - `POST /api/reset-password` - Jelszó frissítés

## API Specifikáció

### Forgot Password Request
```typescript
interface ForgotPasswordRequest {
  email: string
}

// Response
interface ForgotPasswordResponse {
  message: string
}
```

### Reset Password Request
```typescript
interface ResetPasswordRequest {
  token: string
  password: string
  confirmPassword: string
}

// Response
interface ResetPasswordResponse {
  message: string
}
```

### Token Verification
```typescript
// Response
interface VerifyTokenResponse {
  valid: boolean
}
```

## Frontend komponensek

### ForgotPasswordForm
- **Lokáció**: `components/forgot-password-form.tsx`
- **Funkciók**:
  - Email cím validáció
  - API hívás kezelés
  - Sikerüzenet megjelenítés
  - Hibaüzenetek kezelés

### ResetPasswordForm
- **Lokáció**: `components/reset-password-form.tsx`
- **Funkciók**:
  - Token automatikus validáció
  - Jelszó megerősítés ellenőrzés
  - Jelszó erősség validáció
  - Automatikus átirányítás sikeres reset után

## Oldalak

### `/elfelejtett_jelszo`
- Publikus oldal
- Nem igényel authentikációt
- `ForgotPasswordForm` komponens megjelenítése

### `/elfelejtett_jelszo/[token]`
- Dinamikus route token paraméterrel
- Publikus oldal
- `ResetPasswordForm` komponens megjelenítése

## Biztonsági megfontolások

### Token kezelés
- **Generálás**: Kriptográfiailag biztonságos random tokenek
- **Lejárat**: Maximum 1 óra (backend konfigurálható)
- **Egyszeri használat**: Token érvénytelenítése használat után
- **Hash tárolás**: Token hash-elve tárolva az adatbázisban

### Jelszó validáció
- Minimum 6 karakter hosszúság (frontend)
- Jelszó megerősítés kötelező
- Backend oldali additional validáció szükséges

### Rate limiting
- Email küldés korlátozása IP cím alapján
- Védelem spam és brute force támadások ellen

## Middleware konfiguráció

A `middleware.ts` frissítve lett, hogy az elfelejtett jelszó oldalak publikusak legyenek:

```typescript
const publicPaths = ['/', '/login', '/privacy-policy', '/terms-of-service', '/elfelejtett_jelszo']
const isPublicPath = publicPaths.includes(request.nextUrl.pathname) || 
                    request.nextUrl.pathname.startsWith('/elfelejtett_jelszo/')
```

## API Client módosítások

Az `apiClient` új metódusokkal bővítve:
- `forgotPassword(data: ForgotPasswordRequest)`
- `resetPassword(data: ResetPasswordRequest)`
- `verifyResetToken(token: string)`

## Felhasználói élmény

### Pozitív folyamat
1. Felhasználó kattint "Elfelejtett jelszó?" linkre
2. Megadja email címét
3. Kap egy megerősítést, hogy email elküldve
4. Emailben kattint a linkre
5. Megadja új jelszavát kétszer
6. Sikeres üzenet és automatikus átirányítás login oldalra

### Hibakezelés
- **Ismeretlen email**: Biztonsági okokból nem árulják el, hogy nem létezik
- **Érvénytelen token**: Világos hibaüzenet új link kérésére
- **Lejárt token**: Új link kérésére irányítás
- **Jelszavak nem egyeznek**: Inline validáció
- **Gyenge jelszó**: Erősség követelmények megjelenítése

## Backend követelmények

A backend implementációhoz szükséges:

### Adatbázis tábla
```sql
CREATE TABLE password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Email service integráció
- SMTP konfiguráció
- HTML email template
- Queue system a nagy forgalomhoz

### API endpointok implementálása
1. `POST /api/forgot-password`
2. `GET /api/verify-reset-token/[token]`
3. `POST /api/reset-password`

## Tesztelési szempontok

### Frontend tesztek
- Form validáció tesztek
- API hívások mockolása
- Error handling tesztek
- Success flow tesztek

### Backend tesztek
- Token generálás és validáció
- Email küldés tesztek
- Token lejárat kezelés
- Rate limiting tesztek

### E2E tesztek
- Teljes elfelejtett jelszó folyamat
- Invalid token kezelés
- Email link funkcionality

## Karbantartás

### Token cleanup
Rendszeres cleanup feladat a lejárt tokenek törléséhez:
```sql
DELETE FROM password_reset_tokens 
WHERE expires_at < NOW() OR used_at IS NOT NULL;
```

### Monitoring
- Email küldés sikeressége
- Token használat statisztikák
- Hibák követése

## Fejlesztési megjegyzések

- A komponensek mobil-barát designnal készültek
- Accessibility követelmények teljesítve
- Theme support (dark/light mode)
- Internationalization ready (magyar nyelv)
- Connection indicator integrálva
