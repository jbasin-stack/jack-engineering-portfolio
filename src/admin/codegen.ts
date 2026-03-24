import * as prettier from 'prettier';
import ts from 'typescript';

/**
 * Produces a raw TypeScript source string for a typed data export.
 * Output matches the existing hand-written data file pattern:
 *   import type { X } from '../types/data';
 *   export const y: X = { ... };
 */
export function generateDataFile(
  typeName: string,
  exportName: string,
  data: unknown,
  isArray: boolean,
): string {
  const typeAnnotation = isArray ? `${typeName}[]` : typeName;
  const serialized = JSON.stringify(data, null, 2);

  return [
    `import type { ${typeName} } from '../types/data';`,
    '',
    `export const ${exportName}: ${typeAnnotation} = ${serialized};`,
    '',
  ].join('\n');
}

/**
 * Formats raw TypeScript source with Prettier and validates
 * syntax with the TypeScript compiler. Returns the formatted
 * string on success; throws on invalid TypeScript.
 */
export async function formatAndValidate(rawSource: string): Promise<string> {
  const formatted = await prettier.format(rawSource, {
    parser: 'typescript',
    singleQuote: true,
    trailingComma: 'all',
    printWidth: 100,
  });

  const sourceFile = ts.createSourceFile(
    'generated.ts',
    formatted,
    ts.ScriptTarget.Latest,
    true,
  );

  // parseDiagnostics is an internal property exposed on the SourceFile node
  const diagnostics = (sourceFile as unknown as { parseDiagnostics: ts.Diagnostic[] })
    .parseDiagnostics;

  if (diagnostics && diagnostics.length > 0) {
    const messages = diagnostics.map((d) => {
      const pos = ts.getLineAndCharacterOfPosition(sourceFile, d.start ?? 0);
      const msg = ts.flattenDiagnosticMessageText(d.messageText, '\n');
      return `Line ${pos.line + 1}, Col ${pos.character + 1}: ${msg}`;
    });
    throw new Error(`TypeScript syntax error:\n${messages.join('\n')}`);
  }

  return formatted;
}
