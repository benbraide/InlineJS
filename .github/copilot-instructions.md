# InlineJS Development Instructions

InlineJS is a component-based reactive JavaScript framework inspired by Alpine.js. It runs JavaScript code by embedding them in HTML using elements as context without creating shadow DOMs.

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Bootstrap, Build, and Test the Repository
1. Install dependencies:
   - `npm install` -- takes ~10-15 seconds. Set timeout to 60+ seconds.
   
2. Compile TypeScript to CommonJS and ESM formats:
   - `npm run compile` -- takes ~5 seconds. Set timeout to 60+ seconds.
   - Compiles to `lib/common/` and `lib/esm/` directories
   
3. Build distribution bundles:
   - `npm run build` -- takes ~10 seconds. Set timeout to 60+ seconds.
   - Creates `dist/inlinejs.js` (development) and `dist/inlinejs.min.js` (production)
   - Uses webpack with TypeScript compilation
   
4. Run tests:
   - `npm run test` -- takes ~5 seconds. **EXPECT 7 FAILING TESTS** (interpolation-related, known issues). Set timeout to 60+ seconds.
   - `npm run ts-test` -- takes ~8 seconds for TypeScript tests directly. Set timeout to 60+ seconds.
   - 65 tests pass, 7 fail (interpolation functionality has known issues)

### Development Workflow
- **ALWAYS** run `npm install && npm run compile && npm run build` after cloning
- **ALWAYS** run tests with `npm run test` to validate changes
- Use `npm run ts-test` for faster TypeScript test iteration during development
- Use `npm run dbg-test` for debugging tests with inspector

## Validation

### Manual Testing Requirements
After making changes, ALWAYS validate functionality by:
1. Building the project: `npm run build`
2. Testing the distribution files work in a browser context
3. Running the test suite: `npm run test`
4. Verifying that 65 tests pass (7 interpolation tests will fail - this is expected)

### Build Outputs
- `lib/common/` - CommonJS compiled TypeScript
- `lib/esm/` - ES Modules compiled TypeScript  
- `dist/inlinejs.js` - Development bundle (292KB)
- `dist/inlinejs.min.js` - Production bundle (117KB)

### Testing Framework Integration
- Uses Mocha with jsdom-global for DOM testing
- TypeScript tests in `src/test/` directory
- Compiled tests in `lib/common/test/` and `lib/esm/test/`
- Test subjects: Changes, Config, Directives, Expansion, Interpolation, Proxy, Range, Utilities

## Common Tasks

### File Structure Reference
```
/home/runner/work/InlineJS/InlineJS/
├── README.md              # Main documentation
├── LICENSE                # MIT License
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript CommonJS config  
├── tsconfig.esm.json      # TypeScript ESM config
├── webpack.config.js      # Development build
├── webpack2.config.js     # Production build
├── src/                   # TypeScript source code
│   ├── index.ts          # Main export file
│   ├── entry.ts          # Initialization entry point
│   ├── inlinejs.ts       # Auto-initialization file
│   └── test/             # Test files (*.spec.ts)
├── lib/                   # Compiled TypeScript output
│   ├── common/           # CommonJS modules
│   └── esm/              # ES modules
└── dist/                  # Webpack bundles
    ├── inlinejs.js       # Development bundle
    └── inlinejs.min.js   # Production bundle
```

### Key TypeScript Configuration
- Target: ES2015
- Module: CommonJS (main), ES2015 (ESM)
- Strict mode enabled
- Declaration files generated
- Source in `src/`, output to `lib/common/` and `lib/esm/`

### NPM Scripts Reference
- `npm install` - Install dependencies (~15 seconds)
- `npm run compile` - TypeScript compilation (~5 seconds)  
- `npm run build` - Webpack bundling (~10 seconds)
- `npm run test` - Run Mocha tests (~5 seconds, 65 pass/7 fail expected)
- `npm run ts-test` - Run TypeScript tests directly (~8 seconds)
- `npm run dbg-test` - Debug tests with inspector
- `npm run download` - Install and audit fix
- `npm run upload` - Build and publish

### TIMEOUT REQUIREMENTS
**NEVER CANCEL builds or tests.** All commands complete quickly:
- Set minimum 60+ second timeouts for all npm commands
- Build times are fast (~5-15 seconds each) but use generous timeouts
- Tests complete in ~5-8 seconds but may vary in CI environments

### Framework Usage Patterns
The framework uses:
- `hx-data` directive to define reactive scope
- `hx-text`, `hx-show`, `hx-class` for DOM manipulation
- `hx-on:` for event handling (e.g., `hx-on:click`)
- Text interpolation with `{{ }}` syntax
- Reactive state management without virtual DOM

### Development Notes
- No linting or formatting tools configured
- Uses DOMPurify for sanitization
- Framework works directly with DOM elements
- TypeScript definitions included in build output
- Supports both browser script tags and npm module imports

### Known Issues
- 7 interpolation tests fail consistently (not blocking for development)
- No GitHub Actions workflows for CI (only Copilot workflow exists)
- No eslint/prettier configuration in root
- Security warning: Uses `new Function()` for expression evaluation