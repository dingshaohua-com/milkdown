import { Ctx } from '@milkdown/kit/ctx';
import { useInstance } from '@milkdown/react';
import { callCommand } from '@milkdown/kit/utils';
import { EditorView } from '@milkdown/kit/prose/view';
import { useCallback, useEffect, useRef } from 'react';
import { TextSelection } from '@milkdown/kit/prose/state';
import { TooltipProvider } from '@milkdown/kit/plugin/tooltip';
import { usePluginViewContext } from '@prosemirror-adapter/react';
import { toggleStrongCommand } from '@milkdown/kit/preset/commonmark';
import { RiBold, RiItalic, RiUnderline, RiStrikethrough, RiEmphasisCn } from '@remixicon/react';

const View = () => {
  const ref = useRef<HTMLDivElement>(null);
  const tooltipProvider = useRef<TooltipProvider>(null);

  const { view, prevState } = usePluginViewContext();
  const [loading, get] = useInstance();
  const action = useCallback(
    (fn: (ctx: Ctx) => void) => {
      if (loading) return;
      get().action(fn);
    },
    [loading],
  );

  useEffect(() => {
    const div = ref.current;
    if (loading || !div) {
      return;
    }
    tooltipProvider.current = new TooltipProvider({
      content: div,
      shouldShow: (view: EditorView) => {
        // 这段代码源自于官方 demo packages/crepe/src/feature/toolbar/index.ts
        const { doc, selection } = view.state;
        const { empty, from, to } = selection;

        const isEmptyTextBlock = !doc.textBetween(from, to).length && selection instanceof TextSelection;

        const isNotTextBlock = !(selection instanceof TextSelection);

        const activeElement = (view.dom.getRootNode() as ShadowRoot | Document).activeElement;
        const isTooltipChildren = div.contains(activeElement);

        const notHasFocus = !view.hasFocus() && !isTooltipChildren;

        const isReadonly = !view.editable;

        if (notHasFocus || isNotTextBlock || empty || isEmptyTextBlock || isReadonly) return false;

        return true;
      },
    });

    return () => {
      tooltipProvider.current?.destroy();
    };
  }, [loading]);

  useEffect(() => {
    tooltipProvider.current?.update(view, prevState);
  }, [view, prevState]);

  return (
    <div className="absolute slash-menu-selection" ref={ref}>
      <div className="item">
        <RiBold />
      </div>
      <div className="item">
        <RiUnderline />
      </div>
      <div className="item">
        <RiStrikethrough />
      </div>
      <div className="item">
        <RiEmphasisCn />
      </div>
      {/* <button
        className="text-gray-600 bg-slate-200 px-2 py-1 rounded-lg hover:bg-slate-300 border hover:text-gray-900"
        onMouseDown={(e) => {
          // Use `onMouseDown` with `preventDefault` to prevent the editor from losing focus.
          e.preventDefault();

          action(callCommand(toggleStrongCommand.key));
        }}
      >
        加粗
      </button> */}
    </div>
  );
};

export default View;
