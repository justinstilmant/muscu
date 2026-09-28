if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => console.log('Service Worker enregistré avec succès.'))
    .catch(err => console.error('Erreur Service Worker:', err));
}
console.log('Application initialisée');