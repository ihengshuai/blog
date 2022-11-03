# 编辑器相关

- DocumentORShadow.activeElement: 获取聚焦元素focus/active
- Selection对象（window.getSelection / document.setSelection）: 用户选择的文本范围或光标的当前位置，https://developer.mozilla.org/zh-CN/docs/Web/API/Selection
- Range（接口表示一个包含节点与文本节点的一部分的文档片段）：https://developer.mozilla.org/zh-CN/docs/Web/API/Range
  - 属性：
    - collapsed
    - commonAncestorContainer
    - startContainer
    - endContainer
    - startOffset
    - endOffset
  - 方法：
    - collapse
    - compareBoundaryPoints(how, sourceRange)边界比较
    - comparePoint(referenceNode, offset)返回 -1、0 或 1，分别表示端点在 Range 之前、内部还是之后
    - cloneContents：返回range中所有节点文档片段
    - cloneRange()
    - deleteContents()
    - getBoundingClientRect(): 返回范围内容的DOMRect
    - getClientRects
    - getIsPointInRange(node, offset): 判断某个节点在range里
    - insertNode(node): 在range开头插入节点
    - intersectsNode(node): 判断节点是否相交
    - selectNode(node): 选中节点，并将range起始节点的父节点和node的父节点相同
    - selectNodeContents(node): 设置包含节点内容
    - setEnd(node, offset): 设置range终点
    - setStart(node, offset): 设置起点
    - setEndAfter(refenceNode)
    - setEndBefore
- 粘贴对象（clipboardData）: ClipboardEvent.clipboardData https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent/clipboardData

- 零宽字符
```
零宽空格（zero-width space, ZWSP）用于可能需要换行处。
    Unicode: U+200B  HTML: &#8203;

零宽不连字 (zero-width non-joiner，ZWNJ)放在电子文本的两个字符之间，抑制本来会发生的连字，而是以这两个字符原本的字形来绘制。
    Unicode: U+200C  HTML: &#8204;

零宽连字（zero-width joiner，ZWJ）是一个控制字符，放在某些需要复杂排版语言（如阿拉伯语、印地语）的两个字符之间，使得这两个本不会发生连字的字符产生了连字效果。
    Unicode: U+200D  HTML: &#8205;

左至右符号（Left-to-right mark，LRM）是一种控制字符，用于计算机的双向文稿排版中。
    Unicode: U+200E  HTML: &lrm; &#x200E; 或&#8206;

右至左符号（Right-to-left mark，RLM）是一种控制字符，用于计算机的双向文稿排版中。
    Unicode: U+200F  HTML: &rlm; &#x200F; 或&#8207;
    
字节顺序标记（byte-order mark，BOM）常被用来当做标示文件是以UTF-8、UTF-16或UTF-32编码的标记。
    Unicode: U+FEFF
```