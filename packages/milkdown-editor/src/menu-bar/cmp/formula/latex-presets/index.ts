const allModules = [];
const requireModules = import.meta.glob('./modules/**/*.ts', { eager: true });
for (const path in requireModules) {
  const moduleConent: any = requireModules[path];
  allModules.push(moduleConent.default);
}

export default allModules;


// const allModules: any[] = [];

// // Webpack 使用 require.context 代替 import.meta.glob
// const requireModules = require.context(
//   './modules',      // 要扫描的目录
//   true,             // 是否扫描子目录
//   /\.ts$/           // 匹配文件的正则表达式
// );

// // 遍历所有匹配的模块
// requireModules.keys().forEach((path: string) => {
//   const moduleContent = requireModules(path);
//   allModules.push(moduleContent.default || moduleContent);
// });

// export default allModules;