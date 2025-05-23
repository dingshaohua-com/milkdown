import cs from 'classnames';
import Action from './cmp/action';
import FontStyle from './cmp/font-style';
import { useEditorConfig } from '../config-ctx';

const MenuBar = () => {
  const config = useEditorConfig();
  const isMdEditorFocused = config.isMdEditorFocused;
  return (
    <div className={cs('menuBar', { isMdEditorFocused})}>
      <FontStyle />
      <Action />
    </div>
  );
};

export default MenuBar;
