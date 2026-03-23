import { useState, useMemo } from "react";

const FONT_URL = "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,700;1,9..144,400&display=swap";

function SliderInput({ label, unit, min, max, step, value, onChange, color, sublabel }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: "#c4b8a8", letterSpacing: 0.3 }}>{label}</span>
        <span style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 500, color: "#f5e6d0" }}>
          {typeof value === "number" && value % 1 !== 0 ? value.toFixed(2) : value}
          <span style={{ fontSize: 12, color: "#9a8e7e", marginLeft: 3 }}>{unit}</span>
        </span>
      </div>
      {sublabel && <div style={{ fontSize: 11, color: "#7a7060", marginBottom: 6 }}>{sublabel}</div>}
      <div style={{ position: "relative", height: 6, borderRadius: 3, background: "#2a2520" }}>
        <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: `${pct}%`, borderRadius: 3, background: color || "#c8956c", transition: "width 0.15s" }} />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          style={{
            position: "absolute", top: -8, left: 0, width: "100%", height: 22,
            appearance: "none", WebkitAppearance: "none", background: "transparent", cursor: "pointer",
          }}
        />
      </div>
    </div>
  );
}

function NumberInput({ label, value, onChange, prefix, suffix, small }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: small ? 8 : 14 }}>
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#9a8e7e", minWidth: small ? 100 : 140, letterSpacing: 0.2 }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", background: "#1e1a16", borderRadius: 6, border: "1px solid #3a342c", padding: "5px 10px", flex: 1, maxWidth: 140 }}>
        {prefix && <span style={{ color: "#7a7060", fontSize: 13, marginRight: 4 }}>{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          style={{
            background: "transparent", border: "none", outline: "none", color: "#f5e6d0",
            fontFamily: "'Fraunces', serif", fontSize: 15, width: "100%", textAlign: "right"
          }}
        />
        {suffix && <span style={{ color: "#7a7060", fontSize: 12, marginLeft: 4 }}>{suffix}</span>}
      </div>
    </div>
  );
}

function CostBar({ label, cost, total, color }) {
  const pct = total > 0 ? (cost / total) * 100 : 0;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: "#9a8e7e", fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
        <span style={{ fontSize: 13, color: "#f5e6d0", fontFamily: "'Fraunces', serif" }}>${cost.toFixed(4)}</span>
      </div>
      <div style={{ height: 4, borderRadius: 2, background: "#2a2520" }}>
        <div style={{ height: "100%", width: `${pct}%`, borderRadius: 2, background: color, transition: "width 0.3s" }} />
      </div>
    </div>
  );
}

function SectionCard({ title, icon, children }) {
  return (
    <div style={{
      background: "linear-gradient(145deg, #262018 0%, #1e1914 100%)",
      borderRadius: 14, padding: "22px 24px", marginBottom: 16,
      border: "1px solid #3a332a",
      boxShadow: "0 2px 12px rgba(0,0,0,0.3)"
    }}>
      <div style={{
        fontFamily: "'Fraunces', serif", fontSize: 15, fontWeight: 500,
        color: "#d4b896", marginBottom: 18, display: "flex", alignItems: "center", gap: 8,
        borderBottom: "1px solid #332d24", paddingBottom: 12
      }}>
        <span style={{ fontSize: 18 }}>{icon}</span> {title}
      </div>
      {children}
    </div>
  );
}

export default function NootropicCoffeeCalculator() {
  // Ingredient dosages (mg per serving)
  const [coffeeDose, setCoffeeDose] = useState(3000);
  const [alphaDose, setAlphaDose] = useState(300);
  const [lionsDose, setLionsDose] = useState(500);

  // Bulk costs ($ per kg)
  const [coffeeCostKg, setCoffeeCostKg] = useState(12);
  const [alphaCostKg, setAlphaCostKg] = useState(85);
  const [lionsCostKg, setLionsCostKg] = useState(45);

  // Other costs
  const [packagingCost, setPackagingCost] = useState(0.08);
  const [laborCost, setLaborCost] = useState(0.05);
  const [fulfillmentCost, setFulfillmentCost] = useState(0.15);

  // Pricing
  const [retailPrice, setRetailPrice] = useState(2.50);
  const [targetMargin, setTargetMargin] = useState(65);

  const calc = useMemo(() => {
    const coffeePer = (coffeeDose / 1_000_000) * coffeeCostKg;
    const alphaPer = (alphaDose / 1_000_000) * alphaCostKg;
    const lionsPer = (lionsDose / 1_000_000) * lionsCostKg;
    const ingredientTotal = coffeePer + alphaPer + lionsPer;
    const otherTotal = packagingCost + laborCost + fulfillmentCost;
    const totalCost = ingredientTotal + otherTotal;

    const marginFromRetail = retailPrice > 0 ? ((retailPrice - totalCost) / retailPrice) * 100 : 0;
    const priceFromMargin = targetMargin < 100 ? totalCost / (1 - targetMargin / 100) : 0;
    const profitPerUnit = retailPrice - totalCost;

    return { coffeePer, alphaPer, lionsPer, ingredientTotal, otherTotal, totalCost, marginFromRetail, priceFromMargin, profitPerUnit };
  }, [coffeeDose, alphaDose, lionsDose, coffeeCostKg, alphaCostKg, lionsCostKg, packagingCost, laborCost, fulfillmentCost, retailPrice, targetMargin]);

  return (
    <>
      <link href={FONT_URL} rel="stylesheet" />
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 16px; height: 16px; border-radius: 50%;
          background: #f5e6d0; border: 2px solid #c8956c;
          box-shadow: 0 1px 6px rgba(0,0,0,0.4);
          cursor: pointer;
        }
        input[type=range]::-moz-range-thumb {
          width: 16px; height: 16px; border-radius: 50%;
          background: #f5e6d0; border: 2px solid #c8956c;
          box-shadow: 0 1px 6px rgba(0,0,0,0.4); cursor: pointer;
        }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { opacity: 1; }
        * { box-sizing: border-box; }
        ::selection { background: #c8956c44; }
      `}</style>

      <div style={{
        minHeight: "100vh", background: "#141110",
        fontFamily: "'DM Sans', sans-serif", color: "#f5e6d0",
        padding: "24px 16px",
      }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 11, letterSpacing: 4, color: "#7a7060", textTransform: "uppercase", marginBottom: 8 }}>Unit Economics</div>
            <h1 style={{
              fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700,
              margin: 0, background: "linear-gradient(135deg, #f5e6d0 0%, #c8956c 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              GoJoe Coffee Calculator
            </h1>
            <div style={{ fontSize: 12, color: "#6a6050", marginTop: 6 }}>Coffee · Alpha-GPC · Lion's Mane</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* LEFT COLUMN */}
            <div style={{ minWidth: 0 }}>
              <SectionCard title="Dosage per Serving" icon="⚗️">
                <SliderInput label="Instant Coffee" unit="g" min={500} max={8000} step={100} value={coffeeDose} onChange={setCoffeeDose} color="#a0785a" sublabel={`${(coffeeDose / 1000).toFixed(1)}g per sachet`} />
                <SliderInput label="Alpha-GPC" unit="mg" min={50} max={1200} step={25} value={alphaDose} onChange={setAlphaDose} color="#7ab88f" sublabel="Typical: 150–600mg" />
                <SliderInput label="Lion's Mane" unit="mg" min={100} max={2000} step={50} value={lionsDose} onChange={setLionsDose} color="#b89a6a" sublabel="Typical: 250–1000mg" />
              </SectionCard>

              <SectionCard title="Bulk Ingredient Cost" icon="📦">
                <NumberInput label="Coffee" value={coffeeCostKg} onChange={setCoffeeCostKg} prefix="$" suffix="/kg" />
                <NumberInput label="Alpha-GPC" value={alphaCostKg} onChange={setAlphaCostKg} prefix="$" suffix="/kg" />
                <NumberInput label="Lion's Mane" value={lionsCostKg} onChange={setLionsCostKg} prefix="$" suffix="/kg" />
              </SectionCard>

              <SectionCard title="Other Costs (per unit)" icon="🏷️">
                <NumberInput label="Sachet packaging" value={packagingCost} onChange={setPackagingCost} prefix="$" small />
                <NumberInput label="Labor" value={laborCost} onChange={setLaborCost} prefix="$" small />
                <NumberInput label="Fulfillment" value={fulfillmentCost} onChange={setFulfillmentCost} prefix="$" small />
              </SectionCard>
            </div>

            {/* RIGHT COLUMN */}
            <div style={{ minWidth: 0 }}>
              {/* Big cost number */}
              <div style={{
                background: "linear-gradient(145deg, #2e2518 0%, #1e1914 100%)",
                borderRadius: 14, padding: "28px 24px", marginBottom: 16,
                border: "1px solid #4a3f30", textAlign: "center",
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)"
              }}>
                <div style={{ fontSize: 11, letterSpacing: 3, color: "#7a7060", textTransform: "uppercase", marginBottom: 10 }}>Total Cost per Serving</div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 48, fontWeight: 700, color: "#f5e6d0", lineHeight: 1 }}>
                  ${calc.totalCost.toFixed(4)}
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 16, fontSize: 12 }}>
                  <div>
                    <span style={{ color: "#7a7060" }}>Ingredients </span>
                    <span style={{ color: "#c8956c", fontFamily: "'Fraunces', serif" }}>${calc.ingredientTotal.toFixed(4)}</span>
                  </div>
                  <div>
                    <span style={{ color: "#7a7060" }}>Other </span>
                    <span style={{ color: "#c8956c", fontFamily: "'Fraunces', serif" }}>${calc.otherTotal.toFixed(4)}</span>
                  </div>
                </div>
              </div>

              {/* Cost breakdown */}
              <SectionCard title="Cost Breakdown" icon="📊">
                <CostBar label="Coffee" cost={calc.coffeePer} total={calc.totalCost} color="#a0785a" />
                <CostBar label="Alpha-GPC" cost={calc.alphaPer} total={calc.totalCost} color="#7ab88f" />
                <CostBar label="Lion's Mane" cost={calc.lionsPer} total={calc.totalCost} color="#b89a6a" />
                <CostBar label="Packaging" cost={packagingCost} total={calc.totalCost} color="#6a8a9a" />
                <CostBar label="Labor" cost={laborCost} total={calc.totalCost} color="#8a7aaa" />
                <CostBar label="Fulfillment" cost={fulfillmentCost} total={calc.totalCost} color="#aa7a7a" />
              </SectionCard>

              {/* Margin calculator */}
              <SectionCard title="Margin Calculator" icon="💰">
                <div style={{
                  background: "#1a1612", borderRadius: 10, padding: 16, marginBottom: 14,
                  border: "1px solid #332d24"
                }}>
                  <div style={{ fontSize: 11, color: "#7a7060", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Set Retail Price → See Margin</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", background: "#262018", borderRadius: 6, border: "1px solid #3a342c", padding: "6px 12px", flex: 1 }}>
                      <span style={{ color: "#7a7060", marginRight: 4 }}>$</span>
                      <input type="number" step="0.01" value={retailPrice} onChange={(e) => setRetailPrice(parseFloat(e.target.value) || 0)}
                        style={{ background: "transparent", border: "none", outline: "none", color: "#f5e6d0", fontFamily: "'Fraunces', serif", fontSize: 18, width: "100%", textAlign: "right" }} />
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{
                        fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700,
                        color: calc.marginFromRetail >= 50 ? "#7ab88f" : calc.marginFromRetail >= 30 ? "#d4b87a" : "#cc7a6a"
                      }}>
                        {calc.marginFromRetail.toFixed(1)}%
                      </div>
                      <div style={{ fontSize: 10, color: "#7a7060" }}>margin</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: "#9a8e7e", marginTop: 8, fontFamily: "'Fraunces', serif" }}>
                    Profit: <span style={{ color: calc.profitPerUnit >= 0 ? "#7ab88f" : "#cc7a6a" }}>${calc.profitPerUnit.toFixed(4)}</span> per unit
                  </div>
                </div>

                <div style={{
                  background: "#1a1612", borderRadius: 10, padding: 16,
                  border: "1px solid #332d24"
                }}>
                  <div style={{ fontSize: 11, color: "#7a7060", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Set Target Margin → See Price</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", background: "#262018", borderRadius: 6, border: "1px solid #3a342c", padding: "6px 12px", flex: 1 }}>
                      <input type="number" step="1" value={targetMargin} onChange={(e) => setTargetMargin(parseFloat(e.target.value) || 0)}
                        style={{ background: "transparent", border: "none", outline: "none", color: "#f5e6d0", fontFamily: "'Fraunces', serif", fontSize: 18, width: "100%", textAlign: "right" }} />
                      <span style={{ color: "#7a7060", marginLeft: 4 }}>%</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700, color: "#c8956c" }}>
                        ${calc.priceFromMargin.toFixed(2)}
                      </div>
                      <div style={{ fontSize: 10, color: "#7a7060" }}>retail price</div>
                    </div>
                  </div>
                </div>
              </SectionCard>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
