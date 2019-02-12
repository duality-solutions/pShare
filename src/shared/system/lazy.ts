export const lazy = <T>(generator: () => T) => {
    let value: T;
    let initialized = false;
    return {
        get: () => {
            if (initialized) {
                return value;
            }
            value = generator();
            initialized = true;
            return value;
        }
    };
};

