import { AutoBootstrap } from './bootstrap/auto';
import { GetGlobal } from './global/get';
import { AttributeInterpolator, TextContentInterpolator } from './global/interpolation';

AutoBootstrap();

GetGlobal().AddAttributeProcessor(AttributeInterpolator);
GetGlobal().AddTextContentProcessor(TextContentInterpolator);
