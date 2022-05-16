export function FlattenDirective(directive) {
    return {
        originalView: directive.meta.view.original,
        expandedView: directive.meta.view.expanded,
        nameValue: directive.meta.name.value,
        nameJoined: directive.meta.name.joined,
        nameParts: directive.meta.name.parts,
        argKey: directive.meta.arg.key,
        argOptions: directive.meta.arg.options,
        expression: directive.value,
    };
}
