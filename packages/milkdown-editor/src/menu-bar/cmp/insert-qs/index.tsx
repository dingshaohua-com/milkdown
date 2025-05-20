import { Button, Tooltip, Popover, Input } from 'antd';
import { useState } from 'react';
import ohmImg from '../../../assets/ohm.svg';


const imgUpload = ({ editor, handlers }) => {
  const [open, setOpen] = useState(false);

  const ok = () => {
    editor.chain().focus().insertQs().run();
    handlers.onInsertQs && handlers.onInsertQs();
  };

  return (
    <div className="fontStyle">
      <Tooltip title="插入填空">
          <Button
            onClick={ok}
            color="default"
            variant="filled"
            autoInsertSpace
          >
            <img src={ohmImg} style={{ width: 18 }}/>
          </Button>
      </Tooltip>
    </div>
  );
};

export default imgUpload;
