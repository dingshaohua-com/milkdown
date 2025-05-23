import { createContext, useContext } from 'react';
import { EditorDefaultConfig, EditorConfig } from '../global';

const editorDefaultConfig: EditorDefaultConfig = {
  clickToEdit: false,
  imgBaseUrl: '',
  mdMode: false,
};
const EditorDefaultConfigContext = createContext<EditorDefaultConfig>(editorDefaultConfig);
export const useEditorDefaultConfig = () => useContext(EditorDefaultConfigContext);
export const EditorDefaultConfigProvider = ({ children, ...rest }: EditorDefaultConfig & { children: React.ReactNode }) => {
  return <EditorDefaultConfigContext.Provider value={rest}>{children}</EditorDefaultConfigContext.Provider>;
};

const editorConfig: EditorConfig = {};
const EditorConfigContext = createContext<EditorConfig>(editorConfig);
export const useEditorConfig = () => useContext(EditorConfigContext);
export const EditorConfigProvider = ({ children, ...rest }: EditorConfig & { children: React.ReactNode }) => {
  return <EditorConfigContext.Provider value={rest}>{children}</EditorConfigContext.Provider>;
};
