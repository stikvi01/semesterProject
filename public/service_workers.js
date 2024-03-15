self.addEventListener('fetch', event => {
    if (!navigator.onLine) {
      event.respondWith(new Response("Du er offline, sjekk internett forbindelsen."));
    }
  });