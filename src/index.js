import './scss/index.sass';
import 'bootstrap/js/dist/modal';
import 'bootstrap/js/dist/alert';
import initApp from './main';
import domReady from './utils/utils';

domReady().then(() => initApp());
