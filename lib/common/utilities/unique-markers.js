"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateUniqueId = exports.JoinUniqueMarkers = exports.IncrementUniqueMarkers = exports.GetDefaultUniqueMarkers = void 0;
function GetDefaultUniqueMarkers() {
    return {
        level0: 0,
        level1: 0,
        level2: 0,
    };
}
exports.GetDefaultUniqueMarkers = GetDefaultUniqueMarkers;
function IncrementUniqueMarkers(markers, level = 'level0', upperLevel = 'level1') {
    if (markers[level] == (Number.MAX_SAFE_INTEGER || 9007199254740991)) { //Roll over
        if (level === 'level0') {
            IncrementUniqueMarkers(markers, 'level1', 'level2');
        }
        else { //Increment upper level
            ++markers[upperLevel];
        }
        markers[level] = 0; //Reset level
    }
    else { //Increment leve
        ++markers[level];
    }
}
exports.IncrementUniqueMarkers = IncrementUniqueMarkers;
function JoinUniqueMarkers(markers) {
    return `${markers.level2}_${markers.level1}_${markers.level0}`;
}
exports.JoinUniqueMarkers = JoinUniqueMarkers;
function GenerateUniqueId(markers, scope, prefix, suffix) {
    IncrementUniqueMarkers(markers);
    return `${scope || ''}${prefix || ''}${JoinUniqueMarkers(markers)}${suffix || ''}`;
}
exports.GenerateUniqueId = GenerateUniqueId;
