/********************************************************************************
 * Copyright (C) 2020 CoCreate LLC and others.
 *
 *
 * SPDX-License-Identifier: MIT
 ********************************************************************************/

import "@cocreate/element-prototype";
import { queryElements } from "@cocreate/utils";
import Actions from "@cocreate/actions";
import Observer from "@cocreate/observer";

const selector = "[print-query]";
const initialized = new WeakSet();

/**
 *
 * @public
 * @environment client
 */
function init(element) {
    const elements = !element ? document.querySelectorAll(selector)
        : element instanceof Element ? [element] : element;
    for (const target of elements) {
        if (!target.matches(selector) || initialized.has(target)) continue;
        initialized.add(target);
        target.addEventListener("click", () => {
            if (target.hasAttribute("actions")) return;
            runPrint({ element: target });
        });
    }
}

function cloneForPrint(target) {
    const clone = target.cloneNode(true);
    const originals = [target, ...target.querySelectorAll("*")];
    const copies = [clone, ...clone.querySelectorAll("*")];
    originals.forEach((original, index) => {
        const copy = copies[index];
        const style = getComputedStyle(original);
        // Unclip scrollable layouts without showing intentionally hidden content.
        if (/(auto|scroll|hidden|clip)/.test(`${style.overflowX} ${style.overflowY}`)) {
            for (const [name, value] of Object.entries({ overflow: "visible", height: "auto", "max-height": "none", "min-height": "0" }))
                copy.style.setProperty(name, value, "important");
        }
        if (style.position === "sticky") copy.style.setProperty("position", "static", "important");
        if (original.matches("input")) {
            if (original.type !== "file") copy.setAttribute("value", original.value);
            copy.toggleAttribute("checked", original.checked);
            copy.indeterminate = original.indeterminate;
        } else if (original.matches("textarea")) copy.textContent = original.value;
        else if (original.matches("option")) copy.toggleAttribute("selected", original.selected);
        for (const attribute of [...copy.attributes]) {
            if (attribute.name.startsWith("on")) copy.removeAttribute(attribute.name);
        }
    });
    const style = getComputedStyle(target);
    for (const property of style) {
        if (property.startsWith("--")) clone.style.setProperty(property, style.getPropertyValue(property));
    }
    clone.querySelectorAll("script, iframe, object, embed, .simplebar-track, .simplebar-placeholder").forEach(node => node.remove());
    return clone;
}

/**
 *
 * @public
 * @environment client
 */
async function print(elements) {
    if (!elements) return;
    const targets = elements instanceof Element ? [elements] : Array.from(elements);
    if (!targets.length) return;
    const iframe = document.createElement("iframe");
    iframe.title = "Print preview";
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.cssText = "position:fixed;left:-10000px;top:0;width:1000px;height:800px;border:0";
    document.body.appendChild(iframe);
    const frame = iframe.contentWindow;
    const doc = iframe.contentDocument;
    try {
        doc.open();
        doc.write("<!doctype html><html><head><title>Print</title></head><body></body></html>");
        doc.close();
        for (const attribute of document.documentElement.attributes)
            doc.documentElement.setAttribute(attribute.name, attribute.value);
        for (const attribute of document.body.attributes)
            doc.body.setAttribute(attribute.name, attribute.value);
        const base = doc.createElement("base");
        base.href = document.baseURI;
        doc.head.appendChild(base);
        const loading = [];
        for (const sheet of document.querySelectorAll('style, link[rel="stylesheet"]')) {
            const copy = sheet.cloneNode(true);
            if (copy.tagName === "LINK") {
                loading.push(new Promise(resolve => {
                    copy.addEventListener("load", resolve, { once: true });
                    copy.addEventListener("error", resolve, { once: true });
                }));
            }
            doc.head.appendChild(copy);
        }
        const styles = doc.createElement("style");
        styles.textContent = `
            html, body { height: auto !important; overflow: visible !important; }
            .simplebar-wrapper, .simplebar-mask, .simplebar-offset,
            .simplebar-content-wrapper, .simplebar-content {
                position: static !important; overflow: visible !important;
                height: auto !important; max-height: none !important;
                width: auto !important; margin: 0 !important; transform: none !important;
            }
            thead { display: table-header-group; }
            tr, img { break-inside: avoid; }
        `;
        doc.head.appendChild(styles);
        for (const target of targets) doc.body.appendChild(doc.adoptNode(cloneForPrint(target)));
        for (const img of doc.images) {
            img.loading = "eager";
            if (!img.complete) loading.push(new Promise(resolve => {
                img.addEventListener("load", resolve, { once: true });
                img.addEventListener("error", resolve, { once: true });
            }));
        }
        await Promise.all(loading);
        if (doc.fonts?.ready) await doc.fonts.ready;
        await new Promise(resolve => frame.requestAnimationFrame(() => frame.requestAnimationFrame(resolve)));
        await new Promise((resolve, reject) => {
            frame.addEventListener("afterprint", resolve, { once: true });
            try { frame.focus(); frame.print(); } catch (error) { reject(error); }
        });
    } finally {
        iframe.remove();
    }
}

async function runPrint(action) {
    try {
        const elements = action.element.hasAttribute("print-query")
            ? queryElements({ element: action.element, prefix: "print" }) : [action.element];
        await print(elements);
        if (action.end) action.end();
        else action.element.dispatchEvent(new CustomEvent("printed", { bubbles: true }));
    } catch (error) {
        action.abort?.();
        action.element.dispatchEvent(new CustomEvent("printError", { bubbles: true, detail: { error } }));
    }
}

init();
Actions.init([{ name: "print", endEvent: "printed", callback: runPrint }]);
Observer.init({
    name: "CoCreatePrintAddedNodes", types: ["addedNodes"], selector,
    callback: mutation => init(mutation.target)
});
Observer.init({
    name: "CoCreatePrintObserver", types: ["attributes"], attributeFilter: ["print-query"], selector,
    callback: mutation => init(mutation.target)
});

export default { init, print };

/**
 *
 * @name actions
 * @kind member
 * @attribute
 * @environment client
 */

/**
 *
 * @name aria-hidden
 * @kind member
 * @attribute
 * @environment client
 */

/**
 *
 * @name print-query
 * @kind member
 * @attribute
 * @environment client
 */

/**
 *
 * @name value
 * @kind member
 * @attribute
 * @environment client
 */

/**
 * A simple print component in vanilla javascript. Easily configured using HTML5 data-attributes and/or JavaScript API.
 *
 * @module print
 * @environment client
 */

/**
 * Declarative selectors recognized by this module.
 *
 * @name declarative-selectors
 * @kind member
 * @selectors
 * @environment client
 * @example
 * ```json
 * [
 *   "[print-query]"
 * ]
 * ```
 */

/**
 * Declarative actions supported or registered by this module.
 *
 * @name declarative-actions
 * @kind member
 * @actions
 * @environment client
 * @example
 * ```json
 * [
 *   {
 *     "name": "print"
 *   }
 * ]
 * ```
 */
