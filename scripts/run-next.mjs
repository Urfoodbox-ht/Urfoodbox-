import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const mode = process.argv[2] === 'start' ? 'start' : 'dev';

const port =
  process.env.NGINX_PORT || process.env.DEFAULT_APP_PORT
    ? String(Number(process.env.DEFAULT_APP_PORT) || 3000)
    : String(Number(process.env.PORT) || 3000);

const standaloneServer = path.resolve(process.cwd(), '.next', 'standalone', 'server.js');
const useStandalone = mode === 'start' && fs.existsSync(standaloneServer);

const cmd = useStandalone
  ? process.execPath
  : path.resolve(process.cwd(), 'node_modules', '.bin', 'next');

const args = useStandalone ? [standaloneServer] : [mode, '-H', '0.0.0.0', '-p', port];

const child = spawn(cmd, args, {
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: port,
    HOSTNAME: '0.0.0.0',
  },
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
