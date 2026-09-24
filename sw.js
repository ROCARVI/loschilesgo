// sw.js - Archivo requerido para que el teléfono permita la instalación
self.addEventListener('install', (e) => {
  console.log('[Service Worker] Instalado correctamente');
});

self.addEventListener('fetch', (e) => {
  // Se deja en blanco temporalmente solo para cumplir el requisito PWA
});