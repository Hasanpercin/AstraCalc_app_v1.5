Local diagnostic steps to run (copy & paste into your terminal):

1) Clean and reinstall with legacy peer deps (shows full logs):

   npm ci --force || true
   rm -rf node_modules package-lock.json
   npm cache clean --force
   npm install --legacy-peer-deps --loglevel verbose 2>&1 | tee npm-install.log

2) Check installed versions:

   node -e "console.log(require('./node_modules/typescript/package.json').version)" || echo typescript_missing
   node -e "console.log(require('./node_modules/@types/react/package.json').version)" || echo atypes_react_missing
   node -e "console.log(require('./node_modules/react-test-renderer/package.json').version)" || echo rtr_missing

3) Start Expo and capture output:

   npx expo start --tunnel --non-interactive 2>&1 | tee expo-start.log

4) If you see ERESOLVE errors, rerun with:

   npm install --legacy-peer-deps --loglevel verbose 2>&1 | tee npm-install-fix.log

Notes:
- One MCP package, @modelcontextprotocol/server-playwright, returned 404 earlier — it's not published in the registry. Use the other servers instead or contact MCP package maintainer.
- Common root causes for repeated install failures: strict npm peer dependency resolution (use --legacy-peer-deps), corrupted npm cache (~/.npm) or permission issues, and conflicting minor versions between react and react-test-renderer/@types/react.

If you run the above and attach npm-install.log and expo-start.log, I will parse them and provide precise edits to package.json or targeted installs to resolve the failures.
