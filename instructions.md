# vLLM

vLLM does not serve anything until you choose a model. Until you run the **Set Model** action, the service idles and its health check reports "No model selected" — this is expected, not a failure.

## Documentation

- [vLLM documentation](https://github.com/vllm-project/vllm/tree/main/docs) — the upstream guide to the inference engine, its OpenAI-compatible API, and supported models.

## What you get on StartOS

- An **OpenAI-compatible API** at the **vLLM API Server** interface (port 8000), usable by any OpenAI client library or app.
- A managed **model cache** on the service's data volume, so weights you download persist across restarts and are included in backups.
- An **API key**, generated for you automatically, that protects the inference endpoints.

## Getting set up

1. Run the **Set Model** action — a **Set Model** task is waiting on the dashboard whenever no model is selected. It detects your host's GPU (or CPU) and available memory, then offers the curated model presets that will fit. Pick one — or choose **Custom** to pass your own `vllm serve` arguments.
2. Wait for the first start to finish. After you select a model, vLLM downloads its weights into the cache and loads them. A first-time download plus load can take **30 minutes or more**; loading an already-cached model can take **15 minutes or more**, depending on your hardware and bandwidth. While this happens the service shows a **loading** status — it is not hung. If it still hasn't come up after about 35 minutes, check the service logs for errors.

Your API key is generated automatically — retrieve it from the **Get API Key** action whenever you connect a client; it isn't a required setup step.

To change models later, run **Set Model** again; the service restarts with the new selection.

## Using vLLM

### API

Point any OpenAI-compatible client at the **vLLM API Server** interface address with `/v1` appended as the base URL, and authenticate with the key from **Get API Key**. The usual endpoints (`/v1/chat/completions`, `/v1/completions`, `/v1/models`, …) work as documented upstream.

### Actions

- **Set Model** — choose which model to serve, from a hardware-filtered preset list or custom arguments. Restarts the service.
- **Get API Key** — reveal the API key clients use to authenticate.
- **Delete Model Cache** — pick one of the models already downloaded, listed with its size on disk, and remove it to free space.

## Limitations

- The API key covers the `/v1`, `/v2` and `/inference` paths. Other paths vLLM serves on the same port answer without it, among them `/invocations`, which runs inference just as `/v1/chat/completions` does, and `/pause`, which stops the engine serving. Share the interface address only with clients you would give the key to.
- The **Custom** model option splits your input on whitespace, so arguments whose values contain spaces (such as JSON-valued flags) won't survive. Use a preset when you need those.
