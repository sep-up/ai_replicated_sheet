---
name: "vue3-project-structure"
description: "Provides Vue 3 project structure guidelines and best practices. Invoke when creating new Vue 3 components, pages, or features in this project."
---

# Vue 3 项目结构规范

## 项目结构

```
├── src/
│   ├── App.vue           # 主应用组件
│   ├── main.js           # 应用入口文件
│   ├── style.css         # 全局样式
├── .gitignore            # Git忽略文件
├── AppManifest.json      # 应用配置文件
├── README.md             # 项目说明
├── dist.zip              # 构建输出压缩包
├── index.html            # HTML模板
├── package.json          # 项目依赖和脚本
├── vite.config.js        # Vite配置文件
```

## 技术栈

- **框架**: Vue 3
- **构建工具**: Vite
- **开发依赖**:
  - @vitejs/plugin-vue
  - vite
- **运行依赖**:
  - vue ^3.5.13

## 开发规范

### 组件开发

1. **文件命名**:
   - 组件文件使用 PascalCase (如: `MyComponent.vue`)
   - 工具函数文件使用 camelCase (如: `utils.js`)

2. **组件结构**:
   - 使用 `<script setup>` 语法
   - 组件逻辑与模板分离
   - 样式使用 scoped

3. **代码风格**:
   - 遵循 Vue 3 最佳实践
   - 使用 ES6+ 语法
   - 保持代码简洁清晰

### 项目配置

1. **Vite 配置**:
   - 保持默认配置，如需修改参考 vite.config.js

2. **依赖管理**:
   - 使用 npm 安装依赖
   - 保持依赖版本一致性

### 开发流程

1. **启动开发服务器**:
   ```bash
   npm run dev
   ```

2. **构建项目**:
   ```bash
   npm run build
   ```

3. **预览构建结果**:
   ```bash
   npm run preview
   ```

## 最佳实践

1. **代码组织**:
   - 按功能模块组织代码
   - 合理拆分组件，保持组件职责单一

2. **性能优化**:
   - 使用 Vue 3 的 Composition API
   - 合理使用响应式数据
   - 避免不必要的计算和渲染

3. **代码质量**:
   - 编写清晰的注释
   - 遵循一致的代码风格
   - 定期进行代码审查

## 使用场景

- 当创建新的 Vue 3 组件时
- 当添加新的页面或功能时
- 当需要了解项目结构和规范时
- 当指导新成员参与项目开发时