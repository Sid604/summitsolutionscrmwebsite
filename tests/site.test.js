const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

// Check published routes, evidence assets, punctuation, and structured data.
const pages = ['index.html', 'speed-to-lead-guide.html', 'privacy.html', 'terms.html',
  ...fs.readdirSync(path.join(root, 'blog')).filter(f => f.endsWith('.html')).map(f => 'blog/' + f)];
for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), 'utf8');
  assert(!/—|&mdash;|&#(?:8212|x2014);/i.test(html), `${page}: em dash`);
  for (const [, attrs, code] of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (attrs.includes('ld+json')) JSON.parse(code);
    else new vm.Script(code, { filename: page });
  }
  for (const [, value] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(?:https?:|mailto:|tel:|data:)/.test(value)) continue;
    const [route, fragment] = value.split('#');
    const file = route ? path.resolve(route.startsWith('/') ? root : path.dirname(path.join(root, page)), route.replace(/^\//, '')) : path.join(root, page);
    const target = fs.existsSync(file) && fs.statSync(file).isDirectory() ? path.join(file, 'index.html') : file;
    assert(fs.existsSync(target), `${page}: missing ${value}`);
    if (fragment) assert(fs.readFileSync(target, 'utf8').includes(`id="${fragment}"`), `${page}: missing anchor ${value}`);
  }
}
const article = 'blog/estimate-follow-up-sms-email.html';
for (const file of ['sitemap.xml', 'llms.txt', 'blog/index.html']) {
  assert(fs.readFileSync(path.join(root, file), 'utf8').includes(article), `${file}: estimate article missing`);
}
const journey = home.split('<!-- TIEP D. CASE STUDY -->')[1].split("<!-- WHAT'S INCLUDED -->")[0];
assert(!/assets\/cycle-|Mario|estimate\.png/.test(journey), 'Journey mixes customer evidence');
assert.equal((journey.match(/class="cy-step/g) || []).length, 4);
assert(journey.includes('sold $26k Tiep Dang'));
assert.equal(8000 * .25, 2000);

// Exercise the timeline with a deterministic clock: sequence, pause, offscreen,
// visibility changes, and reduced motion must never leave a repeating timer running.
function classes() {
  const values = new Set();
  return { add: v => values.add(v), remove: v => values.delete(v), contains: v => values.has(v),
    toggle(v, enabled) { enabled ? values.add(v) : values.delete(v); } };
}
const timers = new Map(), observers = [], documentEvents = {}, motionEvents = {}, buttonEvents = {};
let timerId = 0;
const motion = { matches: false, addEventListener: (name, fn) => { motionEvents[name] = fn; } };
const button = { hidden: true, textContent: '', setAttribute(name, value) { this[name] = value; }, addEventListener: (name, fn) => { buttonEvents[name] = fn; } };
const demos = Array.from({ length: 4 }, () => {
  const steps = Array.from({ length: 3 }, () => ({ dataset: { step: '100' }, classList: classes() }));
  return { dataset: { hold: '500' }, classList: classes(), steps, querySelectorAll: () => steps };
});
const document = { hidden: false, documentElement: { classList: classes() }, getElementById: () => button,
  querySelectorAll: () => demos, addEventListener: (name, fn) => { documentEvents[name] = fn; } };
const start = home.indexOf('  // ---- how-it-works timeline player ----');
const end = home.indexOf('  // ---- reveal on scroll ----', start);
vm.runInNewContext(home.slice(start, end), {
  window: { matchMedia: () => motion, dispatchEvent() {} }, document,
  Event: function Event() {},
  setTimeout(fn) { const id = ++timerId; timers.set(id, fn); return id; },
  clearTimeout(id) { timers.delete(id); },
  IntersectionObserver: function IntersectionObserver(callback) {
    this.observe = () => observers.push(callback);
  }
});
function tick() {
  const [id, callback] = timers.entries().next().value;
  timers.delete(id); callback();
}
assert.equal(timers.size, 0, 'Offscreen demos must not run');
observers[0]([{ isIntersecting: true }]);
tick();
assert(demos[0].steps[0].classList.contains('show'));
assert(!demos[0].steps[1].classList.contains('show'), 'Later steps must wait');
tick(); tick();
assert(demos[0].classList.contains('done'), 'Final step must complete the sequence');
observers[0]([{ isIntersecting: false }]);
assert.equal(timers.size, 0, 'Leaving viewport must clear the loop');
observers[0]([{ isIntersecting: true }]);
buttonEvents.click();
assert.equal(button['aria-pressed'], 'true');
assert.equal(timers.size, 0, 'Pause must clear the loop');
assert(demos.every(d => d.steps.every(s => s.classList.contains('show'))), 'Paused demos must remain readable');
buttonEvents.click();
assert.equal(timers.size, 1, 'Resume restarts only visible demos');
motion.matches = true; motionEvents.change();
assert(button.hidden);
assert.equal(timers.size, 0, 'Reduced motion must not loop');
motion.matches = false; motionEvents.change();
document.hidden = true; documentEvents.visibilitychange();
assert.equal(timers.size, 0, 'Background tabs must not loop');
document.hidden = false; documentEvents.visibilitychange();
assert.equal(timers.size, 1);

console.log(`Passed: ${pages.length} pages, internal links, JSON-LD, evidence journey, and demo lifecycle`);
