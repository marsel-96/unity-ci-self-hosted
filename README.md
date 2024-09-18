# Unity CI Self Hosted

# Package
```
npm run package'
```

# Test Script Locally

### Install ts-node
```
npm install -g ts-node typescript '@types/node'
```

### Set environment variables

```
$env:GITHUB_WORKSPACE = 'C:\Users\marco\Desktop\actions-runner\_work\test-game-ci\test-game-ci'
$env:INPUT_UNITYVERSION = '2022.3.43f1'
$env:INPUT_UNITYARTIFACTSPATH = 'artifacts'
$env:INPUT_UNITYTESTMODE = 'all'
$env:INPUT_UNITYCUTOMARGUMENTS = ''
```

### Run index.ts

```
ts-node src/index.ts
```