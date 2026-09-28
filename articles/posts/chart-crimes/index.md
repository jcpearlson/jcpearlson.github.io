---
title: "Chart Crimes"
author: "Josh Pearlson"
date: "2026-09-27"
categories: ["Machine Learning", "LLM"]
css: style.css
---

Seven charts from the AI world, exactly as they were published.

---

"Chart crime" started as finance slang. Reuters journalist Eric Burroughs [began using it on Twitter in 2015](https://rpc.cfainstitute.org/blogs/enterprising-investor/2018/18-chart-crimes-and-misdemeanors), and it stuck because traders needed a name for a graph that isn't technically lying but is obviously up to something.

These days the best specimens come from AI launches. A launch chart is half research result, half ad, and usually finished the night before the livestream. You can guess which half wins.

## OpenAI - August 2025

![From the [GPT-5 launch](https://openai.com/index/introducing-gpt-5/) livestream.](gpt5-swe-bench.jpg)

52.8 is drawn taller than 69.1, and 69.1 is drawn exactly as tall as 30.8.

Sam Altman [called it a "mega chart screwup"](https://tech.co/news/openai-apologizes-mega-chart-screwup) and said the team had been working late and was very tired. Hacker News had already [named the technique](https://news.ycombinator.com/item?id=44827179): vibegraphing.

## Anthropic - November 2025

![From the [Claude Opus 4.5 launch](https://www.anthropic.com/news/claude-opus-4-5).](anthropic-opus-45.png)

The y-axis jumps from 0 straight to 70 (that's the little zigzag at the bottom), so the whole chart spans 12 points. That's how Opus 4.5's bar ends up 2.4 times taller than Opus 4.1's, when the real scores are 80.9% and 74.5%, a gap of under 9%.

The zigzag is at least an honest confession. [One reviewer](https://bdtechtalks.com/2025/11/25/anthropic-claude-opus-4-5/) still called the chart a bit misleading.

## xAI - February 2025

![From the [Grok 3 launch](https://x.ai/news/grok-3).](grok3-aime.png)

Those pale tips on the orange bars are `cons@64`: the model gets 64 tries at each problem and submits its most common answer. None of the grey bars got that treatment.

Put your thumb over the pale tips and both Grok models fall behind o3 mini (high). OpenAI's cons@64 score for o3 mini, which [beats Grok 3](https://techcrunch.com/2025/02/22/did-xai-lie-about-grok-3s-benchmarks/), didn't make the chart. When an OpenAI employee complained, xAI's co-founder said OpenAI does the same thing. He may be right, but that's not really a defense.

## Meta - April 2026

![From the [Muse Spark launch](https://ai.meta.com/blog/introducing-muse-spark-msl/).](meta-muse-spark.png)

One column gets the blue treatment, and it's Meta's. Go row by row and Muse Spark has the best score in 3 of the 20.

Color tells your eye where the winner is before you've read a single number. Here it points at the model that mostly isn't.

## Nvidia - March 2024

![From the [GTC keynote](https://blogs.nvidia.com/blog/2024-gtc-keynote/). Yellow annotations by [Maxim Saplin](https://dev.to/maximsaplin/nvidias-1000x-performance-boost-claim-verified-j7f).](nvidia-1000x.png)

The chips are real, but read the small print under each point: FP16, FP16, BF16/FP16, FP8, FP4. Those are number formats, and each step down to a smaller one roughly doubles how many operations a chip can do. So part of that curve is just smaller numbers.

The yellow line shows the same chips at one precision: 263x instead of 1000x. Still wild, just not 1000x wild.

## Twitter - October 2025

![From a [post on X](https://x.com/slow_developer/status/1976062551088566739).](llm-capability-index.jpg)

This one's a popular post, not a company. The y-axis measures "Capability Index (conceptual)" and has no numbers on it, and the models sit neatly on a smooth curve.

It's the purest AI progress chart there is: impossible to prove wrong, because it doesn't claim anything.

## ARC Prize - December 2024

![From ARC Prize's [o3 results on ARC-AGI](https://arcprize.org/blog/oai-o3-pub-breakthrough).](arc-agi-o3-cost.png)

To ARC Prize's credit, cost is on the chart at all. But each gridline on the x-axis is ten times the one before it.

In their own table, going from 75.7% to 87.5% took the cost per task from $26 to $4,560. That's 175 times the money for about 12 more points, and on this chart it looks like a short hop to the right.

## Read the small print

None of these tricks were hidden. The axis break, the pale tips, the FP4: it's all printed right on the chart. They just bet you wouldn't look.

The funny part is that some of them didn't need to. GPT-5 really did beat o3, and Opus 4.5 really did top SWE-bench. The honest charts would have been impressive anyway.
