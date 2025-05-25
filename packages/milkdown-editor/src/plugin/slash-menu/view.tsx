import { useEffect, useRef, useState } from 'react';
import { SlashProvider } from '@milkdown/kit/plugin/slash';
import { usePluginViewContext } from '@prosemirror-adapter/react';

export const SlashView = () => {
  const { view, prevState } = usePluginViewContext();
  const provider = useRef<SlashProvider>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (!containerRef.current || !view) return;
    provider.current = new SlashProvider({
      content: containerRef.current,
      debounce: 50,
    });
    provider.current.onShow = () => setIsOpen(true);
    provider.current.onHide = () => setIsOpen(false);
    return () => {
      provider.current?.destroy();
      provider.current = null;
    };
  }, [view]);
  useEffect(() => provider.current?.update(view, prevState));
  return (
    <div className="slash-view" style={{ display: isOpen ? 'block' : 'none' }} ref={containerRef}>
      <div className="slash-view-content">
        <div className="slash-view-content-item">哈哈哈</div>
      </div>
    </div>
  );
};
