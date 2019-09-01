"use strict";
(() => {
    let DirectionEnum;
    (function (DirectionEnum) {
        DirectionEnum["FORWARD"] = "forward";
        DirectionEnum["BACKWARD"] = "backward";
    })(DirectionEnum || (DirectionEnum = {}));
    let AttrEnum;
    (function (AttrEnum) {
        AttrEnum["PATTERN"] = "pattern";
        AttrEnum["PREFIX"] = "prefix";
        AttrEnum["SUFFIX"] = "suffix";
        AttrEnum["DIRECTION"] = "direction";
    })(AttrEnum || (AttrEnum = {}));
    const DOC = document, MASK_SELECTOR = `[type="mask"]`, EVENT = 'input';
    function main() {
        let inputs = query(MASK_SELECTOR), i = inputs.length;
        while (i) {
            let el = inputs[--i];
            el.addEventListener(EVENT, () => { onInputChange(el); });
        }
    }
    function onInputChange(el) {
        let mask = getAutoMask(el), length = mask.pattern.length, value = '', selection, valuePos = 0;
        if (isEmpty(mask.value)) {
            selection = 0;
        }
        if (mask.direction === DirectionEnum.BACKWARD) {
            mask.pattern = reverse(mask.pattern);
            mask.value = reverse(mask.value);
        }
        for (let i = 0; i < length; i++) {
            let maskChar = mask.pattern.charAt(i);
            if (isIndexOut(mask.value, valuePos)) {
                if (selection === void 0) {
                    selection = i;
                }
                if (maskChar !== '0' && !isZero(mask.pattern, i)) {
                    break;
                }
                value += maskChar;
                continue;
            }
            value += equals(maskChar, ['_', '0']) ? mask.value.charAt(valuePos++) : maskChar;
        }
        if (mask.direction === DirectionEnum.BACKWARD) {
            value = reverse(value);
        }
        el.value = mask.prefix + value + mask.suffix;
        if (selection === void 0 || mask.direction === DirectionEnum.BACKWARD) {
            el.selectionStart = el.selectionEnd = el.value.length - mask.suffix.length;
        }
        else {
            el.selectionStart = el.selectionEnd = selection + mask.prefix.length;
        }
    }
    function getAutoMask(el) {
        let value = el.value + '', direction = el.getAttribute(AttrEnum.DIRECTION) || DirectionEnum.FORWARD;
        value = removeZeros(value.replace(/\D/g, ''), direction);
        return {
            direction: direction,
            prefix: el.getAttribute(AttrEnum.PREFIX) || '',
            suffix: el.getAttribute(AttrEnum.SUFFIX) || '',
            pattern: el.getAttribute(AttrEnum.PATTERN),
            value: value
        };
    }
    function isEmpty(str) {
        return str.length === 0;
    }
    function isIndexOut(str, index) {
        return index < 0 || index >= str.length;
    }
    function equals(str, matchesArr) {
        return matchesArr.some(match => str === match);
    }
    function reverse(str) {
        let rStr = "", i = str.length;
        while (i) {
            rStr += str[--i];
        }
        return rStr;
    }
    function isZero(str, index) {
        while (!isIndexOut(str, index)) {
            let char = str.charAt(index++);
            if (char === '0') {
                return true;
            }
            if (char === '_') {
                return false;
            }
        }
        return false;
    }
    function removeZeros(value, direction) {
        return value.replace(direction === DirectionEnum.FORWARD ? /0*$/ : /^0*/, '');
    }
    function query(querySelector) {
        return DOC.querySelectorAll(querySelector);
    }
    function ready(handler) {
        if (DOC.readyState !== 'loading') {
            handler();
        }
        else {
            DOC.addEventListener('DOMContentLoaded', () => { handler(); });
        }
    }
    ready(main);
})();
