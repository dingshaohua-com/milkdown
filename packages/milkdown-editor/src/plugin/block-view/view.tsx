import MenuView from './menu-view';
import { useClickAway } from 'ahooks';
import { useInstance } from '@milkdown/react';
import block from '../../assets/img/block.svg';
import { useEffect, useRef, useState } from 'react';
import { autoUpdate, useFloating } from '@floating-ui/react';
import { BlockProvider, blockServiceInstance, blockConfig } from '@milkdown/kit/plugin/block';

export const View = () => {
  const ref = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const tooltipProvider = useRef<BlockProvider>(null);

  const { refs, floatingStyles } = useFloating({
    whileElementsMounted: autoUpdate,
  });

  const [loading, get] = useInstance();

  useEffect(() => {
    const div = ref.current;
    if (loading || !div) return;

    const editor = get();
    if (!editor) return;
    
    const blockProvider = new BlockProvider({
      ctx: editor.ctx,
      content: div,
      getPlacement: () => 'left',
      getOffset: () => 18,
    });
    tooltipProvider.current = blockProvider;

    // console.log(service.removeEvent());

    tooltipProvider.current?.update();
    return () => {
      tooltipProvider.current?.destroy();
    };
  }, [loading]);

  const editor = get()!;
  useClickAway(() => {
    if (!editor || !tooltipProvider.current) return;
    const service = editor.ctx.get(blockServiceInstance.key);
    service.bind(editor.ctx, (message) => {
      if (message.type === 'hide') {
        tooltipProvider.current?.hide();
        // this.#activeNode = null;
      } else if (message.type === 'show') {
        tooltipProvider.current?.show(message.active);
        // this.#activeNode = message.active;
      }
    });
    setIsOpen(false);
  }, [ref, floatingRef]);

  const onClick = () => {
    const editor = get();
    if (!editor || !ref.current) return;
    setIsOpen(true);
    editor.ctx.get(blockServiceInstance.key).unBind();
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        ref={(node) => {
          if (node) {
            refs.setReference(node);
            ref.current = node;
          }
        }}
        className="milkdown-block-handle"
      >
        <img src={block} alt="block" onClick={onClick} />
      </div>
      {isOpen && (
        <div
          ref={(node) => {
            if (node) {
              refs.setFloating(node);
              floatingRef.current = node;
            }
          }}
          style={floatingStyles}
        >
          <MenuView />
        </div>
      )}
    </>
  );
};
