import mermaid from "mermaid";

let initialized = false;

function initMermaid(): void {
  if (initialized) return;
  initialized = true;

  mermaid.initialize({
    startOnLoad: false,
    theme: "base",
    themeVariables: {
      background: "transparent",
      primaryColor: "var(--color-accent)",
      primaryTextColor: "var(--color-foreground)",
      primaryBorderColor: "var(--color-accent)",
      lineColor: "var(--color-muted-foreground)",
      secondaryColor: "var(--color-muted)",
      tertiaryColor: "var(--color-background)",
      fontSize: "14px",
    },
  });
}

async function renderMermaidBlocks(): Promise<void> {
  initMermaid();

  const blocks = document.querySelectorAll<HTMLElement>(
    "pre > code.language-mermaid",
  );

  if (blocks.length === 0) return;

  for (const codeBlock of blocks) {
    const pre = codeBlock.parentElement;
    if (!pre || pre.dataset.mermaidRendered) continue;

    pre.dataset.mermaidRendered = "true";
    const source = codeBlock.textContent ?? "";
    const id = `mermaid-${crypto.randomUUID()}`;

    try {
      const { svg } = await mermaid.render(id, source);
      pre.innerHTML = svg;
      pre.classList.add("mermaid-rendered");
    } catch (err) {
      console.error("[Mermaid] Failed to render diagram:", err);
      pre.dataset.mermaidRendered = "error";
    }
  }
}

document.addEventListener("DOMContentLoaded", renderMermaidBlocks);
document.addEventListener("astro:after-swap", renderMermaidBlocks);