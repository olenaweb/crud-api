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

  if (existsSync(dbFilePath)) {
    unlinkSync(dbFilePath);
    console.log("🗑️  Cleared users.json database");
  }

  if (existsSync(lockFilePath)) {
    unlinkSync(lockFilePath);
    console.log("🔓 Removed lock file");
  }

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

    req.pipe(proxy, { end: true });
  });

  loadBalancer.listen(BASE_PORT, () => {
    console.log(`Load balancer is listening on http://localhost:${BASE_PORT}`);
  });
} else {
  process.env.MULTI_MODE = "true";
  import("./index");
}
