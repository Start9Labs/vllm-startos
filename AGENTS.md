# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (technical reference for an AI support or administering agent) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **The AMD GPU match must stay a positive allowlist.** StartOS's regex engine has no lookahead, so an iGPU exclusion cannot be expressed; the pattern names discrete families instead. Widening it to plain `Radeon` puts `rocm` on Ryzen APU graphics, where ROCm is unreliable.
- **Don't cache a `cpu`/`0GB` hardware detection.** That result is the "everything failed" sentinel — caching it leaves every preset disabled in the Set Model form for the life of the process, even after a transient probe failure clears.
- **The `ldconfig` oneshot is required on aarch64 NVIDIA.** The container toolkit mounts the host driver libs outside the cached search paths on some images, and Triton cannot find `libcuda.so.1` without the refresh.
- **`credentials.json` lives on the `public` volume so dependents can mount it read-only.** Moving it into `main` breaks that contract — Open WebUI reads the key from there.
