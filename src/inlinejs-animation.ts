import { GetGlobal, WaitForGlobal } from './global/get';

import { AnimationCreatorCallbackType, IAnimationActorCallbackDetails, IAnimationEaseCallbackDetails } from './types/animation';

import { AnimationConcept } from './concepts/animation';

import { BackAnimationEase, BackInAnimationEase, BackOutAnimationEase, BackInOutAnimationEase } from './animation/easing/back';
import { BounceAnimationEase, BounceInAnimationEase, BounceOutAnimationEase, BounceInOutAnimationEase } from './animation/easing/bounce';
import { CircleAnimationEase, CircleInAnimationEase, CircleOutAnimationEase, CircleInOutAnimationEase } from './animation/easing/circle';
import { CubicAnimationEase, CubicInAnimationEase, CubicOutAnimationEase, CubicInOutAnimationEase } from './animation/easing/cubic';
import { ElasticAnimationEase, ElasticInAnimationEase, ElasticOutAnimationEase, ElasticInOutAnimationEase } from './animation/easing/elastic';
import { ExponentialAnimationEase, ExponentialInAnimationEase, ExponentialOutAnimationEase, ExponentialInOutAnimationEase } from './animation/easing/exponential';
import { QuadraticAnimationEase, QuadraticInAnimationEase, QuadraticOutAnimationEase, QuadraticInOutAnimationEase } from './animation/easing/quadratic';
import { QuartAnimationEase, QuartInAnimationEase, QuartOutAnimationEase, QuartInOutAnimationEase } from './animation/easing/quart';
import { QuintAnimationEase, QuintInAnimationEase, QuintOutAnimationEase, QuintInOutAnimationEase } from './animation/easing/quint';
import { SineAnimationEase, SineInAnimationEase, SineOutAnimationEase, SineInOutAnimationEase } from './animation/easing/sine';

import { DefaultAnimationEase } from './animation/easing/default';
import { LinearAnimationEase } from './animation/easing/linear';

import { DefaultAnimationActor } from './animation/actors/default';

import { WidthAnimationActor } from './animation/actors/scale/width';
import { HeightAnimationActor } from './animation/actors/scale/height';
import { ZoomAnimationActor } from './animation/actors/scale/zoom';

import { SlideDownAnimationActor } from './animation/actors/translate/slide-down';
import { SlideLeftAnimationActor } from './animation/actors/translate/slide-left';
import { SlideRightAnimationActor } from './animation/actors/translate/slide-right';
import { SlideUpAnimationActor } from './animation/actors/translate/slide-up';

import { SpinAnimationActor } from './animation/actors/rotate/spin';
import { FlipAnimationActor } from './animation/actors/rotate/flip';
import { TossAnimationActor } from './animation/actors/rotate/toss';

import { PulseAnimationActor } from './animation/actors/scene/pulse';
import { HeartbeatAnimationActor } from './animation/actors/scene/heartbeat';

import { ScaleAnimationCreator } from './animation/creators/scale';
import { TranslateAnimationCreator } from './animation/creators/translate';
import { RotateAnimationCreator } from './animation/creators/rotate';

import { ShakeAnimationCreator } from './animation/creators/shake';
import { VibrateAnimationCreator } from './animation/creators/vibrate';
import { RubberbandAnimationCreator } from './animation/creators/rubberband';
import { JelloAnimationCreator } from './animation/creators/jello';
import { TadaAnimationCreator } from './animation/creators/tada';
import { SwingAnimationCreator } from './animation/creators/swing';

import { TransitionDirectiveHandlerCompact } from './directive/plugin/animation/transition';
import { AnimationMagicHandlerCompact } from './magic/plugin/animation';

WaitForGlobal().then(() => {
    let concept = new AnimationConcept(), easings = concept.GetEaseCollection(), actors = concept.GetActorCollection(), creators = concept.GetCreatorCollection();

    let addEase = (info: IAnimationEaseCallbackDetails) => easings.Add(info.callback, info.name);
    let addActor = (info: IAnimationActorCallbackDetails) => actors.Add(info.callback, info.name);
    let addCreator = (name: string, callback: AnimationCreatorCallbackType) => creators.Add(name, callback);
    
    addEase(BackAnimationEase);
    addEase(BackInAnimationEase);
    addEase(BackOutAnimationEase);
    addEase(BackInOutAnimationEase);

    addEase(BounceAnimationEase);
    addEase(BounceInAnimationEase);
    addEase(BounceOutAnimationEase);
    addEase(BounceInOutAnimationEase);

    addEase(CircleAnimationEase);
    addEase(CircleInAnimationEase);
    addEase(CircleOutAnimationEase);
    addEase(CircleInOutAnimationEase);

    addEase(CubicAnimationEase);
    addEase(CubicInAnimationEase);
    addEase(CubicOutAnimationEase);
    addEase(CubicInOutAnimationEase);

    addEase(ElasticAnimationEase);
    addEase(ElasticInAnimationEase);
    addEase(ElasticOutAnimationEase);
    addEase(ElasticInOutAnimationEase);

    addEase(ExponentialAnimationEase);
    addEase(ExponentialInAnimationEase);
    addEase(ExponentialOutAnimationEase);
    addEase(ExponentialInOutAnimationEase);

    addEase(QuadraticAnimationEase);
    addEase(QuadraticInAnimationEase);
    addEase(QuadraticOutAnimationEase);
    addEase(QuadraticInOutAnimationEase);

    addEase(QuartAnimationEase);
    addEase(QuartInAnimationEase);
    addEase(QuartOutAnimationEase);
    addEase(QuartInOutAnimationEase);

    addEase(QuintAnimationEase);
    addEase(QuintInAnimationEase);
    addEase(QuintOutAnimationEase);
    addEase(QuintInOutAnimationEase);

    addEase(SineAnimationEase);
    addEase(SineInAnimationEase);
    addEase(SineOutAnimationEase);
    addEase(SineInOutAnimationEase);

    addEase(DefaultAnimationEase);
    addEase(LinearAnimationEase);

    addActor(DefaultAnimationActor);

    addActor(WidthAnimationActor);
    addActor(HeightAnimationActor);
    addActor(ZoomAnimationActor);

    addActor(SlideDownAnimationActor);
    addActor(SlideLeftAnimationActor);
    addActor(SlideRightAnimationActor);
    addActor(SlideUpAnimationActor);

    addActor(SpinAnimationActor);
    addActor(FlipAnimationActor);
    addActor(TossAnimationActor);

    addActor(PulseAnimationActor);
    addActor(HeartbeatAnimationActor);

    addCreator('scale', ScaleAnimationCreator);
    addCreator('translate', TranslateAnimationCreator);
    addCreator('rotate', RotateAnimationCreator);

    addCreator('shake', ShakeAnimationCreator);
    addCreator('vibrate', VibrateAnimationCreator);
    addCreator('rubberband', RubberbandAnimationCreator);
    addCreator('jello', JelloAnimationCreator);
    addCreator('tada', TadaAnimationCreator);
    addCreator('swing', SwingAnimationCreator);
    
    GetGlobal().SetConcept('animation', concept);
    
    TransitionDirectiveHandlerCompact();
    AnimationMagicHandlerCompact();
});
