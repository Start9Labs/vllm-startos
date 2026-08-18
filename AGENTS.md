# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

**Start every task at the recipe index** — `../start-technologies/projects/start-sdk/docs/src/recipes.md`
(or <https://docs.start9.com/packaging/recipes.html>). It maps an intent ("prompt the user to create
admin credentials", "expose a web UI") to the constructs, the reference pages, and a named production
package to copy. Find the recipe before you read this package's neighbours: a package you reach by
grepping may be non-conformant, and the recipe outranks it.

Freshly scaffolded? Work the
[New Package Checklist](../start-technologies/projects/start-sdk/docs/src/new-package-checklist.md)
(or <https://docs.start9.com/packaging/new-package-checklist.html>) from top to bottom. It is a
guide page, not a file in this repo — read it, don't copy it in.

Keep `README.md` (technical reference for an AI support or administering agent) and
`instructions.md` (end-user docs) in sync with your changes.

**Bugs and feature requests are GitHub issues on this repo** — file them as you find them.
Don't record work in the repo instead: no `TODO.md`, no `NOTES.md`, no `PLAN.md`. What you
verified, tried, and decided belongs in the commit message and the PR body.

## This repo

- **The AMD GPU match must stay a positive allowlist.** StartOS's regex engine has no lookahead, so an iGPU exclusion cannot be expressed; the pattern names discrete families instead. Widening it to plain `Radeon` puts `rocm` on Ryzen APU graphics, where ROCm is unreliable.
- **Don't cache a `cpu`/`0GB` hardware detection.** That result is the "everything failed" sentinel — caching it leaves every preset disabled in the Set Model form for the life of the process, even after a transient probe failure clears.
- **The `ldconfig` oneshot is required on aarch64 NVIDIA.** The container toolkit mounts the host driver libs outside the cached search paths on some images, and Triton cannot find `libcuda.so.1` without the refresh.
- **`credentials.json` lives on the `public` volume so dependents can mount it read-only.** Moving it into `main` breaks that contract — Open WebUI reads the key from there.
