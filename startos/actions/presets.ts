import type { I18nKey } from '../i18n/dictionaries/default'
import type { HardwareTier } from '../hardware'

export type ContextStep = {
  /** Total accelerator memory (GiB) at which this context length kicks in. */
  gb: number
  /** Value passed to `vllm serve --max-model-len`. */
  ctx: number
}

export type ModelConfig = {
  /** vLLM serve args, NOT including `--max-model-len` (injected per memory). */
  args: string[]
  /** Minimum total accelerator/system memory required (GiB) to load the model at all. */
  minMemoryGB: number
  /**
   * Sorted ascending by `gb`. setModel picks the largest entry whose
   * threshold is <= the detected memory and appends
   * `--max-model-len <ctx>` to `args`. An empty array means "don't set
   * `--max-model-len`" — vLLM falls back to the model's native max
   * position embeddings.
   */
  contextByMemory: ContextStep[]
}

export type ModelPreset = {
  id: string
  displayName: I18nKey
  configs: Partial<Record<HardwareTier, ModelConfig>>
}

// Quantization choice by tier:
//   blackwell  → NVFP4 (sm_120/121, FP4 hardware path)
//   hopper     → AWQ INT4 (CUDA kernels work on sm_90)
//   older      → AWQ INT4 (CUDA kernels work down to sm_80)
//   amd        → FP8 (the only quant other than GGUF that vllm-rocm supports;
//                requires MI300+ class hardware)
//
// Memory budget = quantized weights size + ~30% for KV cache, activations,
// CUDA graphs, and Python overhead.
//
// Context length scales with available VRAM via `contextByMemory`. Pick
// step thresholds that leave headroom for KV growth: a tighter cap at
// minMemoryGB, the model's native max at 2-3× that.
//
// Tool-call parsers (per model family):
//   Qwen3.6                       → qwen3_coder (Qwen3.6's chat template emits
//                                   <function=name><parameter=key>...</parameter>
//                                   </function> XML; hermes silently passes it
//                                   through as plain text)
//   Qwen3 / Qwen3-Next            → hermes (older JSON-inside-<tool_call> format)
//   Llama 3.3                     → llama3_json + tool_chat_template_llama3.2_json.jinja
//   Mistral Small 3.2             → mistral (used together with
//                                   --tokenizer-mode mistral)
//   Nemotron 3 (Nano / Elastic)   → qwen3_coder for tools, nemotron_v3 for
//                                   the <think>…</think> reasoning trace.
//   Gemma 4                       → gemma4 for both tool and reasoning parsers,
//                                   plus tool_chat_template_gemma4.jinja.
//                                   MTP draft model is a separate ~0.5B BF16
//                                   assistant checkpoint
//                                   (google/gemma-4-<size>-it-assistant) that
//                                   shares the target's KV cache. Thinking
//                                   mode is off in the upstream chat template;
//                                   we force it on via
//                                   --default-chat-template-kwargs.
//
// Tool-call chat templates ship inside the vLLM image at
// /vllm-workspace/examples/.

export const models: ModelPreset[] = [
  {
    id: 'qwen36-35b-a3b',
    displayName: 'Qwen3.6 35B-A3B',
    configs: {
      'nvidia-blackwell': {
        args: [
          'RedHatAI/Qwen3.6-35B-A3B-NVFP4',
          '--reasoning-parser',
          'qwen3',
          '--moe_backend',
          'flashinfer_cutlass',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'qwen3_coder',
        ],
        minMemoryGB: 32,
        contextByMemory: [
          { gb: 32, ctx: 65536 },
          { gb: 48, ctx: 131072 },
          { gb: 80, ctx: 262144 },
        ],
      },
      'nvidia-hopper': {
        args: [
          'cyankiwi/Qwen3.6-35B-A3B-AWQ-4bit',
          '--reasoning-parser',
          'qwen3',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'qwen3_coder',
        ],
        minMemoryGB: 30,
        contextByMemory: [{ gb: 30, ctx: 262144 }],
      },
      'nvidia-older': {
        args: [
          'cyankiwi/Qwen3.6-35B-A3B-AWQ-4bit',
          '--reasoning-parser',
          'qwen3',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'qwen3_coder',
        ],
        minMemoryGB: 30,
        contextByMemory: [
          { gb: 30, ctx: 32768 },
          { gb: 48, ctx: 65536 },
          { gb: 80, ctx: 131072 },
          { gb: 120, ctx: 262144 },
        ],
      },
      amd: {
        args: [
          'Qwen/Qwen3.6-35B-A3B-FP8',
          '--reasoning-parser',
          'qwen3',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'qwen3_coder',
        ],
        minMemoryGB: 45,
        contextByMemory: [
          { gb: 45, ctx: 32768 },
          { gb: 80, ctx: 65536 },
          { gb: 120, ctx: 131072 },
          { gb: 180, ctx: 262144 },
        ],
      },
    },
  },
  {
    id: 'qwen36-27b',
    displayName: 'Qwen3.6 27B',
    configs: {
      'nvidia-blackwell': {
        args: [
          'sakamakismile/Qwen3.6-27B-Text-NVFP4-MTP',
          '--trust-remote-code',
          '--quantization',
          'modelopt',
          '--language-model-only',
          '--max-num-seqs',
          '2',
          '--kv-cache-dtype',
          'fp8',
          '--gpu-memory-utilization',
          '0.9',
          '--reasoning-parser',
          'qwen3',
          '--speculative-config',
          '{"method":"mtp","num_speculative_tokens":3}',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'qwen3_coder',
        ],
        minMemoryGB: 28,
        contextByMemory: [{ gb: 28, ctx: 262144 }],
      },
      'nvidia-hopper': {
        args: [
          'cyankiwi/Qwen3.6-27B-AWQ-INT4',
          '--reasoning-parser',
          'qwen3',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'qwen3_coder',
        ],
        minMemoryGB: 25,
        contextByMemory: [{ gb: 25, ctx: 262144 }],
      },
      'nvidia-older': {
        args: [
          'cyankiwi/Qwen3.6-27B-AWQ-INT4',
          '--reasoning-parser',
          'qwen3',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'qwen3_coder',
        ],
        minMemoryGB: 25,
        contextByMemory: [
          { gb: 25, ctx: 32768 },
          { gb: 40, ctx: 65536 },
          { gb: 64, ctx: 131072 },
          { gb: 96, ctx: 262144 },
        ],
      },
      amd: {
        args: [
          'Qwen/Qwen3.6-27B-FP8',
          '--reasoning-parser',
          'qwen3',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'qwen3_coder',
        ],
        minMemoryGB: 35,
        contextByMemory: [
          { gb: 35, ctx: 32768 },
          { gb: 64, ctx: 65536 },
          { gb: 96, ctx: 131072 },
          { gb: 144, ctx: 262144 },
        ],
      },
    },
  },
  {
    id: 'qwen3-next-80b-a3b',
    displayName: 'Qwen3-Next 80B-A3B',
    configs: {
      'nvidia-blackwell': {
        args: [
          'RedHatAI/Qwen3-Next-80B-A3B-Instruct-NVFP4',
          '--trust-remote-code',
          '--gpu-memory-utilization',
          '0.9',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'hermes',
        ],
        minMemoryGB: 56,
        contextByMemory: [
          { gb: 56, ctx: 32768 },
          { gb: 80, ctx: 65536 },
          { gb: 144, ctx: 131072 },
          { gb: 192, ctx: 262144 },
        ],
      },
      'nvidia-hopper': {
        args: [
          'cyankiwi/Qwen3-Next-80B-A3B-Instruct-AWQ-4bit',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'hermes',
        ],
        minMemoryGB: 55,
        contextByMemory: [
          { gb: 55, ctx: 32768 },
          { gb: 80, ctx: 65536 },
          { gb: 144, ctx: 131072 },
          { gb: 192, ctx: 262144 },
        ],
      },
      'nvidia-older': {
        args: [
          'cyankiwi/Qwen3-Next-80B-A3B-Instruct-AWQ-4bit',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'hermes',
        ],
        minMemoryGB: 55,
        contextByMemory: [
          { gb: 55, ctx: 32768 },
          { gb: 96, ctx: 65536 },
          { gb: 160, ctx: 131072 },
        ],
      },
      amd: {
        args: [
          'RedHatAI/Qwen3-Next-80B-A3B-Instruct-FP8-dynamic',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'hermes',
        ],
        minMemoryGB: 95,
        contextByMemory: [
          { gb: 95, ctx: 32768 },
          { gb: 160, ctx: 65536 },
          { gb: 256, ctx: 131072 },
        ],
      },
    },
  },
  {
    id: 'qwen3-30b-a3b',
    displayName: 'Qwen3 30B-A3B',
    configs: {
      'nvidia-blackwell': {
        args: [
          'RedHatAI/Qwen3-30B-A3B-NVFP4',
          '--gpu-memory-utilization',
          '0.9',
          '--reasoning-parser',
          'qwen3',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'hermes',
        ],
        minMemoryGB: 25,
        contextByMemory: [
          { gb: 25, ctx: 32768 },
          { gb: 40, ctx: 65536 },
          { gb: 64, ctx: 131072 },
          { gb: 96, ctx: 262144 },
        ],
      },
      'nvidia-hopper': {
        args: [
          'cyankiwi/Qwen3-30B-A3B-Instruct-2507-AWQ-4bit',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'hermes',
        ],
        minMemoryGB: 22,
        contextByMemory: [
          { gb: 22, ctx: 32768 },
          { gb: 40, ctx: 65536 },
          { gb: 64, ctx: 131072 },
          { gb: 96, ctx: 262144 },
        ],
      },
      'nvidia-older': {
        args: [
          'cyankiwi/Qwen3-30B-A3B-Instruct-2507-AWQ-4bit',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'hermes',
        ],
        minMemoryGB: 22,
        contextByMemory: [
          { gb: 22, ctx: 32768 },
          { gb: 40, ctx: 65536 },
          { gb: 64, ctx: 131072 },
          { gb: 96, ctx: 262144 },
        ],
      },
      amd: {
        args: [
          'RedHatAI/Qwen3-30B-A3B-FP8-dynamic',
          '--reasoning-parser',
          'qwen3',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'hermes',
        ],
        minMemoryGB: 38,
        contextByMemory: [
          { gb: 38, ctx: 32768 },
          { gb: 64, ctx: 65536 },
          { gb: 96, ctx: 131072 },
          { gb: 144, ctx: 262144 },
        ],
      },
    },
  },
  {
    id: 'llama-33-70b',
    displayName: 'Llama 3.3 70B Instruct',
    configs: {
      'nvidia-blackwell': {
        args: [
          'RedHatAI/Llama-3.3-70B-Instruct-NVFP4',
          '--gpu-memory-utilization',
          '0.9',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'llama3_json',
          '--chat-template',
          '/vllm-workspace/examples/tool_chat_template_llama3.2_json.jinja',
        ],
        minMemoryGB: 60,
        contextByMemory: [
          { gb: 60, ctx: 32768 },
          { gb: 80, ctx: 65536 },
          { gb: 120, ctx: 131072 },
        ],
      },
      'nvidia-hopper': {
        args: [
          'ibnzterrell/Meta-Llama-3.3-70B-Instruct-AWQ-INT4',
          '--quantization',
          'awq',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'llama3_json',
          '--chat-template',
          '/vllm-workspace/examples/tool_chat_template_llama3.2_json.jinja',
        ],
        minMemoryGB: 44,
        contextByMemory: [
          { gb: 44, ctx: 32768 },
          { gb: 80, ctx: 65536 },
          { gb: 144, ctx: 131072 },
        ],
      },
      'nvidia-older': {
        args: [
          'ibnzterrell/Meta-Llama-3.3-70B-Instruct-AWQ-INT4',
          '--quantization',
          'awq',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'llama3_json',
          '--chat-template',
          '/vllm-workspace/examples/tool_chat_template_llama3.2_json.jinja',
        ],
        minMemoryGB: 44,
        contextByMemory: [
          { gb: 44, ctx: 8192 },
          { gb: 64, ctx: 16384 },
          { gb: 96, ctx: 32768 },
          { gb: 144, ctx: 65536 },
          { gb: 192, ctx: 131072 },
        ],
      },
      amd: {
        args: [
          'RedHatAI/Llama-3.3-70B-Instruct-FP8-dynamic',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'llama3_json',
          '--chat-template',
          '/vllm-workspace/examples/tool_chat_template_llama3.2_json.jinja',
        ],
        minMemoryGB: 85,
        contextByMemory: [
          { gb: 85, ctx: 32768 },
          { gb: 144, ctx: 65536 },
          { gb: 192, ctx: 131072 },
        ],
      },
    },
  },
  {
    id: 'mistral-small-32-24b',
    displayName: 'Mistral Small 3.2 24B Instruct',
    configs: {
      'nvidia-blackwell': {
        args: [
          'RedHatAI/Mistral-Small-3.2-24B-Instruct-2506-NVFP4',
          '--tokenizer-mode',
          'mistral',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'mistral',
        ],
        minMemoryGB: 22,
        contextByMemory: [
          { gb: 22, ctx: 32768 },
          { gb: 40, ctx: 65536 },
          { gb: 64, ctx: 131072 },
        ],
      },
      'nvidia-hopper': {
        args: [
          'unsloth/Mistral-Small-3.2-24B-Instruct-2506-bnb-4bit',
          '--quantization',
          'bitsandbytes',
          '--load-format',
          'bitsandbytes',
          '--tokenizer-mode',
          'mistral',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'mistral',
        ],
        minMemoryGB: 18,
        contextByMemory: [
          { gb: 18, ctx: 32768 },
          { gb: 32, ctx: 65536 },
          { gb: 64, ctx: 131072 },
        ],
      },
      'nvidia-older': {
        args: [
          'unsloth/Mistral-Small-3.2-24B-Instruct-2506-bnb-4bit',
          '--quantization',
          'bitsandbytes',
          '--load-format',
          'bitsandbytes',
          '--tokenizer-mode',
          'mistral',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'mistral',
        ],
        minMemoryGB: 18,
        contextByMemory: [
          { gb: 18, ctx: 32768 },
          { gb: 32, ctx: 65536 },
          { gb: 64, ctx: 131072 },
        ],
      },
      amd: {
        args: [
          'RedHatAI/Mistral-Small-3.2-24B-Instruct-2506-FP8',
          '--tokenizer-mode',
          'mistral',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'mistral',
        ],
        minMemoryGB: 30,
        contextByMemory: [
          { gb: 30, ctx: 32768 },
          { gb: 64, ctx: 65536 },
          { gb: 96, ctx: 131072 },
        ],
      },
    },
  },
  {
    // Dense 31B multimodal flagship. MTP via a ~0.5B BF16 assistant on
    // blackwell + hopper (vllm nightly only). older + amd skip MTP: AWQ +
    // assistant isn't a tested combo, and ROCm speculative decoding is
    // immature.
    //
    // --max-num-batched-tokens 8192: MTP auto-caps the batch token budget
    // (default ~2048). Gemma 4's multimodal-bidirectional attention disables
    // chunked MM input, and a single image is 2496 tokens, so the engine
    // refuses to start unless we raise the cap.
    id: 'gemma4-31b',
    displayName: 'Gemma 4 31B Instruct',
    configs: {
      'nvidia-blackwell': {
        args: [
          'nvidia/Gemma-4-31B-IT-NVFP4',
          '--quantization',
          'modelopt',
          '--gpu-memory-utilization',
          '0.9',
          '--max-num-batched-tokens',
          '8192',
          '--reasoning-parser',
          'gemma4',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'gemma4',
          '--chat-template',
          '/vllm-workspace/examples/tool_chat_template_gemma4.jinja',
          '--default-chat-template-kwargs',
          '{"enable_thinking":true}',
          '--speculative-config',
          '{"method":"mtp","model":"google/gemma-4-31B-it-assistant","num_speculative_tokens":4}',
        ],
        minMemoryGB: 22,
        contextByMemory: [
          { gb: 22, ctx: 32768 },
          { gb: 40, ctx: 65536 },
          { gb: 64, ctx: 131072 },
          { gb: 96, ctx: 262144 },
        ],
      },
      'nvidia-hopper': {
        args: [
          'RedHatAI/gemma-4-31B-it-FP8-block',
          '--kv-cache-dtype',
          'fp8',
          '--gpu-memory-utilization',
          '0.9',
          '--max-num-batched-tokens',
          '8192',
          '--reasoning-parser',
          'gemma4',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'gemma4',
          '--chat-template',
          '/vllm-workspace/examples/tool_chat_template_gemma4.jinja',
          '--default-chat-template-kwargs',
          '{"enable_thinking":true}',
          '--speculative-config',
          '{"method":"mtp","model":"google/gemma-4-31B-it-assistant","num_speculative_tokens":4}',
        ],
        minMemoryGB: 32,
        contextByMemory: [
          { gb: 32, ctx: 32768 },
          { gb: 48, ctx: 65536 },
          { gb: 80, ctx: 131072 },
          { gb: 120, ctx: 262144 },
        ],
      },
      'nvidia-older': {
        args: [
          'cyankiwi/gemma-4-31B-it-AWQ-4bit',
          '--reasoning-parser',
          'gemma4',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'gemma4',
          '--chat-template',
          '/vllm-workspace/examples/tool_chat_template_gemma4.jinja',
          '--default-chat-template-kwargs',
          '{"enable_thinking":true}',
        ],
        minMemoryGB: 24,
        contextByMemory: [
          { gb: 24, ctx: 32768 },
          { gb: 48, ctx: 65536 },
          { gb: 80, ctx: 131072 },
          { gb: 128, ctx: 262144 },
        ],
      },
      amd: {
        args: [
          'RedHatAI/gemma-4-31B-it-FP8-dynamic',
          '--reasoning-parser',
          'gemma4',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'gemma4',
          '--chat-template',
          '/vllm-workspace/examples/tool_chat_template_gemma4.jinja',
          '--default-chat-template-kwargs',
          '{"enable_thinking":true}',
        ],
        minMemoryGB: 40,
        contextByMemory: [
          { gb: 40, ctx: 32768 },
          { gb: 80, ctx: 65536 },
          { gb: 128, ctx: 131072 },
          { gb: 192, ctx: 262144 },
        ],
      },
    },
  },
  {
    // 25.2B-total / 3.8B-active MoE multimodal. MTP via a ~0.4B BF16
    // assistant on blackwell + hopper. No community AWQ checkpoint at the
    // time of writing, so older-NVIDIA is intentionally omitted (pre-Hopper
    // cards can't run FP8 efficiently). This is the proven config for the
    // DGX Spark MTP benchmark.
    id: 'gemma4-26b-a4b',
    displayName: 'Gemma 4 26B-A4B Instruct',
    configs: {
      'nvidia-blackwell': {
        args: [
          'RedHatAI/gemma-4-26B-A4B-it-NVFP4',
          '--kv-cache-dtype',
          'fp8',
          '--gpu-memory-utilization',
          '0.9',
          '--max-num-batched-tokens',
          '8192',
          '--reasoning-parser',
          'gemma4',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'gemma4',
          '--chat-template',
          '/vllm-workspace/examples/tool_chat_template_gemma4.jinja',
          '--default-chat-template-kwargs',
          '{"enable_thinking":true}',
          '--speculative-config',
          '{"method":"mtp","model":"google/gemma-4-26B-A4B-it-assistant","num_speculative_tokens":4}',
        ],
        minMemoryGB: 16,
        contextByMemory: [
          { gb: 16, ctx: 32768 },
          { gb: 32, ctx: 65536 },
          { gb: 64, ctx: 131072 },
          { gb: 96, ctx: 262144 },
        ],
      },
      'nvidia-hopper': {
        args: [
          'RedHatAI/gemma-4-26B-A4B-it-FP8-Dynamic',
          '--kv-cache-dtype',
          'fp8',
          '--gpu-memory-utilization',
          '0.9',
          '--max-num-batched-tokens',
          '8192',
          '--reasoning-parser',
          'gemma4',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'gemma4',
          '--chat-template',
          '/vllm-workspace/examples/tool_chat_template_gemma4.jinja',
          '--default-chat-template-kwargs',
          '{"enable_thinking":true}',
          '--speculative-config',
          '{"method":"mtp","model":"google/gemma-4-26B-A4B-it-assistant","num_speculative_tokens":4}',
        ],
        minMemoryGB: 28,
        contextByMemory: [
          { gb: 28, ctx: 32768 },
          { gb: 48, ctx: 65536 },
          { gb: 80, ctx: 131072 },
          { gb: 120, ctx: 262144 },
        ],
      },
      amd: {
        args: [
          'RedHatAI/gemma-4-26B-A4B-it-FP8-Dynamic',
          '--reasoning-parser',
          'gemma4',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'gemma4',
          '--chat-template',
          '/vllm-workspace/examples/tool_chat_template_gemma4.jinja',
          '--default-chat-template-kwargs',
          '{"enable_thinking":true}',
        ],
        minMemoryGB: 32,
        contextByMemory: [
          { gb: 32, ctx: 32768 },
          { gb: 64, ctx: 65536 },
          { gb: 96, ctx: 131072 },
          { gb: 144, ctx: 262144 },
        ],
      },
    },
  },
  {
    // NVIDIA only ships NVFP4 + FP8 elastic checkpoints (no AWQ, no BF16),
    // so the older-NVIDIA tier is intentionally omitted — pre-Hopper cards
    // can't run FP8 efficiently. Mamba2-Transformer hybrid: KV per token is
    // small (most layers are Mamba state), so context scales aggressively.
    id: 'nemotron3-elastic-30b-a3b',
    displayName: 'Nemotron 3 Elastic 30B-A3B',
    configs: {
      'nvidia-blackwell': {
        args: [
          'nvidia/NVIDIA-Nemotron-Labs-3-Elastic-30B-A3B-NVFP4',
          '--trust-remote-code',
          '--max-num-seqs',
          '8',
          '--gpu-memory-utilization',
          '0.9',
          '--async-scheduling',
          '--reasoning-parser',
          'nemotron_v3',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'qwen3_coder',
        ],
        minMemoryGB: 24,
        contextByMemory: [
          { gb: 24, ctx: 65536 },
          { gb: 40, ctx: 131072 },
          { gb: 80, ctx: 262144 },
        ],
      },
      'nvidia-hopper': {
        args: [
          'nvidia/NVIDIA-Nemotron-Labs-3-Elastic-30B-A3B-FP8',
          '--trust-remote-code',
          '--max-num-seqs',
          '8',
          '--kv-cache-dtype',
          'fp8',
          '--async-scheduling',
          '--reasoning-parser',
          'nemotron_v3',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'qwen3_coder',
        ],
        minMemoryGB: 40,
        contextByMemory: [
          { gb: 40, ctx: 65536 },
          { gb: 60, ctx: 131072 },
          { gb: 96, ctx: 262144 },
        ],
      },
      amd: {
        args: [
          'nvidia/NVIDIA-Nemotron-Labs-3-Elastic-30B-A3B-FP8',
          '--trust-remote-code',
          '--max-num-seqs',
          '8',
          '--reasoning-parser',
          'nemotron_v3',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'qwen3_coder',
        ],
        minMemoryGB: 40,
        contextByMemory: [
          { gb: 40, ctx: 32768 },
          { gb: 80, ctx: 65536 },
          { gb: 144, ctx: 131072 },
        ],
      },
    },
  },
]
