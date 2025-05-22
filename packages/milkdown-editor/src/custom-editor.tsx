import './style.scss';
import MenuBar from './menu-bar';
import emitter from './utils/emitter';
import { Crepe } from '@milkdown/crepe';
import { useState, useRef } from 'react';
import { EditorConfig } from '../global';
import '@milkdown/crepe/theme/frame.css'; // 一个完整主题（可选，其它可选项见下）
import '@milkdown/crepe/theme/common/style.css'; // 基础样式（必需）
import { replaceAll } from '@milkdown/kit/utils';
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react';
import { EditorConfigProvider, useEditorDefaultConfig } from './config-ctx';

const CrepeEditor: React.FC<EditorConfig> = (props) => {
  const defaultConfig = useEditorDefaultConfig();
  const config = { ...defaultConfig, ...props };

  const editorRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState(props.defaultValue || 'Hello, Milkdown!');
  const { get } = useEditor((root) => {
    const crepe = new Crepe({ root, defaultValue: content });
    crepe.on((listener) => {
      listener.selectionUpdated((ctx, selection, prevSelection) => {
        emitter.emit('selectionUpdated', { ctx, selection, prevSelection });
      });
      listener.markdownUpdated((ctx, markdown) => {
        if (markdown !== content) {
          setContent(markdown);
          editorRef.current?.focus();
        }
      });
    });
    return crepe;
  });

  const editor = get();

  return (
    <EditorConfigProvider {...{ ...config, editor }}>
      <div className="milkdown-editor">
        <MenuBar />
        <div className="milkdown-editor-content">
          <Milkdown />
        </div>
      </div>
    </EditorConfigProvider>
  );
};

export const MilkdownEditorWrapper: React.FC = (props) => {
  return (
    <MilkdownProvider>
      <CrepeEditor {...props} />
    </MilkdownProvider>
  );
};

export default MilkdownEditorWrapper;
