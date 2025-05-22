export default function MdEditor({ content, onChange }: { content: string, onChange: (content: string) => void }) {

  return <textarea onInput={(e) => {
    onChange(e.target.value);
  }} value={content}></textarea>;
}