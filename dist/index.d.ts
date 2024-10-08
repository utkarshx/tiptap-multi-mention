import { Node } from '@tiptap/core';
import { DOMOutputSpec, Node as ProseMirrorNode } from '@tiptap/pm/model';
import { PluginKey } from '@tiptap/pm/state';
import { SuggestionOptions } from '@tiptap/suggestion';
export interface CombinedMentionNodeAttrs {
    /**
     * The identifier for the selected item that was mentioned, stored as a `data-id`
     * attribute.
     */
    id: string | null;
    /**
     * The label to be rendered by the editor as the displayed text for this mentioned
     * item, if provided. Stored as a `data-label` attribute. See `renderLabel`.
     */
    label?: string | null;
}
export type CombinedMentionOptions<SuggestionItem = any, Attrs extends Record<string, any> = CombinedMentionNodeAttrs> = {
    /**
     * The HTML attributes for a mention node.
     * @default {}
     * @example { class: 'foo' }
     */
    HTMLAttributes: Record<string, any>;
    /**
     * A function to render the label of a mention.
     * @deprecated use renderText and renderHTML instead
     * @param props The render props
     * @returns The label
     * @example ({ options, node }) => `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`
     */
    renderLabel?: (props: {
        options: CombinedMentionOptions<SuggestionItem, Attrs>;
        node: ProseMirrorNode;
    }) => string;
    /**
     * A function to render the text of a mention.
     * @param props The render props
     * @returns The text
     * @example ({ options, node }) => `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`
     */
    renderText: (props: {
        options: CombinedMentionOptions<SuggestionItem, Attrs>;
        node: ProseMirrorNode;
    }) => string;
    /**
     * A function to render the HTML of a mention.
     * @param props The render props
     * @returns The HTML as a ProseMirror DOM Output Spec
     * @example ({ options, node }) => ['span', { 'data-type': 'mention' }, `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`]
     */
    renderHTML: (props: {
        options: CombinedMentionOptions<SuggestionItem, Attrs>;
        node: ProseMirrorNode;
    }) => DOMOutputSpec;
    /**
     * Whether to delete the trigger character with backspace.
     * @default false
     */
    deleteTriggerWithBackspace: boolean;
    /**
     * The suggestion options.
     * @default {}
     * @example { char: '@', pluginKey: MentionPluginKey, command: ({ editor, range, props }) => { ... } }
     */
    suggestion: Omit<SuggestionOptions<SuggestionItem, Attrs>, 'editor'>;
};
/**
 * The plugin key for the mention plugin.
 * @default 'mention'
 */
export declare const MentionPluginKey: PluginKey<any>;
/**
 * This extension allows you to insert mentions into the editor.
 * @see https://www.tiptap.dev/api/extensions/mention
 */
export declare const CombinedMention: Node<CombinedMentionOptions<any, CombinedMentionNodeAttrs>, any>;
export declare const createMention: (options: Partial<CombinedMentionOptions> & {
    name: string;
}) => Node<CombinedMentionOptions<any, CombinedMentionNodeAttrs>, any>;
