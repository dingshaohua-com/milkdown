import './style.scss';
import MenuBar from './menu-bar';
import MdEditor from './md-editor';
import emitter from './utils/emitter';
import { Crepe } from '@milkdown/crepe';
import { EditorConfig } from '../global';
import '@milkdown/crepe/theme/frame.css'; // 一个完整主题（可选，其它可选项见下）
import '@milkdown/crepe/theme/common/style.css'; // 基础样式（必需）
import { replaceAll } from '@milkdown/kit/utils';
import { editorViewCtx } from '@milkdown/kit/core';
import { useState, useRef, useEffect } from 'react';
import { Milkdown, MilkdownProvider, useEditor } from '@milkdown/react';
import { EditorConfigProvider, useEditorDefaultConfig } from './config-ctx';

const CrepeEditor: React.FC<EditorConfig> = (props) => {
  const defaultConfig = useEditorDefaultConfig();
  const config = { ...defaultConfig, ...props };

  const [content, setContent] = useState(props.defaultValue || 'Hello, Milkdown!');
  const { get } = useEditor((root) => {
    const crepe = new Crepe({ root, defaultValue: content });
    crepe.on((listener) => {
      listener.selectionUpdated((ctx, selection, prevSelection) => {
        const isFocused = ctx.get(editorViewCtx).hasFocus();
        if (isFocused) {
          emitter.emit('selectionUpdated', { ctx, selection, prevSelection });
        }
      });
      listener.markdownUpdated((ctx, markdown) => {
        const isFocused = ctx.get(editorViewCtx).hasFocus();
        if (isFocused) {
          setContent(markdown);
        }
      });
    });
    return crepe;
  });

  const editor = get();

  // 设置一个状态来跟踪焦点
  const [isFocused, setIsFocused] = useState(false);
  useEffect(() => {
    if (!editor) return;
    // 在编辑器创建后
    const editorView = editor.ctx.get(editorViewCtx);
    editorView.dom.addEventListener('focus', () => {
      setIsFocused(true);
    });

    editorView.dom.addEventListener('blur', () => {
      setIsFocused(false);
    });

    return () => {
      editorView.dom.removeEventListener('focus', () => {});
      editorView.dom.removeEventListener('blur', () => {});
    };
  }, [get]);

  const handleMdEditorChange = (content: string) => {
    setContent(content);
    editor?.action(replaceAll(content));
  }
  

  return (
    <EditorConfigProvider {...{ ...config, editor, isFocused }}>
      <div className="milkdown-editor">
        <MenuBar />
        <div className="content">
          <Milkdown />
          <MdEditor content={content} onChange={handleMdEditorChange} />
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
