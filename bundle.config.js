module.exports = {
  bundle: {
    base: {
      scripts: [
          'app/js/*.js', 
          'app/js/controllers/*.js',
          'app/js/services/fitch/*.js',
          'app/js/services/*.js',
          'app/js/services/fitch/rules/*.js',
          'app/js/services/premise/*.js',
          'app/js/services/tables/*.js'
      ],
      styles: 'app/css/*.css',
      options: {
          rev: false,
          uglify: false
      }
    },
    vendor: {
      scripts: [
                './bower_components/jquery/dist/jquery.js',
                './bower_components/bootstrap/dist/js/bootstrap.js',
                './bower_components/angular/angular.js',
                './bower_components/angular-ui-router/release/angular-ui-router.js',
                './bower_components/lodash/lodash.js'
            ],
      styles: './bower_components/bootstrap/dist/css/bootstrap.css',
      options: {
          rev: false,
          uglify: false
      }
    }
  }
};