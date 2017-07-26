const fs = require('fs-extra');
const path = require('path');

const rollup = require('rollup');
const bublePlugin = require('rollup-plugin-buble');
const vuePlugin = require('rollup-plugin-vue');
const uglifyPlugin = require('rollup-plugin-uglify');

const postcss = require('postcss');
const precss = require('precss');
const unPrefix = require('postcss-unprefix');
const autoprefixer = require('autoprefixer');
const triangle = require('postcss-triangle');
const processor = postcss([precss, triangle, unPrefix, autoprefixer]);

//const prettier = require('prettier-eslint');

const CleanCss = require('clean-css');
let cssCleaner = new CleanCss({
  format: {
    breaks: {
      // controls where to insert breaks
      afterAtRule: true, // controls if a line break comes after an at-rule; e.g. `@charset`; defaults to `false`
      afterBlockBegins: true, // controls if a line break comes after a block begins; e.g. `@media`; defaults to `false`
      afterBlockEnds: true, // controls if a line break comes after a block ends, defaults to `false`
      afterComment: true, // controls if a line break comes after a comment; defaults to `false`
      afterProperty: true, // controls if a line break comes after a property; defaults to `false`
      afterRuleBegins: true, // controls if a line break comes after a rule begins; defaults to `false`
      afterRuleEnds: true, // controls if a line break comes after a rule ends; defaults to `false`
      beforeBlockEnds: true, // controls if a line break comes before a block ends; defaults to `false`
      betweenSelectors: true // controls if a line break comes between selectors; defaults to `false`
    },
    spaces: {
      // controls where to insert spaces
      aroundSelectorRelation: true, // controls if spaces come around selector relations; e.g. `div > a`; defaults to `false`
      beforeBlockBegins: true, // controls if a space comes before a block begins; e.g. `.block {`; defaults to `false`
      beforeValue: true // controls if a space comes before a value; e.g. `width: 1rem`; defaults to `false`
    },
    indentBy: 2
  }
});

//const: source path & dist path
const srcRoot = path.resolve(__dirname, '..', 'src');
const distRoot = path.join(__dirname, '..', 'dist');

const cssEntry = path.join(srcRoot, 'css', 'index.pcss');
const cssDist = path.join(distRoot, 'sparrow-ui.css');

const scriptEntry = path.join(srcRoot, 'index.js');
const scriptDist = path.join(distRoot, 'sparrow.js');

async function processScript() {
  try {
    let bundle = await rollup.rollup({
      entry: scriptEntry,
      moduleName: 'sparrow',
      plugins: [vuePlugin(), bublePlugin()] //, uglifyPlugin()
    });
    bundle.write({
      format: 'umd',
      useStrict: false,
      moduleName: 'sparrow',
      dest: scriptDist
    });
  } catch (error) {
    console.error(error);
  }
}

async function processCss() {
  let css = fs.readFileSync(cssEntry);
  try {
    let result = await processor.process(css, {
      from: cssEntry,
      to: cssDist
    });
    let warnings = result.warnings();
    for (let i = 0, len = warnings.length; i < len; i++) {
      console.warn(warnings[i].text);
    }
    let styles = cssCleaner.minify(result.css).styles;
    fs.writeFileSync(cssDist, styles);
    //复制字体文件夹
    //fs.copySync(path.join(srcRoot, 'fonts'), path.join(distRoot, 'fonts'));
    console.log('done.');
  } catch (error) {
    console.error(error);
  }
}

async function processEntry() {
  await processScript();
  await processCss();
}

processEntry();
