import { GetGlobal, WaitForGlobal } from './global/get';

import { AnimationCreatorCallbackType, IAnimationActorCallbackDetails, IAnimationEaseCallbackDetails } from './types/animation';

import { AnimationConcept } from './concepts/animation';

import { DefaultAnimationEase } from './animation/easing/default';

import { DefaultAnimationActor } from './animation/actors/default';
import { NullAnimationActor } from './animation/actors/null';

import { BezierAnimationEaseCreator } from './animation/creators/bezier';

import { ScaleAnimationCreator } from './animation/creators/scale';
import { TranslateAnimationCreator } from './animation/creators/translate';
import { RotateAnimationCreator } from './animation/creators/rotate';
import { SceneAnimationCreator } from './animation/creators/scene';

import { TransitionDirectiveHandlerCompact } from './directive/plugin/animation/transition';
import { AnimateDirectiveHandlerCompact } from './directive/plugin/animation/animate';
import { AnimationMagicHandlerCompact } from './magic/plugin/animation';

WaitForGlobal().then(() => {
    let concept = new AnimationConcept(), easings = concept.GetEaseCollection(), actors = concept.GetActorCollection(), creators = concept.GetCreatorCollection();

    let addEase = (info: IAnimationEaseCallbackDetails) => easings.Add(info.callback, info.name);
    let addActor = (info: IAnimationActorCallbackDetails) => actors.Add(info.callback, info.name);
    let addCreator = (name: string, callback: AnimationCreatorCallbackType) => creators.Add(name, callback);
    
    addEase(DefaultAnimationEase);

    addActor(DefaultAnimationActor);
    addActor(NullAnimationActor);

    addCreator('bezier', BezierAnimationEaseCreator);
    
    addCreator('scale', ScaleAnimationCreator);
    addCreator('translate', TranslateAnimationCreator);
    addCreator('rotate', RotateAnimationCreator);
    addCreator('scene', SceneAnimationCreator);
    
    GetGlobal().SetConcept('animation', concept);
    
    TransitionDirectiveHandlerCompact();
    AnimateDirectiveHandlerCompact();
    AnimationMagicHandlerCompact();
});
