import { BlockProvider } from "@milkdown/kit/plugin/block";
import { useInstance } from "@milkdown/react";
import { useEffect, useRef } from "react";
import block from '../../assets/block.svg';
import { api as smBlockViewApi } from '../slash-menu-block-view';


export const View = () => {
  const ref = useRef<HTMLDivElement>(null);
  const tooltipProvider = useRef<BlockProvider>(null);

  const [loading, get] = useInstance();

  useEffect(() => {
    const div = ref.current;
    if (loading || !div) return;

    const editor = get();
    if (!editor) return;

    tooltipProvider.current = new BlockProvider({
      ctx: editor.ctx,
      content: div,
    });
    tooltipProvider.current?.update();

    return () => {
      tooltipProvider.current?.destroy();
    };
  }, [loading]);

  const onClick = () => {
    const editor = get();
    if (!editor) return;
    const smbvApi: any = editor.ctx.get(smBlockViewApi.key);
    smbvApi.show();
  };

  return (
    <div
      ref={ref}
      className="mblock-view"
    >
      <img src={block} alt="block" onClick={onClick}/>
    </div>
  );
};
