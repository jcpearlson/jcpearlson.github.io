---
title: "Perpetual Futures: The Market for Leverage"
author: "Josh Pearlson"
date: "2026-02-05"
categories: ["Finance"]
---

Perpetual futures have no expiry. Funding payments keep their price near spot and put a price on leveraged exposure.

---

![Perps](../../../media/perps_image.png)

Perpetual futures ("perps") let traders hold leveraged exposure without a fixed expiry. They look like futures, trade like futures, and offer clean linear exposure with leverage. But they never expire, and that design choice affects how prices stay near spot, where liquidity concentrates, and how funding rates price leverage.

I'll explain what perps are, how they differ from expiring futures, how funding works, and how leveraged positions can amplify price moves.

## Why perps exist

Traditional futures are a stack of contracts by maturity: March, June, September, and so on. That structure creates three annoying problems:

1. **Liquidity fragmentation.** Each maturity has its own order book.
2. **Roll friction.** You must close one contract and open the next, paying spreads and fees.
3. **Basis noise.** PnL can swing because the futures price decouples from spot, even if the underlying barely moves.

Perps eliminate expiry and roll friction while preserving linear leveraged exposure. All liquidity collapses into a single book. You can hold a position as long as you want. But if there is no expiry, how does the price stay tethered to spot?

That is where funding rates come in.

## What is a perpetual future?

A perp is a margined, linear derivative on an underlying index with **no maturity**. It is marked to an external index (e.g., a composite of spot prices across exchanges), and it stays close to that index via **funding payments** between longs and shorts.

Key features:

- **No maturity.** The position can be held indefinitely.
- **Continuous mark to index.** PnL is based on changes in the index price.
- **Funding transfers.** Periodic payments between longs and shorts push the perp price toward spot.
- **Central clearing.** The exchange manages margin, liquidations, and an insurance fund.
- **Single deep liquidity pool.** One order book, one main price.

## Why it is not really a future

Futures are defined by a fixed expiry and a convergence mechanism. At expiration the futures price becomes the spot price. However, perps do not converge because they never expire.

Instead, perps rely on **economic pressure** rather than **calendar convergence**. When perp price drifts above spot, longs pay shorts. That payment makes long positions more expensive and short positions more attractive, pulling the perp price down. When perp trades below spot, the opposite happens.

So a perp is less like a future and more like a **synthetic, never-ending forward** where you rent the position via a funding fee. I would also like to formally offer a suggestion of changing the name of these so called perpetual futures to perpetual forwards, but I digress.

## How Funding Keeps Prices Near Spot {#the-brilliance-of-funding-rates}

Funding payments help keep the perp price near spot without an expiration date. They also put a price on demand for leverage.

At a high level:

- If the perp trades **above** spot, **longs pay shorts**.
- If the perp trades **below** spot, **shorts pay longs**.

Each exchange uses its own formula, but most use some variation of the following:

$$
\begin{aligned}
    \text{Funding Rate} &\approx \text{Clamp}\left(\frac{\text{Perp Price} - \text{Index Price}}{\text{Index Price}} + \text{Interest Component}\right)
\end{aligned}
$$

Let's break this down piece by piece.

The first term, $\frac{\text{Perp Price} - \text{Index Price}}{\text{Index Price}}$, is the **premium** (or discount). It measures how far the perp has drifted from spot as a percentage. If the perp is trading at $\$50,500$ and spot is at $\$50,000$, the premium is:

$$
\begin{aligned}
    \text{Premium} &= \frac{50,500 - 50,000}{50,000} = \frac{500}{50,000} = 0.01 = 1\%
\end{aligned}
$$

The second term is the interest component, which reflects the cost of capital. In traditional derivatives, this matters because one currency might have higher rates than another. In crypto, this is usually tiny, often effectively zero, because both sides are collateralized in the same asset (e.g., USDC or BTC). Most exchanges set it to something like $0.01\%$ or less per funding period.

The **Clamp** function caps the funding rate at some maximum to prevent extreme transfers during volatility. Different exchanges use different caps (commonly $\pm 0.75\%$ to $\pm 2\%$ per funding period). Without this, a flash crash could trigger enormous funding payments.

**Funding periods** are typically **8 hours** on most exchanges (three times per day at 00:00, 08:00, and 16:00 UTC). Some use 1 hour. The rate is annualized in some displays but applied per period.

### Funding math in plain English

The rate determines how much longs and shorts pay each other. If you hold a perp position with notional value $N$ and the funding rate per period is $f$, your funding payment is simply:

$$
\begin{aligned}
    \text{Funding Payment} = N \times f
\end{aligned}
$$

Let's work through a concrete example. Suppose:

- **BTC perp price:** $\$50,000$
- **Position size:** $0.5$ BTC (you are long)
- **Notional:** $N = 0.5 \times 50,000 = \$25,000$
- **Funding rate:** $0.01\%$ per 8 hours $= 0.0001$

The funding payment is:

$$
\begin{aligned}
    \text{Payment} &= 25,000 \times 0.0001 \\ 
    &= \$2.50
\end{aligned}
$$

If you are long and funding is positive (meaning perp > spot), **you pay $\$2.50$** to shorts every 8 hours. If you are short, **you receive $\$2.50$** from longs. Three funding periods per day means this could cost you $\$7.50$ daily, or about $\$2,738$ per year on a $\$25,000$ position, roughly $11\%$ annually.

Of course, funding rates fluctuate. They can go negative (shorts pay longs), near-zero during calm markets, or spike to extreme levels during mania. During the 2021 bull run, BTC perp funding occasionally exceeded $0.1\%$ per 8 hours, more than $100\%$ annualized.

That tiny number is the **price of leverage**. It is the rent you pay to hold linear exposure with no expiry. And just like rent, it adds up if you are not paying attention.

### The market for leverage

Funding rates are not set by the exchange, they emerge from **market positioning**. They respond to demand for leverage in real time:

- **When everyone wants to be long** (bullish sentiment, FOMO, momentum), the perp price rises above spot. Funding goes positive. **Longs pay shorts**. Being levered long becomes expensive.
- **When everyone wants to be short** (bearish sentiment, panic, hedging), the perp price falls below spot. Funding goes negative. **Shorts pay longs**. Being levered short becomes expensive.

This is the market's self-balancing mechanism. It does not remove leverage demand, it **prices it**.

Think about the incentives this creates. If funding is extremely positive, you get paid to short. If it is extremely negative, you get paid to go long. This naturally attracts contrarian traders who fade the crowd, which pulls the perp price back toward spot.

The more one-sided the market becomes, the more expensive it is to be on that side, and the more you get paid to take the other side.

## How leverage actually works in perps

Perps are margined instruments, meaning you do not need to put up the full value of your position. You post collateral (initial margin), and the exchange lets you control a larger notional position.

Let:

- $P$ = perp price
- $Q$ = position size (in coins or contracts)
- $N = P \times Q$ = notional value of your position
- $M$ = margin you posted

Then leverage is simply:

$$
\begin{aligned}
    \text{Leverage} = \frac{N}{M}
\end{aligned}
$$

### A worked example

Suppose you want to go long BTC perps:

- **BTC perp price:** $\$50,000$
- **Position size:** $0.2$ BTC
- **Notional:** $N = 0.2 \times 50,000 = \$10,000$
- **Margin posted:** $M = \$1,000$

Your leverage is:

$$
\begin{aligned}
    \text{Leverage} = \frac{10,000}{1,000} = 10\times
\end{aligned}
$$

Now, if BTC moves up by $1\%$, your position gains $1\%$ of the notional value:

$$
\begin{aligned}
    \text{PnL} = N \times 1\% = 10,000 \times 0.01 = \$100
\end{aligned}
$$

That $\$100$ gain on a $\$1,000$ margin is a **10% return on your capital**. Your leverage amplified a $1\%$ market move into a $10\%$ portfolio move.

Of course, this works in reverse. A $1\%$ drop becomes a $-10\%$ loss. A $5\%$ drop is $-50\%$. And at $-10\%$, your margin is completely wiped out.

### Maintenance Margin and Liquidation {#liquidation-and-the-cliff-edge}

Leverage is powerful, but it comes with a hard stop: **liquidation**. Exchanges enforce a **maintenance margin**, a minimum equity level you must maintain. If your position loses enough that your remaining equity falls below this threshold, the exchange forcibly closes your position at market prices.

Why? Because if they let you go negative, the exchange would be on the hook for your losses. Liquidations protect the exchange and the counterparties.

Ignoring funding costs and fees for a moment, the rough liquidation threshold for a long position is:

$$
\begin{aligned}
    \text{Liquidation Move} \approx -\frac{1}{\text{Leverage}}
\end{aligned}
$$

At **10x leverage**, a **-10% move** can wipe out your margin and trigger liquidation. At **50x leverage**, it takes just **-2%**. At **100x**, a **-1%** move is game over.

In reality, funding payments and trading fees eat into your margin buffer over time, so the actual safe range is tighter than the simple formula suggests. If you are paying positive funding three times a day, that margin is slowly bleeding out even if price does not move.

### The cascade effect

Here is where perps can amplify volatility. Liquidations are not voluntary closes, they are **forced market sells** (for longs) or **forced market buys** (for shorts) that hit the order book instantly.

When price starts dropping and highly levered longs get liquidated, their forced selling pushes price lower, triggering more liquidations, creating more selling pressure, and so on. This is a **liquidation cascade**, and it is why you sometimes see brutal intraday moves in crypto that blow past technical levels and recover just as fast.

The same happens in reverse when shorts get squeezed. Forced buy-backs push price higher, liquidating more shorts, creating more buy pressure, rinse and repeat.

Forced liquidations can amplify a price move as leveraged positions close. That feedback helps explain why perp prices can move sharply relative to spot.

## Benefits and Risks of Perpetual Futures {#the-good-the-bad-and-the-weird}

### What perps solve

- **No maturity, no roll.** You never pay to roll a contract.
- **Single liquidity pool.** Liquidity concentrates, spreads tighten.
- **Clean linear exposure.** PnL tracks the underlying move (plus funding).
- **Global access.** Retail can access leverage in seconds.

### Unintended effects

- **Funding becomes a tradeable signal and tax.** Traders fade extremes, or farm funding in neutral strategies.
- **Reflexive leverage cycles.** Positive funding encourages shorting, negative funding encourages longing, feeding cyclical positioning.
- **Liquidation cascades.** Forced liquidations can accelerate moves and create gaps.
- **Exchange risk is concentrated.** Perps are centrally cleared; you are exposed to the exchange.

There is also **ADL (auto-deleveraging)**, a last-resort mechanism some exchanges use to reduce risk when liquidations fail. It is rare in normal markets, but it is part of the system design and worth knowing exists.

## A simple mental model

Think of a perp as:

- A spot-like exposure
- Plus an embedded funding lease
- Settled and enforced by a centralized exchange

You are renting exposure at a floating rate. Sometimes the rate pays you. Sometimes it taxes you. The rent is set by crowd positioning, not by a fixed schedule.

## Funding Costs and Liquidation Risk {#closing-thoughts}

Perps address liquidity fragmentation and roll friction through a shared structure: no expiry, continuous mark to index, and a funding transfer that anchors price to spot.

But they also create a second market layered on top of price: the market for leverage. Funding is both a stabilizer and a signal, and the leverage it enables can be reflexive.

When a perp price moves sharply, funding rates and liquidations can help explain how leverage is contributing to the move.

As always, till next time.

JCP