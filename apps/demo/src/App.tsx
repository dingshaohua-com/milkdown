import './App.css';
import MilkdownEditor from '@repo/milkdown-editor';

function App() {
  // const [count, setCount] = useState(0);

  const handleSave = (value: string) => {
    console.log('save', value);
  }

  return <div className='app'>
      <MilkdownEditor defaultValue='你好，这是一段文本' onSave={handleSave}/>

  </div>
  ;
}

export default App;
