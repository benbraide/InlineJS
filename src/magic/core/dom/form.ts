import { FindComponentById } from "../../../component/find";
import { AddMagicHandler } from "../../../magics/add";
import { CreateMagicHandlerCallback } from "../../../magics/callback";

export const FormMagicHandler = CreateMagicHandlerCallback('form', ({ componentId, component, contextElement }) => {
    return (component || FindComponentById(componentId))?.FindElement(contextElement, el => (el instanceof HTMLElement));
});

export function FormMagicHandlerCompact(){
    AddMagicHandler(FormMagicHandler);
}
