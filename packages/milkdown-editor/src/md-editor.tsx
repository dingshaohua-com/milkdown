import Editor from '@monaco-editor/react';

export default function MdEditor({ content, onChange }: { content: string, onChange: (content: string) => void }) {

  // return <textarea onInput={(e) => {
  //   onChange(e.target.value);
  // }} value={content}></textarea>;
  return <div className="md-editor">
  <Editor height="100vh" defaultLanguage="markdown" value={content} onChange={(value) => {
    onChange(value);
  }}/>
  </div>
}