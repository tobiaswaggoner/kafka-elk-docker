import express from "express";
import zookeeper from "node-zookeeper-client";
import option from "node-zookeeper-client";
import state from "node-zookeeper-client";
import { STATUS_CODES } from "http";

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Hello world\n');
});

app.get('/zoo', async (req, res) => {

  try {

    let zooAccess = new Promise<string>((resolve, reject) => {
      let result: string = "Get received\n";
      console.log("Connecting");
      try {
        const client = zookeeper.createClient('zoo1:2181', { sessionTimeout: 1000, spinDelay: 10, retries: 0} );
        client.on("state", (state) => {
          console.log(state.name + state.name);
        } )
        client.once('connected', function () {
          console.log("Connected");
          result += 'Connected to the server.';

          client.close();
          resolve(result + "OK");
        });
        client.connect();
        console.log("Connecting in progress");
      } catch (ex){

        console.log("Error");
        reject(ex)
      }
    });


    const result = await zooAccess;
    res.send(result);
  } catch (ex) {
    res.status(500);
    res.send(JSON.stringify( ex ));
  }

});


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);