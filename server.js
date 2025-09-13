const express = require('express');
const path = require('path');

const port = process.env.PORT || 8080;
const app = express();

// Serve microfrontend static files
app.use('/single-spa-auth-app.umd.js', express.static(path.resolve(__dirname, '../single-spa-auth-app/dist/single-spa-auth-app.umd.js')));
app.use('/single-spa-layout-app.umd.js', express.static(path.resolve(__dirname, '../single-spa-layout-app/dist/single-spa-layout-app.umd.js')));
app.use('/single-spa-home-app.js', express.static(path.resolve(__dirname, '../single-spa-home-app/dist/single-spa-home-app.js')));
app.use('/single-spa-angular-app.js', express.static(path.resolve(__dirname, '../single-spa-angular-app/dist/single-spa-angular-app.js')));
app.use('/single-spa-vue-app.umd.js', express.static(path.resolve(__dirname, '../single-spa-vue-app/dist/single-spa-vue-app.umd.js')));
app.use('/single-spa-react-app.js', express.static(path.resolve(__dirname, '../single-spa-react-app/dist/single-spa-react-app.js')));
app.use('/single-spa-vanilla-app.js', express.static(path.resolve(__dirname, '../single-spa-vanilla-app/dist/single-spa-vanilla-app.js')));
app.use('/single-spa-webcomponents-app.js', express.static(path.resolve(__dirname, '../single-spa-webcomponents-app/dist/single-spa-webcomponents-app.js')));
app.use('/single-spa-typescript-app.js', express.static(path.resolve(__dirname, '../single-spa-typescript-app/dist/single-spa-typescript-app.js')));
app.use('/single-spa-jquery-app.js', express.static(path.resolve(__dirname, '../single-spa-jquery-app/dist/single-spa-jquery-app.js')));
app.use('/single-spa-svelte-app.js', express.static(path.resolve(__dirname, '../single-spa-svelte-app/dist/single-spa-svelte-app.js')));

// Serve root application static files
app.use(express.static(path.resolve(__dirname, 'dist')));

// send the user to index html page inspite of the url
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log('App listening on port:', port);
});
