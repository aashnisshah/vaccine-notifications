console.log('service worker here')
self.addEventListener('push', function(event) {
    if (event.data) {
    const showNotif = self.registration.showNotification(event.data.text());
  
    event.waitUntil(showNotif);
    } else {
      console.log('This push event has no data.');
    }

    self.addEventListener('notificationclick', function(event) {
      const clickedNotification = event.notification;
      clickedNotification.close();
    
      // Do something as the result of the notification click
      const alertsPage = '/alerts';
      const promiseChain = clients.openWindow(alertsPage);
      event.waitUntil(promiseChain);
    });
    
  });