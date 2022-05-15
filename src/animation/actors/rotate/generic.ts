import { CreateAnimationActorCallback } from "../callback";

export type RotateAnimationActorAxisType = 'x' | 'y' | 'z' | 'all';
export type RotateAnimatorActorOriginType = 'start' | 'center' | 'end';

export interface IRotateAnimatorActorOrigin{
    x: RotateAnimatorActorOriginType;
    y: RotateAnimatorActorOriginType;
}

export interface IRotateAnimationCallbackInfo{
    axis?: RotateAnimationActorAxisType;
    origin?: IRotateAnimatorActorOrigin;
    factor?: number;
    unit?: string;
}

export interface IRotateAnimationActorInfo extends IRotateAnimationCallbackInfo{
    name: string;
}

export const DefaultRotateAnimationActorFactor = 360;
export const DefaultRotateAnimationActorUnit = 'deg';

export function CreateRotateAnimationCallback({ axis = 'z', origin, factor, unit }: IRotateAnimationCallbackInfo = {}){
    let translateOrigin = (value: RotateAnimatorActorOriginType) => ((value !== 'center') ? ((value === 'end') ? '100%' : '0%') : '50%');
    let translatedOrigin = `${translateOrigin(origin?.x || 'center')} ${translateOrigin(origin?.y || 'center')}`;
    let validFactor = (factor ? factor : DefaultRotateAnimationActorFactor), validUnit = (unit ? unit : DefaultRotateAnimationActorUnit);

    return ({ fraction, target, stage }) => {
        if (stage === 'start'){
            target.style.transformOrigin = translatedOrigin;
        }
        
        let delta = ((validFactor < 0) ? (validFactor + (-validFactor * fraction)) : (validFactor - (validFactor * fraction))), axisList = {
            x: ((axis === 'x' || axis === 'all') ? 1 : 0),
            y: ((axis === 'y' || axis === 'all') ? 1 : 0),
            z: ((!axis || axis === 'z' || axis === 'all') ? 1 : 0),
        };

        target.style.transform = target.style.transform.replace(/[ ]*rotate([XYZ]|3d)?\(.+?\)/g, '');
        target.style.transform += ` rotate3d(${axisList.x},${axisList.y},${axisList.z},${delta}${validUnit})`;
    };
}

export function CreateRotateAnimationActor({ name, ...rest }: IRotateAnimationActorInfo){
    return CreateAnimationActorCallback(name, CreateRotateAnimationCallback(rest));
}
