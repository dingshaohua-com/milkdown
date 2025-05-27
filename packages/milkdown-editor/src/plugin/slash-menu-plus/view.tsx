import { slash } from '.';
import { useInstance } from '@milkdown/react';
import { commandsCtx } from '@milkdown/kit/core';
import { useEffect, useRef, useState } from 'react';
import { SlashProvider } from '@milkdown/kit/plugin/slash';
import { usePluginViewContext } from '@prosemirror-adapter/react';
import { wrapInHeadingCommand } from '@milkdown/kit/preset/commonmark';

export const SlashView = () => {
  const instance = useInstance();
  const [loading, getEditor] = instance;
  const editor = getEditor()!;
  const { view, prevState } = usePluginViewContext();
  const provider = useRef<SlashProvider>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current || !view) return;
    provider.current = new SlashProvider({
      content: containerRef.current,
      debounce: 50,
    });
    return () => {
      provider.current?.destroy();
      provider.current = null;
      containerRef.current?.remove();
    };
  }, [view]);
  useEffect(() => provider.current?.update(view, prevState));

  const checkFmt = (type: string) => {
    if (type === 'heading1') {
      editor.ctx.get(commandsCtx).call(wrapInHeadingCommand.key, 1);
    }
  };

  return (
    <div className="slash-view" ref={containerRef}>
      <div className="slash-view-content">
        <div className="slash-view-content-item" onClick={() => checkFmt('heading1')}>
          标题 1
        </div>
      </div>
    </div>
  );
};
