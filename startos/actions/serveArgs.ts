import { i18n } from '../i18n'

const WHITESPACE = /\s/
const ESCAPABLE_IN_DOUBLE_QUOTES = ['"', '\\', '$', '`', '\n']

/**
 * Rejects a string a shell could not tokenize, so the form catches an
 * unbalanced quote before the action runs. Every alternative is decided by its
 * first character, so the outer repetition cannot backtrack.
 */
export const SERVE_ARGS_PATTERN =
  '^(?:[^\'"\\\\]|\\\\[\\s\\S]|\'[^\']*\'|"(?:[^"\\\\]|\\\\[\\s\\S])*")*$'

/**
 * Splits a `vllm serve` argument string into arguments the way a shell splits a
 * command line: whitespace separates them, single quotes are literal, double
 * quotes take backslash escapes, and a backslash escapes the character after
 * it. Nothing is expanded — no variables, globs, pipes or redirection — so
 * every character that survives quote removal reaches vLLM.
 */
export function parseServeArgs(input: string): string[] {
  const args: string[] = []
  let arg = ''
  let building = false
  let i = 0

  const finish = () => {
    if (building) args.push(arg)
    arg = ''
    building = false
  }

  while (i < input.length) {
    const char = input[i]

    // A backslash before a newline continues the line and produces nothing.
    if (char === '\\' && input[i + 1] === '\n') {
      i += 2
      continue
    }

    if (WHITESPACE.test(char)) {
      finish()
      i++
      continue
    }

    building = true

    if (char === "'") {
      const close = input.indexOf("'", i + 1)
      if (close === -1)
        throw new Error(i18n('The serve arguments have an unterminated quote.'))
      arg += input.slice(i + 1, close)
      i = close + 1
      continue
    }

    if (char === '"') {
      i++
      while (true) {
        if (i >= input.length)
          throw new Error(
            i18n('The serve arguments have an unterminated quote.'),
          )
        const quoted = input[i]
        if (quoted === '"') {
          i++
          break
        }
        if (
          quoted === '\\' &&
          ESCAPABLE_IN_DOUBLE_QUOTES.includes(input[i + 1])
        ) {
          if (input[i + 1] !== '\n') arg += input[i + 1]
          i += 2
          continue
        }
        arg += quoted
        i++
      }
      continue
    }

    if (char === '\\') {
      if (i + 1 >= input.length)
        throw new Error(
          i18n(
            'The serve arguments end with a lone backslash, which escapes nothing.',
          ),
        )
      arg += input[i + 1]
      i += 2
      continue
    }

    arg += char
    i++
  }

  finish()
  return args
}
