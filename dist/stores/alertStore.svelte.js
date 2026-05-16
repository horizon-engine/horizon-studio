class AlertStore {
    current = $state(null);
    show(options) {
        return new Promise((resolve) => {
            this.current = {
                ...options,
                onCancel: () => {
                    if (options.onCancel)
                        options.onCancel();
                    resolve(false);
                },
                onContinue: () => {
                    if (options.onContinue)
                        options.onContinue();
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
