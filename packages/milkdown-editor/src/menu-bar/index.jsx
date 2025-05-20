import './style.scss';
// import Shape from './cmp/shape';
// import Action from './cmp/action';
// import Heading from './cmp/heading';
// import Formula from './cmp/formula';
// import { Divider, Button } from 'antd';
// import InsertQs from './cmp/insert-qs';
import FontStyle from './cmp/font-style';
// import ImgUpload from './cmp/img-upload';
// import AlignStyle from './cmp/align-style';
// import InsertSome from './cmp/insert-some';

const MenuBar = ({ editor, handlers, uploadFileConfig }) => {
  // if (!editor) {
  //   return null;
  // }

  return (
    <div className="menuBar">
      {/* <Heading editor={editor} />
      <Divider type="vertical" className="menuBarDivider" /> */}
      <FontStyle editor={editor} />
      {/* <Divider type="vertical" className="menuBarDivider" />
      <InsertSome editor={editor} />
      <Divider type="vertical" className="menuBarDivider" />
      <AlignStyle editor={editor} />
      <Divider type="vertical" className="menuBarDivider" />
      <Shape editor={editor} />
      <Formula editor={editor} />
      <ImgUpload editor={editor} uploadFileConfig={uploadFileConfig} />
      <InsertQs editor={editor} handlers={handlers}/>
      <Divider type="vertical" className="menuBarDivider" />
      <Action editor={editor} handlers={handlers} /> */}
    </div>
  );
};

export default MenuBar;
