import store from './store';

export const BASE_URL = 'https://antares.rigel.digital/api';

export const PUSHER_CONFIG = {
  appId: "776528",
  key: "2d250613bf1826bdc4c5",
  secret: "1cc248647f5a55178fcb",
  cluster: "us2",
  encrypted: true,
  namespace: 'App.Events',
  broadcaster: 'pusher',
  authEndpoint: 'https://antares.rigel.digital/mobile/broadcasting/auth'
}