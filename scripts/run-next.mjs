import { spawn } from 'node:child_process';
import path from 'node:path';

const mode = process.argv[2] === 'start' ? 'start' : 'dev';

const port =
  process.env.NGINX_PORT || process.env.DEFAULT_APP_PORT
    ? String(Number(process.env.DEFAULT_APP_PORT) || 3000)
    : String(Number(process.env.PORT) || 3000);

const nextBin = path.resolve(process.cwd(), 'node_modules', '.bin', 'next');

const child = spawn(nextBin, [mode, '-H', '0.0.0.0', '-p', port], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: port,
  },
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
