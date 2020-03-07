const STATE_KEY = "state";

export const loadState = () => {
    try {
        const serializedState = localStorage.getItem(STATE_KEY);

        if (serializedState === null)
            return undefined;

        return JSON.parse(serializedState);
    }

    catch (err) {
        console.log("Error loading state", err);

        return undefined;
    }
};

export const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);

        localStorage.setItem(STATE_KEY, serializedState);
    }

    catch (err) {
        console.log("Error saving state", err);
    }
};
