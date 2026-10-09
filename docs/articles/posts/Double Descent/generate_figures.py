"""Original figures for the article. Run with Python, NumPy and Matplotlib.

The experiment uses n=40 observations of a Gaussian latent signal z.
Each feature is z plus independent measurement noise with variance 9.
The target is z plus independent label noise with variance 0.09.
All widths share the same training sample within each repetition. Least squares
uses the minimum Euclidean norm solution, including above interpolation.
Test MSE is integrated exactly over independent test inputs and label noise.
"""

from pathlib import Path
import csv

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

OUT = Path(__file__).resolve().parent
N, TRIALS, SEED = 40, 400, 20261008
FEATURE_VARIANCE, LABEL_VARIANCE = 9.0, 0.09
WIDTHS = np.unique(np.concatenate([np.arange(1, 61), [64, 72, 80, 100, 120, 160, 240, 320]]))
BG, INK, GREEN, BLUE, ORANGE = "#0a0b09", "#c9d1c6", "#7cff00", "#65c7ff", "#ffb86c"
plt.rcParams.update({
    "figure.facecolor": BG, "axes.facecolor": BG, "savefig.facecolor": BG,
    "text.color": INK, "axes.labelcolor": INK, "xtick.color": INK,
    "ytick.color": INK, "axes.edgecolor": "#53604e", "font.family": "DejaVu Sans",
    "font.size": 12, "axes.spines.top": False, "axes.spines.right": False,
})


def schematic():
    fig, ax = plt.subplots(figsize=(11, 5.8), layout="constrained")
    # These are explicitly qualitative curves, not results from the experiment.
    x = np.linspace(0, 1, 500)
    test = 0.12 + 0.60 * np.exp(-12*x) + 0.69 * np.exp(-((x-0.49)/0.105)**2)
    train = 0.60 * np.exp(-12*x) * np.maximum(1-x/0.49, 0)
    ax.axvspan(0.49, 1, color=GREEN, alpha=0.035)
    ax.plot(x, test, color=GREEN, lw=3, label="Test error")
    ax.plot(x, train, color=BLUE, lw=2.2, ls="--", label="Training error")
    ax.axvline(0.49, color=ORANGE, ls=":", lw=1.8)
    ax.annotate("Just enough capacity\nto fit every training example", xy=(0.49, 0.82),
                xytext=(0.60, 0.89), arrowprops={"arrowstyle": "->", "color": ORANGE},
                color=ORANGE, fontsize=11)
    ax.text(0.03, 0.94, "1. Underfitting", transform=ax.transAxes, fontsize=11)
    ax.text(0.21, 0.40, "2. Overfitting", fontsize=11)
    ax.text(0.69, 0.36, "3. A second descent", color=GREEN, fontsize=11)
    ax.set(xlim=(0, 1), ylim=(-0.035, 1.03), xticks=[], yticks=[],
           xlabel="Model capacity  →", ylabel="Prediction error  →",
           title="The curve keeps going after the textbook U")
    ax.legend(loc="upper right", bbox_to_anchor=(1, 0.75), frameon=False)
    fig.savefig(OUT / "double-descent-schematic.png", dpi=190)
    plt.close(fig)


def experiment():
    rng = np.random.default_rng(SEED)
    train = np.zeros((TRIALS, len(WIDTHS)))
    test = np.zeros_like(train)
    signal_error = np.zeros_like(train)
    measurement_error = np.zeros_like(train)
    for trial in range(TRIALS):
        z = rng.normal(size=N)
        full_x = z[:, None] + np.sqrt(FEATURE_VARIANCE)*rng.normal(size=(N, int(WIDTHS.max())))
        y = z + np.sqrt(LABEL_VARIANCE)*rng.normal(size=N)
        for j, p in enumerate(WIDTHS):
            x = full_x[:, :p]
            coef = np.linalg.lstsq(x, y, rcond=None)[0]
            train[trial, j] = np.mean((x @ coef-y)**2)
            signal_error[trial, j] = (coef.sum()-1)**2
            measurement_error[trial, j] = FEATURE_VARIANCE*np.sum(coef**2)
            test[trial, j] = LABEL_VARIANCE + signal_error[trial, j] + measurement_error[trial, j]

    median = np.median(test, axis=0)
    average = test.mean(axis=0)
    lo, hi = np.quantile(test, [0.1, 0.9], axis=0)
    first_idx = np.flatnonzero(WIDTHS < N)[np.argmin(median[WIDTHS < N])]
    mean_first_idx = np.flatnonzero(WIDTHS < N)[np.argmin(average[WIDTHS < N])]

    with (OUT / "experiment-results.csv").open("w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["parameters", "mean_training_mse", "mean_test_mse", "median_test_mse", "test_p10", "test_p90", "mean_signal_error", "mean_measurement_noise_error", "label_noise_error"])
        for j, p in enumerate(WIDTHS):
            writer.writerow([int(p), train[:, j].mean(), average[j], median[j], lo[j], hi[j],
                             signal_error[:, j].mean(), measurement_error[:, j].mean(), LABEL_VARIANCE])

    fig, ax = plt.subplots(figsize=(11, 5.8), layout="constrained")
    ax.plot(WIDTHS, median, color=GREEN, lw=3, label="Test error")
    ax.plot(WIDTHS, train.mean(axis=0), color=BLUE, lw=2.2, ls="--", label="Training error")
    ax.axvline(N, color=ORANGE, ls=":", lw=1.8)
    ax.set_xscale("log")
    # A linear region near zero preserves the training curve and the two minima;
    # logarithmic scaling above 1 keeps the full interpolation peak visible.
    ax.set_yscale("symlog", linthresh=1, linscale=1)
    ax.set(xlim=(0.9, 370), ylim=(-0.06, 35),
           xlabel="Number of fitted parameters", ylabel="Mean squared error",
           title="The second descent beats the first minimum")
    ax.set_xticks([1, 5, 10, 20, 40, 80, 160, 320], ["1", "5", "10", "20", "40", "80", "160", "320"])
    ax.set_yticks([0, 0.5, 1, 5, 10, 25], ["0", "0.5", "1", "5", "10", "25"])
    ax.grid(alpha=0.10)
    ax.legend(frameon=False, fontsize=11, loc="upper left")
    ax.annotate("Interpolation threshold", xy=(N, median[np.where(WIDTHS == N)[0][0]]),
                xytext=(65, 22), arrowprops={"arrowstyle": "->", "color": ORANGE},
                color=ORANGE, fontsize=11)
    ax.scatter([WIDTHS[first_idx], 320], [median[first_idx], median[-1]], color=GREEN, s=28, zorder=5)
    ax.annotate(f"First minimum: {median[first_idx]:.3f}", xy=(WIDTHS[first_idx], median[first_idx]),
                xytext=(2.5, 1.8), arrowprops={"arrowstyle": "->", "color": INK},
                color=INK, fontsize=11)
    ax.annotate(f"320 parameters: {median[-1]:.3f}", xy=(320, median[-1]),
                xytext=(80, 0.55), arrowprops={"arrowstyle": "->", "color": INK},
                color=INK, fontsize=11)
    fig.savefig(OUT / "double-descent-experiment.png", dpi=190)
    plt.close(fig)

    fig, ax = plt.subplots(figsize=(11, 5.8), layout="constrained")
    ax.plot(WIDTHS, average, color=INK, lw=2.3, label="Total mean test MSE")
    ax.plot(WIDTHS, measurement_error.mean(axis=0), color=BLUE, lw=2,
            label=r"Measurement noise: $9\sum_j w_j^2$")
    ax.plot(WIDTHS, signal_error.mean(axis=0), color=ORANGE, lw=2,
            label=r"Signal error: $(\sum_j w_j-1)^2$")
    ax.axhline(LABEL_VARIANCE, color=GREEN, ls="--", label="Label noise: 0.09")
    ax.axvline(N, color=INK, ls=":", lw=1.5)
    ax.set(xscale="log", yscale="log", xlabel="Number of fitted parameters (log scale)",
           ylabel="Mean error contribution (log scale)", title="Why predictions improve after the peak")
    ax.set_xticks([1, 5, 10, 20, 40, 80, 160, 320], ["1", "5", "10", "20", "40", "80", "160", "320"])
    ax.grid(alpha=0.12)
    ax.legend(frameon=False, fontsize=10, loc="upper left")
    fig.savefig(OUT / "double-descent-mechanism.png", dpi=190)
    plt.close(fig)

    # These checks verify the scientific claims, including the stronger second descent.
    assert np.max(train[:, WIDTHS >= N]) < 1e-15
    at = {int(p): j for j, p in enumerate(WIDTHS)}
    assert median[first_idx] < median[at[1]]
    assert median[at[40]] > 10*median[first_idx]
    assert median[at[320]] < median[at[160]] < median[at[80]] < median[first_idx]
    assert average[at[320]] < np.min(average[WIDTHS < N])
    assert np.allclose(average, LABEL_VARIANCE + signal_error.mean(axis=0) + measurement_error.mean(axis=0))
    print(f"First median minimum: p={WIDTHS[first_idx]}, MSE={median[first_idx]:.6f}")
    print(f"First mean minimum: p={WIDTHS[mean_first_idx]}, MSE={average[mean_first_idx]:.6f}")
    for p in [1, 10, int(WIDTHS[first_idx]), 20, 38, 40, 80, 160, 320]:
        j = at[p]
        print(f"p={p:3d} train={train[:, j].mean():.6f} median_test={median[j]:.6f} mean_test={average[j]:.6f} signal={signal_error[:, j].mean():.6f} measurement={measurement_error[:, j].mean():.6f}")


if __name__ == "__main__":
    schematic()
    experiment()
