import './App.css';
import { useEffect, useState } from 'react';
import MilkdownEditor from '@repo/milkdown-editor';

const contentTemp = `
# 你好，这是一段文本111
## 你好，这是一段文本222
### 你好，这是一段文本333
`;

function App() {
  // const [count, setCount] = useState(0);

  const handleSave = (value: any) => {
    console.log('save', value);
  };

  const [content, setContent] = useState(contentTemp);


  const handleChange = (value: string) => {
    console.log('change', value);
    setContent(value);
  };

  return (
    <div className="app">
      <MilkdownEditor content={content} onSave={handleSave} onChange={handleChange} />
    </div>
  );
}

export default App;
