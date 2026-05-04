import type { I18nKey } from '../i18n/dictionaries/default'
import type { HardwareTier } from '../hardware'

export type ModelConfig = {
  args: string[]
  /** Minimum total accelerator/system memory required (GiB). Includes weights + KV cache + overhead. */
  minMemoryGB: number
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
// Tool-call parsers (per model family):
//   Qwen3.6                       → qwen3_coder (Qwen3.6's chat template emits
//                                   <function=name><parameter=key>...</parameter>
//                                   </function> XML; hermes silently passes it
//                                   through as plain text)
//   Qwen3 / Qwen3-Next            → hermes (older JSON-inside-<tool_call> format)
//   Llama 3.3                     → llama3_json + tool_chat_template_llama3.2_json.jinja
//   Mistral Small 3.2             → mistral (used together with
//                                   --tokenizer-mode mistral)
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
      },
      'nvidia-hopper': {
        args: [
          'cyankiwi/Qwen3.6-35B-A3B-AWQ-4bit',
          '--max-model-len',
          '262144',
          '--reasoning-parser',
          'qwen3',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'qwen3_coder',
        ],
        minMemoryGB: 30,
      },
      'nvidia-older': {
        args: [
          'cyankiwi/Qwen3.6-35B-A3B-AWQ-4bit',
          '--max-model-len',
          '32768',
          '--reasoning-parser',
          'qwen3',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'qwen3_coder',
        ],
        minMemoryGB: 30,
      },
      amd: {
        args: [
          'Qwen/Qwen3.6-35B-A3B-FP8',
          '--max-model-len',
          '32768',
          '--reasoning-parser',
          'qwen3',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'qwen3_coder',
        ],
        minMemoryGB: 45,
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
          '--max-model-len',
          '262144',
          '--max-num-seqs',
          '2',
          '--kv-cache-dtype',
          'fp8',
          '--gpu-memory-utilization',
          '0.9',
          '--reasoning-parser',
          'qwen3',
          '--speculative-config',
          '{"method":"qwen3_5_mtp","num_speculative_tokens":3}',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'qwen3_coder',
        ],
        minMemoryGB: 28,
      },
      'nvidia-hopper': {
        args: [
          'cyankiwi/Qwen3.6-27B-AWQ-INT4',
          '--max-model-len',
          '262144',
          '--reasoning-parser',
          'qwen3',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'qwen3_coder',
        ],
        minMemoryGB: 25,
      },
      'nvidia-older': {
        args: [
          'cyankiwi/Qwen3.6-27B-AWQ-INT4',
          '--max-model-len',
          '32768',
          '--reasoning-parser',
          'qwen3',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'qwen3_coder',
        ],
        minMemoryGB: 25,
      },
      amd: {
        args: [
          'Qwen/Qwen3.6-27B-FP8',
          '--max-model-len',
          '32768',
          '--reasoning-parser',
          'qwen3',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'qwen3_coder',
        ],
        minMemoryGB: 35,
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
          '--max-model-len',
          '32768',
          '--gpu-memory-utilization',
          '0.9',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'hermes',
        ],
        minMemoryGB: 56,
      },
      'nvidia-hopper': {
        args: [
          'cyankiwi/Qwen3-Next-80B-A3B-Instruct-AWQ-4bit',
          '--max-model-len',
          '32768',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'hermes',
        ],
        minMemoryGB: 55,
      },
      'nvidia-older': {
        args: [
          'cyankiwi/Qwen3-Next-80B-A3B-Instruct-AWQ-4bit',
          '--max-model-len',
          '32768',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'hermes',
        ],
        minMemoryGB: 55,
      },
      amd: {
        args: [
          'RedHatAI/Qwen3-Next-80B-A3B-Instruct-FP8-dynamic',
          '--max-model-len',
          '32768',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'hermes',
        ],
        minMemoryGB: 95,
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
          '--max-model-len',
          '32768',
          '--gpu-memory-utilization',
          '0.9',
          '--reasoning-parser',
          'qwen3',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'hermes',
        ],
        minMemoryGB: 25,
      },
      'nvidia-hopper': {
        args: [
          'cyankiwi/Qwen3-30B-A3B-Instruct-2507-AWQ-4bit',
          '--max-model-len',
          '32768',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'hermes',
        ],
        minMemoryGB: 22,
      },
      'nvidia-older': {
        args: [
          'cyankiwi/Qwen3-30B-A3B-Instruct-2507-AWQ-4bit',
          '--max-model-len',
          '32768',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'hermes',
        ],
        minMemoryGB: 22,
      },
      amd: {
        args: [
          'RedHatAI/Qwen3-30B-A3B-FP8-dynamic',
          '--max-model-len',
          '32768',
          '--reasoning-parser',
          'qwen3',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'hermes',
        ],
        minMemoryGB: 38,
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
          '--max-model-len',
          '131072',
          '--gpu-memory-utilization',
          '0.9',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'llama3_json',
          '--chat-template',
          '/vllm-workspace/examples/tool_chat_template_llama3.2_json.jinja',
        ],
        minMemoryGB: 60,
      },
      'nvidia-hopper': {
        args: [
          'ibnzterrell/Meta-Llama-3.3-70B-Instruct-AWQ-INT4',
          '--quantization',
          'awq',
          '--max-model-len',
          '32768',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'llama3_json',
          '--chat-template',
          '/vllm-workspace/examples/tool_chat_template_llama3.2_json.jinja',
        ],
        minMemoryGB: 44,
      },
      'nvidia-older': {
        args: [
          'ibnzterrell/Meta-Llama-3.3-70B-Instruct-AWQ-INT4',
          '--quantization',
          'awq',
          '--max-model-len',
          '8192',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'llama3_json',
          '--chat-template',
          '/vllm-workspace/examples/tool_chat_template_llama3.2_json.jinja',
        ],
        minMemoryGB: 44,
      },
      amd: {
        args: [
          'RedHatAI/Llama-3.3-70B-Instruct-FP8-dynamic',
          '--max-model-len',
          '32768',
          '--enable-auto-tool-choice',
          '--tool-call-parser',
          'llama3_json',
          '--chat-template',
          '/vllm-workspace/examples/tool_chat_template_llama3.2_json.jinja',
        ],
        minMemoryGB: 85,
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
      },
    },
  },
]
