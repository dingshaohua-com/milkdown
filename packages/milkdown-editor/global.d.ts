import { MathfieldElement } from 'mathlive';
import type { Editor } from '@milkdown/kit/core'

declare module '*.svg' {
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<React.HTMLAttributes<MathfieldElement>, MathfieldElement>;
    }
  }
}

// 编辑器默认配置
declare interface EditorDefaultConfig {
  imgBaseUrl?: string;
  imageUploadHandler?: (file: File) => Promise<string>;
  onImageUpload?: ({ file, base64, url, id }: { file: File; base64: string; url: string; id: string }) => void;
  placeholder?: string;
  clickToEdit?: boolean;
  defaultValue?: string;
}

// 编辑器配置
type EditorConfig = {
  onSave?: (arg: { doc: any; json: any; markdown: any }) => void;
  placeholder?: string;
  editor?: Editor;
  onBlur?: (arg: any) => void;
  onFocus?: (arg: any) => void;
  [str: string]: any;
} & EditorDefaultConfig;

