// Exercise the PHP guards with real PHP, without a live WordPress or external requests.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { before, after, test } from 'node:test';
import { PHP } from '@php-wasm/universal';
import { loadNodeRuntime } from '@php-wasm/node';

let php;
const security = await readFile(new URL('../theme/inc/security.php', import.meta.url), 'utf8');
const functions = await readFile(new URL('../theme/functions.php', import.meta.url), 'utf8');
const booking = functions.slice(functions.indexOf('function phaness_booking_config()'), functions.indexOf('/**\n * Booking destination,'));
const stubs = `define('ABSPATH', '/'); $hooks = array();
function add_filter($name, $callback, $priority = 10) { global $hooks; $hooks[$name] = $callback; }
function is_admin() { return false; } function wp_doing_ajax() { return false; }
function wp_is_json_request() { return !empty($GLOBALS['json']); } function is_customize_preview() { return false; }
function __return_false() { return false; } function __return_zero() { return 0; }
`;
before(async () => {
  php = new PHP(await loadNodeRuntime('8.3', { emscriptenOptions: { processId: process.pid } }));
  php.writeFile('/security.php', security);
});
after(() => php?.exit());
async function run(code) {
  const response = await php.run({ code: '<?php ' + code });
  assert.equal(response.errors, '');
  return JSON.parse(response.text);
}

test('public headers protect documents and preserve an existing CSP', async () => {
  const data = await run(stubs + `require '/security.php';
    $base = phaness_public_security_headers(array('X-Pingback' => 'ignored'));
    $kept = phaness_public_security_headers(array('content-security-policy' => "default-src 'none'"));
    $GLOBALS['json'] = true;
    $json = phaness_public_security_headers(array('Content-Type' => 'application/json'));
    echo json_encode(array($base, $kept, $json));`);
  assert.equal(data[0]['Referrer-Policy'], 'no-referrer');
  assert.equal(data[0]['X-Content-Type-Options'], 'nosniff');
  assert.equal(data[0]['X-Frame-Options'], 'SAMEORIGIN');
  assert.match(data[0]['Content-Security-Policy'], /frame-ancestors 'self'/);
  assert.match(data[0]['Content-Security-Policy'], /frame-src 'self' https:\/\/calendly\.com/);
  assert.equal(data[0]['X-Pingback'], undefined);
  assert.equal(data[1]['content-security-policy'], "default-src 'none'");
  assert.equal(data[1]['Content-Security-Policy'], undefined);
  assert.deepEqual(data[2], { 'Content-Type': 'application/json' });
});

test('pingbacks are removed while unrelated XML-RPC methods remain', async () => {
  const data = await run(stubs + `require '/security.php';
    $methods = $hooks['xmlrpc_methods'](array('pingback.ping'=>'a','pingback.extensions.getPingbacks'=>'b','wp.getPosts'=>'c'));
    echo json_encode(array($methods, $hooks['comments_open'](), $hooks['pings_open'](), $hooks['pre_option_show_avatars']()));`);
  assert.deepEqual(data, [{ 'wp.getPosts': 'c' }, false, false, 0]);
});

test('booking accepts only the declared Calendly HTTPS destination', async () => {
  const cases = [
    ['https://calendly.com/rafael-delbecq/appel-de-decouverte-phaness', true],
    ['https://CALENDLY.COM/event', true],
    ['https://calendly.com:443/event', true],
    ['http://calendly.com/event', false],
    ['https://calendly.com.attacker.invalid/event', false],
    ['https://attacker.invalid/calendly.com/event', false],
    ['https://user:pass@calendly.com/event', false],
    ['https://calendly.com:8443/event', false],
    ['https://calendly.com/', false],
    ['', false],
  ];
  for (const [url, allowed] of cases) {
    const value = await run(`define('PHANESS_BOOKING_URL', base64_decode('${Buffer.from(url).toString('base64')}'));
      function wp_parse_url($url) { return parse_url($url); } function esc_url_raw($url) { return $url; }
      ${booking} echo json_encode(phaness_booking_config() !== null);`);
    assert.equal(value, allowed, url);
  }
});
