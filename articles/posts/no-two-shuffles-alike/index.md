---
title: "No Two Shuffles Alike"
author: "Josh Pearlson"
date: "2026-05-08"
categories: [Probability]
css: style.css
---

Every time you shuffle a deck of cards, you almost certainly create an ordering that has never existed before in the history of the universe.

---

## How Many Ways Can You Arrange 52 Cards?

The setup is simple. A standard deck has 52 cards. How many distinct orderings are there?

You're arranging the cards one position at a time. For position 1, you can place any of the 52 cards. For position 2, one card is already placed, so you have 51 choices. Position 3: 50 choices. You keep going until the last card has exactly one possible spot.

The total count is their product, written as a factorial:

$$52! = 52 \times 51 \times 50 \times \cdots \times 2 \times 1$$

Let's actually watch this grow. The first few multiplications:

$$52 \times 51 = 2{,}652$$

$$2{,}652 \times 50 = 132{,}600$$

$$132{,}600 \times 49 = 6{,}497{,}400$$

$$6{,}497{,}400 \times 48 = 311{,}875{,}200$$

$$311{,}875{,}200 \times 47 = 14{,}658{,}134{,}400$$

We're at $52 \times 51 \times \cdots \times 47$, which is only 6 of the 52 multiplications. The running total is already over 14 billion, and we still have 46 more factors to go. The full result:

$$52! = 80{,}658{,}175{,}170{,}943{,}878{,}571{,}660{,}636{,}856{,}403{,}766{,}975{,}289{,}505{,}440{,}883{,}277{,}824{,}000{,}000{,}000{,}000$$

In scientific notation:

$$52! \approx 8.07 \times 10^{67}$$

That's a 68-digit number starting with 8.

## Contextualizing Scale

Here are some reference points:

| Quantity | Approximate Value |
|---|---|
| [Grains of sand on all Earth's beaches](https://www.npr.org/sections/krulwich/2012/09/17/161096233/which-is-greater-the-number-of-sand-grains-on-earth-or-stars-in-the-sky) | $\approx 7.5 \times 10^{18}$ |
| [Stars in the Milky Way](https://asd.gsfc.nasa.gov/blueshift/index.php/2015/07/22/how-many-stars-in-the-milky-way/) | $\approx 3 \times 10^{11}$ |
| [Atoms in Earth](https://sciencenotes.org/how-many-atoms-are-in-the-world/) | $\approx 10^{50}$ |
| [Atoms in the observable universe](https://en.wikipedia.org/wiki/Observable_universe) | $\approx 10^{80}$ |
| [Age of the universe in seconds](https://en.wikipedia.org/wiki/Age_of_the_universe) | $\approx 4.3 \times 10^{17}$ |
| **Possible deck arrangements** | **$\approx 8.07 \times 10^{67}$** |

Note that $52!$ comfortably exceeds the number of atoms in Earth by nearly 18 orders of magnitude. It's only a factor of $\sim 10^{12}$ smaller than the atoms in the entire observable universe.

Another fun fact: what if [every person who ever lived](https://www.prb.org/articles/how-many-people-have-ever-lived-on-earth/) ($\approx 10^{11}$ humans total) had shuffled a deck of cards once per second for the entire age of the universe?

$$\underbrace{10^{11}}_{\text{humans}} \times \underbrace{4.3 \times 10^{17}}_{\text{seconds}} = 4.3 \times 10^{28} \text{ shuffles}$$

That's an enormous number of shuffles, and it's still about $\mathbf{10^{39}}$ times smaller than $52!$.

## Same Exact Order Twice 

The interesting question is: what's the probability that any two shuffles in history have ever produced the same arrangement?

This is the birthday problem.

The birthday problem is a classic conundrum: in a room of $n$ people, what's the probability that at least two share a birthday? The answer surprises most people. With only 23 people and 365 possible birthdays, the probability of a shared birthday already exceeds 50%.

The formula: given $N$ equally likely outcomes, if you sample $n$ times, the probability of at least one repeated value is approximately:

$$P(\text{collision}) \approx 1 - e^{-n^2 / (2N)}$$

This approximation works well when $n \ll N$. In our case, $N = 52! \approx 8.07 \times 10^{67}$ and $n$ is however many total shuffles have happened in history.

## Estimating Total Shuffles in History

[Cards arrived in Europe around 1370](https://en.wikipedia.org/wiki/Playing_card), so call it 650 years of card playing. Factoring in growing global population:

$$\underbrace{650 \text{ yrs}}_{\text{history}} \times \underbrace{10^9}_{\substack{\text{avg global} \\ \text{population}}} \times \underbrace{0.10}_{\substack{\text{fraction} \\ \text{playing cards}}} \times \underbrace{50}_{\substack{\text{games} \\ \text{per year}}} \times \underbrace{2.5}_{\substack{\text{shuffles} \\ \text{per game}}}$$

$$= 650 \times 1.25 \times 10^{10} \approx 8 \times 10^{12} \text{ shuffles}$$

A generous upper bound. To give ourselves the most room to work with, let's push even further and say $n = 10^{18}$ total shuffles (this would require about 100,000 times more shuffling than my estimate above, which is almost certainly not the case).

**The probability calculation:**

First, compute the exponent:

$$\frac{n^2}{2N} = \frac{(10^{18})^2}{2 \times 8.07 \times 10^{67}} = \frac{10^{36}}{1.61 \times 10^{68}} \approx 6.2 \times 10^{-33}$$

Plugging into the full formula:

$$P(\text{any two shuffles in history matched}) = 1 - e^{-6.2 \times 10^{-33}}$$

The exponent is so tiny that $e^{-x} \approx 1 - x$ for $x \ll 1$, so this collapses to:

$$P(\text{any two shuffles in history matched}) \approx 6.2 \times 10^{-33}$$

The probability of winning Powerball is about 1 in 292 million, or $\approx 3.4 \times 10^{-9}$.

The probability that any two shuffles in history have ever matched is about $\mathbf{10^{24}}$ times smaller than winning the lottery. As far as sure bets go, we can be extremely confident that two decks have never been shuffled into the same order.

**How many shuffles would we need for a 50% collision probability?**

Setting $P \approx 0.5$ and solving:

$$1 - e^{-n^2/(2N)} = 0.5$$

$$n^2 / (2N) = \ln 2$$

$$n = \sqrt{2N \ln 2} = \sqrt{2 \times 8.07 \times 10^{67} \times 0.693}$$

$$= \sqrt{1.12 \times 10^{68}} \approx 1.06 \times 10^{34}$$

You'd need roughly $1.06 \times 10^{34}$ shuffles before a collision becomes likely. That's about $1.3 \times 10^{21}$ times more shuffles than have plausibly ever happened in human history.

## The Catch

The math assumes each of the $52!$ arrangements is equally likely. That requires truly random shuffling.

Humans don't shuffle randomly. The most common technique is the riffle shuffle: split the deck roughly in half, interleave the two halves by releasing cards alternately from each thumb. Real riffle shuffles are uneven and imperfect, which is close to random. But the edge case of a *perfect* riffle shuffle (cut exactly in half, interleave one card at a time perfectly) is completely deterministic. In fact, [8 perfect riffle shuffles return the deck to its original order](https://math.hmc.edu/funfacts/perfect-shuffles/). Not great for exploring the $52!$ space.

Persi Diaconis, a Stanford mathematician who spent years as a professional card magician before becoming an academic, addressed this directly in a [1992 paper with Dave Bayer](https://projecteuclid.org/journals/annals-of-applied-probability/volume-2/issue-2/Trailing-the-Dovetail-Shuffle-to-its-Lair/10.1214/aoap/1177005705.full). Their finding: it takes exactly 7 riffle shuffles to produce a deck that's statistically close to uniformly random. Fewer than 7 and the arrangement is still heavily correlated with the starting order.

What this means in practice:

1. A poorly shuffled deck (1-3 riffles) is not randomly selected from the full $52!$ space. Repeated games in the same session could theoretically produce correlated shuffles, and the uniqueness claim weakens.
2. A well-shuffled deck (7+ riffles) is effectively sampling from the full distribution, and the uniqueness claim holds as strongly as the math says.
3. Casino shuffling machines are designed to meet the 7-riffle threshold. Your kitchen table poker game probably doesn't, but even with a reduced effective sample space, the collision probability remains so small that it's not a practical concern.

The bigger practical caveat is that even "close to random" is not uniform over all $52!$ outcomes. The shuffled deck you're holding today is almost certainly unique, but "almost certainly" is doing real work. The probability isn't exactly zero. It's just unimaginably close to it.

## Takeaways

- $52! \approx 8.07 \times 10^{67}$ is a number that exceeds the atoms in Earth by nearly 18 orders of magnitude, and it sits within a factor of $10^{12}$ of atoms in the observable universe. Factorials grow faster than any physical intuition can track.
- The birthday problem turns the vague claim "it's very unlikely" into a concrete number. With a generous estimate of $10^{18}$ total shuffles in history and $N = 52!$, the collision probability is around $10^{-33}$. That's $10^{24}$ times harder than winning Powerball.
- For collisions to become 50% likely, you'd need $\sim 1.06 \times 10^{34}$ shuffles, roughly $10^{21}$ times more than all shuffles in human history.
- The claim requires good shuffling. Diaconis showed 7 riffle shuffles as the threshold for effective randomization. Below that, you're not sampling the full space. Above it, you almost certainly are.

Next time you sit down with friends to play a game of cards and shuffle the deck, admire the fact that you likely just **created an ordering which has never been seen before and almost certainly never will be**.

---
