import { FindComponentById, FindComponentByName } from "../../../component/find";
import { AddMagicHandler } from "../../../magics/add";
import { CreateMagicHandlerCallback } from "../../../magics/callback";

export const ComponentMagicHandler = CreateMagicHandlerCallback('component', () => (name: string) => FindComponentByName(name)?.GetRootProxy().GetNative());

export const ComponentNameMagicHandler = CreateMagicHandlerCallback('name', ({ componentId, component }) => (component || FindComponentById(componentId))?.GetName());

export function ComponentMagicHandlerCompact(){
    AddMagicHandler(ComponentMagicHandler);
    AddMagicHandler(ComponentNameMagicHandler);
}

