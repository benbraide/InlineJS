import { JournalTry } from "../journal/try";
import { ITimeDifferenceConcept, ITimeDifferenceFormatParams, ITimeDifferenceTrackInfo, ITimeDifferenceTrackParams } from "../types/time-diff";

interface ITimeDifferenceCheckpoint{
    value: number;
    label?: string;
    ago?: string;
    until?: string;
    next?: number;
    append?: boolean;
}

interface ITimeDifferenceComputeNextParams{
    seconds: number;
    checkpointIndex: number;
    checkpoint: ITimeDifferenceCheckpoint;
}

interface ITimeDifferenceLabelParams{
    checkpoint: ITimeDifferenceCheckpoint;
    count: number;
    short?: boolean;
    ucfirst?: boolean;
    capitalize?: boolean;
}

interface ITimeDifferenceComputeLabelParams{
    label: string;
    count: number;
    short?: boolean;
    ucfirst?: boolean;
    capitalize?: boolean;
    prefix?: string;
    suffix?: string;
}

interface ITimeDifferenceLocalFormatParams{
    seconds: number;
    short?: boolean;
    ucfirst?: boolean;
    capitalize?: boolean;
    computeNext: (params: ITimeDifferenceComputeNextParams) => number;
    computeLabel: (params: ITimeDifferenceLabelParams) => string;
}

export class TimeDifferenceConcept implements ITimeDifferenceConcept{
    private checkpoints_: Array<ITimeDifferenceCheckpoint> = [
        { value: (365 * 24 * 60 * 60), label: 'year' },
        { value: (30 * 24 * 60 * 60), label: 'month' },
        { value: (7 * 24 * 60 * 60), label: 'week' },
        { value: (24 * 60 * 60), label: 'day', next: (7 * 24 * 60 * 60) },
        { value: (60 * 60), label: 'hour', next: (24 * 60 * 60) },
        { value: 60, label: 'minute', next: (60 * 60) },
        { value: 45, label: '45 seconds', next: 60 },
        { value: 30, label: '30 seconds', next: 45 },
        { value: 15, label: '15 seconds', next: 30 },
        { value: 10, label: '10 seconds', next: 15 },
        { value: 5, label: '5 seconds', next: 10 },
        { value: 2, label: 'few seconds', next: 5 },
        { value: 0, ago: 'just now', until: 'right now', next: 1, append: false },
    ];
    
    public Format({ date, until, ...rest }: ITimeDifferenceFormatParams): [string, number, boolean]{
        let now = Date.now(), then = date.getTime();
        if (then < now || (then == now && !until)){//Ago
            return [...this.Format_({ ...rest,
                seconds: Math.floor((now - then) / 1000),
                computeNext: ({ seconds, checkpoint }) => {
                    return (checkpoint.next ? ((checkpoint.value < 60) ? (checkpoint.value - seconds) : (checkpoint.value - (seconds % checkpoint.value))) : 0);
                },
                computeLabel: ({ checkpoint, ...rest }) => this.ComputeLabel_({ ...rest,
                    label: (checkpoint.ago || checkpoint.label || ''),
                    suffix: ((checkpoint.append === false) ? '' : ' ago'),
                }),
            }), false];
        }

        return [...this.Format_({ ...rest,
            seconds: Math.floor((then - now) / 1000),
            computeNext: ({ seconds, checkpoint }) => {
                return (seconds - checkpoint.value);
            },
            computeLabel: ({ checkpoint, ...rest }) => this.ComputeLabel_({ ...rest,
                label: (checkpoint.until || checkpoint.label || ''),
                suffix: ((checkpoint.append === false) ? '' : ' until'),
            }),
        }), true];
    }

    public Track({ handler, until, startImmediately, ...rest }: ITimeDifferenceTrackParams): ITimeDifferenceTrackInfo{
        let stopped = false, checkpoint = 0, lastLabel = '', label = '', next = 0, callHandler = () => {
            let myCheckpoint = ++checkpoint;
            requestAnimationFrame(() => (stopped = (stopped || (myCheckpoint == checkpoint && JournalTry(() => handler(lastLabel = label)) === false))));
        };

        let pass = () => {
            if (!stopped){
                [label, next, until] = this.Format({ ...rest, until });
                setTimeout(pass, (next * 1000));
                if (label !== lastLabel){
                    callHandler();
                }
            }
        };
        
        let start = () => {
            lastLabel = '';
            pass();
        };

        if (startImmediately !== false){
            start();
        }
        
        return {
            stop: () => {
                stopped = true;
                ++checkpoint;
            },
            resume: () => {
                if (stopped){
                    stopped = false;
                    start();
                }
            },
            stopped: () => stopped,
        };
    }

    private Format_({ seconds, computeNext, computeLabel, ...rest }: ITimeDifferenceLocalFormatParams): [string, number]{
        let checkpointIndex = this.checkpoints_.findIndex(checkpoint => (checkpoint.value < seconds));
        if (checkpointIndex == -1){
            return ['', 0];
        }

        let checkpoint = this.checkpoints_[checkpointIndex], count = ((checkpoint.value < 60) ? 0 : Math.floor(seconds / checkpoint.value));
        return [computeLabel({ checkpoint, count, ...rest }), computeNext({ seconds, checkpointIndex, checkpoint })];
    }

    private ComputeLabel_({ label, count, short, ucfirst, capitalize, prefix, suffix }: ITimeDifferenceComputeLabelParams): string{
        let resolvedLabel: string, transformString = (str: string) => {
            if (!ucfirst && !capitalize){
                return str;
            }
            
            let parts = str.split(' ');
            if (capitalize){
                return parts.map(part => (part.substring(0, 1).toUpperCase() + part.substring(1))).join(' ');
            }

            let wordIndex = parts.findIndex(part => /[a-zA-Z]/.test(part.substring(0, 1)));//Find first word index
            return parts.map((part, index) => ((index == wordIndex) ? (part.substring(0, 1).toUpperCase() + part.substring(1)) : part)).join(' ');
        };

        if (short){
            if (label === 'just now' || label === 'right now'){
                resolvedLabel = ((ucfirst || capitalize) ? '0S' : '0s');
            }
            else if (label === 'few seconds'){
                resolvedLabel = ((ucfirst || capitalize) ? '2S' : '2s');
            }
            else if (count == 0){
                resolvedLabel = transformString(label.split(' ').reduce((prev, part) => (prev ? `${prev}${part.substring(0, 1)}` : part), ''));
            }
            else{
                resolvedLabel = transformString(`${count}${label.substring(0, 1)}`);
            }
        }
        else{
            resolvedLabel = transformString(count ? `${count} ${label}${(count == 1) ? '' : 's'}` : label);
            resolvedLabel = `${prefix || ''}${resolvedLabel}${suffix || ''}`;
        }

        return resolvedLabel;
    }
}
