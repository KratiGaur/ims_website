# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## XAMPP + MySQL setup

1. Copy this project folder into `C:\xampp\htdocs\yroc13-website`.
2. Start Apache and MySQL from the XAMPP Control Panel.
3. Open phpMyAdmin and run [database/schema.sql](/d:/yroc13-website/database/schema.sql).
4. If your MySQL username, password, or database name is different, update [config/database.php](/d:/yroc13-website/config/database.php).
5. If you run the React frontend with Vite during development, create a `.env` file from [.env.example](/d:/yroc13-website/.env.example) so the frontend can call the PHP API in XAMPP.

Example `.env`:

```env
VITE_API_BASE_URL=http://localhost/yroc13-website
```
NGROK:
Authtoken saved to configuration file: C:\Users\KRATI\AppData\Local\ngrok\ngrok.yml
#### ngrok changes section fro the vite.config.js
original code:
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
####