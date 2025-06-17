import Editor from '@monaco-editor/react';
interface MdEditorProps {
  content: string;
  onChange: (content: string) => void;
  setIsMdEditorFocused: (isFocused: boolean) => void;
}

const MdEditor: React.FC<MdEditorProps> = ({ content, onChange, setIsMdEditorFocused }) => {
  const onBlur = () => {
    setIsMdEditorFocused(false);
  }
  const onFocus = () => {
    setIsMdEditorFocused(true);
  }
  
  return (
    <div className="md-editor">
      <Editor
        defaultLanguage="markdown"
        value={content}
        wrapperProps={{
          onBlur,
          onFocus,
          fontSize: 12,
        }}
        onChange={(value) => {
          onChange(value);
        }}
      />
    </div>
  );
};

export default MdEditor;
