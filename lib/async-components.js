import dynamic from 'next/dynamic';

/**
 * 异步加载客户端组件，避免构建时引用问题
 * @param {string} importPath - 组件导入路径
 * @param {Object} options - 配置选项
 * @returns {React.ComponentType} 动态导入的组件
 */
export function loadClientComponent(importPath, options = {}) {
  return dynamic(() => import(importPath), {
    ssr: false,
    loading: () => <div className="p-4 text-center">加载中...</div>,
    ...options,
  });
}

/**
 * 预加载客户端组件，但不立即渲染
 * @param {string} importPath - 组件导入路径
 */
export function preloadClientComponent(importPath) {
  import(importPath).catch(err => {
    console.error('预加载组件失败:', err);
  });
}

/**
 * 创建懒加载组件的外壳
 * @param {string} importPath - 组件导入路径
 * @param {Object} props - 传递给组件的属性
 * @returns {Object} 包含组件与预加载函数的对象
 */
export function createAsyncComponent(importPath, props = {}) {
  const Component = loadClientComponent(importPath);
  
  return {
    Component,
    preload: () => preloadClientComponent(importPath),
    render: (additionalProps = {}) => (
      <Component {...props} {...additionalProps} />
    ),
  };
} 