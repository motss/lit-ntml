// @ts-check

export declare interface NtmlOpts {
  minify?: boolean;

  options?: {
    minify?: htmlMinifier.Options;
    parse?: 'html'|'fragment'|boolean;
  };
}

/** Import project dependencies */
import htmlMinifier from 'html-minifier';
import parse5 from 'parse5';

export const DEFAULT_MINIFY_OPTIONS: htmlMinifier.Options = {
  collapseBooleanAttributes: true,
  collapseInlineTagWhitespace: true,
  collapseWhitespace: true,
  minifyCSS: true,
  minifyJS: true,
  processConditionalComments: true,
  quoteCharacter: '"',
  removeComments: true,
  removeOptionalTags: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  sortAttributes: true,
  sortClassName: true,
  trimCustomFragments: true,
};

async function parseParserOptions(
  parserOptions: NtmlOpts['options']['parse']
): Promise<boolean> {
  switch (true) {
    case (typeof parserOptions === 'string'): {
      return /^(html|fragment)$/i.test(parserOptions as string);
    }
    case (typeof parserOptions === 'boolean'): {
      return parserOptions as boolean;
    }
    default: {
      throw new Error(
        `Invalid parse options (${
          parserOptions
        }). Only allows ['html', 'fragment', true, false]`
      );
    }
  }
}

export async function parser(
  content: string,
  parserOptions: NtmlOpts['options']['parse']
): Promise<string> {
  const parseAs = await parseParserOptions(parserOptions);

  return parse5.serialize(
    parseAs
      ? parse5.parse(`<!doctype html>${content}`)
      : parse5.parseFragment(content)
  );
}

export async function minifier(
  content: string,
  minifierOptions: htmlMinifier.Options
) {
  return htmlMinifier.minify(
    content,
    minifierOptions == null
      ? DEFAULT_MINIFY_OPTIONS
      : minifierOptions
  );
}

export function ntml({
  minify,
  options = {} as NtmlOpts['options'],
}: NtmlOpts) {
  return async function html(
    strings: TemplateStringsArray,
    ...exps
  ) {
    const asyncTasks = exps.map(
      async n =>
        typeof n === 'function' || n instanceof Function
          ? n()
          : n
    );
    const doneTasks = await Promise.all(asyncTasks);
    const doneTasksLen = doneTasks.length;
    const allDone = await Promise.all(
      strings.map(
        async (n, i) =>
          i >= doneTasksLen
            ? n
            : `${n}${doneTasks[i]}`
      )
    );
    const parsed = await parser(
      allDone.join(''),
      options.parse == null
        ? 'fragment'
        : options.parse
    );

    return minify == null
      ? parsed
      : minifier(parsed, options.minify);
  };
}

export default ntml;
