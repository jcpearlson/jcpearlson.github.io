---
title: "Why the Closest Large Galaxy Is Simultaneously 2.5 Million Years Away and Just Around the Corner"
author: "Josh Pearlson"
date: "2026-04-15"
categories: [Physics]
---

Andromeda is 2.5 million light-years away. At the speed of light, that's a 2.5 million year trip. So why does the physics say the journey could feel like a short hop?

---

(For the record: Andromeda is the closest large spiral galaxy; there are smaller dwarf galaxies closer to the Milky Way, but none you'd want to put on a poster)

## Wait, What is a Light-Year?

"Light-year" is a **unit of distance, not time**. It's the distance light travels in one year, roughly 5.88 trillion miles. 

To keep the distance from changing across calendar years, astronomers standardize it to a **Julian year** of exactly 365.25 days, averaging in a leap day so the unit stays fixed regardless of what our messy human calendars are doing.

It's also a misleading name because it sounds like a duration, and that ambiguity hides something important: how long a trip *feels* depends entirely on how fast you're moving.


At everyday speeds, this doesn't matter. If you drive 60 miles at 60 mph, the trip takes you one hour and it takes the same one hour from everyone else's point of view. Time is time. But special relativity says that's only an approximation, one that holds when speeds are much smaller than the speed of light. Once you start pushing toward $c$, time itself starts behaving differently for the moving observer versus the stationary one.

The technical term for this is **time dilation**: moving clocks run slow relative to stationary ones. The faster you move, the more dramatic the effect. At 99% the speed of light, your clock ticks about 7x slower than a clock on Earth. At 99.99% the speed of light, about 70x slower. This isn't a trick of perception or a measurement error. It's a real, physical difference in how much time passes. Atomic clocks on fast-moving aircraft confirm this. GPS satellites have to correct for it. It's well-established physics.

So when someone says "Andromeda is 2.537 million light-years away," they're giving you a true statement about distance. What they're *not* telling you is how long the trip would feel to the person making it.

## The Math behind the Magic

The relationship between Earth-frame time and traveler time comes from the **Lorentz factor**, usually written as $\gamma$ (gamma):

$$\gamma = \frac{1}{\sqrt{1 - \frac{v^2}{c^2}}}$$

where $v$ is your speed and $c$ is the speed of light. At low speeds, $v^2/c^2$ is tiny, $\gamma \approx 1$, and nothing interesting happens. But as $v$ approaches $c$, the denominator shrinks toward zero, and $\gamma$ shoots toward infinity.

The time experienced by the traveler, called **proper time** and written $\tau$, is:

$$\tau = \frac{t}{\gamma}$$

where $t$ is the time elapsed on Earth. So if Earth clocks tick off 2.537 million years during your trip to Andromeda, you personally experience only $2{,}537{,}000 / \gamma$ years. The bigger $\gamma$ is, the less time you age.

Let's make this concrete. At $v = 0.99c$:

$$\gamma = \frac{1}{\sqrt{1 - 0.99^2}} = \frac{1}{\sqrt{1 - 0.9801}} = \frac{1}{\sqrt{0.0199}} \approx 7.09$$

Earth-frame travel time is roughly $2{,}537{,}000 / 0.99 \approx 2{,}562{,}626$ years. Proper time for the traveler:

$$\tau = \frac{2{,}562{,}626}{7.09} \approx 361{,}503 \text{ years}$$

Still an unfathomably long time. But it's not 2.5 million years. Let's keep pushing.

## The Full Speed Sweep

Here's what the trip to Andromeda looks like across a range of speeds. The proper time is where things get wild.

| Speed | $\gamma$ | Your time |
|-------|----------|-----------|
| $0.99c$ | 7.09 | 361,503 years |
| $0.999c$ | 22.37 | 113,543 years |
| $0.9999c$ | 70.71 | 35,881 years |
| $0.99999c$ | 223.61 | 11,346 years |
| $0.999999c$ | 707.11 | 3,588 years |
| $0.9999999c$ | 2,236 | 1,135 years |
| $0.99999999c$ | 7,071 | 359 years |
| $0.999999999c$ | 22,361 | 114 years |
| $0.9999999999c$ | 70,711 | 36 years |

From the traveler's frame, each nine you add to your speed roughly cuts the trip time by a factor of ~3. Go from $0.99c$ to $0.999c$ and your personal elapsed time drops from 361,000 years to 113,000. Another nine gets you to 35,000. There's no lower bound: the faster you push toward $c$, the shorter the trip feels, and you can compress it to any duration you want.

From Earth's perspective, the trip always takes 2.537 million years. From the traveler's perspective, the answer depends entirely on how fast you're going. Same trip, same physics, infinitely many valid answers.

## The Reality Check

A few things that make this less useful as a vacation plan:

**The energy requirement is absurd.** Kinetic energy grows as $(\gamma - 1) m c^2$. At $\gamma = 70{,}711$, accelerating even a 1 kg payload to that speed requires energy on the order of $70{,}711 \times 1 \times (3 \times 10^8)^2 \approx 6.4 \times 10^{21}$ joules. That's roughly **eleven years of total global human energy consumption, just for one kilogram**. A crewed spacecraft with life support, fuel, and structure would weigh many thousands of kilograms. The numbers become cosmically unrealistic fast.

**Everyone you know will be dead.** And their children. And their children's children, for roughly 100,000 generations (at the standard ~25 years per generation). You can show up at Andromeda having aged a human lifetime or less, but Earth has moved on by 2.5 million years. If you turn around and come back, Earth has aged 5 million years since you left. This is the heart of the twin paradox, one of the most counterintuitive implications of special relativity.

**You still have to decelerate.** The Lorentz factor applies symmetrically to acceleration and deceleration. To arrive at Andromeda rather than fly through it at $0.9999999999c$, you need to slow down, which requires the same absurd energy expenditure in reverse. The table above assumes you're moving at constant velocity the whole time, which is a simplification. In a realistic mission profile you'd be accelerating, then decelerating, and your average $\gamma$ over the trip would be lower.

## The Bottom Line

- Light-years measure distance, not travel time, even though the name sounds like it does both. They implicitly assume a stationary observer; for a traveler at a significant fraction of $c$, distance and subjective travel time start to decouple, and the faster you go, the more extreme the split.
- Special relativity introduces a factor of $\gamma = 1/\sqrt{1 - v^2/c^2}$ that compresses the traveler's experienced time relative to the Earth frame.
- At ordinary fractions of the speed of light ($0.99c$, $0.999c$, $0.9999c$), the compression is real but still leaves you with tens of thousands of years of personal travel time to Andromeda.
- Push to extreme speeds like $0.9999999999c$ and the trip genuinely feels like a human lifetime, while over 2.5 million years pass on Earth.
- The energy requirements are completely beyond anything we can currently imagine engineering, so this remains firmly in the domain of physics education rather than mission planning.

The distance to Andromeda is fixed. What changes, depending on how fast you move, is how much of your own life it costs to get there. Somewhere in the structure of spacetime, there's a provision waiting for whatever civilization eventually figures out how to use it: any distance in the universe, compressed to fit within a single human lifetime, in exchange for enough speed.
