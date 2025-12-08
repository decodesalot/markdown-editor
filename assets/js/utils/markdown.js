const escapeHTML = (str = "") =>
    str.replace(/[&<>"']/g, (char) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char])
    );

const groupListItems = (lines, regex, tag) => {
    const output = [];
    let inList = false;

    lines.forEach(line => {
        const match = line.match(regex);
        if (match) {
            if (!inList) output.push(`<${tag}>`), inList = true;
            output.push(`<li>${match[1]}</li>`);
        } else {
            if (inList) output.push(`</${tag}>`), inList = false;
            output.push(line);
        }
    });

    if (inList) output.push(`</${tag}>`);
    return output.join("\n");
};

const transformCodeBlocks = md =>
    md.replace(/```([\s\S]*?)```/g, (_, code) => `<pre><code>${code}</code></pre>`);

const transformInlineCode = md =>
    md.replace(/`([^`]+)`/g, (_, code) => `<code>${code}</code>`);

const transformHeadings = md =>
    md
        .replace(/^###### (.*)$/gim, "<h6>$1</h6>")
        .replace(/^##### (.*)$/gim, "<h5>$1</h5>")
        .replace(/^#### (.*)$/gim, "<h4>$1</h4>")
        .replace(/^### (.*)$/gim, "<h3>$1</h3>")
        .replace(/^## (.*)$/gim, "<h2>$1</h2>")
        .replace(/^# (.*)$/gim, "<h1>$1</h1>");

const transformEmphasis = md =>
    md
        .replace(/\*\*\*(.*?)\*\*\*/gim, "<b><i>$1</i></b>")
        .replace(/\*\*(.*?)\*\*/gim, "<b>$1</b>")
        .replace(/\*(.*?)\*/gim, "<i>$1</i>")
        .replace(/~~(.*?)~~/gim, "<del>$1</del>");

const transformTaskLists = md =>
    md.replace(
        /^- \[ \] (.*)$/gim,
        `<ul class="task-list"><li><input type="checkbox" disabled> $1</li></ul>`
    ).replace(
        /^- \[x\] (.*)$/gim,
        `<ul class="task-list"><li><input type="checkbox" checked disabled> $1</li></ul>`
    );

const transformOrderedLists = md => groupListItems(md.split("\n"), /^(\d+)\. (.*)$/, "ol");

const transformUnorderedLists = md => groupListItems(md.split("\n"), /^[\*\+-] (.*)$/, "ul");

const transformBlockquotes = md =>
    md.replace(/^> (.*)$/gim, "<blockquote>$1</blockquote>");

const transformLinksAndImages = md =>
    md
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, `<img alt="$1" src="$2" />`)
        .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, `<a href="$2" target="_blank">$1</a>`);

const transformHorizontalRules = md =>
    md.replace(/^---$/gim, "<hr>").replace(/^\*\*\*$/gim, "<hr>");

const transformParagraphs = md => {
    const blockTags = new Set(["ul", "ol", "pre", "blockquote", "h1", "h2", "h3", "h4", "h5", "h6"]);
    return md
        .split(/\n{2,}/)
        .map(block => {
            const trimmed = block.trim();
            if (!trimmed) return "";
            const tagMatch = trimmed.match(/^<(\w+)/);
            return (tagMatch && blockTags.has(tagMatch[1])) ? trimmed : `<p>${trimmed}</p>`;
        })
        .join("\n");
};

const defaultTransforms = [
    transformCodeBlocks,
    transformInlineCode,
    transformHeadings,
    transformTaskLists,
    transformOrderedLists,
    transformUnorderedLists,
    transformBlockquotes,
    transformEmphasis,
    transformLinksAndImages,
    transformHorizontalRules,
    transformParagraphs
];

export function parseMarkdown(md = "", options = {}) {
    let output = escapeHTML(md);

    let transforms = defaultTransforms;

    if (options.disable && Array.isArray(options.disable)) {
        transforms = defaultTransforms.filter(fn => !options.disable.includes(fn.name));
    }

    transforms.forEach(fn => {
        output = fn(output);
    });

    return output;
}