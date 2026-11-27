# Pokédeck

API de cartas: TCGdex (https://tcgdex.dev), gratuita e sem chave.

```powershell
npm install
npx expo install --fix      # alinha as versões ao SDK 54
Copy-Item .env.example .env # opcional: a API já tem endereço padrão
npx tsc --noEmit
npx expo start -c
```
Abra no Expo Go (SDK 54) lendo o QR code.
