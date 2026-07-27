/**
 * CSS Modules are a bundler feature, not a TypeScript one. Without this
 * declaration `import styles from './X.module.css'` is a type error in any
 * package that compiles outside Next.js.
 */
declare module '*.module.css' {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}
