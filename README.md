# React Apps erstellen - Ultra einfach

## Schritt 1: Template klonen

```bash
git clone https://github.com/likehome/react-template
cd react-template
npm install
```

## Schritt 2: Neue App bauen

1. Öffne `src/Example.jsx`
2. Lösche alles und füge deinen Code ein
3. Benenne die Datei um: `Example.jsx` → `MeineApp.jsx`

## Schritt 3: App verlinken

Öffne `src/App.jsx` und ändere nur diese Zeile:

```jsx
import Example from './Example';
```

zu:

```jsx
import MeineApp from './MeineApp';
```

## Schritt 4: Starten

```bash
npm run dev
```