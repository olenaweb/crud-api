import { EOL } from "os";

import "dotenv/config";
import cluster from "cluster";
import { availableParallelism } from "os";
import http from "http";
import { unlinkSync, existsSync } from "fs";
import { resolve } from "path";

export const BASE_PORT = process.env.PORT
  ? parseInt(process.env.PORT, 10)
  : 4000;
const numCPUs = availableParallelism() - 1;
const workers: number[] = [];

if (cluster.isPrimary) {
  console.log(`Master started (PID: ${process.pid})`);

  const dbFilePath = resolve(process.cwd(), "users.json");
  const lockFilePath = resolve(process.cwd(), "users.json.lock");

  function cleanup() {
    try {
      if (existsSync(dbFilePath)) {
        unlinkSync(dbFilePath);
      }
    } catch (err) {
      console.error(" Error deleting temporary files:", err);
    }

    try {
      if (existsSync(lockFilePath)) {
        unlinkSync(lockFilePath);
      }
    } catch (err) {
      console.error(" Error deleting temporary files:", err);
    }
  }

  cleanup();

  process.on("exit", () => {
    cleanup();
  });

  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} died with code ${code} and signal ${signal}`
    );

    const aliveWorkers = Object.keys(cluster.workers || {}).length;
    if (aliveWorkers === 0) {
      cleanup();
    }
  });

  for (let i = 0; i < numCPUs; i++) {
    const port = BASE_PORT + i + 1;
    const worker = cluster.fork({ PORT: port });
    workers.push(port);
    console.log(`Worker ${worker.process.pid} -> port ${port}`);
  }

  // Round-robin balancer
  let current = 0;

  const loadBalancer = http.createServer((req, res) => {
    const targetPort = workers[current];
    current = (current + 1) % workers.length;

    const options = {
      hostname: "localhost",
      port: targetPort,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    const proxy = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    proxy.on("error", (err) => {
      console.error("Proxy error:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal server error" }));
    });

    req.pipe(proxy, { end: true });
  });

  loadBalancer.listen(BASE_PORT, () => {
    console.log(
      `✅ Load balancer is listening on http://localhost:${BASE_PORT}${EOL}`
    );
    console.log(`to exit press Ctrl-C`);
  });

  process.on("SIGINT", () => {
    console.log("\n Received SIGINT (Ctrl+C). Graceful shutdown...");
    cleanup();
    loadBalancer.close(() => {
      console.log(`✅ Load balancer closed${EOL}`);
      process.exit(0);
    });
  });

  process.on("SIGTERM", () => {
    console.log("\n Received SIGTERM. Graceful shutdown...");
    cleanup();
    loadBalancer.close(() => {
      console.log(`✅ Load balancer closed${EOL}`);
      process.exit(0);
    });
  });
} else {
  process.env.MULTI_MODE = "true";
  import("./index");
}
