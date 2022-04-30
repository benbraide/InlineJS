import { GetOrCreateGlobal } from './global/create';
import { BootstrapAndAttach } from './bootstrap/attach';

import { DataDirectiveHandlerCompact } from './directive/core/data/data';
import { ComponentDirectiveHandlerCompact } from './directive/core/data/component';
import { LocalsDirectiveHandlerCompact } from './directive/core/data/locals';
import { RefDirectiveHandlerCompact } from './directive/core/data/ref';

import { PostDirectiveHandlerCompact } from './directive/core/lifecycle/post';
import { UninitDirectiveHandlerCompact } from './directive/core/lifecycle/uninit';

import { StaticDirectiveHandlerCompact } from './directive/core/reactive/static';
import { EffectDirectiveHandlerCompact } from './directive/core/reactive/effect';

import { CloakDirectiveHandlerCompact } from './directive/core/cloak';

import { BindDirectiveHandlerCompact } from './directive/core/attr/bind';
import { ClassDirectiveHandlerCompact } from './directive/core/attr/class';
import { StyleDirectiveHandlerCompact } from './directive/core/attr/style';

import { TextDirectiveHandlerCompact } from './directive/core/flow/text';
import { HtmlDirectiveHandlerCompact } from './directive/core/flow/html';
import { OnDirectiveHandlerCompact } from './directive/core/flow/on';
import { ModelDirectiveHandlerCompact } from './directive/core/flow/model';

import { ShowDirectiveHandlerCompact } from './directive/core/show';

import { IfDirectiveHandlerCompact } from './directive/core/control/if';
import { ElseDirectiveHandlerCompact } from './directive/core/control/else';
import { EachDirectiveHandlerCompact } from './directive/core/control/each';

import { ComponentMagicHandlerCompact } from './magic/core/data/component';
import { LocalsMagicHandlerCompact } from './magic/core/data/locals';
import { RefsMagicHandlerCompact } from './magic/core/data/refs';
import { ScopeMagicHandlerCompact } from './magic/core/data/scope';
import { ProxyMagicHandlerCompact } from './magic/core/data/proxy';
import { WaitMagicHandlerCompact } from './magic/core/data/wait';
import { StreamMagicHandlerCompact } from './magic/core/data/stream';

import { StaticMagicHandlerCompact } from './magic/core/reactive/static';
import { UnoptimizedMagicHandlerCompact } from './magic/core/reactive/unoptimized';
import { WatchMagicHandlerCompact } from './magic/core/reactive/watch';

import { RootMagicHandlerCompact } from './magic/core/dom/root';
import { ParentMagicHandlerCompact } from './magic/core/dom/parent';
import { AncestorMagicHandlerCompact } from './magic/core/dom/ancestor';
import { FormMagicHandlerCompact } from './magic/core/dom/form';

import { ArithmeticMagicHandlerCompact } from './magic/core/operations/arithmetic';
import { RelationalMagicHandlerCompact } from './magic/core/operations/relational';
import { LogicalMagicHandlerCompact } from './magic/core/operations/logical';

import { NextTickMagicHandlerCompact } from './magic/core/nexttick';
import { PickMagicHandlerCompact } from './magic/core/pick';
import { ClassMagicHandlerCompact } from './magic/core/class';
import { EvaluateMagicHandlerCompact } from './magic/core/evaluate';

GetOrCreateGlobal();

queueMicrotask(() => {//Bootstrap
    if (document.readyState == "loading"){
        document.addEventListener('DOMContentLoaded', () => {
            BootstrapAndAttach();
        });
    }
    else{//Loaded
        BootstrapAndAttach();
    }
});

DataDirectiveHandlerCompact();
ComponentDirectiveHandlerCompact();
LocalsDirectiveHandlerCompact();
RefDirectiveHandlerCompact();

PostDirectiveHandlerCompact();
UninitDirectiveHandlerCompact();

StaticDirectiveHandlerCompact();
EffectDirectiveHandlerCompact();

CloakDirectiveHandlerCompact();

BindDirectiveHandlerCompact();
ClassDirectiveHandlerCompact();
StyleDirectiveHandlerCompact();

TextDirectiveHandlerCompact();
HtmlDirectiveHandlerCompact();
OnDirectiveHandlerCompact();
ModelDirectiveHandlerCompact();

ShowDirectiveHandlerCompact();

IfDirectiveHandlerCompact();
ElseDirectiveHandlerCompact();
EachDirectiveHandlerCompact();

ComponentMagicHandlerCompact();
LocalsMagicHandlerCompact();
RefsMagicHandlerCompact();
ScopeMagicHandlerCompact();
ProxyMagicHandlerCompact();
WaitMagicHandlerCompact();
StreamMagicHandlerCompact();

StaticMagicHandlerCompact();
UnoptimizedMagicHandlerCompact();
WatchMagicHandlerCompact();

RootMagicHandlerCompact();
ParentMagicHandlerCompact();
AncestorMagicHandlerCompact();
FormMagicHandlerCompact();

ArithmeticMagicHandlerCompact();
RelationalMagicHandlerCompact();
LogicalMagicHandlerCompact();

NextTickMagicHandlerCompact();
PickMagicHandlerCompact();
ClassMagicHandlerCompact();
EvaluateMagicHandlerCompact();
