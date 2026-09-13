import { ShoppingBag, ArrowUpRight, Cable, Plug, Gauge, Cog, Disc, Package } from "lucide-react";
import { shopItems } from "../data/mockData.js";

const icons = {
  "type2-cable": Cable,
  "portable-charger": Plug,
  "obd-dongle": Gauge,
  "extension-reel": Cog,
  "tyre-inflator": Disc,
  "cable-organizer": Package,
};

export default function Shop() {
  return (
    <div className="container" style={{ paddingBottom: 56 }}>
      <div className="page-header">
        <h1>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <ShoppingBag size={26} /> Shop EV accessories
          </span>
        </h1>
        <p>
          Handy gear for charging and looking after your EV. Every card opens
          Amazon in a new tab, where you can compare options and add to cart.
        </p>
      </div>

      <div className="grid grid-3">
        {shopItems.map((item) => {
          const Icon = icons[item.id] || Package;
          const amazonUrl = `https://www.amazon.in/s?k=${encodeURIComponent(
            item.amazonQuery
          )}`;
          return (
            <a
              key={item.id}
              href={amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shop-card"
            >
              <div className="shop-card-icon">
                <Icon size={20} />
              </div>
              <div className="shop-card-title">{item.name}</div>
              <div className="shop-card-desc">{item.description}</div>
              <div className="shop-card-cta">
                Shop on Amazon <ArrowUpRight size={14} />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
