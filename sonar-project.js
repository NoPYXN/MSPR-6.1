const sonarqubeScanner = require('sonarqube-scanner');

sonarqubeScanner({
  serverUrl : 'http://localhost:9000',
  token : "il faudras ajouter ici le token SonarQube quand on l'auras activé",
  options : {
    'sonar.projectKey': 'la clé de projet ce trouve quand on activeras sonarQube aussi ',
    'sonar.sources': 'src',
    'sonar.tests': '__tests__',
    'sonar.inclusions' : '**', // ça prend donc tout les fichiers sauf ceux du gitignor
    'sonar.test.inclusions': 'src/**/*.spec.js,src/**/*.test.js',
    'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
    'sonar.testExecutionReportPaths': 'reports/test-report.xml'
  }
}, () => {});
