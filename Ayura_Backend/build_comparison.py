def build_comparison(alt: dict) -> dict:
    """
    Takes one alternative result and builds a
    side-by-side comparison: prescribed vs generic.
    """
    brand_price = alt.get("brand_price_inr", 0)
    generic_price = alt.get("generic_price_inr", 0)
    savings_amount = round(brand_price - generic_price, 2)
    savings_pct = alt.get("savings_percent", 0)

    # Monthly cost estimate (assume 1 strip/pack per medicine)
    monthly_brand = round(brand_price * 3, 2)      # ~3 strips/month
    monthly_generic = round(generic_price * 3, 2)
    monthly_savings = round(monthly_brand - monthly_generic, 2)

    return {
        "medicine": alt.get("brand_name", ""),
        "prescribed": {
            "name": alt.get("brand_name", ""),
            "composition": alt.get("composition", ""),
            "price_inr": brand_price,
            "monthly_cost_inr": monthly_brand,
            "therapeutic_class": alt.get("therapeutic_class", ""),
            "side_effects": alt.get("side_effects", []),
            "uses": alt.get("uses", []),
        },
        "generic_alternative": {
            "name": alt.get("generic_alternative", ""),
            "composition": alt.get("composition", ""),  # same composition
            "price_inr": generic_price,
            "monthly_cost_inr": monthly_generic,
            "unit_size": alt.get("jan_aushadhi_unit", ""),
            "available_at": "Jan Aushadhi Kendra (Govt Store)",
            "substitutes": alt.get("substitutes", []),
            "buy_links": alt.get("buy_links", []),
        },
        "savings": {
            "per_unit_inr": savings_amount,
            "per_month_inr": monthly_savings,
            "percent": savings_pct,
            "verdict": (
                "🟢 High savings — switch recommended" if savings_pct >= 50 else
                "🟡 Moderate savings — consider switching" if savings_pct >= 20 else
                "🔵 Low savings — your choice"
            )
        }
    }