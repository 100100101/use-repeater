"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRepeater = void 0;
const useRepeater = (options) => {
    const { call, repeatAfterMs, attemptsAmount } = options;
    const state = {
        attemptsCount: 0,
        repeatAfterMs: repeatAfterMs || 0,
        result: null,
        timeout: null,
        isStopped: false,
    };
    const stop = () => {
        state.isStopped = true;
        const { timeout } = state;
        if (timeout)
            clearTimeout(timeout);
    };
    state.stop = stop;
    const repeater = async () => {
        for (;;) {
            if ((typeof attemptsAmount === 'number' &&
                state.attemptsCount >= attemptsAmount) ||
                state.isStopped) {
                return state.result;
            }
            state.attemptsCount++;
            const result = await call(state);
            state.result = result;
            if (result) {
                return result;
            }
            await new Promise(resolve => {
                state.timeout = setTimeout(resolve, state.repeatAfterMs);
            });
        }
    };
    const repeaterPromise = repeater();
    repeaterPromise.state = state;
    repeaterPromise.stop = stop;
    return repeaterPromise;
};
exports.useRepeater = useRepeater;
//# sourceMappingURL=index.js.map