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

// Little zookeeper test routine...
app.get('/zoo', async (req, res) => {

  try {

    let zooAccess = new Promise<string>((resolve, reject) => {
      let result: string = "Get received\n";
      console.log("Connecting");
      try {
        const client = zookeeper.createClient('zoo1:2181', { sessionTimeout: 1000, spinDelay: 10, retries: 0 });
        client.on("state", (state) => {
          console.log(state.name + state.name);
        })
        client.once('connected', function () {
          console.log("Connected");
          result += 'Connected to the server.\n';
          client.exists("/TestNode", (ex, stat) => {
            console.log("Exist executed");
            result += 'Exist executed.\n';
            if (ex) {
              client.close();
              reject(ex);
              return;
            }
            if (stat == null) {
              console.log("ZNode does not exist.. creating.");
              client.create("/TestNode", new Buffer('{ "test": "ok"}'), zookeeper.CreateMode.PERSISTENT, (ex, path) => {
                console.log("Create executed");
                result += 'Create executed.\n';
                if (ex) {
                  client.close();
                  reject(ex);
                  return;
                }
                console.log("Successfully created Zookeeper node");
                client.close();
                resolve(result + '\nOK');
                return;
              });

            } else {
              console.log("ZNode does exist.. getting value.");
              client.getData("/TestNode", (ex, data) => {
                console.log("Get executed");
                if (ex) {
                  client.close();
                  reject(ex);
                  return;
                }
                console.log("Successfully queried Zookeeper node: " + data.toJSON());
                result += data.toString() + "\n";
                resolve(result + '\nOK');

                client.close();
                return;
              });
            }
          });

        });
        client.connect();
        console.log("Connecting in progress");
      } catch (ex) {

        console.log("Error");
        reject(ex)
      }
    });


    const result = await zooAccess;
    res.send(result);

  } catch (ex) {
    res.status(500);
    res.send(JSON.stringify(ex));
  }

});


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);