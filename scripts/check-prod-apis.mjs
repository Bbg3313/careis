const body = JSON.stringify({
  items: [{ productSlug: "sun-pack", quantity: 1 }],
  referralCode: "sin",
});

const quote = await fetch("https://careis-mall.vercel.app/api/order-quote", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body,
});
console.log("quote sin", quote.status, await quote.json());

const strip = await fetch("https://careis-mall.vercel.app/api/promo-countdown-strip?ref=sin");
console.log("strip sin", strip.status, await strip.json());

const exp = await fetch("https://careis-mall.vercel.app/api/admin/orders/export?status=PAID&scope=general");
console.log("export unauth", exp.status, await exp.text().then((t) => t.slice(0, 200)));
