/**
 * Take real-mobile-emulated screenshots of the calculator.
 *
 *   npm run screenshots              # against http://localhost:3000
 *   npm run screenshots -- --prod    # against the live URL
 *
 * Writes PNGs to ./screenshots/. Headless Chrome alone does NOT honor the
 * meta viewport without a real device descriptor, so use Playwright's
 * `devices` rather than `--window-size` flags.
 */
import { chromium, devices } from "playwright";

const BASE =
  process.argv.includes("--prod")
    ? "https://hong-tax-calculator.vercel.app"
    : "http://localhost:3000";

const TARGETS = [
  { name: "iphone-se", device: devices["iPhone SE"], path: "/" },
  { name: "iphone-14", device: devices["iPhone 14"], path: "/?income=2000000" },
  { name: "ipad-mini", device: devices["iPad Mini"], path: "/?income=500000" },
  {
    name: "ipad-pro",
    device: devices["iPad Pro 11"],
    path: "/?income=200000",
  },
  {
    name: "desktop-1440",
    viewport: { width: 1440, height: 900 },
    path: "/?income=2000000",
  },
];

async function main() {
  const browser = await chromium.launch();
  for (const t of TARGETS) {
    const ctx = await browser.newContext({
      ...(t.device ?? {}),
      ...(t.viewport ? { viewport: t.viewport } : {}),
    });
    const page = await ctx.newPage();
    await page.goto(BASE + t.path, { waitUntil: "networkidle" });

    // Surface any console errors so we don't silently miss client-side bugs.
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(`console: ${m.text()}`);
    });

    // Confirm zero horizontal overflow at this viewport. Use a string-eval
    // expression rather than a closure so tsx's __name annotations don't leak.
    const overflow = (await page.evaluate(`(() => {
      var out = [];
      var stack = [[document.body, 0]];
      while (stack.length) {
        var pair = stack.pop();
        var el = pair[0]; var depth = pair[1];
        if (depth > 14) continue;
        // Skip decorative subtrees — they're typically clipped by parent overflow.
        if (el.getAttribute && el.getAttribute('aria-hidden') === 'true') continue;
        var r = el.getBoundingClientRect();
        if (r.right > window.innerWidth + 0.5) {
          out.push({
            tag: el.tagName,
            cls: typeof el.className === "string" ? el.className.slice(0, 80) : "",
            excess: Math.round(r.right - window.innerWidth),
          });
        }
        for (var i = 0; i < el.children.length; i++) {
          stack.push([el.children[i], depth + 1]);
        }
      }
      return {
        vw: window.innerWidth,
        bodyW: document.body.scrollWidth,
        overflow: out.slice(0, 5),
      };
    })()`)) as { vw: number; bodyW: number; overflow: { tag: string; cls: string; excess: number }[] };

    const file = `screenshots/${t.name}.png`;
    await page.screenshot({ path: file, fullPage: true });
    const ok = overflow.overflow.length === 0 && errors.length === 0 ? "✓" : "✗";
    console.log(
      `${ok} ${t.name.padEnd(14)} vw=${overflow.vw} body=${overflow.bodyW} overflow=${overflow.overflow.length} errors=${errors.length}`,
    );
    if (overflow.overflow.length > 0) {
      console.log("  overflow:", JSON.stringify(overflow.overflow));
    }
    if (errors.length > 0) {
      console.log("  errors:", errors.join("\n           "));
    }
    await ctx.close();
  }
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
