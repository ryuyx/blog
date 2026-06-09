---
title: "Conventional Commits 1.0.0：规范化的 Git 提交信息约定"
pubDatetime: 2026-06-09
description: "Conventional Commits 是一套轻量级的 Git 提交信息约定规范，通过结构化的提交信息实现自动化生成 CHANGELOG、语义版本控制等功能。"
tags: ["git", "conventional-commits", "specification", "workflow"]
lang: "zh"
---

## 简介

Conventional Commits 规范是一套建立在 Git 提交信息之上的轻量级约定。它提供了一套简单的规则来创建明确的提交历史，使得基于这些提交信息编写自动化工具变得更加容易。这套规范与 SemVer（语义化版本控制）相辅相成，通过在提交信息中描述功能（feature）、修复（fix）和不兼容变更（breaking change）来协同工作。

提交信息应遵循以下结构：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

提交信息包含以下结构化元素，用于向库的使用者传达意图：

- **fix**: 类型为 `fix` 的提交表示修复了代码库中的 bug（对应语义化版本中的 PATCH）。
- **feat**: 类型为 `feat` 的提交表示引入了新功能（对应语义化版本中的 MINOR）。
- **BREAKING CHANGE**: 提交中包含 `BREAKING CHANGE` 页脚，或在类型/作用域后附加 `!`，表示引入了不兼容的 API 变更（对应语义化版本中的 MAJOR）。BREAKING CHANGE 可以是任意类型提交的一部分。
- 除 `fix:` 和 `feat:` 之外的其他类型也是允许的，例如 `@commitlint/config-conventional`（基于 Angular 约定）推荐使用 `build:`、`chore:`、`ci:`、`docs:`、`style:`、`refactor:`、`perf:`、`test:` 等。
- 除 `BREAKING CHANGE` 外，还可以提供其他页脚，遵循类似 git trailer 的格式。

Conventional Commits 规范不强制要求额外的类型，它们对语义化版本没有隐含影响（除非包含 BREAKING CHANGE）。可以在类型后提供作用域（scope），用括号包裹，以提供额外的上下文信息，例如 `feat(parser): add ability to parse arrays`。

> 本文翻译整理自 [Conventional Commits 1.0.0](https://www.conventionalcommits.org/) 官方规范。

## 示例

### 带描述和 BREAKING CHANGE 页脚的提交
```
feat: allow provided config object to extend other configs

BREAKING CHANGE: `extends` key in config file is now used for extending other config files
```

### 使用 ! 标记 BREAKING CHANGE
```
feat!: send an email to the customer when a product is shipped
```

### 带作用域和 ! 的提交
```
feat(api)!: send an email to the customer when a product is shipped
```

### 同时使用 ! 和 BREAKING CHANGE 页脚
```
feat!: drop support for Node 6

BREAKING CHANGE: use JavaScript features not available in Node 6.
```

### 无正文的提交
```
docs: correct spelling of CHANGELOG
```

### 带作用域的提交
```
feat(lang): add Polish language
```

### 带多段正文和多个页脚的提交
```
fix: prevent racing of requests

Introduce a request id and a reference to latest request. Dismiss
incoming responses other than from latest request.

Remove timeouts which were used to mitigate the racing issue but are
obsolete now.

Reviewed-by: Z
Refs: #123
```

## 规范

本文档中的关键词 "MUST"、"MUST NOT"、"REQUIRED"、"SHALL"、"SHALL NOT"、"SHOULD"、"SHOULD NOT"、"RECOMMENDED"、"MAY" 和 "OPTIONAL" 的含义参见 RFC 2119。

1. 提交**必须**以类型（type）作为前缀，类型是一个名词（如 `feat`、`fix`），后跟**可选的**作用域（scope）、**可选的** `!`，以及**必需的**冒号和空格。
2. 类型 `feat`**必须**用于向应用或库添加新功能的提交。
3. 类型 `fix`**必须**用于修复应用 bug 的提交。
4. 可以在类型后提供作用域（scope），作用域**必须**是描述代码库某一部分的名词，并用括号包裹，例如 `fix(parser):`。
5. 描述（description）**必须**紧跟类型/作用域前缀后的冒号和空格。描述是对代码变更的简短摘要。
6. 可以在简短描述后提供更长的提交正文（body），提供关于代码变更的额外上下文信息。正文**必须**在描述后空一行开始。
7. 提交正文是自由格式的，可以由任意数量的换行分隔段落组成。
8. 可以在正文后空一行提供一个或多个页脚（footer）。每个页脚**必须**由一个单词标记、`:<space>` 或 `<space>#` 分隔符以及字符串值组成（受 git trailer 约定启发）。
9. 页脚的标记**必须**使用 `-` 代替空格字符，例如 `Acked-by`（有助于区分页脚段与多段正文）。BREAKING CHANGE 除外，它也可以用作标记。
10. 页脚的值可以包含空格和换行，解析**必须**在遇到下一个有效的页脚标记/分隔符对时终止。
11. BREAKING CHANGE**必须**在提交的类型/作用域前缀或页脚中指明。
12. 如果作为页脚，BREAKING CHANGE**必须**由大写文本 `BREAKING CHANGE` 后跟冒号、空格和描述组成。
13. 如果出现在类型/作用域前缀中，BREAKING CHANGE**必须**用 `!` 紧跟在冒号前表示。如果使用了 `!`，可以省略页脚中的 `BREAKING CHANGE:`，提交描述将用于描述 BREAKING CHANGE。
14. 除 `feat` 和 `fix` 之外的类型**可以**用在提交信息中，例如 `docs: update ref docs`。
15. 实现者**不得**将 Conventional Commits 的信息单元视为大小写敏感的，但 BREAKING CHANGE**必须**大写。
16. 当用作页脚标记时，`BREAKING-CHANGE`**必须**与 `BREAKING CHANGE` 同义。

## 为什么要用 Conventional Commits

- 自动生成 CHANGELOG
- 自动确定语义化版本升级（基于提交的类型）
- 向团队成员、公众和其他利益相关者传达变更性质
- 触发构建和发布流程
- 让人们更容易为你的项目做贡献，因为他们可以探索结构化的提交历史

## 常见问题

### 初始开发阶段如何处理提交信息？
建议你按照已经发布产品的标准来操作。通常总有人在用你的软件——即使是你的同行开发者。他们需要知道什么被修复了、什么被破坏了等等。

### 提交标题中的类型是大写还是小写？
可以使用任何大小写，但最好保持一致。

### 如果一个提交符合多种提交类型怎么办？
尽可能拆分成多个提交。Conventional Commits 的好处之一就是能推动我们做出更有组织的提交和 PR。

### 这是否会抑制快速迭代？
它抑制的是混乱无组织的快速推进，但能帮助你在长期内、在跨项目多贡献者的场景下保持快速迭代。

### Conventional Commits 会不会限制开发者的提交类型？
Conventional Commits 鼓励我们更多地使用某些类型（如 fix）。除此之外，它允许团队自定义类型并随时间调整。

### 这与 SemVer 的关系？
`fix` 类型对应 PATCH 发布，`feat` 类型对应 MINOR 发布，包含 BREAKING CHANGE 的提交（无论类型）对应 MAJOR 发布。

### 如何对规范本身进行扩展？
建议使用 SemVer 来发布你自己的扩展版本。

### 用错了提交类型怎么办？
- 合并或发布前：使用 `git rebase -i` 修改提交历史。
- 发布后：根据具体工具和流程处理。
- 用了不合规的类型（如 `feet` 而非 `feat`）：最坏情况下，这不算世界末日，只是该提交会被基于规范的自动化工具忽略。

### 所有贡献者都必须使用 Conventional Commits 吗？
不必。如果使用 squash 合并工作流，主要维护者可以在合并时清理提交信息，不会给普通贡献者增加负担。

### 如何处理 revert 提交？
Conventional Commits 没有明确定义 revert 行为，留给工具开发者利用类型和页脚的灵活性来处理。一个推荐的做法是使用 `revert` 类型和引用被 revert 提交 SHA 的页脚：

```
revert: let us never again speak of the noodle incident

Refs: 676104e, a215868
```

---

> 本文内容整理自 [Conventional Commits 1.0.0](https://www.conventionalcommits.org/) 官方规范，遵循 [CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/) 许可协议。
