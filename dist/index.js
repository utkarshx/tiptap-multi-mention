"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMention = exports.CombinedMention = exports.MentionPluginKey = void 0;
const core_1 = require("@tiptap/core");
const state_1 = require("@tiptap/pm/state");
const suggestion_1 = __importDefault(require("@tiptap/suggestion"));
/**
 * The plugin key for the mention plugin.
 * @default 'mention'
 */
exports.MentionPluginKey = new state_1.PluginKey('mention');
/**
 * This extension allows you to insert mentions into the editor.
 * @see https://www.tiptap.dev/api/extensions/mention
 */
exports.CombinedMention = core_1.Node.create({
    name: 'mention',
    addOptions() {
        return {
            HTMLAttributes: {},
            renderText({ options, node }) {
                var _a;
                return `${options.suggestion.char}${(_a = node.attrs.label) !== null && _a !== void 0 ? _a : node.attrs.id}`;
            },
            deleteTriggerWithBackspace: false,
            renderHTML({ options, node }) {
                var _a;
                return [
                    'span',
                    (0, core_1.mergeAttributes)(this.HTMLAttributes, options.HTMLAttributes),
                    `${options.suggestion.char}${(_a = node.attrs.label) !== null && _a !== void 0 ? _a : node.attrs.id}`,
                ];
            },
            suggestion: {
                char: '@',
                pluginKey: exports.MentionPluginKey,
                command: ({ editor, range, props }) => {
                    var _a, _b;
                    // increase range.to by one when the next node is of type "text"
                    // and starts with a space character
                    const nodeAfter = editor.view.state.selection.$to.nodeAfter;
                    const overrideSpace = (_a = nodeAfter === null || nodeAfter === void 0 ? void 0 : nodeAfter.text) === null || _a === void 0 ? void 0 : _a.startsWith(' ');
                    if (overrideSpace) {
                        range.to += 1;
                    }
                    editor
                        .chain()
                        .focus()
                        .insertContentAt(range, [
                        {
                            type: this.name,
                            attrs: props,
                        },
                        {
                            type: 'text',
                            text: ' ',
                        },
                    ])
                        .run();
                    (_b = window.getSelection()) === null || _b === void 0 ? void 0 : _b.collapseToEnd();
                },
                allow: ({ state, range }) => {
                    const $from = state.doc.resolve(range.from);
                    const type = state.schema.nodes[this.name];
                    const allow = !!$from.parent.type.contentMatch.matchType(type);
                    return allow;
                },
            },
        };
    },
    group: 'inline',
    inline: true,
    selectable: false,
    atom: true,
    addAttributes() {
        return {
            id: {
                default: null,
                parseHTML: element => element.getAttribute('data-id'),
                renderHTML: attributes => {
                    if (!attributes.id) {
                        return {};
                    }
                    return {
                        'data-id': attributes.id,
                    };
                },
            },
            label: {
                default: null,
                parseHTML: element => element.getAttribute('data-label'),
                renderHTML: attributes => {
                    if (!attributes.label) {
                        return {};
                    }
                    return {
                        'data-label': attributes.label,
                    };
                },
            },
        };
    },
    parseHTML() {
        return [
            {
                tag: `span[data-type="${this.name}"]`,
            },
        ];
    },
    renderHTML({ node, HTMLAttributes }) {
        if (this.options.renderLabel !== undefined) {
            console.warn('renderLabel is deprecated use renderText and renderHTML instead');
            return [
                'span',
                (0, core_1.mergeAttributes)({ 'data-type': this.name }, this.options.HTMLAttributes, HTMLAttributes),
                this.options.renderLabel({
                    options: this.options,
                    node,
                }),
            ];
        }
        const mergedOptions = Object.assign({}, this.options);
        mergedOptions.HTMLAttributes = (0, core_1.mergeAttributes)({ 'data-type': this.name }, this.options.HTMLAttributes, HTMLAttributes);
        const html = this.options.renderHTML({
            options: mergedOptions,
            node,
        });
        if (typeof html === 'string') {
            return [
                'span',
                (0, core_1.mergeAttributes)({ 'data-type': this.name }, this.options.HTMLAttributes, HTMLAttributes),
                html,
            ];
        }
        return html;
    },
    renderText({ node }) {
        if (this.options.renderLabel !== undefined) {
            console.warn('renderLabel is deprecated use renderText and renderHTML instead');
            return this.options.renderLabel({
                options: this.options,
                node,
            });
        }
        return this.options.renderText({
            options: this.options,
            node,
        });
    },
    addKeyboardShortcuts() {
        return {
            Backspace: () => this.editor.commands.command(({ tr, state }) => {
                let isMention = false;
                const { selection } = state;
                const { empty, anchor } = selection;
                if (!empty) {
                    return false;
                }
                state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
                    if (node.type.name === this.name) {
                        isMention = true;
                        tr.insertText(this.options.deleteTriggerWithBackspace ? '' : this.options.suggestion.char || '', pos, pos + node.nodeSize);
                        return false;
                    }
                });
                return isMention;
            }),
        };
    },
    addProseMirrorPlugins() {
        return [
            (0, suggestion_1.default)(Object.assign({ editor: this.editor }, this.options.suggestion)),
        ];
    },
});
const createMention = (options) => {
    const pluginKey = new state_1.PluginKey(options.name);
    return exports.CombinedMention.extend({
        name: options.name,
        addOptions() {
            var _a, _b;
            return Object.assign(Object.assign(Object.assign({}, (_a = this.parent) === null || _a === void 0 ? void 0 : _a.call(this)), options), { suggestion: Object.assign(Object.assign(Object.assign({}, (_b = this.parent) === null || _b === void 0 ? void 0 : _b.call(this).suggestion), options.suggestion), { pluginKey }) });
        },
        addProseMirrorPlugins() {
            return [
                (0, suggestion_1.default)(Object.assign(Object.assign({ editor: this.editor }, this.options.suggestion), { pluginKey })),
            ];
        },
    });
};
exports.createMention = createMention;
