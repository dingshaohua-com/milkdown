import { Ctx } from '@milkdown/kit/ctx';
import { useInstance } from '@milkdown/react';
import { callCommand } from '@milkdown/kit/utils';
import { useCallback, useEffect, useRef } from 'react';
import { TooltipProvider } from '@milkdown/kit/plugin/tooltip';
import { usePluginViewContext } from '@prosemirror-adapter/react';
import { toggleStrongCommand } from '@milkdown/kit/preset/commonmark';

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
      content: div
    });

    return () => {
      tooltipProvider.current?.destroy();
    };
  }, [loading]);

  useEffect(() => {
    tooltipProvider.current?.update(view, prevState);
  });

  return (
    <div className="absolute data-[show=false]:hidden" ref={ref}>
      <button
        className="text-gray-600 bg-slate-200 px-2 py-1 rounded-lg hover:bg-slate-300 border hover:text-gray-900"
        onMouseDown={(e) => {
          // Use `onMouseDown` with `preventDefault` to prevent the editor from losing focus.
          e.preventDefault();

          action(callCommand(toggleStrongCommand.key));
        }}
      >
        加粗
      </button>
    </div>
  );
};

export default View;
