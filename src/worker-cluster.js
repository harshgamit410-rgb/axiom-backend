import cluster from "cluster";
import os from "os";

const numWorkers = os.cpus().length;

if (cluster.isPrimary) {

console.log("Starting worker cluster:", numWorkers);

for (let i = 0; i < numWorkers; i++) {
cluster.fork();
}

cluster.on("exit", (worker) => {
console.log("Worker died, restarting...");
cluster.fork();
});

} else {

import("./worker-queue.js");

}
