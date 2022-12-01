export type TRepeaterState = {
    attemptsCount: number
    repeatAfterMs: number
    result: any
    timeout: ReturnType<typeof setTimeout> | null
    isStopped: boolean
}
export type TRepeaterCall = (
    state: TRepeaterState
) => Promise<boolean | void> | (boolean | void)
export type TRepeaterOptions = {
    call: TRepeaterCall
    repeatAfterMs?: number
    attemptsAmount?: number
}
export type TRepeaterPromise = Promise<any>
export type TStopMethod = () => void
export type TRepeaterPromiseExtended = TRepeaterPromise & {
    state: TRepeaterState
    stop: TStopMethod
}
