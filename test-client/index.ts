import express from "express";
import zookeeper from "node-zookeeper-client";
import option from "node-zookeeper-client";
import state from "node-zookeeper-client";
import { Promise as Promise2 } from "bluebird";
import { STATUS_CODES } from "http";

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const VERSION = process.env.npm_package_version

// App
const app = express();
app.get('/', (req, res) => {
  res.send(`${VERSION} Hello world\n`);
});

interface ZooKeeperClient2 extends zookeeper.Client {
  existsAsync(path: String): Promise<zookeeper.Stat>;
  createAsync(path: String, data: Buffer, mode: zookeeper.ACL | number) : Promise<string>;
  getDataAsync(path: String) : Promise<Buffer>;
}

// Little zookeeper test routine...
app.get('/zoo', async (req, res) => {

  try {

    let zooAccess = new Promise<string>(async (resolve, reject) => {
      let result: string = `${VERSION} - Get received\n`;
      console.log("Connecting");
      try {
        const client: ZooKeeperClient2 = <any>Promise2.promisifyAll(zookeeper.createClient('zoo1:2181', { sessionTimeout: 1000, spinDelay: 10, retries: 0 }));

        // Log stat changes
        client.on("state", (state) => {
          console.log(state.name + state.name);
        })

        // Wait for connect
        client.once('connected', async () => {
          console.log("Connected");
          result += 'Connected to the server.\n';

          const stat = await client.existsAsync("/TestNode");
          console.log("Exist executed");
          result += 'Exist executed.\n';

          if (stat == null) {
            // ZNode does not exist yet
            console.log("ZNode does not exist.. creating.");
            var path = client.createAsync("/TestNode", new Buffer('{ "test": "ok"}'), zookeeper.CreateMode.PERSISTENT);
            console.log("Create executed");
            result += 'Create executed.\n';
          } else {
            // ZNode does exist
            console.log("ZNode does exist.. getting value.");
            const data = await client.getDataAsync("/TestNode");
            console.log("Get executed");
            console.log("Successfully queried Zookeeper node: " + data.toJSON());
            result += data.toString() + "\n";
          }
          client.close();
          resolve(result + '\nOK');
          return;
      });

        // Now connect
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
console.log(`Running V${VERSION} on http://${HOST}:${PORT}`);