---
title: "Time Dilation on a 2.5 Million Light-Year Trip"
author: "Josh Pearlson"
date: "2026-04-15"
categories: [Physics]
---

Andromeda is [about 2.5 million light-years away](https://science.nasa.gov/photojournal/andromeda/). Light takes about 2.5 million years to cross that distance in a frame where the endpoints are at rest; a massive traveler must move more slowly than light. So why does the physics say the journey could feel like a short hop?

---

(For the record: Andromeda is the closest large spiral galaxy; there are smaller dwarf galaxies closer to the Milky Way, but none you'd want to put on a poster)

## Wait, What is a Light-Year?

"Light-year" is a **unit of distance, not time**. It's the distance light travels in one year, roughly 5.88 trillion miles. 

To keep the distance from changing across calendar years, astronomers standardize it to a [Julian year of exactly 365.25 days](https://iauarchive.eso.org/public/themes/measuring/), averaging in a leap day so the unit stays fixed regardless of what our messy human calendars are doing.

It's also a misleading name because it sounds like a duration, and that ambiguity hides something important: how long a trip *feels* depends entirely on how fast you're moving.


At everyday speeds, this doesn't matter. If you drive 60 miles at 60 mph, the trip takes you one hour and it takes the same one hour from everyone else's point of view. But special relativity says that's only an approximation, one that holds when speeds are much smaller than the speed of light. Once you start pushing toward $c$, time itself starts behaving differently for the moving observer versus the stationary one.

The technical term for this is **time dilation**: moving clocks run slow relative to stationary ones. The faster you move, the more dramatic the effect. At 99% the speed of light, your clock ticks about 7x slower than a clock on Earth. At 99.99% the speed of light, about 70x slower. This isn't a trick of perception or a measurement error. It's a real, physical difference in how much time passes. [Atomic-clock experiments measure this effect](https://www.nist.gov/publications/relativity-and-optical-clocks). GPS also needs relativistic corrections, including the separate effect of gravity on clock rates, as [NIST explains](https://www.nist.gov/atomic-clocks/a-powerful-tool-for-science/putting-einstein-test).

For the arithmetic below, I will use $D=2.537$ million light-years as a working distance. Treat Earth and Andromeda as stationary endpoints in one inertial frame, ignoring their relative motion and gravity. The extra digits make the calculation reproducible; they are not a claim of exact astronomical distance.

## Calculating the Traveler's Time {#the-math-behind-the-magic}

The relationship between Earth-frame time and traveler time comes from the **Lorentz factor**, usually written as $\gamma$ (gamma):

$$\gamma = \frac{1}{\sqrt{1 - \frac{v^2}{c^2}}}$$

where $v$ is your speed and $c$ is the speed of light. At low speeds, $v^2/c^2$ is tiny, $\gamma \approx 1$, so the two clocks measure nearly the same elapsed time. But as $v$ approaches $c$, the denominator shrinks toward zero, and $\gamma$ shoots toward infinity.

The time experienced by the traveler, called **proper time** and written $\tau$, is:

$$\tau = \frac{t}{\gamma}$$

where $t=D/v$ is the travel time in the chosen Earth/Andromeda frame for a constant-speed trip. Thus $\tau=D/(v\gamma)$. This relation applies to the coasting model; changing speed requires adding up proper time along the whole journey.

Let's make this concrete. At $v = 0.99c$:

$$\gamma = \frac{1}{\sqrt{1 - 0.99^2}} = \frac{1}{\sqrt{1 - 0.9801}} = \frac{1}{\sqrt{0.0199}} \approx 7.09$$

Earth-frame travel time is roughly $2{,}537{,}000 / 0.99 \approx 2{,}562{,}626$ years. Proper time for the traveler:

Using the unrounded Lorentz factor:

$$\tau = \frac{2{,}537{,}000}{0.99}\sqrt{1-0.99^2} \approx 361{,}503 \text{ years}$$

Still an unfathomably long time. But it's not 2.5 million years. Let's keep pushing.

## Travel Time at Different Speeds {#the-full-speed-sweep}

Here's what the trip to Andromeda looks like across a range of speeds.

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

From the traveler's frame, each nine you add to your speed roughly cuts the trip time by a factor of ~3. Go from $0.99c$ to $0.999c$ and your personal elapsed time drops from 361,000 years to 113,000. Another nine gets you to 35,000. In this idealized coasting model, proper time approaches zero as speed approaches $c$. That limit assumes unbounded energy and does not include the time needed to accelerate or brake.

In the chosen Earth frame, the trip takes $D/v$, which is greater than 2.537 million years for every speed below $c$ and approaches that value as $v$ approaches $c$. The traveler records less elapsed time on their own clock.

## The Reality Check

A few things that make this less useful as a vacation plan:

**The energy requirement is absurd.** The [relativistic kinetic energy](https://openstax.org/books/university-physics-volume-3/pages/5-9-relativistic-energy) is $(\gamma-1)mc^2$. At $v=0.9999999999c$, a 1 kg payload has kinetic energy of about $6.36\times10^{21}$ joules in the Earth frame. This is the payload's kinetic energy, not a complete propulsion budget. A spacecraft also has structure, equipment, and, depending on its propulsion, fuel and exhaust to account for.

**Everyone you know will be dead.** And their children. And their children's children, for roughly 100,000 generations (at the standard ~25 years per generation). You can show up at Andromeda having aged a human lifetime or less, but Earth has moved on by 2.5 million years. If you turn around and come back, Earth has aged 5 million years since you left. This is the heart of the twin paradox, one of the most counterintuitive implications of special relativity.

**You still have to decelerate.** To arrive and stop, the spacecraft must transfer away its kinetic energy in the destination frame. For the idealized stationary endpoints and unchanged payload mass, that energy change has the same magnitude as the earlier kinetic-energy gain. It does **not** follow that braking consumes an identical quantity of fuel or externally supplied energy. That depends on the propulsion system and where the energy goes.

The Lorentz factor depends on instantaneous speed, not on acceleration itself. For a trip with changing velocity, calculate the traveler's time as:

$$\tau=\int_0^{t_{\mathrm{arrival}}}\sqrt{1-\frac{v(t)^2}{c^2}}\,dt.$$

An acceleration-and-braking plan must also satisfy $D=\int v(t)\,dt$. It cannot be obtained by putting a simple average of $\gamma$ into the coasting formula. A [relativistic rocket calculation](https://math.ucr.edu/home/baez/physics/Relativity/SR/Rocket/rocket.html) can include a specified acceleration felt by the passengers and the corresponding travel times. A fixed acceleration limit changes what trip durations are possible.

## Distance and Travel Time {#the-bottom-line}

- Light-years measure distance, not travel time, even though the name sounds like it does both. A stated distance needs a reference frame; a light-year itself is simply a unit. The distance between the endpoints and the time recorded by a traveler are different quantities.
- Special relativity introduces a factor of $\gamma = 1/\sqrt{1 - v^2/c^2}$ that compresses the traveler's experienced time relative to the Earth frame.
- At the high speeds shown here ($0.99c$, $0.999c$, $0.9999c$), the compression is real but still leaves you with tens of thousands of years of personal travel time to Andromeda.
- Push to extreme speeds like $0.9999999999c$ and the trip genuinely feels like a human lifetime, while over 2.5 million years pass on Earth.
- The energy requirements are completely beyond anything we can currently imagine engineering, so this remains firmly in the domain of physics education rather than mission planning.

The distance is held fixed in this model. What changes, depending on how fast you move, is how much of your own life it costs to get there.
