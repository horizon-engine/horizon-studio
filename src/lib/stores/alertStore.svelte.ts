// alertStore.svelte.ts
export interface AlertOptions {
    title?: string;
    body?: string;
    cancelText?: string;
    continueText?: string;
    onCancel?: () => void;
    onContinue?: () => void;
}

class AlertStore {
    current = $state<AlertOptions | null>(null);

    show(options: AlertOptions): Promise<boolean> {
        return new Promise((resolve) => {
            this.current = {
                ...options,
                onCancel: () => {
                    if (options.onCancel) options.onCancel();
                    resolve(false);
                },
                onContinue: () => {
                    if (options.onContinue) options.onContinue();
                    resolve(true);
                }
            };
        });
    }

    close() {
        this.current = null;
    }
}

export const alertStore = new AlertStore();
