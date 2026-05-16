export interface AlertOptions {
    title?: string;
    body?: string;
    cancelText?: string;
    continueText?: string;
    onCancel?: () => void;
    onContinue?: () => void;
}
declare class AlertStore {
    current: AlertOptions | null;
    show(options: AlertOptions): Promise<boolean>;
    close(): void;
}
export declare const alertStore: AlertStore;
export {};
