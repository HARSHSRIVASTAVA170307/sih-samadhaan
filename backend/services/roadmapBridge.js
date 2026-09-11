const { spawn } = require('child_process');
const path = require('path');

const PYTHON = process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3');
const BRIDGE_SCRIPT = path.join(__dirname, 'roadmap_bridge.py');

/**
 * Spawn `python roadmap_bridge.py '<json>'` and collect stdout.
 * SkillRoute's agent can take a while (LLM call + retries), so callers pass a
 * generous timeout.
 */
function spawnPythonBridge({ action, payload, timeoutMs = 120000 }) {
  return new Promise((resolve, reject) => {
    let child;
    try {
      child = spawn(
        PYTHON,
        [BRIDGE_SCRIPT, JSON.stringify({ action, payload })],
        {
          cwd: path.join(__dirname, '..'),
          env: process.env, // passes GROQ_API_KEY through to the Python agent
          windowsHide: true,
        }
      );
    } catch (e) {
      reject(e);
      return;
    }

    let stdout = '';
    let stderr = '';
    let settled = false;

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      try { child.kill(); } catch { /* noop */ }
      const err = new Error('Roadmap generation timed out. Please try again.');
      err.status = 504;
      reject(err);
    }, timeoutMs);

    child.stdout.on('data', (d) => { stdout += d; });
    child.stderr.on('data', (d) => { stderr += d; });

    child.on('error', (e) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (e.code === 'ENOENT') {
        const err = new Error(
          'Python is not available. Install Python 3.10+ and make sure `python` is on PATH.'
        );
        err.status = 500;
        reject(err);
        return;
      }
      reject(e);
    });

    child.on('close', (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);

      if (code !== 0 && !stdout.trim()) {
        const err = new Error(stderr.trim() || `Roadmap bridge exited with code ${code}`);
        err.status = 500;
        reject(err);
        return;
      }

      let parsed;
      try {
        parsed = JSON.parse(stdout.trim().split('\n').pop());
      } catch {
        const err = new Error(
          `Could not parse bridge output. ${stderr.trim().slice(0, 300)}`
        );
        err.status = 500;
        reject(err);
        return;
      }

      if (!parsed.ok) {
        const err = new Error(parsed.error || 'Roadmap generation failed.');
        err.status = 502;
        reject(err);
        return;
      }

      resolve(parsed.result);
    });
  });
}

module.exports = { spawnPythonBridge };
