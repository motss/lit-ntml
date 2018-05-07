// @ts-check

export declare interface NtmlOpts {
  minify?: boolean;

  options?: {
    minify?: htmlMinifier.Options;
    parse?: 'html'|'fragment'|boolean;
    pretty?: {
      ocd: boolean;
    };
  };
}

/** Import project dependencies */
import htmlMinifier from 'html-minifier';
import parse5 from 'parse5';
import pretty from 'pretty';

export const DEFAULT_MINIFY_OPTIONS: htmlMinifier.Options = {
  collapseBooleanAttributes: true,
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
  parserOptions: NonNullable<NtmlOpts['options']>['parse']
): Promise<'html'|'fragment'> {
  const isParserString = typeof parserOptions === 'string';

  switch (true) {
    case (isParserString && /^html$/i.test(parserOptions as string)): return 'html';
    case (isParserString && /^fragment$/i.test(parserOptions as string)): return 'fragment';
    case (typeof parserOptions === 'boolean'): {
      return parserOptions
        ? 'html'
        : 'fragment';
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

async function parser(
  content: string,
  parserOptions: NonNullable<NtmlOpts['options']>['parse']
): Promise<string> {
  const parseAs = await parseParserOptions(parserOptions);

  return parse5.serialize(
    parseAs === 'html'
      ? parse5.parse(`<!doctype html>${content}`)
      : parse5.parseFragment(content)
  );
}

async function minifier(
  content: string,
  minifierOptions?: htmlMinifier.Options
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
  options = {} as NonNullable<NtmlOpts['options']>,
}: NtmlOpts = {} as NonNullable<NtmlOpts>) {
  return async function html(
    strings: TemplateStringsArray,
    ...exps
  ): Promise<string> {
    const asyncTasks = exps.map(
      async n => Promise.all(
        (Array.isArray(n) ? n : [n])
          .map(
            async nn =>
              typeof nn === 'function' || nn instanceof Function
                ? nn()
                : nn
          )
      )
    );
    const doneTasks = await Promise.all(asyncTasks);
    const doneTasksLen = doneTasks.length;
    const allDone = await Promise.all(
      strings.map(async (n, i) => {
        const dn = doneTasks[i];
        const jn = Array.isArray(dn)
          ? dn.join('')
          : dn;

        return i >= doneTasksLen
          ? n
          : `${n}${jn}`;
      })
    );
    const parsed = await parser(
      allDone.join(''),
      options.parse == null
        ? 'fragment'
        : options.parse
    );

    return minify == null
      ? pretty(
        parsed,
        options.pretty == null
          ? { ocd: true }
          : options.pretty
      )
      : minifier(parsed, options.minify);
  };
}

export default ntml;
