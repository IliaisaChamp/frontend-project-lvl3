import initApp from './main';
import domReady from './utils/domready';

domReady().then(() => initApp());
