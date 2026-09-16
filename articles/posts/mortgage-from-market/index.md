---
title: "Getting a Mortgage from the Market"
author: "Josh Pearlson"
date: "2025-11-22"
categories: ["Finance"]
---

Some articles describe using options to borrow money in place of a traditional agency mortgage. Do offers of $0 down and borrowing near Treasury rates hold up?

---

![Mortgage from the Market](../../../media/mortgageMarketHeader.png)

Imagine securing a loan for your dream home with a 0% down payment and an interest rate that rivals the U.S. Treasury. It sounds like a financial fantasy, but a niche corner of the options market, the 'box spread', has been touted online as a secret Wall Street trick to do just that. But is this a golden ticket for the average homebuyer, or a high-stakes gamble reserved for a select few? Let's break down the math, the hype, and the hidden dangers.

For the worked example, assume a 30-year fixed mortgage at a nominal annual rate of 6.3%, a 20% down payment, and a $1M home. These are illustrative inputs, not a current quote or a claim that every mortgage requires 20% down. The monthly payment below includes principal and interest only, excluding property taxes, insurance, and fees.

Home cost: <br>
**$1M** 
<br>
Down payment: <br>
20% * $1M = **$200K**
<br>
Loan value: <br>
$1M - $200K = **$800K** 
<br>
Interest rate monthly:  <br>
6.3%/12 = **.525% monthly**
<br>
Length of payments in months: <br>
30 years * 12 = **360 months**
<br>
Monthly payment: <br>
$800K * .525% / (1-(1 + .525%)^-360) = **$4,951.78**
<br>
Total interest paid:  <br>
Using the unrounded monthly payment: $4,951.7823157 * 360 - $800K ≈ **$982,641.63**

There are good and bad things associated with this:

**[good]** <br>

1) You have effectively lowered the initial cost burden of purchasing a home. Now instead of paying $1M today, I can pay $200K today and own a home for $5K in fixed payments per month.

2) I get to enjoy the appreciation of equity value if my house rises in value. If rates decline or my home value increases, I may then be able to re-finance my home enjoying even lower rates or payments.

**[bad]**<br>

1) I have to come up with $200K today. This may not be a problem for me financially, however, I don't want to have to sell large chunks of stocks or my retirement accounts in order to get the cash on hand.

2) If I cannot make my payments, I risk [foreclosure](https://www.consumerfinance.gov/ask-cfpb/how-does-foreclosure-work-en-287/). That puts the home and my equity at risk; it does not mean every foreclosure necessarily wipes out all remaining equity.

3) If I keep to my payments and everything goes according to plan I will likely have a $800K loan that costs me $982K in interest over time to borrow that money. That is a ton of interest, more than 120% of the loan value spent and pocketed by a bank.


## The Box Spread Mortgage

First let's clarify, I am not suggesting you do this. In fact, today I am going to argue why this is not the Goldilocks scenario it is documented as in articles online. Please do not take this article as advice to go out and try and trade millions of dollars of notional volume of options to try and create yourself one of these. 

Here is the structure:

A **box-spread loan** uses options to receive cash today in exchange for a fixed payment at expiration. It is backed by brokerage collateral and usually has a lump-sum repayment. Those cash flows differ from a mortgage paid down each month.

### Creating a Box Spread Mortgage

Take two strikes, $k_1<k_2$, with the same underlying and expiration. Assume European, cash-settled options and ignore fees for the payoff calculation. First build a **long box**:

| Strike | Call position | Put position | Combined payoff at expiration |
|---|---|---|---|
| $k_1$ | Buy | Sell | $S_T-k_1$ |
| $k_2$ | Sell | Buy | $k_2-S_T$ |
| Total | | | $k_2-k_1$ |

Here $S_T$ is the underlying's settlement value. The underlying price cancels:

$$ (S_T-k_1)+(k_2-S_T)=k_2-k_1. $$

Buying that future payment costs money today. A long box is the lending side. To borrow, **sell the box**, reversing all four option positions. You receive the market premium today and owe the strike difference at expiration. The Options Industry Council describes this [buyer/lender and seller/borrower relationship](https://www.optionseducation.org/getmedia/1dcd759e-d52b-4323-8095-c3a343cab824/Box-Spreads-Paper_2025.pdf).

For one unit of the underlying, suppose the strikes are $1,000 and $1,050. The long box pays $50 at expiration and might cost $48 today. The short box does the reverse:

| Cash flow | Long box: lender | Short box: borrower |
|---|---:|---:|
| Today | Pay $48 | Receive $48 |
| At expiration | Receive $50 | Pay $50 |

For the borrower, the loan principal is $48 and the financing cost is $2. If the term is $T$ years, the implied effective annual borrowing rate is:

$$r=\left(\frac{50}{48}\right)^{1/T}-1.$$

Actual option cash flows also include the contract multiplier. The premium is set by market prices, so the implied rate need not equal a Treasury yield. Early exercise and settlement differences can disrupt the simple payoff calculation; this example specifically assumes European, cash-settled contracts.

### Borrowing Rates {#how-much}

The [Cboe-hosted financing example](https://www.cboe.com/insights/posts/long-dated-box-spreads-a-better-way-to-buy-a-home-updated/) discusses borrowing through short box spreads and quotes spreads of 30–50 basis points above Treasury yields. Those were dated market observations, not guaranteed terms.

For our comparison, assume a five-year effective annual box borrowing rate of 4.1%. For example, a 3.6% Treasury yield plus 0.5 percentage points would give that rate. Compared with the illustrative 6.3% mortgage rate, the quoted difference is **2.2 percentage points**, before accounting for compounding conventions, costs, and taxes.

To isolate the repayment schedules, compare the **same $1M principal** in each loan. This is separate from the earlier $800K mortgage example; it does not assume a zero-down mortgage is available.

The box loan has no interim payments in this example:

$$\text{Box repayment}=\$1{,}000{,}000(1.041)^5=\$1{,}222{,}513.45.$$

Its five-year financing cost is therefore $222,513.45. For a 30-year mortgage at 6.3% nominal annual interest, let $r=0.063/12$ and $A$ be the monthly payment:

$$A=\frac{\$1{,}000{,}000r}{1-(1+r)^{-360}}\approx\$6{,}189.73.$$

After 60 payments, the remaining balance is:

$$B_{60}=\$1{,}000{,}000(1+r)^{60}-A\frac{(1+r)^{60}-1}{r}\approx\$933{,}927.16.$$

Using unrounded payments throughout:

$$\begin{aligned}
\text{Principal repaid}&=\$1{,}000{,}000-B_{60}\approx\$66{,}072.84,\\
\text{Interest paid}&=60A-\text{Principal repaid}\approx\$305{,}310.83.
\end{aligned}$$

| First five years, same $1M principal | Box loan | Amortizing mortgage |
|---|---:|---:|
| Interim monthly payment | $0 | $6,189.73 |
| Total interim payments | $0 | $371,383.67 |
| Financing cost / interest | $222,513.45 | $305,310.83 |
| Amount owed at year five | $1,222,513.45, due then | $933,927.16, still amortizing |

The lower assumed rate gives the box lower nominal interest in this example. But the cash is paid at different times, and the remaining obligations differ. This table is not a present-value comparison. It excludes fees, taxes, investment returns, and refinancing risk. Compounding the mortgage's entire original principal for five years would ignore its monthly payments and overstate its interest cost.

### All the Problems

**The collateral has to be eligible.** A short box does not let you withdraw unlimited cash without margin. The broker determines the required collateral, withdrawal capacity, and maintenance requirements. An illustrative multiple such as twice the loan is not a universal rule or a guarantee against a margin call.

I mean eligible assets in a **taxable brokerage account**, not a retirement balance that can automatically be pledged. The [IRS explains that pledging part of an IRA as collateral treats that part as distributed](https://www.irs.gov/retirement-plans/retirement-plans-faqs-regarding-loans). Other retirement plans have their own restrictions and any permitted plan loans follow different rules.

**The repayment still comes due.** Borrowing $1M at the assumed rate leaves a $1.223M payment after five years. If the collateral falls in value before then, a margin call can force sales before the planned repayment date. Rolling into another box requires available financing at whatever rates and margin terms apply then.

For someone who already has enough eligible investments to buy the house, the question is whether keeping those investments is worth the borrowing cost and collateral risk. The alternative is to sell assets and pay cash. Investment gains are uncertain; the contractual repayment is not.

**The tax benefit needs its own calculation.** A deduction reduces taxable income or gains; it does not reimburse the full financing cost. An "almost free loan" does not follow from deductibility.

Qualifying section 1256 contracts generally have annual mark-to-market treatment, with gains and losses split 60% long-term and 40% short-term. Net capital losses generally offset capital gains; the ordinary-income deduction is usually limited to $3,000 a year, or $1,500 if married filing separately, with carryforward rules. Contract classification and straddle rules can affect the result. These are the [IRS rules to check](https://www.irs.gov/publications/p550), not an assumption that the whole financing loss can be saved for a planned asset sale at expiration.

A borrower would need to compare the actual after-tax cash flows for their contracts and account. Avoiding an asset sale today can defer a gain, but it does not remove the later liability or make leveraged investing risk-free.

### Who Could Use a Box-Spread Loan? {#conclusion}

A box-spread loan may suit someone with substantial eligible brokerage collateral, a reason to keep those investments, and a credible repayment plan. The borrowing rate alone is not enough to decide.

A traditional mortgage spreads principal repayment over time and uses the property as collateral. The box loan in this example leaves a large lump sum and exposes the brokerage portfolio to margin requirements. For a buyer whose main constraint is a small down payment or limited savings, "no cash down" does not solve the collateral problem.

As always, till next time.

JCP
