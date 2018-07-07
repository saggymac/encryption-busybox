const nic = require('./networkInterfaceInfo');
const webInterfaces = nic.getIp4Interfaces();
const environment = JSON.stringify( process.env, null, 4 );
const nodeVersion = JSON.stringify( process.release, null, 4);

exports.whereAmI = function(req, res) {
  let showHowToFindMe = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Where am I?</title>
      </head>
      <body>
        <h1>Local Environment Information</h1>
        <br><br><br><br>
        <h2>http://${webInterfaces[0]}:3000/</h2>
        <p><strong>Environment:</strong></p>
        <p><pre>${environment}</pre></p>
        <p><strong>Node Release:</strong></p>
        <p><pre>${nodeVersion}</pre></p>
      </body>
    </html>`;
  res.send(showHowToFindMe);
};