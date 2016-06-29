(function(global) {

var map = {
  '@angular':                   'node_modules/@angular',
  'angular2-in-memory-web-api': 'node_modules/angular2-in-memory-web-api',
  'rxjs':                       'node_modules/rxjs'
};

var packages = {
  'app':                        { main: 'main.js',  defaultExtension: 'js' },
  'rxjs':                       { defaultExtension: 'js' },
  'angular2-in-memory-web-api': { main: 'index.js', defaultExtension: 'js' },
  'dist':                       { main: 'index.js', defaultExtension: 'js' }
};

var ngPackageNames = [
  'common',
  'compiler',
  'core',
  'forms',
  'http',
  'platform-browser',
  'platform-browser-dynamic',
];

function packIndex(pkgName) {
  packages['@angular/'+pkgName] = { main: 'index.js', defaultExtension: 'js' };
}

ngPackageNames.forEach(packIndex);

System.config({
  map: map,
  packages: packages
});

})(this);
