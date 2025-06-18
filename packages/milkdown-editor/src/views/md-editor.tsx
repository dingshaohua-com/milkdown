import Editor, { useMonaco } from '@monaco-editor/react';

interface MdEditorProps {
  content: string;
  onChange: (content: string) => void;
  setIsMdEditorFocused: (isFocused: boolean) => void;
}

const theme = {
  base: 'vs',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#00000000',
    'editor.foreground': '#000000',
    focusBorder: '#00000000',
    'editor.lineHighlightBackground': '#00000000',
    'editor.lineHighlightBorder': '#00000000',
    'editor.selectionBackground': '#add6ff',
    'editor.inactiveSelectionBackground': '#e5ebf1',
    'editorCursor.foreground': '#000000',
    'editorWhitespace.foreground': '#d3d3d3',
    'editorIndentGuide.background': '#d3d3d3',
    'editorIndentGuide.activeBackground': '#939393',
    'editor.selectionHighlightBorder': '#add6ff',
  },
};

const MdEditor: React.FC<MdEditorProps> = ({ content, onChange, setIsMdEditorFocused }) => {
  // const monaco = useMonaco();

  const beforeMount = (monaco: any) => {
    monaco.editor.defineTheme('myCustomTheme', theme);
  };

  const onBlur = () => {
    setIsMdEditorFocused(false);
  };
  const onFocus = () => {
    setIsMdEditorFocused(true);
  };

  const onMount = (editor: any, monaco: any) => {
    editor.updateOptions({
      theme: 'myCustomTheme',
    });
  };

  return (
    <Editor
      defaultLanguage="markdown"
      value={content}
      beforeMount={beforeMount}
      onMount={onMount}
      wrapperProps={{
        onBlur,
        onFocus,
        className: 'md-editor',
      }}
      options={{
        minimap: {
          enabled: false,
        },
        fontSize: 14,
        lineHeight: 1.5,
        theme: 'myCustomTheme',
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
      onChange={(value) => {
        onChange(value || '');
      }}
    />
  );
};

export default MdEditor;
